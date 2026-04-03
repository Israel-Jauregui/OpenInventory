import { View, Text, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Pressable , ScrollView} from "react-native";
import React from 'react';
//FIXME: TEMPORARY IMPORT
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
//FIXME: TEMPORARY IMPORT
import { Dropdown } from 'react-native-element-dropdown' //TODO: To be implemented

import  HomeInventoryButton from "../../components/HomeInventoryButton/HomeInventoryButton"; 

//FIXME: TEMPORARY IMPORT
import BarcodeScanInput from "@/components/BarcodeScanInput/BarcodeScanInput";

//Utilized for home button onPress events and barcode scanner button
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768; //large view
const buttonSize = isLargeScreen ? 200 : width / 2.5; // fits two buttons per row
/* make buttons to navigate to other tabs*/
export default function Home() {

    //Used for routing after clicking barcode scanner, home inventory buttons, etc.
    const router = useRouter();

    //When importing components that were previously written here, make sure to adjust / remove styling here since they will have their own stylesheets
    return (
        <>
            
            {/*Inventory type dropdown TODO: Turn into own component with appropriate dropdown later for reusability and functionality
           Also change styling when dropdown is incorporated */
            }
            <View style={styles.inventoryHeader}>
                <Text style={{margin: 2, padding: 5, fontSize: 22}}>Inventory_Name</Text>
            </View>

            {//Search bar TODO: Move to own component file for reusability's sake. Do the same for sort, filter, and other buttons that appear more than once
            }
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for items here..."
                    placeholderTextColor="grey"
                ></TextInput>

                {//Input barcode via scan TODO: Turn into own component
                }
                <Pressable style={[styles.barcodeScan]} onPress={()=>{router.navigate('../scanner');}}>
                    <Image 
                    style={{height: 40,width: 40}}source={require("../../assets/images/barcodeScanIcon.png")}/>
                </Pressable>
            </View>

            {//Home view buttons TODO: Turn into components and pass relevant props such as name
            }
            <ScrollView>
            <View style={styles.container}>
                

                <View style={styles.row}>
                    {//Create item button
                    }
                    <TouchableOpacity style={styles.button}>
                        <Image style={{marginTop: 40, height: 75, width: 75}}source={require("../../assets/images/plusIcon.png")}/>
                        <Text style={[styles.buttonText, {marginBottom: 20, padding: 4, textAlign: "center"}]}>Create Item Master Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}>
                        <Image style={{height: 75, width: 75}}source={require("../../assets/images/manageUsersIcon.png")}/>
                        <Text style={[styles.buttonText, {marginTop: 10}]}>Manage Users</Text>
                       
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={[styles.buttonText, {marginTop: 10}]}>Comments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={[styles.buttonText, {marginTop: 10}]}>Needs attention</Text>
                    </TouchableOpacity>
                    
                    
                </View>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={[styles.buttonText, {marginTop: 10}]}>Delete Item</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={[styles.buttonText, {marginTop: 10}]}>Edit Item</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </>

    );

}

const styles = StyleSheet.create({
    inventoryHeader: { justifyContent: "center", alignItems: "center" },
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
        right: 50,
        justifyContent: "center",
        alignItems: "center",

        height: 50,
        width: 50,

        borderColor: "black",
        borderWidth: 2,
        borderRadius: 30,
        backgroundColor: "#1B9AAA",
    
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
        flexDirection: 'row',       // horizontal row
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
        borderColor: '#a2d3fa',
        borderWidth: 1,

    },
    buttonText: {
        color: '#a2d3fa',
        fontWeight: 'bold',
        fontSize: 16,
    },
})