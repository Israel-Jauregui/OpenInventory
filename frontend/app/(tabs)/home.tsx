import { View, Text, StyleSheet} from "react-native";
import React from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

/* make buttons to navigate to other screens*/
export default function Home(){

    return (<View><Text style={styles.text}>Home page</Text></View>);
    
}

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})