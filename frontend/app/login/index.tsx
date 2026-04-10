import { View, Button, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
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
          <Button

            color="white"
            title="LOGIN"
            onPress={() => router.replace("/(tabs)/inventory-select")} />
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



    experimental_backgroundImage: "linear-gradient(0deg,rgba(134, 193, 217, 1) 0%, rgba(223, 237, 227, 1) 45%, rgba(255, 255, 255, 1) 86%, rgba(214, 213, 203, 1) 100%)",
  },

  mainHeader: {
    fontSize: 48
  },

  fieldsContainer: {

    justifyContent: "center",
    alignItems: "center",

    margin: 10,
    padding: 10,

    borderColor: "black",
    borderWidth: 2,
    borderRadius: 35,

    backgroundColor: "#1B9AAA",


    height: "50%",
    width: "80%"

  },

  textInputField: {
    margin: 5,
    padding: 10,

    borderRadius: 20,
    borderWidth: 2,

    color: "black",
    backgroundColor: "#DDDBCB",

    fontSize: 20,
    textAlign: "left",


    height: "15%",
    width: "90%",
  },

  loginButtonWrapper: {
    margin: 5,
    marginTop: 25,
    padding: 10,

    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,

    backgroundColor: "rgba(11, 74, 73, 0.71)",



    width: "90%"
  },

  signupText: {

    margin: 40,
    color: "#DDDBCB",

    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline"

  },



});
