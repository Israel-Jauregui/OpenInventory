import { StyleSheet, Modal, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SetStateAction } from 'react';

import { useNavigation } from 'expo-router';

import { useContext } from 'react';

//FIXME: TEMPORARY UNTIL AUTHCONTEXT AND EXPO-SECURE-STORE ARE USED
import { TemporaryTokenContext } from '@/contexts/InventoryNamesContext/TemporaryTokenContext';

type CreateItemModalProps = {
    visible: boolean,
    //MARK: State setter function type format (replace boolean with state's type)
    setCreateItemVisible: React.Dispatch<SetStateAction<boolean>>;
};

//FormData is utilized since /items/create takes in multipart/form-data
const formData = new FormData();

export default function CreateItemModal({ visible, setCreateItemVisible }: CreateItemModalProps) {

    //BEGIN HOOK INSTANTIATIONS
    const navigation = useNavigation();

    //FIXME: TEMPORARY UNTIL AUTHCONTEXT AND EXPO-SECURE-STORE ARE USED
    const token = useContext(TemporaryTokenContext);

    //END HOOK INSTANTIATIONS

    //BEGIN FUNCTION DECLARATIONS (For functions that require component scope)

    //FIXME: TEMPORARY JWT BEARER; REQUEST NEW ONE / REPLACE UPON EXPIRATION UNTIL AUTHCONTEXT AND EXPO-SECURE-STORAGE IS IMPLEMENTED
    
    async function handleSubmit() {

        const options = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            }
        }

        const response = await fetch("http://165.227.213.87:8000/inventory/getinventories", options);
        const responseJSON = await response.json();
        console.log(responseJSON);
    }

    //END FUNCTION DECLARATIONS (For functions that require component scope)


    return (<>

        <Modal
            transparent={true}
            animationType={"slide"}
            visible={visible}
        >
            <View style={{ alignItems: "center" }}>
                <View style={styles.createItemContainer}>
                    {//Used to exit the modal. Place new fields after this component
                    }<TouchableOpacity
                        style={
                            {
                                position: "absolute",
                                top: 20,
                                right: 20,
                            }}
                        onPress={() => {
                            setCreateItemVisible(false);
                            navigation.setOptions({ headerTitle: "Home" })
                        }}>

                        {//X button icon
                        }<Image
                            style={
                                {
                                    height: 40,
                                    width: 40,
                                    transform: [{ rotate: "45deg" }]
                                }}

                            source={require("../../assets/images/plusIcon.png")}
                        />
                    </TouchableOpacity>

                    {//TODO: Create fields and possibly a reusable field component
                        //Not required, though consider using react-hook-form for handling input / submission since React Native has no browser <form> equivalent
                    }
                    <TextInput placeholder=""></TextInput>

                    {//Submit button FIXME: Handler function temporarily fetches with test data
                    }<TouchableOpacity style={{ height: "5%", width: "40%", backgroundColor: "purple", justifyContent: "center", borderRadius: 15 }} onPress={handleSubmit}>
                        <Text style={{ color: "white", textAlign: "center", fontSize: 22 }}>TEST SUBMIT</Text>
                    </TouchableOpacity>
                    <Text>Currently makes request to inventory/getinventories</Text>
                </View>

            </View>
        </Modal>

    </>);
}

const styles = StyleSheet.create(
    {

        //TODO: Consider creating a customizable / universal modal component
        createItemContainer: {
            alignItems: "center",
            justifyContent: "center",

            //Allows for empty space above modal
            top: "10%",

            height: "100%",
            width: "98%",

            backgroundColor: "white",

            borderWidth: 0.2,
            borderRadius: 20,
            borderColor: "black"
        },

    });