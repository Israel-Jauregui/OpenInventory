import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import DataField from "../DataField/DataField";
import { item } from "@/contexts/InventoryDataContext/InventoryDataContext";

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
                    <ScrollView contentContainerStyle={{ alignItems: "center" }}>

                        <View style={[styles.center, { height: "15%" }]}>
                            <DataField
                                textInputStyle={{ width: 300 }}
                                header="ITEM NAME"
                                containerStyle={{ padding: 20 }}
                                placeholder="Item Name"
                                placeholderTextColor="#979797"
                                requiredAsterisk={true}
                            />
                        </View>

                        <View style={
                            {
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",

                                padding: 20,

                                width: "90%",

                            }}>
                            <DataField
                                header="CATEGORY"
                                headerStyle={{}}
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

                        <View style={
                            {
                                flex: 1,
                                backgroundColor: "#c6d7e7",

                                margin: 0,
                                padding: 0,

                                borderColor: "#36a2fa",
                                borderWidth: 1,
                                borderRadius: 20,
                                
                                width: 300,


                            }}>
                            <Text style={{margin: 10, top: 0, left: 0, fontSize: 16, color: "#437a9e", fontWeight: "600"}}>STOCK SETTINGS</Text>
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
                        </View>

                    </ScrollView>
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
            alignItems: "center"
        },
    });