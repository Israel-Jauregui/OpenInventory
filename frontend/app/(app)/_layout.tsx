import { Stack } from 'expo-router';

export default function AppRoutesLayout() {

    return (<>

        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="scanner" />
        </Stack>
    </>);
}