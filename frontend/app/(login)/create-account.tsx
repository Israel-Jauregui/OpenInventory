import { useRouter, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, TouchableOpacity, Text, TextInput, Switch, StyleSheet } from 'react-native'

import { useSession } from '@/contexts/AuthContext/AuthContext';

import DataField from '@/components/DataField/DataField';

export default function CreateAccount() {

    const { fetchWithAuth, handleSignup } = useSession();

    const navigation = useRouter();
    const router = useRouter();

    //Utilizes an object so that one state setter can update error states that are similar in appearance
    //Isn't technically needed for username / password / wantsNotif (since it's just three fields), though this format can definitely benefit holding data for more complex forms
    const [formError, setFormError] = useState<{ usernameError: string, passwordError: string }>({
        usernameError: "",
        passwordError: "",
    });


    const [username, setUsername] = useState<string>("");

    //Utilizing useState for password via plaintext is acceptable since such data will not persist locally after being submitted to the API as long as the state is cleared after submission
    const [password, setPassword] = useState<string>("")

    const [wantsNotif, setWantsNotif] = useState<boolean>(false);

    return (<>
        {//Main view
        }
        <View
            style={styles.mainContainer}
        >
            {//FIXME: Optional Main text header here
            }<Text style={styles.mainHeader}>Create account</Text>

            {//Field container TODO: Fine-tune KeyboardAvoidingView behavior and props so that everything including "Need an account?" is visible (though may not be necessary since typing infers having an account) above the keyboard while typing
            }<KeyboardAvoidingView style={styles.fieldsContainer}>

                {//Username input MARK: Begin input fields
                }<DataField
                    style={{ marginTop: 40, width: "90%" }}
                    placeholder="Username"
                    placeholderTextColor="rgba(100, 100, 100, 0.41)"

                    onChangeText={(text) => { setUsername(text); }}

                />

                {//Form error state for username that is conditionally rendered
                }{formError.usernameError ? <Text style={{ margin: 4, marginLeft: "23%", color: "red", width: "100%" }}>{formError.usernameError}</Text> : null}

                {//Password input
                }<DataField
                    style={{ width: "90%" }}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor="rgba(100, 100, 100, 0.41)"

                    onChangeText={(text) => { setPassword(text); }}
                />
                {//Form error state for username that is conditionally rendered
                }{formError.passwordError ? <Text style={{ margin: 4, marginLeft: "23%", color: "red", width: "100%" }}>{formError.passwordError}</Text> : null}

                {//Toggle for enabling wantsNotif
                }<View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                    <Text style={{ color: "grey", fontSize: 15 }}>Enable notifications</Text>
                    {//Toggle for notifications
                    }<Switch
                        style={styles.notificationSwitch}
                        value={wantsNotif}
                        ios_backgroundColor={"grey"}
                        onValueChange={() => { setWantsNotif(!wantsNotif); }}
                    />
                </View>

                {//Signup button
                }<TouchableOpacity
                    style={styles.signupButtonWrapper}
                    onPress={() => {
                        //Prevents signup if fields are empty (can add more error states / potentially use a switch)
                        if (!username || !password) {
                            //Spread syntax is still used just in case more error states are added for any reason
                            setFormError({
                                ...formError,
                                usernameError: !username ? "Username is required" : "",
                                passwordError: !password ? "Password is required" : "",
                            });

                            return;

                        } else {
                            setFormError({
                                ...formError,
                                usernameError: "",
                                passwordError: "",
                            });
                            handleSignup(username, password, wantsNotif);
                        }
                    }}>
                    <Text style={{ textAlign: "center", fontSize: 20, color: "#ffffff" }}>Register</Text>
                </TouchableOpacity>


                {//Alternative back button to login
                }<TouchableOpacity onPress={() => { 

                    //Resets form error states before backing out
                    setFormError({usernameError: "", passwordError: ""});
                    router.back(); }}>
                    <Text style={styles.loginNavigatorText}>Already have an account?</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </View>

    </>);
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


        borderColor: "#36a2fa",
        borderWidth: 1,
        borderRadius: 30,

        //Changing color property will alter the input text's color
        color: "black",

        backgroundColor: "#e4e4e4",

        fontSize: 15,
        textAlign: "left",


        height: 60,
        width: "90%",
    },

    notificationSwitch: {
        marginLeft: 18,
    },
    signupButtonWrapper: {
        margin: 5,
        marginTop: 25,
        padding: 10,

        borderRadius: 30,

        backgroundColor: "#36a2fa",

        width: "90%"
    },

    loginNavigatorText: {

        margin: 20,
        color: "#292929",

        fontSize: 16,
        fontWeight: "600",
        textDecorationLine: "underline"

    },



});