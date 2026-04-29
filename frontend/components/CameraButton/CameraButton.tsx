import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";


type Props = {
    header : String,
}

export default function CameraButton({header}: Props) {
  return (
    <>
        <Text style={styles.header}>{header}</Text>
      <TouchableOpacity style={styles.button}>
        <Svg
          height="96px"
          viewBox="0 -960 960 960"
          width="96px"
        >
          <Path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" 
            fill="#36a2fa"
          />
        </Svg>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 12,
  },
  header:{
    color: "#707479",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    paddingBottom: 16,
  }
});
