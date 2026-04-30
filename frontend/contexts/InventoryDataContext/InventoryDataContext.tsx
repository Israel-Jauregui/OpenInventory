
import { createContext, use, useReducer, useEffect, PropsWithChildren, ActionDispatch } from 'react';
import { useSession } from '../AuthContext/AuthContext';
import { useCurrentInventoryContext } from '../CurrentInventoryContext/CurrentInventoryContext';

//MARK: item type
//Type definition for an item that follows Item class / model in API
export type item = {
    //Changed item_id type to string from response's item_id: number since FlatList's keyExtractor expects a string
    //Also optional since some requests such as creating a completely new item obviously should not send this property
    //TODO: Possibly change other expected properties to be optional depending on expected body / FormData of other requests
    "item_id": string,
    "item_name": string,
    "desc": string,
    "upc": string,
    "photo_url": string,
    "price": number,
    "category": string,
    "brand": string,
    "quantity": number,
    "low_stock_trigger": number,
}


export type createItemFormData = {
    "item_name": string,
    "desc": string,
    "upc": string,
    "price": number,
    "category": string,
    "brand": string,
    "file": string,
}

export type addItemFormData = {
    "inventory_id": number | null,
    "item_id": number | null,
    "quantity": number,
    "low_stock_trigger": number
}

//Same type as item with exception of item_id since its other properties match those expected in FormData of /inventory/{inventory_id}/items/{item_id}
export type editItemFormData = Omit<item, "item_id">;


//State and dispatch contexts are separated so that only updating state for example doesn't cause rerenders for components that only need the dispatch function

//Represents the actual inventory data and appropriate functons for handling inventory-related actions
//TODO: Continue adding handler function types and initial values
const InventoryDataContext = createContext<{
    inventoryItems: item[],
    handleCreateItem: (createFormData: FormData) => Promise<void | Response>,
    handleAddItem: (addItemData: addItemFormData) => Promise<void | Response>,
    handleEditItem: (editItemFormData: editItemFormData, item_id: string) => Promise<void | Response>,
    refreshInventoryItems: () => Promise<void>,
}>({
    inventoryItems: [],
    handleCreateItem: () => Promise.resolve(undefined),
    handleAddItem: () => Promise.resolve(undefined),
    handleEditItem: () => Promise.resolve(undefined),
    refreshInventoryItems: () => Promise.resolve(),

});

//Type can be changed if needed
const InventoryDataDispatchContext = createContext<ActionDispatch<any>>(() => null);

//Use hooks for consumers to grab inventory data / dispatch function
export function useInventoryDataContext() {

    const inventoryDataContextObject = use(InventoryDataContext);

    if (!inventoryDataContextObject) {
        throw new Error("useInventoryDataContext requries this component to have a wrapped InventoryDataProvider in order to have access to InventoryDataContext");
    }

    return inventoryDataContextObject;
}

export function useInventoryDataDispatchContext() {
    const inventoryDataDispatchContextObject = use(InventoryDataDispatchContext);

    if (!inventoryDataDispatchContextObject) {
        throw new Error("useInventoryDataDispatchContext requries this component to have a wrapped InventoryDataProvider in order to have access to InventoryDataDispatchContext");
    }

    return inventoryDataDispatchContextObject;
}


