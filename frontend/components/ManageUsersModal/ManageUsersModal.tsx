import { StyleSheet, Modal, View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { SetStateAction, useState, useContext } from 'react';

import { useNavigation } from 'expo-router';

//FIXME: TEMPORARY UNTIL AUTHCONTEXT AND EXPO-SECURE-STORE ARE USED
import { TemporaryTokenContext } from '@/contexts/TemporaryTokenContext/TemporaryTokenContext';

type ManageUsersModalProps = {
    visible: boolean,
    //MARK: State setter function type format (replace boolean with state's type)
    setManageUsersVisible: React.Dispatch<SetStateAction<boolean>>;
    inventoryId?: string;
};

export default function ManageUsersModal({ visible, setManageUsersVisible, inventoryId }: ManageUsersModalProps) {

    //BEGIN HOOK INSTANTIATIONS
    const navigation = useNavigation();

    //FIXME: TEMPORARY UNTIL AUTHCONTEXT AND EXPO-SECURE-STORE ARE USED
    const token = useContext(TemporaryTokenContext);

    const [users, setUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    //END HOOK INSTANTIATIONS

    //BEGIN FUNCTION DECLARATIONS (For functions that require component scope)

    //FIXME: TEMPORARY JWT BEARER; REQUEST NEW ONE / REPLACE UPON EXPIRATION UNTIL AUTHCONTEXT AND EXPO-SECURE-STORAGE IS IMPLEMENTED

    async function fetchUsers() {
        setLoading(true);
        try {
            const options = {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                }
            }

            //FIXME: Update endpoint once backend exposes a proper get-users-by-inventory route
            const response = await fetch(`http://165.227.213.87:8000/inventory/getusers`, options);
            const responseJSON = await response.json();
            setUsers(responseJSON);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }

    //END FUNCTION DECLARATIONS (For functions that require component scope)


    return (
        <Modal
            transparent={true}
            animationType={"slide"}
            visible={visible}
            onShow={fetchUsers}
        >
            <View style={{ alignItems: "center" }}>
                <View style={styles.displayUsersContainer}>

                    {//Used to exit the modal
                    }<TouchableOpacity
                        style={{ position: "absolute", top: 20, right: 20 }}
                        onPress={() => {
                            setManageUsersVisible(false);
                            navigation.setOptions({ headerTitle: "Home" });
                        }}>
                        <Image
                            style={{ height: 40, width: 40, transform: [{ rotate: "45deg" }] }}
                            source={require("../../assets/images/plusIcon.png")}
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>Users with Access</Text>

                    {loading
                        ? <ActivityIndicator size="large" />
                        : <FlatList
                            data={users}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.userRow}>
                                    <Text style={styles.userText}>{item}</Text>
                                </View>
                            )}
                            ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
                            style={styles.list}
                        />
                    }

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create(
    {

        //TODO: Consider creating a customizable / universal modal component
        displayUsersContainer: {
            alignItems: "center",

            //Allows for empty space above modal
            top: "10%",

            height: "85%",
            width: "98%",

            backgroundColor: "white",

            borderWidth: 0.2,
            borderRadius: 20,
            borderColor: "black",

            paddingTop: 70,
        },

        title: {
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 16,
        },

        list: {
            width: "100%",
            paddingHorizontal: 20,
        },

        userRow: {
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
        },

        userText: {
            fontSize: 16,
        },

        emptyText: {
            textAlign: "center",
            color: "#888",
            marginTop: 20,
        },

    });