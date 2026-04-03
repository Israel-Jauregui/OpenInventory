//HomeInventoryButton.tsx: Returns a button that can be used to perform actions such as creating item master data, edting / deleting items, etc.

import { Text, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native"; 

const buttonSize = Dimensions.get('window').width / 2.5; // fits two buttons per row


//TODO: Consider changing onPress prop type if needed; current type is void since home buttons will likely just route to another screen
export default function HomeInventoryButton({ name, onPress }: {name: string, onPress: ()=> void}) {
    

    return (

        <>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{name}</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create(
    {
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
    }
);