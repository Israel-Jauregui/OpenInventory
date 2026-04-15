import { View, Button, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useRouter, Link } from 'expo-router';

//TODO: Import appropriate package(s) for handling login authorization
export default function Login() {
  const router = useRouter();

  return (

    //Main view
    <View
      style={styles.mainContainer}
    >
      {//FIXME: Optional Main Login text header here
        <Text style={styles.mainHeader}>OpenInventory</Text>
      }


      {//Field container TODO: Fine-tune KeyboardAvoidingView behavior and props so that everything including "Need an account?" is visible (though may not be necessary since typing infers having an account) above the keyboard while typing
      }
      <KeyboardAvoidingView style={styles.fieldsContainer} behavior="padding" keyboardVerticalOffset={25}>
        {//Username input
        }
        <TextInput
          style={[styles.textInputField, {}]}
          placeholder="Username"
          placeholderTextColor="rgba(100, 100, 100, 0.41)" />

        {//Password input
          <TextInput
            style={[styles.textInputField]}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="rgba(100, 100, 100, 0.41)" />

        }

        <View style={styles.loginButtonWrapper} >
          <TouchableOpacity onPress={() => router.replace("/(tabs)/inventory-select")}>
            <Text style={{ textAlign: "center", fontSize: 20, color: "#ffffff" }}>LOGIN</Text>
          </TouchableOpacity>
        </View>

        {//Secondary account creation link FIXME: TEMPORARILY RETURNS TO LOGIN PAGE
        }
        <Link href="/" asChild>
          <Text style={styles.signupText}>Need an account?</Text>
        </Link>

      </KeyboardAvoidingView>
    </View>
  );


}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",



    experimental_backgroundImage: "linear-gradient(0340deg, #a2d5ff 0%, #b2dbff 20%, #68bbff 45%, #3da6fc 60%, #a0d4ff 100%)",
  },

  mainHeader: {
    fontSize: 30,
    textAlign: "center",
    
  },

  fieldsContainer: {

    justifyContent: "center",
    alignItems: "center",

    marginTop:10,

    padding: 20,

    borderRadius: 35,
    
    backgroundColor: "#ffffff",


    height: "50%",
    width: "80%"

  },

  textInputField: {
    margin: 7,
    padding: 20,

   borderRadius: 30,
    
    
    color: "black",
    backgroundColor: "#e4e4e4",

    fontSize: 15,
    textAlign: "left",


    height: "10%",
    width: "90%",
  },

  loginButtonWrapper: {
    margin: 5,
    marginTop: 25,
    padding: 10,

    borderRadius: 30,

    backgroundColor: "#36a2fa",



    width: "90%"
  },

  signupText: {

    margin: 40,
    color: "#292929",

    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline"

  },



});
