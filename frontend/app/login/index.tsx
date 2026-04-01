import { Button, Text, View } from "react-native";
import { useRouter } from 'expo-router';
//TODO: Import appropriate package(s) for handling login authorization
export default function Login() {
  const router = useRouter();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Login"
        onPress={() => router.replace('/(tabs)/home')}
      />
      <Text>login Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
