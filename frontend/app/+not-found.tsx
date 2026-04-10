import { View, StyleSheet, Button} from 'react-native';
import { router, Stack } from 'expo-router';

export default function NotFound(){

    return(

        <>
            <Stack.Screen options={{title: "404 Not Found", headerRight: () => <Button title='Logout' onPress={() => router.replace('/login')} />}} />
        </>
    )
}