import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";
import { useInventoryDataContext } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { useSession } from "@/contexts/AuthContext/AuthContext";

export default function DeleteItemScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const numericItemId = useMemo(() => Number(itemId), [itemId]);

  const { fetchWithAuth } = useSession();
  const { currentInventory } = useCurrentInventoryContext();
  const { inventoryItems, refreshInventoryItems } = useInventoryDataContext();

  const targetItem = inventoryItems.find((inventoryItem) => Number(inventoryItem.item_id) === numericItemId);
  const isInventoryAdmin = currentInventory.role === "admin";
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  async function handleDelete() {
    if (!currentInventory.invId || !numericItemId) {
      return;
    }

    if (!isInventoryAdmin) {
      Alert.alert("Permission denied", "Only admins can delete items.");
      return;
    }

    setIsDeleting(true);
    const response = await fetchWithAuth(`/inventory/${currentInventory.invId}/items/${numericItemId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    });
    setIsDeleting(false);

    if (response?.status === 403) {
      Alert.alert("Permission denied", "Only admins can delete items.");
      return;
    }

    if (!response?.ok) {
      const responseJSON = await response?.json().catch(() => null);
      Alert.alert("Unable to delete item", responseJSON?.detail ?? "Please try again.");
      return;
    }

    await refreshInventoryItems();
    router.replace("/items");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Remove Item From Inventory</Text>
        <Text style={styles.bodyText}>
          {targetItem
            ? `Are you sure you want to remove "${targetItem.item_name}" from this inventory?`
            : "Are you sure you want to remove this item from this inventory?"}
        </Text>
        <Text style={styles.warningText}>
          This only removes the item from the current inventory.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, (!isInventoryAdmin || isDeleting) && styles.deleteButtonDisabled]}
          disabled={!isInventoryAdmin || isDeleting}
          onPress={handleDelete}
        >
          <Text style={styles.deleteText}>{isDeleting ? "Deleting..." : "Delete"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    borderRadius: 14,
    borderColor: "#d8e4ef",
    borderWidth: 1,
    backgroundColor: "white",
    padding: 18,
  },
  header: {
    fontSize: 24,
    color: "#1d1b20",
    fontWeight: "700",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 17,
    color: "#333",
    lineHeight: 24,
  },
  warningText: {
    marginTop: 10,
    color: "#6b6b6b",
    fontSize: 14,
  },
  buttonRow: {
    marginTop: 18,
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#e24a4a",
    borderRadius: 12,
  },
  deleteButtonDisabled: {
    opacity: 0.55,
  },
  cancelText: {
    color: "#1d1b20",
    fontSize: 18,
    fontWeight: "600",
  },
  deleteText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
