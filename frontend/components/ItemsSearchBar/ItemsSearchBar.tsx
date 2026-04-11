import { View, Image, Pressable, TextInput, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

import BarcodeScannerButton from '../BarcodeScannerButton/BarcodeScannerButton';

export default function ItemsSearchBar() {
    const router = useRouter();

    return (<>
        <View style={styles.searchBarContainer}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for items here..."
                placeholderTextColor="grey"
            ></TextInput>

            {//Input barcode via scan
            }<BarcodeScannerButton
                style={
                    {
                        position: "absolute",
                        right: 55,
                        height: 50,
                        width: 50,
                    }} />
        </View>
    </>
    );

}

const styles = StyleSheet.create(

    {
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

    }
);