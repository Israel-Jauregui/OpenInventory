import { View, Text, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Pressable, ScrollView } from "react-native";
import React from 'react';
//FIXME: TEMPORARY IMPORT
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
//FIXME: TEMPORARY IMPORT
import { Dropdown } from 'react-native-element-dropdown' //TODO: To be implemented

//BEGIN Custom component imports
import HomeInventoryButton from "../../components/HomeInventoryButton/HomeInventoryButton";
import ItemsSearchBar from "@/components/ItemsSearchBar/ItemsSearchBar";
import InventoryHeader from "@/components/InventoryHeader/InventoryHeader";
//FIXME: TEMPORARY IMPORT
import BarcodeScanInput from "@/components/BarcodeScanInput/BarcodeScanInput";

//END Custom component imports

//Utilized for home button onPress events and barcode scanner button
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768; //large view
const buttonSize = isLargeScreen ? 200 : width / 2.5; // fits two buttons per row


export default function Home() {

    //Used for routing after clicking barcode scanner, home inventory buttons, etc.
    const router = useRouter();
    const { inventoryName } = useLocalSearchParams<{ inventoryName?: string }>();

    //When importing components that were previously written here, make sure to adjust / remove styling here since they will have their own stylesheets
    return (
        <>

            {/*Inventory type dropdown */
            }<InventoryHeader inventoryName={inventoryName === undefined ? "" : inventoryName} />

            {//Contains both the search bar and the barcode scanner button
            }<ItemsSearchBar />

            {//Home view buttons TODO: Consider turning into components and pass relevant props such as name
            }<ScrollView>
                <View style={styles.container}>


                    <View style={styles.row}>
                        {//Create item button
                        }
                        <TouchableOpacity style={styles.button}>
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Inventory</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Image style={{ height: 75, width: 75 }} source={require("../../assets/images/manageUsersIcon.png")} />
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Manage Users</Text>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.button}>
                            <Image style={{ marginTop: 40, height: 75, width: 75 }} source={require("../../assets/images/plusIcon.png")} />
                            <Text style={[styles.buttonText, { marginBottom: 20, padding: 4, textAlign: "center" }]}>Create Item Master Data</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Needs attention</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={[styles.buttonText, { marginTop: 10 }]}>Delete Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
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
    buttonText: {
        color: '#39a2f8',
        fontWeight: 'bold',
        fontSize: 16,
    },
})