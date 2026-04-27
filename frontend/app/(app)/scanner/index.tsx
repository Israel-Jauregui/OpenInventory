import { Button, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';


import BarcodeScanInput from '@/components/BarcodeScanInput/BarcodeScanInput';
import { useSession } from '@/contexts/AuthContext/AuthContext';
import { useCurrentInventoryContext } from '@/contexts/CurrentInventoryContext/CurrentInventoryContext';

export default function ScannerView() {

    const router = useRouter();
    const { action } = useLocalSearchParams<{ action?: "view" | "edit" | "delete" }>();
    const { fetchWithAuth } = useSession();
    const { currentInventory } = useCurrentInventoryContext();
    const [isProcessing, setIsProcessing] = useState(false);

    async function handleScannedBarcode(barcode: string) {
        if (isProcessing || !currentInventory.invId) {
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetchWithAuth(`/inventory/${currentInventory.invId}/items/by-barcode/${barcode}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response?.status === 404) {
                if (action === "edit" || action === "delete") {
                    Alert.alert("Unknown barcode", "This barcode does not exist in the database.");
                } else {
                    router.replace({
                        pathname: "/inventory/item/create",
                        params: { mode: "create", barcode }
                    });
                }
                return;
            }

            if (!response?.ok) {
                Alert.alert("Scan failed", "Unable to process barcode right now.");
                return;
            }

            const responseJSON = await response.json();

            if ((action === "edit" || action === "delete") && !responseJSON.in_inventory) {
                Alert.alert("Not in inventory", "This barcode exists, but the item is not in the current inventory.");
                return;
            }

            if (action === "edit") {
                router.replace({
                    pathname: "/inventory/item/[itemId]/edit",
                    params: { itemId: String(responseJSON.item.item_id) },
                });
                return;
            }

            if (action === "delete") {
                router.replace({
                    pathname: "/inventory/item/[itemId]/delete",
                    params: { itemId: String(responseJSON.item.item_id) },
                });
                return;
            }

            router.replace({
                pathname: "/inventory/item/[itemId]",
                params: {
                    itemId: String(responseJSON.item.item_id),
                    barcode: responseJSON.item.upc,
                    inInventory: responseJSON.in_inventory ? "1" : "0",
                    quantity: responseJSON.quantity ? String(responseJSON.quantity) : "",
                    lowStockTrigger: responseJSON.low_stock_trigger ? String(responseJSON.low_stock_trigger) : "",
                }
            });
        } finally {
            setTimeout(() => {
                setIsProcessing(false);
            }, 900);
        }
    }

    return (
        <>

            <SafeAreaView>
                <Button title="Back" onPress={router.back} />
            </SafeAreaView>
            <BarcodeScanInput onScanned={handleScannedBarcode} />

        </>

    );
}
