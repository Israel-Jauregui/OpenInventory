
//BarcodeScanInput.tsx: Utilizes the phone's camera to scan a valid barcode, then outputs it as plaintext.

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { View, Button, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';


//TODO: Incorporate functionality of scanning barcodes, validating, then returning. CameraView should have defined barCodeTypes in barCodeScannerSettings so that QR codes are prohibited unless otherwise is desired
export default function BarcodeScanInput() {
    //Hook instantiations
    const [permission, requestPermission] = useCameraPermissions();
    const [barcodeScanned, setBarcodeScanned] = useState(false);
    const [previousBarcode, setPreviousBarcode] = useState("");
    const [showCamera, setShowCamera] = useState(true);
    const router = useRouter();

    // Show loading indicator while permission is being checked
    if (!permission) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Checking camera permission...</Text>
            </View>
        );
    }

    // If permission is not granted, show a clear message and a button to request permission
    if (!permission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 16, fontSize: 16 }}>
                    Camera access is required to scan barcodes.
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={{
                        backgroundColor: '#36a2fa',
                        padding: 12,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Grant Camera Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <View style={styles.cameraContainer}>
                {showCamera && (
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        onBarcodeScanned={handleBarcodeScanned}
                    />
                )}
            </View>
        </>
    );

    // Unmount CameraView after a scan to prevent black screen
    function handleBarcodeScanned({ data }: { data: string }) {
        if (!data || barcodeScanned || data === previousBarcode) {
            //FIXME: Temporary console log
            console.log("Exiting handleBarcodeScanned due to either empty data, scan delay, or duplicate scan recently");
            return;
        }
        setBarcodeScanned(true);
        setPreviousBarcode(data);
        setShowCamera(false); // Unmount camera before navigating
        console.log(data);

        // Navigate to the item details screen with the barcode
        router.push(`/items/${data}`);
        // Do not remount camera here; let navigation lifecycle handle remounting
    }
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

