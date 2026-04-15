import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Modal, TextInput } from "react-native";
import { useState } from 'react';
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

//TODO: Replace with real inventory data from backend
const PLACEHOLDER_INVENTORIES = [
  { id: "1", name: "Warehouse A" },
  { id: "2", name: "Warehouse B" },
  { id: "3", name: "Office Supplies" },
];

export default function InventorySelect() {
  const [modalVisible, setModalVisible] = useState(false);
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
      {//Modal for creating a new inventory
      }<Modal
        transparent={true}
        animationType={"slide"}
        visible={modalVisible}>
        {//Centered container for the modal
        }<View style={{ alignItems: "center" }}>
          <View style={styles.createInventoryModal}>
            <TouchableOpacity
              style={
                {
                  position: "absolute",
                  top: 20,
                  right: 20,
                }}
              onPress={() => { setModalVisible(false) }}>
              <Image
                style={
                  {
                    height: 40,
                    width: 40,
                    transform: [{ rotate: "45deg" }]
                  }}

                source={require("../../assets/images/plusIcon.png")}
              />
            </TouchableOpacity>

            <Text style={styles.createInventoryHeader}>Create a new inventory</Text>
            <TextInput style={styles.createInventoryNameField} placeholder="Enter inventory name..." placeholderTextColor={"#bfbfbf"}></TextInput>
            <Text style={styles.createInventoryAltText}>All you need right now is the inventory's name; you may add items or configurations later at any time.</Text>
            <TouchableOpacity
              style={styles.createInventoryButton}>
              <Text style={styles.createInventoryButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal >

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
            <Image style={styles.cardIcon} source={require("../../assets/images/chevronRight.png")} />
          </TouchableOpacity>
        )}

        ListFooterComponent={
          <TouchableOpacity
            style={
              [styles.card,
              {
                backgroundColor: "#36a2fa",
                
              }]}
            onPress={() => { setModalVisible(true) }}
          >
            <Text style={[styles.cardText, { color: "white", fontWeight: "600" }]}>Create new inventory</Text>
            <Image style={styles.cardIcon} source={require("../../assets/images/plusIcon.png")} />
          </TouchableOpacity>}
      />




    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    backgroundColor: "#f5f5f5",

    paddingTop: 20,

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

    flexDirection: "row",

    backgroundColor: "#ffffff",

    borderColor: "#6fbeff",
    borderWidth: 1,
    borderRadius: 12,

    paddingVertical: 24,
    paddingHorizontal: 20,

    marginBottom: 16,

    width: width * 0.85,

    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#39a2f8",
  },

  cardIcon: {
    position: "absolute",
    right: 20,

    height: 35,
    width: 35
  },

  //MARK: Create inventory modal
  //BEGIN Create inventory modal
  createInventoryModal: {
    alignItems: "center",
    justifyContent: "center",

    //Allows for empty space above modal
    top: "7%",

    height: "95%",
    width: "98%",

    backgroundColor: "white",

    borderRadius: 20,
  },

  createInventoryHeader: {
    
    marginBottom: "20%",


    fontSize: 28,
    fontWeight: "600",

  },

  createInventoryNameField: {
    padding: 20,

    width: "80%",

    fontSize: 22,
    color: "#949494",
    borderColor: "#6fbeff",
    borderWidth: 1,
    borderRadius: 20,

    backgroundColor: "white",
  },

  createInventoryAltText: {
    padding: 10,

    width: "82%",

    color: "grey"


  },

  createInventoryButton: {
    marginTop: 20,
    
    padding: 20,
    
    alignItems: "center",

    width: "80%",

    backgroundColor: "#36a2fa",

    borderWidth: 4,
    borderRadius: 12,
    borderColor: "#36a2fa",

  },

  createInventoryButtonText: {

    color: "white",
    fontSize: 28,
    fontWeight: "600",
  },
  //END Create inventory modal
});
