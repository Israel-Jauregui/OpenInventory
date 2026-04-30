import { View, Text, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Pressable, ScrollView, Modal } from "react-native";
import React from 'react';
import { useState } from 'react';
//FIXME: TEMPORARY IMPORT
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
//FIXME: TEMPORARY IMPORT
import { Dropdown } from 'react-native-element-dropdown' //TODO: To be implemented


//BEGIN Custom component imports
//FIXME: TEMPORARY IMPORT
import HomeInventoryButton from "../../../components/HomeInventoryButton/HomeInventoryButton";
//home icons
import AddItemIcon from "@/assets/images/AddItemIcon.svg";
import ViewInventoryIcon from "@/assets/images/viewInventoryIcon.svg";
import ManageUsersIcon from "@/assets/images/ManageUsersIcon.svg";
import DeleteItemIcon from "@/assets/images/deleteItemIcon.svg";
import EditItemIcon from "@/assets/images/editItemIcon.svg";
import ChangeQuantityIcon from "@/assets/images/changeQuantityIcon.svg";
import InventoryHeader from "@/components/InventoryHeader/InventoryHeader";
import ItemsSearchBar from "@/components/ItemsSearchBar/ItemsSearchBar";


//FIXME: TEMPORARY IMPORT
import BarcodeScanInput from "@/components/BarcodeScanInput/BarcodeScanInput";

//END Custom component imports

import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";


//Utilized for home button onPress events and barcode scanner button
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768; //large view
const buttonSize = isLargeScreen ? 200 : width / 2.5; // fits two buttons per row


export default function Home() {
    //BEGIN HOOK INSTANTIATIONS MARK: Hook instantiations
    const [createItemVisible, setCreateItemVisible] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>("");


    //Used for routing after clicking barcode scanner, home inventory buttons, etc.
    const router = useRouter();

    const navigation = useNavigation();

    const { currentInventory } = useCurrentInventoryContext();
    const isInventoryAdmin = currentInventory.role === "admin";
    const isInventoryMember = currentInventory.role === "member";
    //END HOOK INSTANTIATIONS

    //FIXME: Can be added back if needed
    //const { inventoryName, inventoryId } = useLocalSearchParams<{ inventoryName?: string, inventoryId?: string }>();

    //When importing components that were previously written here, make sure to adjust / remove styling here since they will have their own stylesheets
    return (
        <>
            {/*Inventory type dropdown */
            }<InventoryHeader inventoryName={`${currentInventory.invName} ID: ${currentInventory.invId}`} />

            {//Contains both the search bar and the barcode scanner button
            }<ItemsSearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => {
                    router.push({
                        pathname: "/items",
                        params: { q: searchQuery.trim() },
                    });
                }}
                onBarcodePress={() => { router.push("/scanner"); }}
            />

            {//Home view buttons TODO: Consider turning into components and pass relevant props such as name
            }<ScrollView>
                <View style={styles.container}>


                    <View style={styles.row}>
                        {//Create item button
                        }
                        <TouchableOpacity 
                        style={styles.button}
                        onPress={()=>{router.navigate("/items")}}
                        >
                            <ViewInventoryIcon width={75} height={75} />
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Inventory</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        style={[styles.button, !isInventoryAdmin && styles.buttonDisabled]}
                        disabled={!isInventoryAdmin}
                        onPress={()=>{router.navigate("/inventory/manage-users")}}
                        >
                            <ManageUsersIcon width={75} height={75} />
                            <Text style={[styles.buttonText, { marginTop: 10 }, !isInventoryAdmin && styles.buttonTextDisabled]}>Manage Users</Text>
                            {isInventoryMember ? (
                                <Text style={styles.adminOnlyNote}>Admin only</Text>
                            ) : null}

                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity 
                        style={styles.button}
                        onPress={
                            
                            /*FIXME: Add back if create.tsx is reverted ()=>{
                            setCreateItemVisible(true);
                            navigation.setOptions({headerTitle: "Create Item"});}
                            */
                            //TODO: Pass relevant params (may also need router.push instead)
                            ()=>{router.navigate({pathname: "/inventory/item/create", params: {mode: "create"}})}
                        }
                        >
                            <AddItemIcon width={75} height={75} style={{ marginTop: 40 }} />
                            <Text style={[styles.buttonText, { marginBottom: 20, padding: 4, textAlign: "center" }]}>Create Item Master Data</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <ChangeQuantityIcon width={75} height={75}  />
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Change Quanity</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity
                        style={[styles.button, !isInventoryAdmin && styles.buttonDisabled]}
                        disabled={!isInventoryAdmin}
                        onPress={() => { router.push({ pathname: "/scanner", params: { action: "delete" } }); }}
                        >
                            <DeleteItemIcon width={75} height={75} />
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Delete Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={[styles.button, !isInventoryAdmin && styles.buttonDisabled]}
                        disabled={!isInventoryAdmin}
                        onPress={() => { router.push({ pathname: "/scanner", params: { action: "edit" } }); }}
                        >
                            <EditItemIcon width={75} height={75} />
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Edit Item</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>

    );

}

const styles = StyleSheet.create({
    inventoryHeader: {
        justifyContent: "center",
        alignItems: "center"
    },

    searchBarContainer: {
        justifyContent: "center",
        alignItems: "center",
    },

    searchBar: {
        margin: 10,
        padding: 20,

        backgroundColor: "#d9d9d9",

        fontSize: 18,
        color: "#1d1b20",

        borderRadius: 20,


        width: "80%",
    },

    barcodeScan: {
        position: "absolute",
        right: 55,
        justifyContent: "center",
        alignItems: "center",

        height: 50,
        width: 50,

        borderColor: "black",
        borderWidth: 2,
        borderRadius: 30,
        backgroundColor: "#3bb7ff",

    },

    text: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    container: {
        flex: 1,
        //justifyContent: 'center',   // center vertically FIXME: Can enable again if needed
        alignItems: 'center',       // center horizontally
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ffffff',
        width: buttonSize,
        height: buttonSize,
        justifyContent: 'center',   // center text vertically
        alignItems: 'center',       // center text horizontally
        marginHorizontal: 10,
        borderRadius: 12,
        borderColor: '#6fbeff',
        borderWidth: 1,

    },
    buttonDisabled: {
        backgroundColor: '#f1f1f1',
        borderColor: '#d3d3d3',
    },
    buttonText: {
        color: '#2e2e2e',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonTextDisabled: {
        color: '#8e8e8e',
    },
    adminOnlyNote: {
        marginTop: 6,
        fontSize: 12,
        color: '#7d7d7d',
        fontWeight: '600',
    },
})
