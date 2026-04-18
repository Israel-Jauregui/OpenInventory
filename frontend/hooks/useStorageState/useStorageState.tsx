//useStorageState.tsx: Custom hook that stores the received JWTs in the mobile device's storage. Functions like localStorage on the web but with encryption due to expo-secure-store.
//If authentication is also implemented on the web, then localStorage should be used instead by detecting Platform.OS === 'web'

//BEGIN imports
import * as SecureStore from 'expo-secure-store';

//END imports