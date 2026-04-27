import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import DataField from "../DataField/DataField";
import { item, createItemFormData, addItemFormData } from "@/contexts/InventoryDataContext/InventoryDataContext";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useSession } from "@/contexts/AuthContext/AuthContext";
import { useInventoryDataContext } from "@/contexts/InventoryDataContext/InventoryDataContext";

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

    //BEGIN HOOK INSTANTIATIONS

    const { fetchWithAuth } = useSession();
    const { handleCreateItem } = useInventoryDataContext();

    //MARK: FormData for creating an item (item_id, quantity, and low_stock_trigger are passed to addFormDataState since /items/additem expects a JSON body)
    //TODO: If on edit mode, initial values should be respective property values of passed item object of type item
    const [createFormDataState, setCreateFormDataState] = useState<createItemFormData>(
        {

            item_name: "",
            desc: "",
            upc: "",
            //TODO: Photo field is still required; may use ImagePicker component for something similar to obtaining file URL if from camera

            price: 0,
            category: "",
            brand: "",
            file: ""

        });

    //FormData for adding an item (expected format for /inventory/addItem)
    const [addFormDataState, setAddFormDataState] = useState<addItemFormData>(
        {
            //TODO: May have to change initial values
            "inventory_id": -1,
            "item_id": -1,
            "quantity": 0,
            "low_stock_trigger": 0
        }
    );


    //END HOOK INSTANTIATIONS

    //MARK: Component scope functions
    //BEGIN FUNCTION DEFINITIONS (For functions that require component scope)

    //TODO: Add handling for missing item_name and invalid photo file; may have to create a validation function since multiple handlers may have similar submit logic
    //TODO: Change behavior depending on mode prop (create, edit, and possibly display will be available props)
    function handleSubmit() {


        //Iterate through formDataState while setting corresponding key / value pair in FormData which is the format that the respective endpoint expects
        for (const [key, value] of Object.entries(createFormDataState)) {

            //value is converted to a string since FormData.set() will not accept numbers; API should still process due to Python's dynamic typing
            createFormData.set(key, String(value))
        }

        //FIXME: TEMPORARY CONSOLE LOG OF createFormData
        for (const pair of createFormData.entries()) {
            console.log(pair[0], pair[1]);
        }

        //Request / response handling is found in InventoryDataContext.tsx for listed handleXYZ functions
        handleCreateItem(createFormData).then(async (response) => {

            const responseJSON = await response?.json();
            
            //Second case is present since 0 is falsy ("0" is still truthy since it is a string)
            if(responseJSON.item_id || responseJSON.item_id === 0){
                //TODO: handleAddItem if and only if stock settings are specified
            }
        });



    }
    //END FUNCTION DEFINITIONS (For functions that require component scope)


    //MARK: Component return
    return (<>
        {
            //TODO: May just need to have conditional for things such as which handle function is used rather than the ENTIRE component
            mode === "create" ?
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

                                onChangeText={(text) => {
                                    setCreateFormDataState({ ...createFormDataState, category: text })
                                }}
                            />

                            <DataField
                                header="BRAND"
                                placeholder="Brand"
                                placeholderTextColor="#979797"

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

                            onChangeText={(text) => {
                                setCreateFormDataState({ ...createFormDataState, desc: text })
                            }}
                        />

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="PRICE"
                            placeholder="Price"

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
                                Create Item
                            </Text>
                        </TouchableOpacity>
                    </View>



                </>

                :
                //Returned component for edit
                <>
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