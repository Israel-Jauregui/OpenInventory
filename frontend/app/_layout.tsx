import { Stack } from "expo-router";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { SessionProvider, useSession } from "@/contexts/AuthContext/AuthContext";


//_layout.tsx:  Parent layout of the app. Used for wrapping the entire app with relevant context providers, themes, etc. (any components that must be applied globally)
export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </SafeAreaProvider>

  );
}


function RootNavigator() {

  const { token } = useSession();
  console.log(`Token in RootNavigator: ${token === undefined ? "undefined; may still be in process of retrieving from storage since it is undefined, most likely invalid if null" : token}`);

  return (<>
    <Stack>
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!token}>
        <Stack.Screen name="(login)" options={{ headerShown: false }} />
      </Stack.Protected >

    </ Stack>

  </>)
}