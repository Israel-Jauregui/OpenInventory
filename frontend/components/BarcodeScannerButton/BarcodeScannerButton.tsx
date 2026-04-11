//BarcodeScannerButton.tsx: Button that navigates to scanner/index.tsx. Should be placed in any field that may take in a barcode manually.
import { Pressable, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';

type Props = { style?: StyleProp<ViewStyle> };

//The style prop can be used for additional styling, overriding certain style properties, etc.
export default function BarcodeScannerButton({ style }: Props) {

    const router = useRouter();

    return (<>
        {//Button that navigates to the scanner. Style prop is also passed to override things such as position for different fields.
        }<Pressable
            style={[styles.barcodeScan, style]}
            onPress={() => { router.navigate('../scanner'); }}
        >
            <Image
                style={{ height: 40, width: 40 }} source={require("../../assets/images/barcodeScanIcon.png")}
            />
        </Pressable>
    </>);
}

const styles = StyleSheet.create(
    //Requires positioning of the button passed via the style prop
    {
        barcodeScan: {
            

            justifyContent: "center",
            alignItems: "center",

            borderColor: "black",
            borderWidth: 2,
            borderRadius: 30,

            backgroundColor: "#3bb7ff",

        },
    });