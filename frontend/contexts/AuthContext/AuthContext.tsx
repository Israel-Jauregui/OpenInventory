//AuthContext.tsx: Context provider that indicates whether the user is authenticated and performs signIn/Out operations. Very heavily influenced by examples on https://docs.expo.dev/router/advanced/authentication/
import { use, createContext, PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/useStorageState/useStorageState';
//Specifies information about the current user's authentication state and provides 
const AuthContext = createContext<{

    //Type definitions for default object in context
    signIn: () => void,
    signOut: () => void,
    session?: string | null,
    isLoading: boolean

}>({

    //Default values provided when AuthContext is consumed without it acting as a provider for the component using it; passed value should have proper functionality defined for signIn and signOut
    signIn: () => null,
    signOut: () => null,
    session: null,

    //Used for controlling the visibility of the splash screen (when implemented) since authentication is async
    isLoading: false,
});

//Grabs and returns provided AuthContext from SessionProvider
export function useSession() {

    const authObject = use(AuthContext);

    if (!authObject) {
        throw new Error("useSession requires a wrapped SessionProvider in order to have access to AuthContext");
    }

    return authObject;
}

export function SessionProvider({ children }: PropsWithChildren) {

    const [[isLoading, session], setSession] = useStorageState("session");


    return (<>

        <AuthContext.Provider value={
            {
                signIn: () => {

                },

                signOut: () => {

                },

                isLoading,
                session,
            }
        }>

        </AuthContext.Provider>
    </>);
}