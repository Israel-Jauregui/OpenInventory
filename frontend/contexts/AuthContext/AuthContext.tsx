//AuthContext.tsx: Context provider that indicates whether the user is authenticated and performs signIn/Out operations. Very heavily influenced by examples on https://docs.expo.dev/router/advanced/authentication/
import { use, createContext, PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/useStorageState/useStorageState';
import { useRouter } from 'expo-router'
import { useState } from 'react';
import qs from 'qs';

import { jwtDecode } from 'jwt-decode';

//Specifies information about the current user's authentication state and provides functions for handling auth-related events
const AuthContext = createContext<{

    //Type definitions for default object in context
    handleLoginAttempt: (username: string, password: string) => Promise<void | Response>,
    handleSignup: (username: string, password: string, wants_notif: boolean) => Promise<void | Response>,
    handleLogout: () => Promise<void>,
    fetchWithAuth: (endpoint: RequestInfo, options: RequestInit) => Promise<Response | undefined>,
    token?: string | ((value: string | null) => void) | null,
    user?: string | null,

}>({

    //Default values provided when AuthContext is consumed without it acting as a provider for the component using it; passed value should have proper functionality defined for any functions
    handleLoginAttempt: () => Promise.resolve(undefined),
    handleSignup: () => Promise.resolve(undefined),
    handleLogout: () => Promise.resolve(undefined),
    fetchWithAuth: () => Promise.resolve(undefined),
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

    //Used for navigating upon successful auth functions such as account creation during handleSignup
    const router = useRouter();

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

    //Initial token expiry check (fetch wrapper will check in response to receiving a 401)
    checkTokenExpiry(token);

    //MARK: Context
    //Grabs and returns provided AuthContext from SessionProvider. Required for components that want to use anything that is specified in AuthContext's value property

    //MARK: Check token expiry

    function checkTokenExpiry(token: string | null | undefined): void {
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
            
            if(isExpired){
                console.log(`Token ${token} has expired. Logging user out.`);
                handleLogout();
            }
        }
    }
    //MARK: Login function
    //TODO: Consider adding parameters that accept state setters for form errors and clearing fields after unsuccessful login.
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

            if(response.status === 401){
                //Returned for custom handling since 401 usually represents incorrect credentials
                return response;
            }
            else if (!response.ok) {
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

            return response;



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
            else if(response.status === 201){
                //Puts user back to login screen TODO: Optionally automatically login via handleLoginAttempt so that token is still set properly
                router.back();
            }

            const responseJSON = await response.json();

            //TODO: Consider adding a handleLoginAttempt that uses the username and password that was passed to the server to automatically redirect upon signup, or just require user to navigate back to login and input username and password there.
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

    /*MARK: Fetch wrapper
     TODO: Add function that wraps a fetch request that takes parameters such as endpoint and options. Should also accept the token, then automatically insert it into the Authorization header. 
     Definition may need to be moved somewhere else depending on when token state updates.
     Should also call setToken(null) upon 401 and maybe simultaneously upon token expiry since 401 may result when token is still being retrieved from storage.
     */
    async function fetchWithAuth(endpoint: RequestInfo, options: RequestInit): Promise<Response | undefined> {

        //Adds the Authorization header with the current token to every request. headers property becomes undefined if original passed options did not have it defined originally, which prevents an error from being thrown.
        const optionsWithAuthorization = { ...options, headers: { ...options.headers, "Authorization": `Bearer ${token}` } };



        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}${endpoint}`, optionsWithAuthorization);

            if (response.ok) {

                //Just the response is returned so that custom handling for each responseJSON or other format can be implemented. Requires .then to be utilized since all asyncs will return a Promise requiring resolution
                return response;
            }
            else if (response.status === 401) {

                //Logs out if expired
                checkTokenExpiry(token);

            }
            else {
                throw new Error(`Request at endpoint ${endpoint} failed. Status code: ${response.status}`)
            }
        } catch (error) {
            console.error(error);

            //TODO: Consider adding boolean parameter to toggle alert(error) so that error is more immediately evident on mobile
        }


    }


    return (<>

        <AuthContext.Provider value={
            {
                handleLoginAttempt,
                handleSignup,
                handleLogout,
                fetchWithAuth,
                //The token state is passed so that routes can use it as their guard prop values to determine whether to allow user in
                token,

                //TODO: Determine purpose since token is used as guard prop value in routes; could be used as source of truth for username
                user
            }
        }>
            {children}
        </AuthContext.Provider>
    </>);
}