import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";
import { item, useInventoryDataContext } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { useSession } from "@/contexts/AuthContext/AuthContext";

type CatalogItem = {
  item_id: number;
  item_name: string;
  desc: string;
  upc: string;
  photo_url: string;
  price: number;
  category: string;
  brand: string;
};

export default function ItemDetailsScreen() {
  const router = useRouter();
  const { currentInventory } = useCurrentInventoryContext();
  const { inventoryItems } = useInventoryDataContext();
  const { fetchWithAuth } = useSession();

  const params = useLocalSearchParams<{
    itemId: string;
    barcode?: string;
    inInventory?: string;
    quantity?: string;
    lowStockTrigger?: string;
  }>();

  const itemId = useMemo(() => Number(params.itemId), [params.itemId]);
  const scannedBarcode = params.barcode;
  const scannedInInventory = params.inInventory === "1";
  const scannedQuantity = params.quantity ? Number(params.quantity) : 0;
  const scannedLowStockTrigger = params.lowStockTrigger ? Number(params.lowStockTrigger) : 5;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inventoryItem, setInventoryItem] = useState<item | null>(null);
  const [catalogItem, setCatalogItem] = useState<CatalogItem | null>(null);
  const [addInProgress, setAddInProgress] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadItem() {
      if (!currentInventory.invId || !itemId) {
        return;
      }

      setIsLoading(true);

      const contextItem = inventoryItems.find((existingItem) => Number(existingItem.item_id) === itemId);
      if (contextItem) {
        if (isMounted) {
          setInventoryItem(contextItem);
          setCatalogItem(null);
          setIsLoading(false);
        }
        return;
      }

      if (scannedBarcode && !scannedInInventory) {
        const catalogResponse = await fetchWithAuth(`/items/${scannedBarcode}`, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        if (catalogResponse?.ok) {
          const responseJSON = await catalogResponse.json();
          if (isMounted) {
            setCatalogItem(responseJSON);
            setInventoryItem(null);
          }
        }
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      const listResponse = await fetchWithAuth(`/inventory/${currentInventory.invId}/items`, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      if (listResponse?.ok) {
        const responseJSON = await listResponse.json();
        const matched = responseJSON.find((existingItem: item) => Number(existingItem.item_id) === itemId);
        if (isMounted && matched) {
          setInventoryItem(matched);
          setCatalogItem(null);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    loadItem();
    return () => {
      isMounted = false;
    };
  }, [currentInventory.invId, fetchWithAuth, inventoryItems, itemId, scannedBarcode, scannedInInventory]);

  const displayName = inventoryItem?.item_name ?? catalogItem?.item_name ?? "Item";
  const displayImage = inventoryItem?.photo_url ?? catalogItem?.photo_url ?? "";
  const displayCategory = inventoryItem?.category ?? catalogItem?.category ?? "";
  const displayBrand = inventoryItem?.brand ?? catalogItem?.brand ?? "";
  const displayPrice = inventoryItem?.price ?? catalogItem?.price ?? 0;
  const displayBarcode = inventoryItem?.upc ?? catalogItem?.upc ?? scannedBarcode ?? "";
  const displayDesc = inventoryItem?.desc ?? catalogItem?.desc ?? "";
  const displayQuantity = inventoryItem?.quantity ?? (scannedInInventory ? scannedQuantity : null);
  const displayLowStockTrigger = inventoryItem?.low_stock_trigger ?? (scannedInInventory ? scannedLowStockTrigger : null);
  const canAddToInventory = !inventoryItem && !!catalogItem;

  async function handleAddToInventory() {
    if (!catalogItem || !currentInventory.invId) {
      return;
    }

    setAddInProgress(true);
    const response = await fetchWithAuth("/inventory/additem", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inventory_id: Number(currentInventory.invId),
        item_id: catalogItem.item_id,
        quantity: 1,
        low_stock_trigger: 1,
      }),
    });
    setAddInProgress(false);

    if (!response?.ok) {
      Alert.alert("Unable to add item", "Only admins can add items to inventory.");
      return;
    }

    Alert.alert("Item added", "The scanned item was added to this inventory.");
    router.replace({
      pathname: "/inventory/item/[itemId]",
      params: { itemId: String(catalogItem.item_id), inInventory: "1", barcode: catalogItem.upc, quantity: "1", lowStockTrigger: "1" },
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {isLoading ? <ActivityIndicator style={{ marginTop: 20 }} size="large" /> : null}

      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}><Text style={{ color: "#6b6b6b" }}>No image</Text></View>
          )}
        </View>

        <Text style={styles.title}>{displayName}</Text>
        <Text style={styles.meta}>UPC: {displayBarcode || "N/A"}</Text>
        <Text style={styles.meta}>Category: {displayCategory || "N/A"}</Text>
        <Text style={styles.meta}>Brand: {displayBrand || "N/A"}</Text>
        <Text style={styles.meta}>Price: ${Number(displayPrice).toFixed(2)}</Text>
        {displayQuantity !== null ? <Text style={styles.meta}>Quantity: {displayQuantity}</Text> : null}
        {displayLowStockTrigger !== null ? <Text style={styles.meta}>Low Stock Trigger: {displayLowStockTrigger}</Text> : null}

        <Text style={styles.description}>{displayDesc || "No description available."}</Text>
      </View>

      {canAddToInventory ? (
        <TouchableOpacity
          style={[styles.addButton, addInProgress && styles.addButtonDisabled]}
          disabled={addInProgress}
          onPress={handleAddToInventory}
        >
          <Text style={styles.addButtonText}>{addInProgress ? "Adding..." : "Add To Inventory"}</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  card: {
    margin: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d8e4ef",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 190,
    height: 190,
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
  },
  imagePlaceholder: {
    width: 190,
    height: 190,
    borderRadius: 12,
    backgroundColor: "#ececec",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1d1b20",
  },
  meta: {
    fontSize: 18,
    color: "#1d1b20",
    marginBottom: 4,
  },
  description: {
    marginTop: 10,
    color: "#383838",
    fontSize: 16,
    lineHeight: 22,
  },
  addButton: {
    marginHorizontal: 12,
    backgroundColor: "#36a2fa",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#9ad1ff",
  },
  addButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
