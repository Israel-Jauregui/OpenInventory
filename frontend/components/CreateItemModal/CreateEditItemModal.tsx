import { useState } from "react"; 
import { View, Text, StyleSheet } from "react-native";
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
                    <DataField placeholder="Item Name"/>
                    <DataField />
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

    });