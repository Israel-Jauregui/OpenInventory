import { TextInput, TextStyle, StyleProp, TextInputProps} from 'react-native';
import { SetStateAction } from 'react';

type Props = {

    style?: StyleProp<TextStyle>,
    textInputProps?: TextInputProps,


    
} 
//I don't even know how this black magic actually works but StackOverflow did it again
//Adds all ability to accept regular TextInputProps (e.g. secureTextEntry, placeholder, and far far more) via type intersection
 & TextInputProps;

export default function DataField({ style, ...textInputProps}: Props) {

    return (<>

        <TextInput
            style={[
                //Default styling (overridden by properties specified in style prop)
                {
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


                    height: "15%",
                    width: "50%",
                }, style]}


        

            //Adds props that are tied to TextInput if such props are specified(e.g. placeholder)
            {...textInputProps}

            
        />

    </>);
}

