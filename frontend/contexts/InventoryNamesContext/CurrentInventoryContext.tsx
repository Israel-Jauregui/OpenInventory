import { use, createContext, PropsWithChildren, useState, SetStateAction } from 'react';

import { inventory } from '@/app/(tabs)/inventory-select';





const CurrentInventoryContext = createContext<{
    //Type definitions for default values (actual default context values are in parentheses)
    currentInventory: inventory,
    setCurrentInventory: React.Dispatch<SetStateAction<inventory>>
}>({
    //Default context values (overridden when both currentInventory state and state setter are passed)
    currentInventory: {invId: "", invName: ""},
    setCurrentInventory: () => undefined
}
);


//Essentially returns context while ensuring that a provider actually exists
export function useCurrentInventoryContext() {

    const inventoryContextObject = use(CurrentInventoryContext);

    if (!inventoryContextObject) {
        throw new Error("useCurrentInventoryContext requries this component to have a wrapped CurrentInventoryProvider in order to have access to CurrentInventoryContext");

    }

    return inventoryContextObject;
}   

//Provider for current inventory
export function CurrentInventoryProvider({ children }: PropsWithChildren) {

    const [currentInventory, setCurrentInventory] = useState<inventory>({ invId: "", invName: "" });

    return (
        <>
            <CurrentInventoryContext.Provider value={{ currentInventory, setCurrentInventory }}>
                {children}
            </CurrentInventoryContext.Provider>
        </>);
}