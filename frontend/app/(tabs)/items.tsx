
import { useEffect } from 'react';
import ItemEntry from '@/components/ItemEntry/ItemEntry';

//BEGIN Custom component imports
import InventoryHeader from '@/components/InventoryHeader/InventoryHeader';
import ItemsSearchBar from '@/components/ItemsSearchBar/ItemsSearchBar';
//END Custom component imports

//TODO: Incorporate fetch that displays all items
export default function ItemsView() {

    return(<>
        <InventoryHeader inventoryName="Needs inventoryName context"/>
        <ItemsSearchBar />

        {//TEMPORARY
        }<ItemEntry />

    </>);
}