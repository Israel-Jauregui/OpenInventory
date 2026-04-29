import { useEffect } from "react";
import { View , Text, StyleSheet, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import Svg, { Path } from "react-native-svg";



export default function Camera(){

    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if(permission && !permission.granted ){
            requestPermission();
        }}, [permission]
      )
    
    if(!permission?.granted){
        return <View><Text>HIIIIIIIIIIIIIIIIIIIIIIIIIIII</Text></View>
    }

    return(
        <>
            <SafeAreaView style={styles.cameraContainer}>
                <CameraView
                          style={styles.camera}
                          facing="back"
                        />
                <TouchableOpacity style={styles.cameraButton}>
                    <Svg
                              height="64px"
                              viewBox="0 -960 960 960"
                              width="64px"
                            >
                              <Path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" 
                                fill="#36a2fa"
                              />
                            </Svg>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
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
  cameraButton:{
    height: 96,
    width: 96,
    borderRadius: 48,
    position: "absolute",
    backgroundColor: "#DDDDDD",
    bottom: 64,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#9c9c9c",
}})