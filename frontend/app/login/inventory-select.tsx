import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

//TODO: Replace with real inventory data from backend
const PLACEHOLDER_INVENTORIES = [
  { id: "1", name: "Warehouse A" },
  { id: "2", name: "Warehouse B" },
  { id: "3", name: "Office Supplies" },
];

export default function InventorySelect() {
  const router = useRouter();

  const handleSelect = (inventory: { id: string; name: string }) => {
    //TODO: Store selected inventory in global state / context
    router.replace({
      pathname: "/(tabs)/home",
      params: { inventoryId: inventory.id, inventoryName: inventory.name },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select an Inventory</Text>

      <FlatList
        data={PLACEHOLDER_INVENTORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 60,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#6fbeff",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: width * 0.85,
    alignItems: "center",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#39a2f8",
  },
});
