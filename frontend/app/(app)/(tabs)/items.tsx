import { FlatList, ListRenderItem, View, Text, Pressable, StyleSheet } from 'react-native';
import { useMemo, useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useCurrentInventoryContext } from '@/contexts/CurrentInventoryContext/CurrentInventoryContext';
import { useInventoryDataContext, item } from '@/contexts/InventoryDataContext/InventoryDataContext';

//BEGIN Custom component imports
import ItemEntry from '@/components/ItemEntry/ItemEntry';
import InventoryHeader from '@/components/InventoryHeader/InventoryHeader';
import ItemsSearchBar from '@/components/ItemsSearchBar/ItemsSearchBar';
//END Custom component imports



/*
    Managing state of each item could be done with Context API + useState() or useReducer(), though
    more research should be done towards the libraries Zustand and TanStack (also known as React Query) since context may cause
    unnecessary rerenders when such context is updated.
    This explains the general difference between Context and state management libraries
    https://blog.isquaredsoftware.com/2021/01/context-redux-differences/
*/
export default function ItemsView() {
    const router = useRouter();
    const params = useLocalSearchParams<{ q?: string }>();

    const { currentInventory } = useCurrentInventoryContext();
    const isInventoryAdmin = currentInventory.role === "admin";

    const { inventoryItems } = useInventoryDataContext();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortDescending, setSortDescending] = useState<boolean>(true);

    useEffect(() => {
        if (typeof params.q === "string") {
            setSearchQuery(params.q);
        }
    }, [params.q]);

    const filteredAndSortedItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = !query
            ? inventoryItems
            : inventoryItems.filter((inventoryItem) => {
                return (
                    inventoryItem.item_name.toLowerCase().includes(query) ||
                    inventoryItem.upc.toLowerCase().includes(query) ||
                    inventoryItem.brand.toLowerCase().includes(query) ||
                    inventoryItem.category.toLowerCase().includes(query)
                );
            });

        const sorted = [...filtered].sort((a, b) => {
            return sortDescending ? b.quantity - a.quantity : a.quantity - b.quantity;
        });

        return sorted;
    }, [inventoryItems, searchQuery, sortDescending]);

    const renderItem: ListRenderItem<item> = ({item}: {item: item}) => {
        return (<>
            <ItemEntry
                item={item}
                canManage={isInventoryAdmin}
                onPress={() => {
                    router.push({
                        pathname: "/inventory/item/[itemId]",
                        params: { itemId: item.item_id, inInventory: "1", barcode: item.upc, quantity: String(item.quantity), lowStockTrigger: String(item.low_stock_trigger) }
                    });
                }}
                onEditPress={() => {
                    router.push({
                        pathname: "/inventory/item/[itemId]/edit",
                        params: { itemId: item.item_id },
                    });
                }}
                onDeletePress={() => {
                    router.push({
                        pathname: "/inventory/item/[itemId]/delete",
                        params: { itemId: item.item_id },
                    });
                }}
            />
        </>)
    };

    return (<>
        <InventoryHeader inventoryName={currentInventory.invName} />
        <ItemsSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBarcodePress={() => { router.push("/scanner"); }}
        />
        <View style={styles.controlsRow}>
            <Pressable
                style={styles.sortButton}
                onPress={() => { setSortDescending(!sortDescending); }}
            >
                <Text style={styles.sortButtonText}>
                    Quantity {sortDescending ? "High -> Low" : "Low -> High"}
                </Text>
            </Pressable>
        </View>

        <FlatList
            data={filteredAndSortedItems}
            renderItem={renderItem}
            keyExtractor={(itemData: item) => itemData.item_id}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No items match this search.</Text>
            }
        />


    </>);
}

const styles = StyleSheet.create({
    controlsRow: {
        width: "100%",
        alignItems: "center",
        marginBottom: 8,
    },
    sortButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "#d9d9d9",
    },
    sortButtonText: {
        fontSize: 16,
        color: "#1d1b20",
        fontWeight: "600",
    },
    emptyText: {
        textAlign: "center",
        color: "#6b6b6b",
        marginTop: 24,
        fontSize: 16,
    },
});
