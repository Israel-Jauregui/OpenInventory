//BarcodeScanInput.tsx: Utilizes the phone's camera to scan a valid barcode, then outputs it as plaintext.

import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  onScanned?: (barcode: string) => void;
};

//TODO: Incorporate functionality of scanning barcodes, validating, then returning. CameraView should have defined barCodeTypes in barCodeScannerSettings so that QR codes are prohibited unless otherwise is desired
export default function BarcodeScanInput({ onScanned }: Props) {
  //Hook instantiations
  const [permission, requestPermission] = useCameraPermissions();
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [previousBarcode, setPreviousBarcode] = useState("");

  
  useEffect(() => {
    if(permission && !permission.granted ){
        requestPermission();
    }}, [permission]
  )

  if(!permission?.granted){
    return <View/>
  }

  return (
    <>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "itf14",
            ],
          }}
        />
        <View pointerEvents="none" style={styles.overlayTop}>
          <Text style={styles.overlayTitle}>Scan a barcode</Text>
        </View>
        <View pointerEvents="none" style={styles.overlayBottom}>
          <Text style={styles.overlayHint}>Center the barcode inside the frame</Text>
        </View>
      </View>
    </>
  );

  //TODO: Continue improving handling of recent / duplicate scans
  function handleBarcodeScanned({ data }: { data: string }) {
    if (!data || barcodeScanned || data === previousBarcode) {
      //FIXME: Temporary console log
      console.log(
        "Exiting handleBarcodeScanned due to either empty data, scan delay, or duplicate scan recently",
      );
      return;
    }
    //Set barcodeScanned to true to delay next processing of scan
    setBarcodeScanned(true);
    setPreviousBarcode(data);

    console.log(data);
    onScanned?.(data);

    //Sets barcodeScanned to false
    setTimeout(() => {
      //FIXME: Temporary console log
      console.log(`barcodeScanned: ${barcodeScanned}`);

      setBarcodeScanned(false);
      setPreviousBarcode("");
    }, 1000);
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },

  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 28,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(13, 27, 42, 0.42)",
    alignItems: "center",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
    backgroundColor: "rgba(13, 27, 42, 0.42)",
    alignItems: "center",
  },
  overlayTitle: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "700",
  },
  overlayHint: {
    fontSize: 15,
    color: "#e5edf6",
    fontWeight: "500",
  },
  perm: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    
  },
  button: {
    width: "66%",
    backgroundColor: "#DDDDDD",
    padding: 30,
    borderRadius: 12,
  },
  buttonText:{
    fontSize:20
  }
  
});
