
import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


import BarcodeScanInput from '@/components/BarcodeScanInput/BarcodeScanInput';

export default function ScannerView() {

    const router = useRouter();

    return (
        <>

            <SafeAreaView>
                <Button title="Back" onPress={router.back} />
            </SafeAreaView>
            <BarcodeScanInput />

        </>

    );
}