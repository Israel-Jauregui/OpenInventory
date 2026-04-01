import { View, Text, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import React from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
const buttonSize = Dimensions.get('window').width / 2.5; // fits two buttons per row
/* make buttons to navigate to other screens*/
export default function Home(){

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Inventory</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Button 2</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Button 3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Button 4</Text>
                </TouchableOpacity>
            </View>
        </View>
            
    );
    
}

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',   // center vertically
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