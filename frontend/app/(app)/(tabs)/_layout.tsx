import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from "react-native";

import LogoutButton from '@/components/LogoutButton/LogoutButton';

//TODO: Create and pass context for relevant inventory data

import { CurrentInventoryProvider } from '@/contexts/CurrentInventoryContext/CurrentInventoryContext';
import { InventoryDataProvider } from '@/contexts/InventoryDataContext/InventoryDataContext';

function TabLayout() {
    const router = useRouter();


    return (
        <>
           

                
                <Tabs backBehavior="history">
                    {/*
                        <Tabs.Screen
                            name="inventory-select"
                            options={{
                                headerTitle: '',
                                tabBarStyle: { display: 'none' },
                                tabBarItemStyle: { display: 'none' },
                                headerShadowVisible: false,
                                headerStyle: { backgroundColor: '#f5f5f5' },
                                animation: 'shift',
                                headerRight: () => (
                                    <LogoutButton />
                                ),
                            }}
                        />
                    */}



                    <Tabs.Screen
                        name="home"
                        options={{
                            headerTitle: 'Home',
                            title: "Home",
                            headerLeft: () => (
                                <Pressable
                                    onPress={() => { router.push("/inventory/inventory-select"); }}
                                    style={{ marginLeft: 12 }}
                                >
                                    <Text style={{ fontSize: 16, color: "#007AFF", fontWeight: "500" }}>Inventories</Text>
                                </Pressable>
                            ),
                            headerRight: () => (
                                <LogoutButton />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="items"
                        options={{
                            headerTitle: 'Items',
                            title: "Items",
                            headerLeft: () => (
                                <Pressable
                                    onPress={() => { router.push("/inventory/inventory-select"); }}
                                    style={{ marginLeft: 12 }}
                                >
                                    <Text style={{ fontSize: 16, color: "#007AFF", fontWeight: "500" }}>Inventories</Text>
                                </Pressable>
                            ),
                            headerRight: () => (
                                <LogoutButton />
                            ),
                        }}
                    />

                    <Tabs.Screen
                        name="alerts"
                        options={{
                            headerTitle: 'Alerts',
                            title: "Alerts",
                            headerLeft: () => (
                                <Pressable
                                    onPress={() => { router.push("/inventory/inventory-select"); }}
                                    style={{ marginLeft: 12 }}
                                >
                                    <Text style={{ fontSize: 16, color: "#007AFF", fontWeight: "500" }}>Inventories</Text>
                                </Pressable>
                            ),
                            headerRight: () => (
                                <LogoutButton />
                            ),
                        }}
                    />




                </Tabs>
     

        </>
    );

}

export default TabLayout;
