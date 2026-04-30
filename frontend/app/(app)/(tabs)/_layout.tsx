import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from "react-native";
import InventoryIcon from '@/assets/images/viewInventoryIcon.svg';
//BEGIN icons
import LogoutButton from '@/components/LogoutButton/LogoutButton';
import HomeIcon from '@/assets/images/homeIcon.svg';
import AlertIcon from '@/assets/images/alertIcon.svg';
//END icons
//TODO: Create and pass context for relevant inventory data

import { CurrentInventoryProvider } from '@/contexts/CurrentInventoryContext/CurrentInventoryContext';
import { InventoryDataProvider } from '@/contexts/InventoryDataContext/InventoryDataContext';

function TabLayout() {
    const router = useRouter();


    return (
        <>
                <Tabs backBehavior="history">

                    <Tabs.Screen
                        name="home"
                        options={{
                            headerTitle: 'Home',
                            title: "Home",
                            tabBarIcon: ({ color, size }) => (
                                HomeIcon ? <HomeIcon width={size} height={size} fill={color} /> : null
                            ),
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
                            tabBarIcon: ({ color, size }) => (
                                InventoryIcon ? <InventoryIcon width={size} height={size} fill={color} /> : null
                            ),
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
                            tabBarIcon: ({ color, size }) => (
                                AlertIcon ? <AlertIcon width={size} height={size} fill={color} /> : null
                            ),
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
