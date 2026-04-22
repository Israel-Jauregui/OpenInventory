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
                    headerBackButtonDisplayMode: "minimal",

                    headerLeft: () => {
                        //FIXME: Not rendering even with normal text (remove text once done, then change headerBackVisible to false)
                        <>
                            <Text>back</Text>

                            <BackButton />
                        </>
                    },
                    animation: 'slide_from_right',
                    animationDuration: 275,
                }} />
        </Stack >
    </>)
}