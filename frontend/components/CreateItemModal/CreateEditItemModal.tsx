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
                    <ScrollView>

                        <View style={[styles.center,]}>
                            <DataField
                                textInputStyle={{ width: 300 }}
                                header="ITEM NAME"
                                headerStyle={{}}
                                placeholder="Item Name"
                                placeholderTextColor="#979797"
                                requiredAsterisk={true}
                            />
                        </View>

                        <View style={{flexDirection: "row", alignItems: "center", padding: 20}}>
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
                            header="DESCRIPTION"
                            placeholder="Description"
                            placeholderTextColor="#979797"
                        />

                        <DataField
                            header="PRICE"
                            placeholder="Price"

                            placeholderTextColor="#979797"
                        />

                        <DataField
                            header="BARCODE"
                            placeholder="Barcode"

                            placeholderTextColor="#979797"

                        />

                        <DataField
                            header="Initial quantity"
                            placeholder="0"
                            placeholderTextColor="#979797"
                            value="0"
                        />
                        <DataField
                            header="Low stock alert trigger"
                            placeholder="0"
                            placeholderTextColor="#979797"
                            value="0"
                        />

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