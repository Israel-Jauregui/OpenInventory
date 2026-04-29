import { Stack } from 'expo-router';
import LogoutButton from '@/components/LogoutButton/LogoutButton';
import { CurrentInventoryProvider } from '@/contexts/CurrentInventoryContext/CurrentInventoryContext';
import { InventoryDataProvider } from '@/contexts/InventoryDataContext/InventoryDataContext';
import BackButton from '@/components/BackButton/BackButton';
export default function AppRoutesLayout() {

    return (<>

        <CurrentInventoryProvider>
            <InventoryDataProvider>
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
                <Stack.Screen name="inventory/manage-users" options={{headerShown: true, headerTitle: "Manage Users"}} />
                <Stack.Screen name="inventory/invite-users" options={{headerShown: true, headerTitle: "Invite Users"}} />
                <Stack.Screen name="inventory/item/create" options={{presentation: "modal", headerShown: true, headerTitle: "Create Item"}}/>
                <Stack.Screen name="inventory/item/[itemId]/index" options={{ headerShown: true, headerTitle: "Item Details" }} />
                <Stack.Screen name="inventory/item/[itemId]/edit" options={{presentation: "modal", headerShown: true, headerTitle: "Edit Item"}}/>
                <Stack.Screen name="inventory/item/[itemId]/delete" options={{presentation: "modal", headerShown: true, headerTitle: "Delete Item"}}/>
                <Stack.Screen name="scanner/index" />
                <Stack.Screen  name="camera/index" options={{ headerLeft: ()=>{return (<><BackButton /></>)}, headerShown: true, headerTitle: "Take Picture", presentation:"fullScreenModal"}}/>
            </Stack>
            </InventoryDataProvider>
        </CurrentInventoryProvider>
    </>);
}
