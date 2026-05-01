import CreateEditItemModal from "@/components/CreateItemModal/CreateEditItemModal";
import { useLocalSearchParams } from "expo-router";
import type { item as Item } from "@/contexts/InventoryDataContext/InventoryDataContext";
import { View, Text, StyleSheet } from "react-native";


export default function EditView() {
  const params = useLocalSearchParams<{ item?: string}>();

  console.log("PARAMS:", params);

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
});
