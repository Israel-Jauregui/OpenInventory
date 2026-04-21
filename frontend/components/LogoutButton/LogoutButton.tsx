//LogoutButton.tsx: Self-explanatory. Calls handleLogout from AuthContext.tsx upon press.

import { Pressable, Text } from "react-native";
import { useSession } from "@/contexts/AuthContext/AuthContext";

export default function functionName() {

    const { handleLogout } = useSession();
    return (<>

        <Pressable onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ fontSize: 20, color: '#007AFF' }}>Logout</Text>
        </Pressable>
    </>);
}