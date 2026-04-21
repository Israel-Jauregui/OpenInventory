//AuthContext.tsx: Context provider that indicates whether the user is authenticated and performs signIn/Out operations. Very heavily influenced by examples on https://docs.expo.dev/router/advanced/authentication/
import { use, createContext, PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/useStorageState/useStorageState';
import { useState } from 'react';
import qs from 'qs';

import { jwtDecode } from 'jwt-decode';

//Specifies information about the current user's authentication state and provides 
const AuthContext = createContext<{

    //Type definitions for default object in context
    handleLoginAttempt: (username: string, password: string) => Promise<void>,
    handleSignup: (username: string, password: string, wants_notif: boolean) => Promise<void>,
    handleLogout: () => Promise<void>,
    token?: string | ((value: string | null) => void) | null,
    user?: string | null,

}>({

    //Default values provided when AuthContext is consumed without it acting as a provider for the component using it; passed value should have proper functionality defined for any functions
    handleLoginAttempt: () => Promise.resolve(undefined),
    handleSignup: () => Promise.resolve(undefined),
    handleLogout: () => Promise.resolve(undefined),
    token: null,
    user: null

    //FIXME: Add optional isLoading: used for controlling the visibility of the splash screen (if implemented) since authentication is async; don't forget to add type definition

});

export function useSession() {

    const authObject = use(AuthContext);

    if (!authObject) {
        throw new Error("useSession requires this component to have a wrapped SessionProvider in order to have access to AuthContext whether if this component is nested or not");
    }

    return authObject;
}


//Used for wrapping the app; provides AuthContext which gives information about the current user and their JWT
export function SessionProvider({ children }: PropsWithChildren) {

    //TODO: Consider adding to an object called session that also contains token, and use that for auth instead
    const [user, setUser] = useState<string | null>(null);

    /*
    //FIXME: Add back if necessary. Pass setter function into useStorageState if added back and add its type and parameter to useStorageState and other functions that may need it
    //Passed to provider's value to ensure that app rendering is consistent with async behavior of storage. Also passed to useStorageState so that it can alter this state.
    const [isLoading, setIsLoading] = useState(false);

    //FIXME: TEMPORARY
    console.log(`isLoading: ${isLoading}`);
    */

    //useStorageState automatically returns the value of token key / value pair in storage, so checking for expiry upon startup can be done here
    const [token, setToken] = useStorageState("token");

    //Reading from storage is async, so either FIXME: add isLoading, or use this branch to check token exp once token is retrieved
    //!!token makes it so that token is always represented as a boolean since token itself may be undefined
    if (!!token) {
        console.log(`Token to be decoded: ${token}`);
        const decodedJWT = jwtDecode(token);
        console.log("Decoded token object: ", decodedJWT)

        //Convert seconds into milliseconds since that is the format of the Date object
        const exp = decodedJWT.exp as number * 1000;
        const isExpired = Date.now() >= exp;
        
        //JWTs cannot be revoked within here (must be from server via blacklist for example), so TODO: an addition of making a request to an authenticated endpoint and then setting token to null if the response is 401 may be needed here
        if (isExpired) {

            setToken(null);
        }
    }
    //MARK: Context
    //Grabs and returns provided AuthContext from SessionProvider. Required for components that want to use anything that is specified in AuthContext's value property


    //MARK: Login function
    async function handleLoginAttempt(username: string, password: string) {
        try {
            const options = {
                method: "POST",
                headers: {
                    //Specifies type of content to be received
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                //qs simply puts data into an acceptable format for the endpoint, which is just an encoded URL parameter for the keys / values of the username and password
                //The password is technically sent in plaintext over the query paramter
                body: qs.stringify({
                    username: username,
                    password: password
                }),

            }

            //FIXME: Temporary log
            console.log(options.body);

            //FIXME: Eventually use .env for resource IP in every endpoint
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/login`, options);

            if (!response.ok) {
                throw new Error(`Failed to login. Status code: ${response.status}`)
            }

            const responseJSON = await response.json();

            //TODO: Place token into storage and set storageState to that token
            console.log("ResponseJSON: ", responseJSON)


            


            setToken(responseJSON.access_token);

            //TODO: Change to accept token's property that specifies the username so that username comes from the server itself
            setUser(username);

            //FIXME: Temporary console log
            console.log(`Token state: ${token}`);



        } catch (error) {
            console.log(error);
        }
    }

    //MARK: Signup function

    async function handleSignup(username: string, password: string, wants_notif: boolean) {


        try {

            const options = {
                method: "POST",

                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"

                },
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                    "wants_notif": wants_notif,
                })
            }

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/signup`, options);

            if (!response.ok) {
                throw new Error(`Failed to create account. Status code: ${response.status}`);
            }

            const responseJSON = await response.json();


            //FIXME: TEMPORARY LOG
            console.log(responseJSON);


        } catch (error) {
            console.log(error);
        }

    }

    //MARK: Logout function 

    async function handleLogout() {

        setUser(null);

        //TODO: Remove stored token locally; however, it will still be valid on the server side for up to ~30 days
        //Deletes the token key / value pair when argument is null
        setToken(null);
    }

    //MARK: Fetch wrapper
    return (<>

        <AuthContext.Provider value={
            {
                handleLoginAttempt,
                handleSignup,
                handleLogout,
                //The token state is passed so that context consumers can use it in relevant fetch requests that require it
                token,
                user
            }
        }>
            {children}
        </AuthContext.Provider>
    </>);
}