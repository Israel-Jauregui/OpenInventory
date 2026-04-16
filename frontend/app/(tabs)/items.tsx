
import { ScrollView } from 'react-native';

import { useEffect, useContext } from 'react'; 



//BEGIN Custom component imports
import ItemEntry from '@/components/ItemEntry/ItemEntry';
import InventoryHeader from '@/components/InventoryHeader/InventoryHeader';
import ItemsSearchBar from '@/components/ItemsSearchBar/ItemsSearchBar';
//END Custom component imports

import { CurrentInventoryContext } from '@/contexts/InventoryNamesContext/CurrentInventoryContext';
//TODO: Incorporate fetch that displays all items
export default function ItemsView() {

    const testVal = useContext(CurrentInventoryContext);
    console.log(testVal)

    

    //TODO: Convert ScrollView into a SectionList that displays items under each category. 
    return (<>
        <InventoryHeader inventoryName="Needs inventoryName context" />
        <ItemsSearchBar />


        {//TEMPORARY
        }<ScrollView contentContainerStyle={{alignItems: "center", justifyContent: "center", gap: 8}}>
            <ItemEntry />
            <ItemEntry />
            <ItemEntry />
            <ItemEntry />
            <ItemEntry />
        </ScrollView>

    </>);
}