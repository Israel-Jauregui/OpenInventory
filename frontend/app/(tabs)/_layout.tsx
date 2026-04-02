import { Tabs, useRouter} from 'expo-router';
import { Button } from "react-native";

function TabLayout(){
    const router = useRouter();

    return(

        <Tabs>
            //name prop determines the route; remember to alter title property of options prop instead
            <Tabs.Screen
                name="home"
                options={{
                    headerTitle: '',
                    title: "Home",
                    tabBarLabelStyle: {fontSize: 20},
                    headerRight: () => <Button title='Logout' onPress={() => router.replace('/login')} />
                }}
            />
            <Tabs.Screen
                name="items"
                options={{
                    headerTitle: '',
                    title: "Items",
                    tabBarLabelStyle: {fontSize: 20},
                    headerRight: () => <Button title='Logout' onPress={() => router.replace('/login')} />
                }}
            />
            

        </Tabs>
    );

}

export default TabLayout;