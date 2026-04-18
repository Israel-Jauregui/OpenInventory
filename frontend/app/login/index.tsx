import { View, Button, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRouter, Link } from 'expo-router';


import { useState } from 'react';

import qs from 'qs';

//TODO: Import appropriate package(s) for handling login authorization
export default function Login() {

  //BEGIN HOOKS INSTANTIATION

  const [username, setUsername] = useState<string>("");

  //Utilizing useState for password via plaintext is acceptable since such data will not persist locally after being submitted to the API as long as the state is cleared after submission
  const [password, setPassword] = useState<string>("")

  const router = useRouter();

  //END HOOKS INSTANTIATION

  //BEGIN FUNCTION DECLARATIONS (For functions that require component scope)

  //MARK: handleLoginAttempt
  async function handleLoginAttempt() {
    try {
      const options = {
        method: "POST",
        headers: { 
          //Specifies type of content to be received
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
         },
         //qs simply puts data into an acceptable format for the endpoint, which is just an encoded URL parameter for the keys / values of the username and password
         //The password is technically sent in plaintext over the query paramter
        body: qs.stringify({
          username: username,
          password: password
        }),

      }

      //FIXME: Temporary log
      console.log(options.body);

      //FIXME: Eventually use .env for resource IP in every endpoint
      const response = await fetch("http://165.227.213.87:8000/login", options);

      if(!response.ok){
        throw new Error(`Failed to login. Status code: ${response.status}`)
      }

      const responseJSON = await response.json();
      console.log(responseJSON.access_token);
      

    } catch (error) {

    }
  }
  //END FUNCTION DECLARATIONS (For functions that require component scope)

  //MARK: Component return

  //TODO: Add modal for account creation
  return (

    //Main view
    <View
      style={styles.mainContainer}
    >
      {//FIXME: Optional Main Login text header here
        <Text style={styles.mainHeader}>OpenInventory</Text>
      }


      {//Field container TODO: Fine-tune KeyboardAvoidingView behavior and props so that everything including "Need an account?" is visible (though may not be necessary since typing infers having an account) above the keyboard while typing
        //FIXME: KeyboardAvoidingView currently hides text for both fields whilst typing
      }<KeyboardAvoidingView style={styles.fieldsContainer}>
        {//Username input
        }
          <TextInput
            style={[styles.textInputField, { marginTop: 40 }, { color: "black" }]}
            placeholder="Username"
            placeholderTextColor="rgba(100, 100, 100, 0.41)"
            value={username}
            onChangeText={(text) => { setUsername(text); }}

          />        
          {//Password input
          <TextInput
            style={[styles.textInputField]}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="rgba(100, 100, 100, 0.41)"

            onChangeText={(text) => { setPassword(text); }}

          
          />

        }

        {//Login button
        }<TouchableOpacity
          style={styles.loginButtonWrapper}
          onPress={handleLoginAttempt}>
          <Text style={{ textAlign: "center", fontSize: 20, color: "#ffffff" }}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButtonWrapper, { backgroundColor: "pink" }]}
          onPress={() => router.replace("/(tabs)/inventory-select")}>
          <Text style={{ textAlign: "center", fontSize: 20, color: "#ffffff" }}>{"\u{1F5E3}"}TEMPORARY BYPASS</Text>
        </TouchableOpacity>

        {//Secondary account creation link FIXME: TEMPORARILY RETURNS TO LOGIN PAGE
        }
        <Link href="/" asChild>
          <Text style={styles.signupText}>Need an account?</Text>
        </Link>

      </KeyboardAvoidingView>
    </View>
  );


}


//MARK: Styling
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",



    experimental_backgroundImage: "linear-gradient(0340deg, #a2d5ff 0%, #b2dbff 20%, #68bbff 45%, #3da6fc 60%, #a0d4ff 100%)",
  },

  mainHeader: {

    color: "white",

    fontSize: 30,

    textAlign: "center",

  },

  fieldsContainer: {

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,

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

    //Changing color property will alter the input text's color
    color: "black",

    backgroundColor: "#e4e4e4",

    fontSize: 15,
    textAlign: "left",


    height: 60,
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
