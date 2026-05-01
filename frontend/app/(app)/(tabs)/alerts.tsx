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

    function getSeverity(quantity: number) {
        if (quantity === 0) {
            return {
                label: "Out of stock",
                border: "#d13a3a",
                badgeBg: "#fde8e8",
                badgeText: "#9f1f1f",
                stripe: "#d13a3a",
            };
        }

        return {
            label: "Low stock",
            border: "#d9a429",
            badgeBg: "#fff4d6",
            badgeText: "#8a5e00",
            stripe: "#e2b242",
        };
    }

    return (
        <View style={styles.container}>
            <InventoryHeader inventoryName={currentInventory.invName} />

            <Text style={styles.header}>Low Stock Alerts</Text>
            <FlatList
                data={lowStockItems}
                keyExtractor={(inventoryItem) => inventoryItem.item_id}
                renderItem={({ item: inventoryItem }: { item: item }) => {
                    const severity = getSeverity(inventoryItem.quantity);
                    return (
                        <View style={[styles.alertRow, { borderColor: severity.border }]}>
                            <View style={[styles.alertStripe, { backgroundColor: severity.stripe }]} />
                            <View style={styles.alertContent}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.itemName}>{inventoryItem.item_name}</Text>
                                    <View style={[styles.badge, { backgroundColor: severity.badgeBg }]}>
                                        <Text style={[styles.badgeText, { color: severity.badgeText }]}>{severity.label}</Text>
                                    </View>
                                </View>
                                <Text style={styles.metaText}>Qty: {inventoryItem.quantity} | Trigger: {inventoryItem.low_stock_trigger}</Text>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>Everything is stocked</Text>
                        <Text style={styles.emptyText}>No low-stock items right now.</Text>
                    </View>
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
        backgroundColor: "#ffffff",
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: "row",
        marginBottom: 8,
        overflow: "hidden",
    },
    alertStripe: {
        width: 6,
    },
    alertContent: {
        flex: 1,
        padding: 12,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    itemName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1d1b20",
        flex: 1,
        marginRight: 8,
    },
    metaText: {
        fontSize: 15,
        color: "#4a4a4a",
    },
    badge: {
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "700",
    },
    emptyCard: {
        marginTop: 20,
        paddingVertical: 20,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#d8e4ef",
        borderRadius: 10,
        backgroundColor: "#ffffff",
    },
    emptyTitle: {
        textAlign: "center",
        color: "#1d1b20",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },
    emptyText: {
        textAlign: "center",
        color: "#6f6f6f",
        fontSize: 16,
    },
});
