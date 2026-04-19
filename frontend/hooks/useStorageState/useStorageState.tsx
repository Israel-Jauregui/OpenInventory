//useStorageState.tsx: Custom hook that stores the received JWTs in the mobile device's storage. Functions like localStorage on the web but with encryption due to expo-secure-store.
//If authentication is also implemented on the web, then localStorage should be used instead by detecting Platform.OS === 'web'

//BEGIN imports
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
//END imports



//BEGIN FUNCTION DEFINITIONS

//Used for storing key / value pairs which will be the JWTs in this case. string | null is Typescript's way of specifying multiple possible types

function useAsyncState<T>() {


}

//Function is async to maintain app responsiveness while storing data 
export async function setStorageItemAsync(key: string, value: string | null) {

    //Configured for mobile only at the moment; use Platform.OS ==='web' and corresponding localStorage methods for web (which are .setItem() and .removeItem())
    if (value === null) {

        await SecureStore.deleteItemAsync(key);
    } else {
        await SecureStore.setItemAsync(key, value);
    }

}

export function useStorageState(key: string){

    const [storageState, setStorageState] = useState<string | null>();


    //Retrieves the session upon AuthContext mount, then sets storageState so that the initial session storage state availability is very quickly available upon app startup
    //useEffect will still behave as expected when useStorageState is called inside AuthContext. It will also only run after AuthContext mount if the key argument changes.
    useEffect(() => {

        SecureStore.getItemAsync(key).then((value: string | null)=>{
            setStorageState(value);
        })

    }, [key])

    //Used for manually setting the storage's actual stored value; this is the actual "setter" function in terms of managing session state
    function setStorageValue(value: string | null){

        //Synchronizes state and the actual stored value
        setStorageState(value);
        setStorageItemAsync(key, value);
    }


    return [storageState, setStorageValue];
}
//END FUNCTION DEFINITIONS

