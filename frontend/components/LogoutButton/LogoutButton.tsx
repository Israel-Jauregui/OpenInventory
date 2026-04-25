//LogoutButton.tsx: Self-explanatory. Calls handleLogout from AuthContext.tsx upon press.

import { Pressable, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useSession } from "@/contexts/AuthContext/AuthContext";

type Props = {
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
};

export default function LogoutButton({ style, textStyle }: Props) {

    const { handleLogout } = useSession();
    return (<>

        <Pressable onPress={handleLogout} style={[{ marginRight: 15 }, style]}>
            <Text style={[{ fontSize: 18, color: '#007AFF' }, textStyle]}>Logout</Text>
        </Pressable>
    </>);
}