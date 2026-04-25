//create-edit-item.tsx:  Modal used for either creating or editing an item. Returned component varies depending on mode prop.

import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import CreateEditItemModal from '@/components/CreateItemModal/CreateEditItemModal';

export default function EditItemModal() {

    //TODO: Params most likely may include item_id 
    const { mode } = useLocalSearchParams<{ mode: "create" | "edit" }>();

    return (<>

        <CreateEditItemModal mode={mode} />

    </>);
}

