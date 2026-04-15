import { StyleSheet, Modal, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SetStateAction } from 'react';

import { useNavigation } from 'expo-router';

type CreateItemModalProps = {
    visible: boolean,
    //MARK: State setter function type format (replace boolean with state's type)
    setCreateItemVisible: React.Dispatch<SetStateAction<boolean>>;
};

export default function CreateItemModal({ visible, setCreateItemVisible }: CreateItemModalProps) {

    const navigation = useNavigation();
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