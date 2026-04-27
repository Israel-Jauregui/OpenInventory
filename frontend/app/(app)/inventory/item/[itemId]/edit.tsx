import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import DataField from "@/components/DataField/DataField";
import { useCurrentInventoryContext } from "@/contexts/CurrentInventoryContext/CurrentInventoryContext";
import { item, useInventoryDataContext } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { useSession } from "@/contexts/AuthContext/AuthContext";

type EditFormState = {
  item_name: string;
  desc: string;
  upc: string;
  photo_url: string;
  price: string;
  category: string;
  brand: string;
  quantity: string;
  low_stock_trigger: string;
};

export default function EditItemScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const numericItemId = useMemo(() => Number(itemId), [itemId]);

  const { fetchWithAuth } = useSession();
  const { currentInventory } = useCurrentInventoryContext();
  const { inventoryItems, refreshInventoryItems } = useInventoryDataContext();

  const isInventoryAdmin = currentInventory.role === "admin";
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formState, setFormState] = useState<EditFormState>({
    item_name: "",
    desc: "",
    upc: "",
    photo_url: "",
    price: "0",
    category: "",
    brand: "",
    quantity: "0",
    low_stock_trigger: "0",
  });

  useEffect(() => {
    const targetItem = inventoryItems.find((existingItem: item) => Number(existingItem.item_id) === numericItemId);
    if (!targetItem) {
      return;
    }

    setFormState({
      item_name: targetItem.item_name ?? "",
      desc: targetItem.desc ?? "",
      upc: targetItem.upc ?? "",
      photo_url: targetItem.photo_url ?? "",
      price: String(targetItem.price ?? 0),
      category: targetItem.category ?? "",
      brand: targetItem.brand ?? "",
      quantity: String(targetItem.quantity ?? 0),
      low_stock_trigger: String(targetItem.low_stock_trigger ?? 0),
    });
  }, [inventoryItems, numericItemId]);

  async function handleSave() {
    if (!currentInventory.invId || !numericItemId) {
      return;
    }

    if (!isInventoryAdmin) {
      Alert.alert("Permission denied", "Only admins can edit items.");
      return;
    }

    setIsSaving(true);
    const response = await fetchWithAuth(`/inventory/${currentInventory.invId}/items/${numericItemId}`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_name: formState.item_name.trim(),
        desc: formState.desc,
        upc: formState.upc.trim(),
        photo_url: formState.photo_url.trim(),
        price: Number(formState.price) || 0,
        category: formState.category,
        brand: formState.brand,
        quantity: Math.max(0, Number(formState.quantity) || 0),
        low_stock_trigger: Math.max(0, Number(formState.low_stock_trigger) || 0),
      }),
    });
    setIsSaving(false);

    if (response?.status === 403) {
      Alert.alert("Permission denied", "Only admins can edit items.");
      return;
    }

    if (!response?.ok) {
      const responseJSON = await response?.json().catch(() => null);
      Alert.alert("Unable to update item", responseJSON?.detail ?? "Please verify your data and try again.");
      return;
    }

    await refreshInventoryItems();
    router.replace({
      pathname: "/inventory/item/[itemId]",
      params: { itemId: String(numericItemId), inInventory: "1" },
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <DataField
          header="ITEM NAME"
          textInputStyle={styles.fullField}
          placeholder="Item name"
          placeholderTextColor="#979797"
          value={formState.item_name}
          onChangeText={(text) => setFormState({ ...formState, item_name: text })}
        />

        <View style={styles.row}>
          <DataField
            header="CATEGORY"
            placeholder="Category"
            placeholderTextColor="#979797"
            value={formState.category}
            onChangeText={(text) => setFormState({ ...formState, category: text })}
          />
          <DataField
            header="BRAND"
            placeholder="Brand"
            placeholderTextColor="#979797"
            value={formState.brand}
            onChangeText={(text) => setFormState({ ...formState, brand: text })}
          />
        </View>

        <DataField
          header="DESCRIPTION"
          textInputStyle={styles.fullField}
          placeholder="Description"
          placeholderTextColor="#979797"
          value={formState.desc}
          onChangeText={(text) => setFormState({ ...formState, desc: text })}
        />
        <DataField
          header="BARCODE"
          textInputStyle={styles.fullField}
          placeholder="Barcode"
          placeholderTextColor="#979797"
          value={formState.upc}
          onChangeText={(text) => setFormState({ ...formState, upc: text })}
        />
        <DataField
          header="PHOTO URL"
          textInputStyle={styles.fullField}
          placeholder="https://..."
          placeholderTextColor="#979797"
          value={formState.photo_url}
          onChangeText={(text) => setFormState({ ...formState, photo_url: text })}
        />
        <DataField
          header="PRICE"
          textInputStyle={styles.fullField}
          placeholder="0.00"
          placeholderTextColor="#979797"
          value={formState.price}
          onChangeText={(text) => setFormState({ ...formState, price: text })}
        />

        <View style={styles.stockSettings}>
          <Text style={styles.stockHeader}>STOCK SETTINGS</Text>
          <View style={styles.row}>
            <DataField
              header="Quantity"
              headerStyle={styles.stockFieldHeader}
              placeholder="0"
              placeholderTextColor="#979797"
              value={formState.quantity}
              onChangeText={(text) => setFormState({ ...formState, quantity: text })}
            />
            <DataField
              header="Low stock alert"
              headerStyle={styles.stockFieldHeader}
              placeholder="0"
              placeholderTextColor="#979797"
              value={formState.low_stock_trigger}
              onChangeText={(text) => setFormState({ ...formState, low_stock_trigger: text })}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, (!isInventoryAdmin || isSaving) && styles.saveButtonDisabled]}
          disabled={!isInventoryAdmin || isSaving}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
  },
  contentContainer: {
    paddingBottom: 20,
    alignItems: "center",
  },
  fullField: {
    width: 300,
  },
  row: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 350,
  },
  stockSettings: {
    backgroundColor: "#c6d7e7",
    marginTop: 12,
    borderColor: "#36a2fa",
    borderWidth: 1,
    borderRadius: 20,
    width: 300,
    paddingVertical: 8,
  },
  stockHeader: {
    marginLeft: 12,
    marginBottom: 4,
    fontSize: 16,
    color: "#437a9e",
    fontWeight: "600",
  },
  stockFieldHeader: {
    color: "#246fa1",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 90,
    backgroundColor: "white",
  },
  saveButton: {
    width: 220,
    paddingVertical: 14,
    backgroundColor: "#36a2fa",
    borderRadius: 12,
  },
  saveButtonDisabled: {
    opacity: 0.55,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
  },
});
