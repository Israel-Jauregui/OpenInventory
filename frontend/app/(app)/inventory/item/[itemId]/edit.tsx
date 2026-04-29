import CreateEditItemModal from "@/components/CreateItemModal/CreateEditItemModal";
import { useLocalSearchParams } from "expo-router";
import type { item as Item } from "@/contexts/InventoryDataContext/InventoryDataContext";


export default function EditView() {
  const params = useLocalSearchParams<{ item?: string}>();

  console.log("PARAMS:", params);

  const itemParam = Array.isArray(params.item)
    ? params.item[0]
    : params.item;

  const parsedItem = itemParam
    ? (JSON.parse(itemParam) as Item)
    : undefined;

  return <CreateEditItemModal mode="edit" item={parsedItem} />;
}
