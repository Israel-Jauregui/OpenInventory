import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from "react-native";

import BackButton from '@/components/BackButton/BackButton';
import LogoutButton from '@/components/LogoutButton/LogoutButton';

//TODO: Create and pass context for relevant inventory data

import { CurrentInventoryContext } from '@/contexts/InventoryNamesContext/CurrentInventoryContext';

import { useContext } from 'react'; 

function TabLayout() {
    const router = useRouter();


    return (

        <Tabs backBehavior="history">
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

            
            
            <Tabs.Screen
                name="home"
                options={{
                    headerTitle: 'Home',
                    title: "Home",
                    headerLeft: () => (
                        <BackButton />
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
                        <BackButton />
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
                        <BackButton />
                    ),
                    headerRight: () => (
                        <LogoutButton />
                    ),
                }}
            />
          



        </Tabs>
    );

}

export default TabLayout;