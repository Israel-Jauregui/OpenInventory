import { Tabs, useRouter} from 'expo-router';
import { Button, Pressable, Text } from "react-native";

function TabLayout(){
    const router = useRouter();

    return(

        <Tabs>
            //name prop determines the route; remember to alter title property of options prop instead
            <Tabs.Screen
                name="inventory-select"
                options={{
                    headerTitle: '',
                    tabBarStyle: { display: 'none' },
                    tabBarItemStyle: { display: 'none' },
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#f5f5f5' },
                    headerRight: () => (
                        <Pressable onPress={() => router.replace('/login')} style={{marginRight: 15}}>
                            <Text style={{fontSize: 16, color: '#007AFF'}}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    headerTitle: '',
                    title: "Home",
                    headerLeft: () => (
                        <Pressable onPress={() => router.replace('/(tabs)/inventory-select')} style={{marginLeft: 10}}>
                            <Text style={{fontSize: 16, color: '#007AFF'}}>{"← Back"}</Text>
                        </Pressable>
                    ),
                    headerRight: () => (
                        <Pressable onPress={() => router.replace('/login')} style={{marginRight: 15}}>
                            <Text style={{fontSize: 16, color: '#007AFF'}}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />
            <Tabs.Screen
                name="items"
                options={{
                    headerTitle: '',
                    title: "Items",
                    headerRight: () => (
                        <Pressable onPress={() => router.replace('/login')} style={{marginRight: 15}}>
                            <Text style={{fontSize: 16, color: '#007AFF'}}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />

            <Tabs.Screen
                name="alerts"
                options={{
                    headerTitle: '',
                    title: "Alerts",
                    headerRight: () => (
                        <Pressable onPress={() => router.replace('/login')} style={{marginRight: 15}}>
                            <Text style={{fontSize: 16, color: '#007AFF'}}>Logout</Text>
                        </Pressable>
                    ),
                }}
            />
            

        </Tabs>
    );

}

export default TabLayout;