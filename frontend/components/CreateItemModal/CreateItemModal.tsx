import { StyleSheet, Modal, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SetStateAction } from 'react';

type CreateItemModalProps = {
    visible: boolean,
    //MARK: State setter function type format (replace boolean with state's type)
    setCreateItemVisible: React.Dispatch<SetStateAction<boolean>>;
};

export default function CreateItemModal({ visible, setCreateItemVisible }: CreateItemModalProps) {

    return (<>

        <Modal
            transparent={true}
            animationType={"slide"}
            visible={visible}
        >
            <View style={{ alignItems: "center" }}>
                <View style={styles.createItemContainer}>


                <TouchableOpacity
                    style={
                        {
                            position: "absolute",
                            top: 20,
                            right: 20,
                        }}
                    onPress={() => { setCreateItemVisible(false) }}>
                    <Image
                        style={
                            {
                                height: 40,
                                width: 40,
                                transform: [{ rotate: "45deg" }]
                            }}

                        source={require("../../assets/images/plusIcon.png")}
                    />
                </TouchableOpacity>
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