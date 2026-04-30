
//ItemEntry.tsx: Component that represents a row for an individual item. Contains all relevant details / buttons for interacting with a given item.

//MARK: Imports
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { item } from '@/contexts/InventoryDataContext/InventoryDataContext';



type Props = {
    item: item;
    onPress?: () => void;
    onEditPress?: () => void;
    onDeletePress?: () => void;
    canManage?: boolean;
};

//TODO: Add props that correspond to displayed data. Background color could also be passed so that it alters between each subsequent row.
export default function ItemEntry({ item, onPress, onEditPress, onDeletePress, canManage = true }: Props) {

    //MARK: Returned component
    return (<>

        {/*BEGIN rowContainer*/}
        {//Main row container
        }<TouchableOpacity style={styles.rowContainer} onPress={onPress} activeOpacity={0.85}>

            {//Image container
            }<View style={styles.imageContainer}>
                <Image
                    style={styles.rowImage}
                    source={{ uri: item.photo_url !== "" ? item.photo_url : undefined }}
                />
            </View>

            {/*Container for item data labels such as name, UPC, etc.
            TODO:  Add appropriate props to each Text component. 
            Add quantity adjuster to Quantity label. Will consist of a View with two TouchableOpacitys and one TextInput.
            Also consider conditionally rendering each label depending on whether they have an actual value.
                
            */
            }<View style={styles.labelsContainer}>
                <Text style={styles.itemName}>{item.item_name}</Text>
                <Text style={styles.labelText}>Quantity: <Text style={{ fontWeight: "normal" }}>{item.quantity}</Text></Text>
                <Text style={styles.labelText}>Category: <Text style={{ fontWeight: "normal" }}>{item.category}</Text></Text>
                <Text style={styles.labelText}>Brand: <Text style={{ fontWeight: "normal" }}>{item.brand}</Text></Text>
                <Text style={styles.labelText}>Price: <Text style={{ fontWeight: "normal" }}>{item.price}</Text></Text>
                <Text style={styles.labelText}>UPC: <Text style={{ fontWeight: "normal" }}>{item.upc}</Text></Text>
            </View>

            {/*Container for buttons that modify or display item data TODO: Consider moving to component*/
            }<View style={styles.buttonsContainer}>
                {//Item description / view button
                }<TouchableOpacity style={styles.button}>
                    <Image style={{ height: 25, width: 25 }} source={require("../../assets/images/itemDescIcon.png")} />
                </TouchableOpacity>

                {//Edit item data button
                }<TouchableOpacity
                    style={[styles.button, !canManage && styles.buttonDisabled]}
                    disabled={!canManage}
                    onPress={(event) => {
                        event.stopPropagation();
                        onEditPress?.();
                    }}
                >
                    <Image style={{ height: 40, width: 40 }} source={require("../../assets/images/editIcon.png")} />
                </TouchableOpacity>

                {//Delete item master data
                }<TouchableOpacity
                    style={[styles.button, !canManage && styles.buttonDisabled]}
                    disabled={!canManage}
                    onPress={(event) => {
                        event.stopPropagation();
                        onDeletePress?.();
                    }}
                >
                    <Image style={{ height: 25, width: 25, borderColor: "red " }} source={require("../../assets/images/deleteIcon.png")} />
                </TouchableOpacity>
            </View>

            {/*END rowContainer*/}
        </TouchableOpacity>

    </>);
}

//MARK: Stylesheet
const styles = StyleSheet.create(
    {
        rowContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingRight: 20,
            height: 150,

            borderRadius: 10,
            backgroundColor: "#d9d9d9",


        },

        imageContainer: {
            justifyContent: "center",
            alignItems: "center",

            marginLeft: 20,

            height: 120,
            width: 120,

            backgroundColor: "#3f6b8e",

            borderRadius: 10,
        },

        rowImage: {
            height: 100,
            width: 100,
            //FIXME: TEMPORARY COLORING FOR JUDGING DIMENSIONS
            //backgroundColor: "blue"
        },
        
        itemName: {
            
            right: 1.5,

            fontSize: 20, 
            fontWeight: "bold", 

            /* FIXME: Add back if needed
            padding: 5,
            width: "100%",
            backgroundColor: "white",
            borderWidth: 1,
            */
          

            
        
        },
        

        labelsContainer: {
            //Adjust gap for spacing between data labels
            gap: 2,

            margin: 10,
            padding: 5,

            //10 pixels lower than rowContainer's fixed height
            height: 140,
            width: 180,

            //FIXME: Add back if needed
            //backgroundColor: "white"


        },

        labelText: {
            fontWeight: "700",
        },

        quantityAdjuster: {

        },
        buttonsContainer: {
            //FIXME: Change back to row if needed
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,

            marginLeft: 0,
        },

        button: {
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            width: 40,
            height: 40,

            backgroundColor: "#b9b9b9"
        },
        buttonDisabled: {
            opacity: 0.45,
        },
    });
