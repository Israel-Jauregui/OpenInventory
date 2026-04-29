import { Text, View, TextInput, TextStyle, ViewStyle,  StyleProp, StyleSheet, TextInputProps } from 'react-native';
import { SetStateAction } from 'react';

type Props = {

    textInputStyle?: StyleProp<TextStyle>,
    //Optional header text that is rendered above field
    header?: string
    headerStyle?: StyleProp<TextStyle>
    containerStyle?: StyleProp<ViewStyle>
    textInputProps?: TextInputProps,
    requiredAsterisk?: boolean
    


}
    //I don't even know how this black magic actually works but StackOverflow did it again
    //Adds all ability to accept regular TextInputProps (e.g. secureTextEntry, placeholder, and far far more) via type intersection
    & TextInputProps;

export default function DataField({ textInputStyle, header, headerStyle, requiredAsterisk = false, containerStyle, ...textInputProps }: Props) {

    return (<>
        <View style={[{flex: 1}, containerStyle]}>
            {header ? <Text style={[styles.header, headerStyle]}>{header}{requiredAsterisk ? <Text style={styles.required}> *</Text> : null}</Text> : null}
            <TextInput
                style={[styles.textInputField
                    //Default styling (overridden by properties specified in style prop)
                    , textInputStyle]}




                //Adds props that are tied to TextInput if such props are specified(e.g. placeholder)
                {...textInputProps} />
        </View>


    </>);
}

const styles = StyleSheet.create(
    {
        header: {
            marginLeft: 10,
            marginTop: 12,
            color: "#707479",
            fontSize: 18,
            fontWeight: "500"
        },

        required: {
            position: "absolute",
            color: "red",
            fontSize: 24,
        },

        textInputField: {
            margin: 5,
            padding: 15,


            borderColor: "#36a2fa",
            borderWidth: 1,
            borderRadius: 30,

            //Changing color property will alter the input text's color
            color: "black",

            backgroundColor: "#e4e4e4",

            fontSize: 15,
            textAlign: "left",

            //Change height back to percentage if needed
            height: 50,
        }
    });