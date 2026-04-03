
import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

import BarcodeScanInput from '@/components/BarcodeScanInput/BarcodeScanInput';

export default function ScannerView() {

    const router = useRouter();

    return (
        <>
            <Button title="Back" onPress={router.back} />
            <BarcodeScanInput />
        </>

    );
}