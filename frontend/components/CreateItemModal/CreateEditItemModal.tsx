import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import DataField from "../DataField/DataField";
import { item } from "@/contexts/InventoryDataContext/InventoryDataContext";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


type Props = {
    //Designates that mode prop will only take either of these values
    mode: "create" | "edit",

    //Only passed when mode is edit
    item?: item

}
export default function CreateEditItemModal({ mode, item }: Props) {

    //Used since /items/create expects a multipart/form-data body
    const formData = new FormData();

    //BEGIN HOOK INSTANTIATIONS

    //END HOOK INSTANTIATIONS

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
                                width: 300,

                            }}>
                            <DataField
                                header="CATEGORY"

                                placeholder="Category"
                                placeholderTextColor="#979797"
                            />

                            <DataField
                                header="BRAND"
                                placeholder="Brand"
                                placeholderTextColor="#979797"

                            />
                        </View>

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="DESCRIPTION"
                            placeholder="Description"
                            placeholderTextColor="#979797"
                        />

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="PRICE"
                            placeholder="Price"

                            placeholderTextColor="#979797"
                        />

                        <DataField
                            textInputStyle={{ width: 300 }}
                            header="BARCODE"
                            placeholder="Scan or type barcode"

                            placeholderTextColor="#979797"

                        />



                        {//Stock settings container and fields
                        }
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
                                    value="0"
                                />
                                <DataField
                                    header={`Low stock alert${"\u2020"}`}
                                    headerStyle={{ color: "#246fa1" }}
                                    placeholder="0"
                                    placeholderTextColor="#979797"
                                    value="0"
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

                    {//Modal footer (change header related props in app/(app)/_layout.tsx if trying to edit header)
                    }
                    <View style={styles.footerContainer}>
                        <TouchableOpacity style={styles.createItemButton}>
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