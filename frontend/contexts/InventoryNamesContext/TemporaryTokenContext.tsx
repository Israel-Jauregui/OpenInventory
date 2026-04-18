/*TempoararyTokenContext.tsx: Temporary context for allowing authenticated endpoint requests without having to incorporate relevant components / contexts for initiating and handling authorized user sessions.
The token must be replaced upon expiration, and it is currently linked to the parker user in the database's users table.
Also does not need to wrap the appropriate screens as a provider since components wont need to alter it for now
*/

import { createContext } from 'react'; 


export const TemporaryTokenContext = createContext("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwYXJrZXIiLCJleHAiOjE3NzkxMTYyNzd9.46ajYm3kI7-xIJWYnmb8azPhhhEL83OrbFBq2drZHRE");
