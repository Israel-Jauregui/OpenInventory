import { FlatList, StyleSheet, Text, View } from "react-native";

import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";
import { useInventoryDataContext, item } from "@/contexts/InventoryDataContext/InventoryDataContext";
import InventoryHeader from "@/components/InventoryHeader/InventoryHeader";

export default function AlertsView() {
    const { currentInventory } = useCurrentInventoryContext();
    const { inventoryItems } = useInventoryDataContext();

    const lowStockItems = inventoryItems.filter((inventoryItem) => {
        return inventoryItem.quantity <= inventoryItem.low_stock_trigger;
    }).sort((a, b) => a.quantity - b.quantity);

    return (
        <View style={styles.container}>
            <InventoryHeader inventoryName={currentInventory.invName} />

            <Text style={styles.header}>Low Stock Alerts</Text>
            <FlatList
                data={lowStockItems}
                keyExtractor={(inventoryItem) => inventoryItem.item_id}
                renderItem={({ item: inventoryItem }: { item: item }) => {
                    return (
                        <View style={styles.alertRow}>
                            <Text style={styles.itemName}>{inventoryItem.item_name}</Text>
                            <Text style={styles.metaText}>Qty: {inventoryItem.quantity} | Trigger: {inventoryItem.low_stock_trigger}</Text>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Everythings stocked!{"\n"}No low-stock items right now.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        paddingHorizontal: 12,
        paddingTop: 4,
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1d1b20",
        marginBottom: 10,
        textAlign: "center",
    },
    alertRow: {
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#d8e4ef",
        padding: 12,
        marginBottom: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
        color: "#1d1b20",
    },
    metaText: {
        fontSize: 15,
        color: "#4a4a4a",
    },
    emptyText: {
        textAlign: "center",
        color: "#6f6f6f",
        marginTop: 20,
        fontSize: 16,
    },
});
