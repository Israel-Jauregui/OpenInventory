
//BarcodeScanInput.tsx: Utilizes the phone's camera to scan a valid barcode, then outputs it as plaintext.

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

import { View, Button, Text, TouchableOpacity , StyleSheet} from 'react-native';


//TODO: Incorporate functionality of scanning barcodes, validating, then returning. CameraView should have defined barCodeTypes in barCodeScannerSettings so that QR codes are prohibited unless otherwise is desired
export default function BarcodeScanInput() {
    const [permission, requestPermission] = useCameraPermissions();


    if (!permission) {
        return <View></View>  //Returned if permissions are still loading
    }

    if (!permission.granted) { //Returned if camera permissions are either denied or turned off in device's permission settings
        //TODO: Add appropriate styling / text to tell user to grant camera permissions
        return (
            <>
                <TouchableOpacity onPress={requestPermission}><Text>Permission</Text></TouchableOpacity>
            </>
        )
    }

    return (

        <>


            <View style={styles.cameraContainer}>
                <CameraView style={styles.camera} facing="back" />
            </View>


        </>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex : 1,

    },

    camera: {
        flex: 1,
        width: "100%",
        height: "100%",
    }
});

