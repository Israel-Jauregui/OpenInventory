
//BarcodeScanInput.tsx: Utilizes the phone's camera to scan a valid barcode, then outputs it as plaintext.

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

import { View, Button, Text } from 'react-native';


//TODO: Incorporate functionality of scanning barcodes, validating, then returning. CameraView should have defined barCodeTypes in barCodeScannerSettings so that QR codes are prohibited unless otherwise is desired
export default function BarcodeScanInput() {
    const [permission, requestPermission] = useCameraPermissions();



    return (

        <>


            <View>
                <CameraView facing="back"></CameraView>
            </View>


        </>
    );
}

