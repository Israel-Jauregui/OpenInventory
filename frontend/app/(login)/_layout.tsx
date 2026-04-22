import BackButton from '@/components/BackButton/BackButton';
import { HeaderTitle } from '@react-navigation/elements';
import { Stack } from 'expo-router';

import { Text } from '@react-navigation/elements';



export default function LoginLayout() {

    return (<>
        <Stack >
            <Stack.Screen name="index" options={{ headerShown: false, animation: 'slide_from_left', animationDuration: 275 }} />
            <Stack.Screen
                name="create-account"

                //TODO: Figure out how to get custom BackButton to render over the default headerBack component
                options={{
                    headerTitle: '',
                    headerBackVisible: false,
                    headerLeft: () => {
                        return(
                        <>
                            <BackButton style={{marginLeft: 0, padding: 5}} textStyle={{marginLeft: 0}} />
                        </>);
                    },
                    animation: 'slide_from_right',
                    animationDuration: 275,
                }} />
        </Stack >
    </>)
}