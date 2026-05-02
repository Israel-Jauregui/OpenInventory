import CreateEditItemModal from "@/components/CreateItemModal/CreateEditItemModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { item as Item } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";


export default function EditView() {
  const router = useRouter();
  const params = useLocalSearchParams<{ item?: string}>();

  const itemParam = Array.isArray(params.item)
    ? params.item[0]
    : params.item;

  let parsedItem: Item | undefined;
  if (itemParam) {
    try {
      parsedItem = JSON.parse(itemParam) as Item;
    } catch {
      parsedItem = undefined;
    }
  }

  if (!parsedItem) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Unable to load item for editing. Please reopen from the item list.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => { router.replace("/items"); }}>
          <Text style={styles.backButtonText}>Back to Items</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <CreateEditItemModal mode="edit" item={parsedItem} />;
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f3f3f3",
  },
  fallbackText: {
    textAlign: "center",
    color: "#1d1b20",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#36a2fa",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
