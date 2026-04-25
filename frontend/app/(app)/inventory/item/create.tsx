import CreateEditItemModal from "@/components/CreateItemModal/CreateEditItemModal";
import { useLocalSearchParams } from "expo-router";

export default function CreateItemModal() {

    //Possible locations that can be passed from include home.tsx and items.tsx
    const { mode } = useLocalSearchParams<{mode: "create" | "edit"}>();
    console.log(mode);
    return(<>

            <CreateEditItemModal mode={mode}/>

    </>);
}