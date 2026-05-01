import { cloneElement, useState } from 'react';
import { Pressable, Text, StyleProp, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";

type Props = {
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
};
export default function BackButton({ style, textStyle }: Props) {
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
                style={[styles.container, style]}>
                <Text
                    style={[styles.text, textStyle]}>
                    {"Back"}
                </Text>
            </Pressable>
            : undefined
        }

    </>);
}

const styles = StyleSheet.create(
    {
        container: {
            alignItems: "center",
            justifyContent: "center",
            height: 40
        },
        text: {
            fontSize: 18,
            color: '#007AFF',
            padding: 8,
        },
    });