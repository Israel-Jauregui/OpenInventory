import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DataField from "../DataField/DataField";
import { item, createItemFormData, addItemFormData } from "@/contexts/InventoryDataContext/InventoryDataContext";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useInventoryDataContext } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";

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

    //Used since /items/create expects a multipart/form-data body. Upon submit, keys / values will be filled by iterating through formDataState.
    const createFormData = new FormData();
    const router = useRouter();
    const { barcode } = useLocalSearchParams<{ barcode?: string }>();

    //BEGIN HOOK INSTANTIATIONS

    const { handleCreateItem, handleAddItem, refreshInventoryItems } = useInventoryDataContext();
    const { currentInventory } = useCurrentInventoryContext();

    //MARK: FormData for creating an item (item_id, quantity, and low_stock_trigger are passed to addFormDataState since /items/additem expects a JSON body)
    //TODO: If on edit mode, initial values should be respective property values of passed item object of type item
    const [createFormDataState, setCreateFormDataState] = useState<createItemFormData>({
        item_name: mode === "edit" ? item?.item_name ?? "" : "",
        desc: mode === "edit" ? item?.desc ?? "" : "",
        upc: mode === "edit" ? item?.upc ?? "" : barcode ?? "",
        price: mode === "edit" ? item?.price ?? 0 : 0,
        category: mode === "edit" ? item?.category ?? "" : "",
        brand: mode === "edit" ? item?.brand ?? "" : "",
        file: "",
    });

    //FormData for adding an item (expected format for /inventory/addItem)
    const [addFormDataState, setAddFormDataState] = useState<addItemFormData>(
        {
            //TODO: May have to change initial values
            "inventory_id": Number(currentInventory.invId) || -1,
            "item_id": -1,
            "quantity": 1,
            "low_stock_trigger": 1
        }
    );


    //END HOOK INSTANTIATIONS

    //MARK: Component scope functions
    //BEGIN FUNCTION DEFINITIONS (For functions that require component scope)

    //TODO: Add handling for missing item_name and invalid photo file; may have to create a validation function since multiple handlers may have similar submit logic
    //TODO: Change behavior depending on mode prop (create, edit, and possibly display will be available props)
    async function handleSubmit() {

        if (!currentInventory.invId) {
            return;
        }

        //Iterate through formDataState while setting corresponding key / value pair in FormData which is the format that the respective endpoint expects
        for (const [key, value] of Object.entries(createFormDataState)) {

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
            quantity: addFormDataState.quantity <= 0 ? 1 : addFormDataState.quantity,
            low_stock_trigger: addFormDataState.low_stock_trigger < 0 ? 0 : addFormDataState.low_stock_trigger,
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
                barcode: createFormDataState.upc,
                quantity: String(addFormDataState.quantity <= 0 ? 1 : addFormDataState.quantity),
                lowStockTrigger: String(addFormDataState.low_stock_trigger < 0 ? 0 : addFormDataState.low_stock_trigger),
            },
        });



    }
    //END FUNCTION DEFINITIONS (For functions that require component scope)

    console.log("ITEM PROP:", item);
    console.log("STATE:", createFormDataState);

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
                                value={createFormDataState.item_name}
                                onChangeText={(text) => {
                                    setCreateFormDataState({ ...createFormDataState, item_name: text })
                                }}
                            />
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
                                value={createFormDataState.category}
                                onChangeText={(text) => {
                                    setCreateFormDataState({ ...createFormDataState, category: text })
                                }}
                            />

                            <DataField
                                header="BRAND"
                                placeholder="Brand"
                                placeholderTextColor="#979797"
                                value={createFormDataState.brand}

                                onChangeText={(text) => {
                                    setCreateFormDataState({ ...createFormDataState, brand: text })
                                }}

                            />
                        </View>

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="DESCRIPTION"
                            placeholder="Description"
                            placeholderTextColor="#979797"
                            value={createFormDataState.desc}
                            
                            onChangeText={(text) => {
                                setCreateFormDataState({ ...createFormDataState, desc: text })
                            }}
                        />

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="PRICE"
                            placeholder="Price"
                            value={String(createFormDataState.price)}

                            placeholderTextColor="#979797"

                            onChangeText={(text) => {
                                setCreateFormDataState({ ...createFormDataState, price: Number(text) })
                            }}
                        />

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="BARCODE"
                            placeholder="Scan or type barcode"
                            
                            placeholderTextColor="#979797"
                            value={createFormDataState.upc}
                            
                            onChangeText={(text) => {
                                setCreateFormDataState({ ...createFormDataState, upc: text })
                            }}

                        />



                        {//Stock settings container and fields
                        }
                        <Text>TODO: Either remove Stock Settings and add to Add Item modal, or (if values are specified) call /inventory/additem in handleSubmit() using the item_id returned by /items/create</Text>
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


                                    onChangeText={(text) => {
                                        setAddFormDataState({ ...addFormDataState, quantity: Number(text) })
                                    }}
                                />
                                <DataField
                                    header={`Low stock alert${"\u2020"}`}
                                    headerStyle={{ color: "#246fa1" }}
                                    placeholder="0"
                                    placeholderTextColor="#979797"


                                    onChangeText={(text) => {
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
