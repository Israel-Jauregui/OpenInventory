import { Stack } from 'expo-router';
import LogoutButton from '@/components/LogoutButton/LogoutButton';
import { CurrentInventoryProvider } from '@/contexts/CurrentInventoryContext/CurrentInventoryContext';
export default function AppRoutesLayout() {

    return (<>

        <CurrentInventoryProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="inventory/inventory-select"
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerRight: () => { return (<><LogoutButton style={{marginRight: 0, padding: 5}}/></>); },
                    }} />
                <Stack.Screen name="(tabs)" />
                {//Remove below Stacks if necessary aside from scanner
                }
                <Stack.Screen name="inventory/item/create" options={{presentation: "modal"}}/>
                <Stack.Screen name="inventory/item/[itemId]/edit" options={{presentation: "modal"}}/>
                <Stack.Screen name="scanner/index" />
            </Stack>
        </CurrentInventoryProvider>
    </>);
}