//TODO: Possibly conditionally render children via isLoading flag
export function InventoryDataProvider({ children }: PropsWithChildren) {

    const { fetchWithAuth } = useSession();

    //MARK: Inventory id
    //currentInventory.invId will be utilized for several endpoints such as /inventory/{inventory_id}/items
    const { currentInventory } = useCurrentInventoryContext();

    let initialInventoryItems: item[] = [];

    const [inventoryItems, dispatch] = useReducer(inventoryItemsReducer, initialInventoryItems);

    //Used for rendering the initial state of inventory items upon application load. Is assigned to inventoryItems which is then passed to consumers via InventoryDataContext.
    useEffect(() => {

        getInventoryItems();

    },
        /*
        currentInventory.invId in the dependency array prevents inventory-select from prematurely fetching when there is no invId available.
        This also doubles as a way to refetch upon changing inventories since there is a nonzero chance that inventory-select does not remount due to being a Tab, thus preventing useEffect from executing again.
        */
        [currentInventory.invId]);

    //BEGIN FUNCTION DEFINITIONS (For functions that require component scope)
    //MARK: Functions (component)

    //TODO: Implement in items.tsx to add pull-to-refresh functionality, but first look into / incorporate how that will impact sorting and filters.
    async function getInventoryItems() {
        if (currentInventory.invId !== "" && currentInventory.invId !== null && currentInventory.invId !== undefined) {
            //FIXME: Temporary console log
            console.log(`Fetching initial inventories for inventory of invId: ${currentInventory.invId}, invName: ${currentInventory.invName}`);

            fetchWithAuth(`/inventory/${currentInventory.invId}/items`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            ).then(async (response) => {
                if (!response?.ok) {
                    dispatch({ type: "initialFetch", inventoryItems: [] });
                    return;
                }

                const responseJSON = await response?.json();

                console.log(responseJSON);

                //Updates inventoryItems with the current state of the inventory on server-side
                dispatch({ type: "initialFetch", inventoryItems: responseJSON });

            });


        }

    }
    
    //TODO: Pass the following functions into value of InventoryDataContext.Provider once completed so they can be utilized via const { functionName } = useInventoryDataContext();
    //FIXME: OPTIONAL Each function MUST dispatch state at some point to the reducer (usually AFTER fetchWithAuth for a given endpoint is successful)

    //MARK: Create handler
    async function handleCreateItem(createFormData: FormData) {


        console.log("Creating new item master data")
        //Send a request with createFormData to /items/create to create a global item format
        //TODO: ADD CASES FOR ERROR HANDLING SUCH AS DUPLICATE BARCODE OR MISSING ITEM_NAME

        //Uses await instead of immediately resolving with .then() since (for example) handleSubmit in CreateEditItemModal.tsx needs the responseJSON in time
        const response = await fetchWithAuth("/items/create", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data"
            },
            body: createFormData
        })

        if (response?.status === 201) {
            return response;
        }
    }
    //MARK: Add handler
    async function handleAddItemToInventory(addItemData: addItemFormData) {
        const response = await fetchWithAuth("/inventory/additem", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(addItemData)
        });

        if (response?.ok) {
            await getInventoryItems();
            return response;
        }
    }

    //MARK: Edit handler
    //handleEditItem expects an item_id parameter because editItemFormData should NOT contain item_id as the endpoint does not expect that property
    async function handleEditItem(editItemFormData: editItemFormData, item_id: string) {
        console.log(`Editing item`);
        console.log("Edit item form data: ", editItemFormData)
        if (editItemFormData) {
            const response = await fetchWithAuth(`/inventory/${currentInventory.invId}/items/${item_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editItemFormData)
            })

            if (response?.status === 200) {
                return response
            }
        }
        else{
            throw new Error("editItemFormData must be defined. Check to make sure that passed mode to CreateEditItemModal is \"edit\" ");
        }
    }

    async function handleDeleteItem() {

    }
    //END FUNCTION DEFINITIONS (For functions that require component scope)

    //MARK: Component return
    return (<>

        <InventoryDataContext.Provider value={{ inventoryItems, handleCreateItem, handleAddItem: handleAddItemToInventory, refreshInventoryItems: getInventoryItems, handleEditItem }}>
            <InventoryDataDispatchContext.Provider value={dispatch}>
                {children}
            </InventoryDataDispatchContext.Provider>
        </InventoryDataContext.Provider>
    </>);


    //MARK: Reducer and action types
    //Type definition for the dispatched action 
    //TODO: Add additional type for every new dispatcher action case that is created
    //TODO: createItem dispatch may be needed and would likely alter state of something such as list of items in items table of database to add to a given inventory
    //Example of additional type is {type: "deleteItem", item_id: number} for action.type case "deleteItem" that deletes an item with item_id
    type Action =
        | { type: "initialFetch", inventoryItems: item[] }
        | { type: "addItem", item: item }
        | { type: "deleteItem", item_id: number }
        ;

    function inventoryItemsReducer(inventoryItems: item[], action: Action) {

        switch (action.type) {
            case "initialFetch": {
                return action.inventoryItems;
            }
            case "addItem": {
                //TODO: action.item is likely sufficient though still keep in mind
                return [...inventoryItems, action.item];
            }
            default: {
                throw new Error(`Dispatch action of type: ${action.type} is not defined`)
            }
        }

    }

    //TODO: Define custom handler functions for events such as handleAddItem which makes a request to the server, then either dispatches a part of the response OR dispatches the local state (e.g. the obtained fields of an item before submitting rather than the returned item from the server)

}
