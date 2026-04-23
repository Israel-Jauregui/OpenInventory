
import { ScrollView } from 'react-native';

import { useEffect, useContext } from 'react';

import { useCurrentInventoryContext } from '@/contexts/InventoryNamesContext/CurrentInventoryContext';

//BEGIN Custom component imports
import ItemEntry from '@/components/ItemEntry/ItemEntry';
import InventoryHeader from '@/components/InventoryHeader/InventoryHeader';
import ItemsSearchBar from '@/components/ItemsSearchBar/ItemsSearchBar';
//END Custom component imports


/*
    TODO: Incorporate fetch that displays all items. 
    Managing state of each item could be done with Context API + useReducer(), though
    more research should be done towards the libraries Zustand and TanStack (also known as React Queery) since context may cause
    unnecessary rerenders when such context is updated.
    This explains the general difference between Context and state management libraries
    https://blog.isquaredsoftware.com/2021/01/context-redux-differences/
*/
export default function ItemsView() {

    const { currentInventory } = useCurrentInventoryContext();


    //TODO: Convert ScrollView into either a FlatList or SectionList that displays items (under each category if SectionList). 
    return (<>
        <InventoryHeader inventoryName={currentInventory.invName} />
        <ItemsSearchBar />


        {//TEMPORARY
        }<ScrollView contentContainerStyle={{ alignItems: "center", justifyContent: "center", gap: 8 }}>
            <ItemEntry />
            <ItemEntry />
            <ItemEntry />
            <ItemEntry />
            <ItemEntry />
        </ScrollView>

    </>);
}