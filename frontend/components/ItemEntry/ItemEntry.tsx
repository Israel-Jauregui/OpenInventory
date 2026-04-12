
//ItemEntry.tsx: Component that represents a row for an individual item. Contains all relevant details / buttons for interacting with a given item.

//MARK: Imports
import { View, Text, StyleSheet, Image } from 'react-native';

//TODO: Add props that correspond to displayed data
export default function ItemEntry() {

//MARK: Returned component
    return (<>

        {//Main row container
        }<View style={styles.rowContainer}>

            {//Image container
            }<View style={styles.imageContainer}>
                <Image style={styles.rowImage} />
            </View>

            {//Container for item data labels such as name, UPC, etc.
            }<View style={styles.labelsContainer}>
                <Text style={{fontSize: 26}}>Item_Name</Text>
                <Text>Quantity: {}</Text>
                <Text>Category: {}</Text>
                <Text>Brand: {}</Text>
                <Text>Price: {}</Text>
                <Text>UPC: {}</Text>
            </View>
        </View>

    </>);
}

//MARK: Stylesheet
const styles = StyleSheet.create(
    {
        rowContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",

            height: 150,

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
            backgroundColor: "blue"
        },

        labelsContainer: {
            //Adjust gap for spacing between data labels
            gap: 2,

            margin: 10,

            //10 pixels lower than rowContainer's fixed height
            height: 140,

            //FIXME: TEMPORARY COLORING FOR JUDGING DIMENSIONS
            backgroundColor: "grey"
        },
    });