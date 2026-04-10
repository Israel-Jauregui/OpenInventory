import { Stack } from "expo-router";

import { useState } from 'react'
//_layout.tsx:  Parent layout of the app. Used for wrapping the entire app with relevant context providers, themes, etc. (any components that must be applied globally)
export default function RootLayout() {

  return (
    <Stack> 
      <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />
      <Stack.Screen name="login"    options={{ headerShown: false, animation: 'slide_from_left', animationDuration: 275 }} />
    </ Stack>

  );
}
