import { View, StyleSheet, Button} from 'react-native';
import { router, Stack } from 'expo-router';

import LogoutButton from '@/components/LogoutButton/LogoutButton';

export default function NotFound(){

    return(

        <>
            <Stack.Screen options={{title: "404 Not Found", headerRight: () => <LogoutButton/> }} />
        </>
    )
}