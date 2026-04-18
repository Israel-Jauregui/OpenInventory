import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Modal, TextInput } from "react-native";
import { useState, useEffect } from 'react';
import { useRouter } from "expo-router";




//FIXME: TEMPORARY UNTIL AUTHCONTEXT AND EXPO-SECURE-STORE ARE USED
import { useContext } from 'react';
import { TemporaryTokenContext } from '@/contexts/InventoryNamesContext/TemporaryTokenContext';

const { width } = Dimensions.get("window");

//TODO: Replace with real inventory data from backend

//Type definition for a given inventory
type inventory = { invId: string, invName: string };


export default function InventorySelect() {
  //BEGIN HOOK INSTANTIATIONS

  console.log(process.env.EXPO_PUBLIC_API_BASE_URL)
  const [modalVisible, setModalVisible] = useState(false);

  //Used in modal for creating a new inventory
  const [newInventoryName, setNewInventoryName] = useState("");
  
  //uses a state to keep it loaded and updated
  const [inventories, setInventories] = useState<inventory[]>([]);
  const router = useRouter();

  //FIXME: TEMPORARY UNTIL AUTHCONTEXT AND EXPO-SECURE-STORE ARE USED
  const token = useContext(TemporaryTokenContext);

  //MARK: Initial fetch of inventories
  useEffect(() => {

    //Retrieves inventories for selection
    async function initialGetInventories() {
      //FIXME: TEMPORARY JWT BEARER; REQUEST NEW ONE / REPLACE UPON EXPIRATION UNTIL AUTHCONTEXT AND EXPO-SECURE-STORAGE IS IMPLEMENTED

      const options = {

        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }

      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/inventory/getinventories`, options);

        if (response.status === 200) {
          const responseJSON = await response.json();
          setInventories(responseJSON);
        }
        else {
          throw new Error(`Failed to retrieve inventories. Server response code: ${response.status}`);
        }
      } catch (error) {
        //TODO: Use for displaying error states
        alert(`TEMPORARY ALERT (add more polished / robust handling): ${error}`);
      }

    }

    initialGetInventories();


  }, []);

  //END HOOK INSTANTIATIONS

  //BEGIN FUNCTION DECLARATIONS (For functions that require component scope)


 const handleSelect = (inventory: { invId: string; invName: string }) => {
    //TODO: Store selected inventory in global state / context
    router.replace({
      pathname: "/(tabs)/home",
      params: { inventoryId: inventory.invId, inventoryName: inventory.invName },
    });
  };

  //END FUNCTION DECLARATIONS (For functions that require component scope)

  //Creates a new inventory. If creation is successful, automatically routes user into that new inventory.
  async function createInventory(newInventoryName: string) {

    if(newInventoryName){

      const options = {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
      }

      try {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/inventory/create?invName=${newInventoryName}`, options);


          console.log(response.status);
          if(response.status === 200){
            const responseJSON = await response.json();

            //FIXME: TEMPORARY LOG
            console.log(responseJSON);

            
            //Add the new inventory to state
            setInventories(prev => [...prev, { invId: responseJSON.invId, invName: newInventoryName }]);

            //Needed so that modal is removed before routing to new inventory
            setModalVisible(false);

            //Automatically routes the user to the new inventory upon successful creation
            handleSelect({invId: responseJSON.invId, invName: newInventoryName});
          }
          else{
            
            throw new Error(`Failed to create inventory. Status code: ${response.status}`)
          }
      } catch (error) {
          alert(`TEMPORARY ALERT(add more polished handling): ${error}`);
      }
    }

  }




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
            <TextInput
              style={styles.createInventoryNameField}
              placeholder="Enter inventory name..."
              placeholderTextColor={"#bfbfbf"}

              onChangeText={(text) => { setNewInventoryName(text)
               }}
            ></TextInput>
            <Text style={styles.createInventoryAltText}>All you need right now is the inventory's name; you may add items or configurations later at any time.</Text>

            <TouchableOpacity
              style={styles.createInventoryButton}
              onPress={()=>{newInventoryName !== "" ? createInventory(newInventoryName) : alert("TEMPORARY ALERT (incorporate more polished handling): Please enter an inventory name.")}}
            >
              <Text style={styles.createInventoryButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal >

      <Text style={styles.heading}>Select an Inventory</Text>


      <FlatList
        data={inventories}
        keyExtractor={(item) => item.invId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.cardText}>{item.invName}</Text>
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

    height: "100%",
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
    marginBottom: 150,
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
