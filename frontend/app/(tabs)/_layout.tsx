import { Tabs, useRouter} from 'expo-router';
import { Button } from "react-native";

function TabLayout(){
    const router = useRouter();

    return(

        <Tabs>
            
            <Tabs.Screen name="home" options={{headerRight: () => <Button title='Logout' onPress={() => router.replace('/login')} />}} />

        </Tabs>
    );

}

export default TabLayout;