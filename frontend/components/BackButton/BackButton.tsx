import { useState } from 'react';
import { Pressable, Text } from "react-native";
import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";

export default function BackButton() {
    //Used for obtaining information about the previous page so that BackButton is conditionally rendered
    const navigation = useNavigation();
    const [canGoBack, setCanGoBack] = useState<boolean>(navigation.canGoBack);

    const router = useRouter();

    return (<>

        {canGoBack ?
            <Pressable
                onPress={() => {
                    router.back();
                    setCanGoBack(navigation.canGoBack);
                }}
                style={{ marginLeft: 10 }}>
                <Text
                    style={{
                        fontSize: 18, marginLeft: 10, color: '#007AFF'

                    }}>

                    {"Back"}
                </Text>
            </Pressable>
            : undefined
        }

    </>);
}