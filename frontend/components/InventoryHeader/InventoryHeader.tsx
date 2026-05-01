//InventoryHeader.tsx:  Header / label for the currently selected inventory. Also serves as a dropdown for switching to another inventory.

import { View, Text, StyleSheet } from 'react-native';

type Props = {inventoryName : string}
export default function InventoryHeader({ inventoryName }: Props) {

    return (<>
        <View style={styles.inventoryHeader}>
            <Text style={{ margin: 2, padding: 5, fontSize: 22 }}>{inventoryName ?? 'Inventory'}</Text>
        </View >

    </>);
}

const styles = StyleSheet.create(
    {
        inventoryHeader: {
            justifyContent: "center",
            alignItems: "center"
        },

    }
);