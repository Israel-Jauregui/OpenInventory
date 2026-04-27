import { View, TextInput, StyleSheet } from 'react-native'

import BarcodeScannerButton from '../BarcodeScannerButton/BarcodeScannerButton';

type Props = {
    value?: string;
    onChangeText?: (text: string) => void;
    onBarcodePress?: () => void;
    placeholder?: string;
};

export default function ItemsSearchBar({ value, onChangeText, onBarcodePress, placeholder }: Props) {
    return (<>
        <View style={styles.searchBarContainer}>
            <TextInput
                style={styles.searchBar}
                placeholder={placeholder ?? "Search for items here..."}
                placeholderTextColor="grey"
                value={value}
                onChangeText={onChangeText}
            ></TextInput>

            {//Input barcode via scan
            }<BarcodeScannerButton
                style={
                    {
                        position: "absolute",
                        right: 55,
                        height: 50,
                        width: 50,
                    }}
                onPress={onBarcodePress}
            />
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
