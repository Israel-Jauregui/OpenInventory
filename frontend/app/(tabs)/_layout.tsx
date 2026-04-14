import { Tabs, useRouter } from 'expo-router';
import { Button, Pressable, Text } from "react-native";

//TODO: Create and pass context for relevant inventory data

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
                        <Pressable onPress={() => router.replace('/login')} style={{ marginRight: 15 }}>
                            <Text style={{ fontSize: 20, color: '#007AFF' }}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    headerTitle: 'Home',
                    title: "Home",
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace('/(tabs)/inventory-select')} style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, marginLeft: 10, color: '#007AFF' }}>{"Back"}</Text>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable onPress={() => router.replace('/login')} style={{ marginRight: 15 }}>
                            <Text style={{ fontSize: 18, color: '#007AFF' }}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="items"
                options={{
                    headerTitle: 'Items',
                    title: "Items",
                    headerLeft: () => (
                        <Pressable onPress={() => router.push('/(tabs)/home')} style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, marginLeft: 10, color: '#007AFF' }}>{"Back"}</Text>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable onPress={() => router.replace('/login')} style={{ marginRight: 15 }}>
                            <Text style={{ fontSize: 18, color: '#007AFF' }}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />

            <Tabs.Screen
                name="alerts"
                options={{
                    headerTitle: 'Alerts',
                    title: "Alerts",
                    headerLeft: () => (
                        <Pressable onPress={() => router.push('/(tabs)/home')} style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, marginLeft: 10, color: '#007AFF' }}>{"Back"}</Text>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable onPress={() => router.replace('/login')} style={{ marginRight: 15 }}>
                            <Text style={{ fontSize: 18, color: '#007AFF' }}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />


        </Tabs>
    );

}

export default TabLayout;