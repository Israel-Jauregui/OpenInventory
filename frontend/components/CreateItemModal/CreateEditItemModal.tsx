import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DataField from "../DataField/DataField";
import { item, createItemFormData, addItemFormData, editItemFormData } from "@/contexts/InventoryDataContext/InventoryDataContext";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useInventoryDataContext } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";
import CameraButton from "../CameraButton/CameraButton";
import EditView from "@/app/(app)/inventory/item/[itemId]/edit";

//MARK: Types
type Props = {
    //Designates that mode prop will only take either of these values
    mode: "create" | "edit",

    //Only passed when mode is edit
    item?: item

}

//MARK: Component

//TODO: item parameter type may or may not change (currently item) depending on what edit item endpoint expects
export default function CreateEditItemModal({ mode, item }: Props) {
    console.log("MODE", mode);

    //Used since /items/create expects a multipart/form-data body. Upon submit, keys / values will be filled by iterating through formDataState.
    const createFormData = new FormData();
    const router = useRouter();
    const { barcode } = useLocalSearchParams<{ barcode?: string }>();

    //BEGIN HOOK INSTANTIATIONS

    const { handleCreateItem, handleAddItem, handleEditItem, refreshInventoryItems } = useInventoryDataContext();
    const { currentInventory } = useCurrentInventoryContext();



    //Returns item_id separated from item object because the PUT endpoint does not expect a property of item_id
    const getEditItemProperties = () =>{
        if(mode === "edit" && item){
            const {item_id, ...editItemProperties} = item;
            console.log("Converted item object to editItemProperties with object", editItemProperties)
            return editItemProperties;
        }
    }
    
    
    const editItemProperties = getEditItemProperties() as editItemFormData;
    console.log(editItemProperties)



    //MARK: FormData for creating an item (item_id, quantity, and low_stock_trigger are passed to addFormDataState since /items/additem expects a JSON body)
    //If in edit mode, instead becomes  editItemFormData state that automatically populates fields with item's stored values in backend.
    const [createEditFormDataState, setCreateEditFormDataState] = useState<createItemFormData | editItemFormData>(
        () => {
            if (mode === "edit" && item) {

                return editItemProperties;
            }
            else {
                return {
                    item_name: "",
                    desc: "",
                    upc: "",
                    price: 0,
                    category: "",
                    brand: "",
                    file: "",
                }
            }
        }
    )
    /*
        mode === "edit" && item ?



            //Item with spread syntax is passed in edit mode because item of type item has same exact properties as edit endpoint's expected request body properties
            useState<editItemFormData>(
                {
                    ...item
                }
            )

            :
            useState<createItemFormData>({
                item_name: "",
                desc: "",
                upc: "",
                price: 0,
                category: "",
                brand: "",
                file: "",
            });
    */

    //FormData for adding an item (expected format for /inventory/addItem)
    const [addFormDataState, setAddFormDataState] = useState<addItemFormData>(
        {
            //TODO: May have to change initial values
            "inventory_id": Number(currentInventory.invId) || -1,
            "item_id": -1,
            "quantity": 0,
            "low_stock_trigger": 1
        }
    );




    function TakeItemPhoto() {
        router.push("/(app)/camera")
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
              
                //value is converted to a string since FormData.set() will not accept numbers; API should still process due to Python's dynamic typing
                createFormData.set(key, String(value))
               
            }

            //Request / response handling is found in InventoryDataContext.tsx for listed handleXYZ functions
            const createResponse = await handleCreateItem(createFormData);
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
                quantity: addFormDataState.quantity < 0 ? Number(null) : addFormDataState.quantity,
                low_stock_trigger: addFormDataState.low_stock_trigger < 0 ? Number(null) : addFormDataState.low_stock_trigger,
            });

            if (!addResponse?.ok) {
                return;
            }

            await refreshInventoryItems();
            router.replace({
                pathname: "/inventory/item/[itemId]",
                params: {
                    itemId: String(createResponseJSON.item_id),
                    inInventory: "1",
                    barcode: createEditFormDataState.upc,
                    quantity: String(addFormDataState.quantity < 0 ? Number(null) : addFormDataState.quantity),
                    lowStockTrigger: String(addFormDataState.low_stock_trigger < 0 ? Number(null) : addFormDataState.low_stock_trigger),
                },
            });
        }
        //quantity is one of the two properties that are found in type editItemFormData, but not type createItemFormData
        //Item must be defined in order to call handleEditItem because the isolated item_id is required
        else if (mode === "edit" && item && "quantity" in createEditFormDataState) {

            const response = await handleEditItem(createEditFormDataState, item.item_id)

            if (!response?.ok) {
                return;
            }

            //Refresh inventory state with newly edited item
            await refreshInventoryItems();

        }



    }
    //END FUNCTION DEFINITIONS (For functions that require component scope)

    console.log("ITEM PROP:", item);
    console.log("STATE:", createEditFormDataState);
    //MARK: Component return
    return (<>
        {
            
            //TODO: May just need to have conditional for things such as which handle function is used rather than the ENTIRE component

            //Returned component for create
            <>


                <KeyboardAwareScrollView contentContainerStyle={styles.center}>

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
                                setCreateEditFormDataState({ ...createEditFormDataState, item_name: text })
                            }
                            }
                        />
                    </View>

                    <View>
                        <CameraButton Pressed={TakeItemPhoto} header="TAKE/UPLOAD PHOTO"></CameraButton>
                    </View>


                    <View style={
                        {
                            margin: 0,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",

                            height: "13%",
                            padding: 20,

                            //Can be changed back to 90% if needed
                            width: 350,

                        }}>
                        <DataField
                            header="CATEGORY"

                            placeholder="Category"
                            placeholderTextColor="#979797"
                            value={createEditFormDataState.category}
                            onChangeText={(text) => {
                                setCreateEditFormDataState({ ...createEditFormDataState, category: text })
                            }}
                        />

                        <DataField
                            header="BRAND"
                            placeholder="Brand"
                            placeholderTextColor="#979797"
                            value={createEditFormDataState.brand}

                            onChangeText={(text) => {
                                setCreateEditFormDataState({ ...createEditFormDataState, brand: text })
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
                            setCreateEditFormDataState({ ...createEditFormDataState, desc: text })
                        }}
                    />

                    <DataField
                        textInputStyle={{ width: 300 }}
                        header="PRICE"
                        placeholder="Price"
                        value={String(createEditFormDataState.price)}

                        placeholderTextColor="#979797"

                        onChangeText={(text) => {
                            setCreateEditFormDataState({ ...createEditFormDataState, price: Number(text) })
                        }}
                    />

                    <DataField
                        textInputStyle={{ width: 300 }}
                        header="BARCODE"
                        placeholder="Scan or type barcode"

                        placeholderTextColor="#979797"
                        defaultValue={createEditFormDataState.upc ?? undefined}

                        onChangeText={(text) => {
                            setCreateEditFormDataState({ ...createEditFormDataState, upc: text })
                        }}

                    />



                    {//Stock settings container and fields
                    }
                    {/* <Text>TODO: Either remove Stock Settings and add to Add Item modal, or (if values are specified) call /inventory/additem in handleSubmit() using the item_id returned by /items/create</Text> */}
                    <View style={
                        {
                            backgroundColor: "#c6d7e7",

                            margin: 15,
                            padding: 0,

                            borderColor: "#36a2fa",
                            borderWidth: 1,
                            borderRadius: 20,

                            width: 300,


                        }}>
                        <Text style={{ margin: 10, top: 0, left: 0, fontSize: 16, color: "#437a9e", fontWeight: "600" }}>STOCK SETTINGS</Text>
                        {//Stock settings fields
                        }
                        <View style={
                            {
                                //TODO: Possibly move these properties into rowPresentation style in the stylesheet and also use on category / brand fields View container

                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",

                                padding: 0,
                                margin: 5
                            }}>
                            <DataField
                                header="Initial quantity"
                                headerStyle={{ color: "#246fa1" }}
                                placeholder="0"
                                placeholderTextColor="#979797"
                                defaultValue={editItemProperties ? String(editItemProperties.quantity) : String(0)}
                                onChangeText={(text) => {
                                    mode === "edit" ? 
                                    setCreateEditFormDataState({...createEditFormDataState, quantity: Number(text)})
                                    :
                                    setAddFormDataState({ ...addFormDataState, quantity: Number(text) })
                                }}
                            />
                            <DataField
                                header={`Low stock alert${"\u2020"}`}
                                headerStyle={{ color: "#246fa1" }}
                                placeholder="0"
                                placeholderTextColor="#979797"

                                defaultValue={editItemProperties ? String(editItemProperties.low_stock_trigger) : String(0)}
                                onChangeText={(text) => {
                                    mode === "edit" ? 
                                    setCreateEditFormDataState({...createEditFormDataState, low_stock_trigger: Number(text)})
                                    :
                                    setAddFormDataState({ ...addFormDataState, low_stock_trigger: Number(text) })
                                }}
                            />


                        </View>

                        {//Dagger mark description for low stock alert field
                        }
                        <View style={{ alignItems: "center", paddingTop: -5, padding: 5 }}>
                            <Text style={{ width: 250, color: "#437a9e" }}>
                                {"\u2020"}You'll receive a push notification (if enabled) when this item's quantity drops to the specified number.
                            </Text>
                        </View>

                    </View>


                </KeyboardAwareScrollView>

                {//Modal footer / create button (change header related props in app/(app)/_layout.tsx if trying to edit header)
                }
                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        style={styles.createItemButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.createItemButtonText}>
                            Save Item
                        </Text>
                    </TouchableOpacity>
                </View>



            </>
        }

    </>);


}

const styles = StyleSheet.create(
    {
        center: {
            justifyContent: "center",
            alignItems: "center"
        },

        footerContainer: {

            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "15%",

            backgroundColor: "white"
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
    });
