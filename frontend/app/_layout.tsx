import { Slot } from "expo-router";
import { TemporaryTokenProvider } from '@/contexts/InventoryNamesContext/TemporaryTokenContext';

//_layout.tsx:  Parent layout of the app. Used for wrapping the entire app with relevant context providers, themes, etc. (any components that must be applied globally)
export default function RootLayout() {
  return (
    <TemporaryTokenProvider>
      <Slot />
    </TemporaryTokenProvider>
  );
}
