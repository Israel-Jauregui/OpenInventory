import { useEffect, useMemo, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DataField from "../DataField/DataField";
import { CameraView } from "expo-camera";
import {
    item,
    createItemFormData,
    addItemFormData,
    editItemFormData,
} from "@/contexts/InventoryDataContext/InventoryDataContext";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Camera from "@/app/(app)/camera";

import { useInventoryDataContext } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";
import CameraButton from "../CameraButton/CameraButton";
import SuccessToast from "../ItemSavedToast/ItemSavedToast";
//MARK: Types
type Props = {
    //Designates that mode prop will only take either of these values
    mode: "create" | "edit";

    //Only passed when mode is edit
    item?: item;
};

//MARK: Component

//TODO: item parameter type may or may not change (currently item) depending on what edit item endpoint expects
export default function CreateEditItemModal({ mode, item }: Props) {
    //Used since /items/create expects a multipart/form-data body. Upon submit, keys / values will be filled by iterating through formDataState.
    const formData = new FormData();
    const router = useRouter();
    const { barcode } = useLocalSearchParams<{ barcode?: string }>();
    const createdItemIdRef = useRef<number | null>(null);
    const successMessages = {
        create: "Item successfully created!",
        edit: "Item edits saved!",
    };
    const [cameraShowing, setShowCamera] = useState(false);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);
    const cameraRef = useRef<CameraView | null>(null);

    //BEGIN HOOK INSTANTIATIONS

    const {
        handleCreateItem,
        handleAddItem,
        handleEditItem,
        refreshInventoryItems,
    } = useInventoryDataContext();
    const { currentInventory } = useCurrentInventoryContext();
    const [showToast, setShowToast] = useState(false);
    const [didInitializeEditState, setDidInitializeEditState] = useState(false);
    const [editQuantityInput, setEditQuantityInput] = useState<string>("");
    const [editLowStockInput, setEditLowStockInput] = useState<string>("");
    const hasImage = typeof image === "string" && image.trim().length > 0;

    const editItemProperties = useMemo(() => {
        if (mode !== "edit" || !item) {
            return null;
        }

        return {
            item_name: item.item_name,
            desc: item.desc,
            upc: item.upc,
            photo_url: item.photo_url,
            price: item.price,
            category: item.category,
            brand: item.brand,
            quantity: item.quantity,
            low_stock_trigger: item.low_stock_trigger,
            file: "",
        };
    }, [item, mode]);

    useEffect(() => {
        if (mode !== "create" || !barcode) {
            return;
        }

        setCreateEditFormDataState((prev) => ({
            ...prev,
            upc: barcode,
        }));
    }, [barcode, mode]);


    //MARK: FormData for creating an item (item_id, quantity, and low_stock_trigger are passed to addFormDataState since /items/additem expects a JSON body)
    //If in edit mode, instead becomes  editItemFormData state that automatically populates fields with item's stored values in backend.
    const [createEditFormDataState, setCreateEditFormDataState] = useState<
        createItemFormData | editItemFormData
    >(() => {
        if (mode === "edit" && editItemProperties) {
            return editItemProperties;
        } else {
            return {
                item_name: "",
                desc: "",
                upc: "",
                price: 0,
                category: "",
                brand: "",
                file: "",
            };
        }
    });

    useEffect(() => {
        if (mode !== "edit" || !editItemProperties || didInitializeEditState) {
            return;
        }

        setCreateEditFormDataState(editItemProperties);
        setImage(item?.photo_url ?? null);
        setEditQuantityInput(String(editItemProperties.quantity));
        setEditLowStockInput(String(editItemProperties.low_stock_trigger));
        setDidInitializeEditState(true);
    }, [didInitializeEditState, editItemProperties, item?.photo_url, mode]);

    useEffect(() => {
        if (mode !== "edit") {
            return;
        }

        setDidInitializeEditState(false);
    }, [item?.item_id, mode]);

    //FormData for adding an item (expected format for /inventory/addItem)
    const [addFormDataState, setAddFormDataState] = useState<addItemFormData>({
        //TODO: May have to change initial values
        inventory_id: Number(currentInventory.invId) || -1,
        item_id: -1,
        quantity: 0,
        low_stock_trigger: 1,
    });

    //MARK: Camera Stuff

    function TakeItemPhoto() {
        setShowCamera(true);
    }

    async function TakePhoto() {
        if (!cameraRef.current) return;

        if (isReady) {
            const picture = await cameraRef.current.takePictureAsync();
            setImage(picture.uri);
            setShowCamera(false);
        }
    }

    function ToastFinished() {
        if (mode === "create") {
            setShowToast(false);

            router.replace({
                pathname: "/inventory/item/[itemId]",
                params: {
                    itemId: String(createdItemIdRef.current),
                    inInventory: "1",
                    barcode: createEditFormDataState.upc,
                    quantity: String(
                        addFormDataState.quantity < 0
                            ? Number(null)
                            : addFormDataState.quantity,
                    ),
                    lowStockTrigger: String(
                        addFormDataState.low_stock_trigger < 0
                            ? Number(null)
                            : addFormDataState.low_stock_trigger,
                    ),
                },
            });
        } else {
            setShowToast(false);
            router.back();
        }
    }
    //END HOOK INSTANTIATIONS

    //MARK: Component scope functions
    //BEGIN FUNCTION DEFINITIONS (For functions that require component scope)

    //MARK: handleSubmit
    //TODO: Add handling for missing item_name and invalid photo file; may have to create a validation function since multiple handlers may have similar submit logic
    //TODO: Change behavior depending on mode prop (create, edit, and possibly display will be available props)
    async function handleSubmit() {
        if (!currentInventory.invId) {
            return;
        }

        if (mode === "create") {
            //Iterate through createEditFormDataState while setting corresponding key / value pair in FormData which is the format that the respective endpoint expects
            for (const [key, value] of Object.entries(createEditFormDataState)) {
                if (key !== "file") {
                    formData.set(key, String(value));
                }
                //value is converted to a string since FormData.set() will not accept numbers; API should still process due to Python's dynamic typing
            }

            if (image) {
                formData.append("file", {
                    uri: image,
                    name: "item-photo.jpg",
                    type: "image/jpeg",
                } as any);
            }

            //Request / response handling is found in InventoryDataContext.tsx for listed handleXYZ functions
            const createResponse = await handleCreateItem(formData);
            if (!createResponse?.ok) {
                return;
            }

            const createResponseJSON = await createResponse.json();

            if (!(createResponseJSON.item_id || createResponseJSON.item_id === 0)) {
                return;
            }

            const addResponse = await handleAddItem({
                inventory_id: Number(currentInventory.invId),
                item_id: Number(createResponseJSON.item_id),
                quantity:
                    addFormDataState.quantity < 0
                        ? Number(null)
                        : addFormDataState.quantity,
                low_stock_trigger:
                    addFormDataState.low_stock_trigger < 0
                        ? Number(null)
                        : addFormDataState.low_stock_trigger,
            });

            if (!addResponse?.ok) {
                return;
            }

            await refreshInventoryItems();
            createdItemIdRef.current = createResponseJSON.item_id;
            setShowToast(true);
        }
        //quantity is one of the two properties that are found in type editItemFormData, but not type createItemFormData
        //Item must be defined in order to call handleEditItem because the isolated item_id is required
        else if (mode === "edit" && item && "quantity" in createEditFormDataState) {
            const parsedQuantity = Number.parseInt(editQuantityInput, 10);
            const parsedLowStock = Number.parseInt(editLowStockInput, 10);

            if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
                Alert.alert("Invalid quantity", "Quantity must be a non-negative integer.");
                return;
            }

            if (!Number.isInteger(parsedLowStock) || parsedLowStock < 0) {
                Alert.alert("Invalid low stock value", "Low stock alert must be a non-negative integer.");
                return;
            }

            const editPayload: editItemFormData = {
                ...createEditFormDataState,
                quantity: parsedQuantity,
                low_stock_trigger: parsedLowStock,
            };

            for (const [key, value] of Object.entries(editPayload)) {
                if (key !== "file") {
                    formData.set(key, String(value))
                }
                //If the current residing image is different (meaning user took a new picture) from what the item's photo_url seen in the database is, send new file
                else if (image && image !== item.photo_url) {
                    formData.set("file", { uri: image, name: "item-photo.jpg", type: "image/jpeg" } as any)

                    //Set photo_url to empty string because file will be the new image; photo_url is reassigned by backend later
                    formData.set("photo_url", "");
                }
                else {
                    formData.set("file", "")
                }
            }


           

            const response = await handleEditItem(
                formData,
                item.item_id,
            );

            if (!response?.ok) {
                return;
            }

            //Refresh inventory state with newly edited item
            await refreshInventoryItems();
            setShowToast(true);

        }
    }
    //END FUNCTION DEFINITIONS (For functions that require component scope)

    //MARK: Component return
    return (
        <>
            {cameraShowing ? (
                <Camera
                    setReady={setIsReady}
                    TakePhoto={TakePhoto}
                    camRef={cameraRef}
                />
            ) : (
                //TODO: May just need to have conditional for things such as which handle function is used rather than the ENTIRE component

                //Returned component for create
                <>
                    <KeyboardAwareScrollView contentContainerStyle={styles.center}>
                        <SuccessToast
                            message={
                                mode === "create"
                                    ? successMessages.create
                                    : successMessages.edit
                            }
                            visible={showToast}
                            onFinish={ToastFinished}
                        />

                        <View style={[styles.center, { height: "15%" }]}>
                            <DataField
                                textInputStyle={{ width: 300 }}
                                header="ITEM NAME"
                                containerStyle={{ margin: 5 }}
                                placeholder="Item Name"
                                placeholderTextColor="#979797"
                                requiredAsterisk={true}
                                value={createEditFormDataState.item_name}
                                onChangeText={(text) => {
                                    setCreateEditFormDataState({
                                        ...createEditFormDataState,
                                        item_name: text,
                                    });
                                }}
                            />
                        </View>

                        <View>
                            {mode === "edit" ? (
                                <TouchableOpacity style={styles.editImageContainer} onPress={TakeItemPhoto}>
                                    {hasImage ? (
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.editImage}
                                        />
                                    ) : (
                                        <View style={styles.emptyImageContainer}>
                                            <Text style={styles.emptyImageText}>Tap to add photo</Text>
                                        </View>
                                    )}
                                    <View style={styles.editImageHintPill}>
                                        <Text style={styles.editImageHintText}>{hasImage ? "Tap to change photo" : "No photo yet"}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : image ? (
                                <TouchableOpacity onPress={TakeItemPhoto}>
                                    <Image
                                        source={{ uri: image }}
                                        style={styles.editImage}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <CameraButton
                                    Pressed={TakeItemPhoto}
                                    header="TAKE/UPLOAD PHOTO"
                                />
                            )}
                        </View>

                        <View
                            style={{
                                margin: 0,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",

                                height: "13%",
                                padding: 20,

                                //Can be changed back to 90% if needed
                                width: 350,
                            }}
                        >
                            <DataField
                                header="CATEGORY"
                                placeholder="Category"
                                placeholderTextColor="#979797"
                                value={createEditFormDataState.category}
                                onChangeText={(text) => {
                                    setCreateEditFormDataState({
                                        ...createEditFormDataState,
                                        category: text,
                                    });
                                }}
                            />

                            <DataField
                                header="BRAND"
                                placeholder="Brand"
                                placeholderTextColor="#979797"
                                value={createEditFormDataState.brand}
                                onChangeText={(text) => {
                                    setCreateEditFormDataState({
                                        ...createEditFormDataState,
                                        brand: text,
                                    });
                                }}
                            />
                        </View>

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="DESCRIPTION"
                            placeholder="Description"
                            placeholderTextColor="#979797"
                            value={createEditFormDataState.desc}
                            onChangeText={(text) => {
                                setCreateEditFormDataState({
                                    ...createEditFormDataState,
                                    desc: text,
                                });
                            }}
                        />

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="PRICE"
                            placeholder="Price"
                            value={String(createEditFormDataState.price)}
                            placeholderTextColor="#979797"
                            onChangeText={(text) => {
                                setCreateEditFormDataState({
                                    ...createEditFormDataState,
                                    price: Number(text),
                                });
                            }}
                        />

                        <View style={styles.barcodeRow}>
                            <DataField
                                textInputStyle={{ width: mode === "create" ? 220 : 300 }}
                                containerStyle={{ flex: 0 }}
                                header="BARCODE"
                                placeholder="Scan or type barcode"
                                placeholderTextColor="#979797"
                                requiredAsterisk={true}
                                value={createEditFormDataState.upc}
                                onChangeText={(text) => {
                                    setCreateEditFormDataState({
                                        ...createEditFormDataState,
                                        upc: text,
                                    });
                                }}
                            />
                            {mode === "create" ? (
                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={() => {
                                        router.push({
                                            pathname: "/scanner",
                                            params: { action: "createBarcodeFill" },
                                        });
                                    }}
                                >
                                    <Text style={styles.scanButtonText}>Scan</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        {
                            //Stock settings container and fields
                        }
                        {/* <Text>TODO: Either remove Stock Settings and add to Add Item modal, or (if values are specified) call /inventory/additem in handleSubmit() using the item_id returned by /items/create</Text> */}
                        <View
                            style={{
                                backgroundColor: "#c6d7e7",

                                margin: 15,
                                padding: 0,

                                borderColor: "#36a2fa",
                                borderWidth: 1,
                                borderRadius: 20,

                                width: 300,
                            }}
                        >
                            <Text
                                style={{
                                    margin: 10,
                                    top: 0,
                                    left: 0,
                                    fontSize: 16,
                                    color: "#437a9e",
                                    fontWeight: "600",
                                }}
                            >
                                STOCK SETTINGS
                            </Text>
                            {
                                //Stock settings fields
                            }
                            <View
                                style={{
                                    //TODO: Possibly move these properties into rowPresentation style in the stylesheet and also use on category / brand fields View container

                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    padding: 0,
                                    margin: 5,
                                }}
                            >
                                <DataField
                                    header={mode === "edit" ? "Quantity" : "Initial quantity"}
                                    headerStyle={{ color: "#246fa1" }}
                                    placeholder="0"
                                    placeholderTextColor="#979797"
                                    value={mode === "edit" ? editQuantityInput : undefined}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                        mode === "edit"
                                            ? setEditQuantityInput(text.replace(/[^\d]/g, ""))
                                            : setAddFormDataState({
                                                ...addFormDataState,
                                                quantity: Number(text),
                                            });
                                    }}
                                />
                                <DataField
                                    header={`Low stock alert${"\u2020"}`}
                                    headerStyle={{ color: "#246fa1" }}
                                    placeholder="0"
                                    placeholderTextColor="#979797"
                                    value={mode === "edit" ? editLowStockInput : undefined}
                                    keyboardType="number-pad"
                                    onChangeText={(text) => {
                                        mode === "edit"
                                            ? setEditLowStockInput(text.replace(/[^\d]/g, ""))
                                            : setAddFormDataState({
                                                ...addFormDataState,
                                                low_stock_trigger: Number(text),
                                            });
                                    }}
                                />
                            </View>

                            {
                                //Dagger mark description for low stock alert field
                            }
                            <View
                                style={{ alignItems: "center", paddingTop: -5, padding: 5 }}
                            >
                                <Text style={{ width: 250, color: "#437a9e" }}>
                                    {"\u2020"}You will receive a push notification (if enabled) when
                                    this item quantity drops to the specified number.
                                </Text>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                    {
                        //Modal footer / create button (change header related props in app/(app)/_layout.tsx if trying to edit header)
                    }
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={styles.createItemButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.createItemButtonText}>Save Item</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center",
    },

    footerContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "15%",

        backgroundColor: "white",
    },
    createItemButton: {
        marginBottom: 5,
        width: 200,
        padding: 15,

        backgroundColor: "#36a2fa",

        borderRadius: 12,
    },

    createItemButtonText: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
    },
    barcodeRow: {
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-end",
        flexDirection: "row",
        gap: 8,
    },
    scanButton: {
        marginTop: 34,
        height: 50,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "#36a2fa",
        justifyContent: "center",
        alignItems: "center",
    },
    scanButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    emptyImageContainer: {
        width: 200,
        height: 200,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#36a2fa",
        backgroundColor: "#eef7ff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    emptyImageText: {
        color: "#246fa1",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
    editImageContainer: {
        width: 200,
        height: 230,
        alignItems: "center",
    },
    editImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#9dcdf4",
        backgroundColor: "#e8f3fe",
    },
    editImageHintPill: {
        marginTop: 8,
        backgroundColor: "#e8f3fe",
        borderColor: "#9dcdf4",
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    editImageHintText: {
        color: "#246fa1",
        fontSize: 12,
        fontWeight: "700",
    },
});
