
//ItemEntry.tsx: Component that represents a row for an individual item. Contains all relevant details / buttons for interacting with a given item.

//MARK: Imports
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

//TODO: Add props that correspond to displayed data. Background color could also be passed so that it alters between each subsequent row.
export default function ItemEntry() {

    //MARK: Returned component
    return (<>

        {/*BEGIN rowContainer*/}
        {//Main row container
        }<View style={styles.rowContainer}>

            {//Image container
            }<View style={styles.imageContainer}>
                <Image style={styles.rowImage} />
            </View>

            {/*Container for item data labels such as name, UPC, etc.
            TODO:  Add appropriate props to each Text component. 
            Add quantity adjuster to Quantity label. Will consist of a View with two TouchableOpacitys and one TextInput.
            Also consider conditionally rendering each label depending on whether they have an actual value.
                
            */
            }<View style={styles.labelsContainer}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Item_Name</Text>
                <Text>Quantity: { }</Text>
                <Text>Category: { }</Text>
                <Text>Brand: { }</Text>
                <Text>Price: { }</Text>
                <Text>UPC: { }</Text>
            </View>

            {/*Container for buttons that modify or display item data TODO: Consider moving to component*/
            }<View style={styles.buttonsContainer}>
                {//Item description / view button
                }<TouchableOpacity style={styles.button}>
                    <Image style={{height: 25, width: 25}}source={require("../../assets/images/itemDescIcon.png")}/>
                </TouchableOpacity>

                {//Edit item data button
                }<TouchableOpacity style={styles.button}>
                    <Image style={{height: 40, width: 40}}source={require("../../assets/images/editIcon.png")}/>
                </TouchableOpacity>

                {//Delete item master data
                }<TouchableOpacity style={styles.button}>
                    <Image style={{height: 25, width: 25, borderColor: "red "}}source={require("../../assets/images/deleteIcon.png")}/>
                </TouchableOpacity>
            </View>

            {/*END rowContainer*/}
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
            paddingRight: 20,
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
            width: 180,

            
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
        }
    });