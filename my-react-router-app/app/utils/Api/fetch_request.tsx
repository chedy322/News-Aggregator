// import { useCallback, useContext, useRef } from "react";
// import { ThemeContext } from "../context";

// const BASE_URL = 'http://localhost:3800/'; 
// const REFRESH_TOKEN_URL = `${BASE_URL}auth/refresh_token`;

// /**
//  * A wrapper around 'fetch' that automatically retries a request once
//  * if it fails with a 401 Unauthorized status (due to an expired access token).
//  * @param endpoint The API endpoint (e.g., 'profile/data').
//  * @param config The fetch configuration object (method, body, headers, etc.).
//  * @returns The successful JSON response data.
//  */
// // export async function apiClient<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
// //     const url = `${BASE_URL}${endpoint}`;
// //     console.log(url)
// //     console.log('config',config)
// //     console.log('Api client is excecuting...')
// //     // const {setting_user_data}=useContext(ThemeContext)
// //     // IMPORTANT: Include credentials to send cookies (access_token/refreshtoken)
// //     const requestConfig: RequestInit = {
// //         ...config,
// //         credentials: 'include',
// //     };
// //     console.log('configreq',requestConfig)
// //     // --- 1. FIRST ATTEMPT ---
// //     let response = await fetch(url, requestConfig);
// //     console.log('response from fetch request',response)
// //     // If successful (2xx), or a non-401 failure (e.g., 404, 500, or network error), 
// //     // we handle it immediately.
// //     if (response.ok || response.status !== 401) {
// //         // If it's an error status, throw a specific message.
// //         if (!response.ok) {
// //              const errorData = await response.json();
// //              throw new Error(errorData.message || 'API request failed.');
// //         }
// //         // Success case
// //         return (await response.json()) as T;
// //         // return response
// //     }

// //     // --- 2. 401 DETECTED: INITIATE TOKEN REFRESH ---
// //     if (response.status === 401) {
// //         console.log("Access token expired. Attempting to refresh token...");
        
// //         // This call automatically uses the refreshtoken cookie for authorization.
// //         const refreshResponse = await fetch(REFRESH_TOKEN_URL, {
// //             method: 'POST',
// //             credentials: 'include'
// //         });

// //         if (!refreshResponse.ok) {
// //             // The refresh token is also invalid/expired. The user must re-login.
// //             console.error("Refresh token failed. User must re-authenticate.");
// //             // delete user_data from localStorage because user has to relog again
// //             // NB think of solution here bcz user ins anuthorized and he has to be automaticcalty logout
// //             // add redirect or any type of alert here
// //             // *** NOTE: You must implement a proper logout/state clear here ***
// //             throw new Error("Session expired. Please log in again."); 
// //         }

// //         // --- 3. AUTO-RETRY THE ORIGINAL REQUEST ---
// //         console.log("Token successfully refreshed. Retrying original request...");
        
// //         // The browser has silently updated the cookies with the new token.
// //         // We now retry the exact original request once.
// //         response = await fetch(url, requestConfig);

// //         // Check the result of the second attempt
// //         if (!response.ok) {
// //             const errorData = await response.json();
// //             throw new Error(errorData.message || "Retry failed after token refresh.");
// //         }

// //         // Return the successful data from the retry.
// //         return (await response.json()) as T;
// //     }
    
// //     // Fallback for unexpected situations
// //     throw new Error('An unexpected API error occurred.');
// // }


// /**Creating wrapper function that will handle token expiration automatically 
// *@param url string - endpoint to fetch 
// *@param options RequestInit - fetch options(method,headers,body etc)
// *@returns Response
// */
// const create_refresh_token=async()=>{
//     try{
//         const response=await fetch(REFRESH_TOKEN_URL,{
//             method:"POST",
//             headers:{
//     "Content-Type": "application/json",
//             },
//             credentials:"include",
//         })
//         if(!response.ok){
//             throw new Error('Failed to refresh token')
//         }
//         return response
//     }catch(err){
//         console.log(err)
//         throw new Error(err.message)
//     }
// }

// export const useInternalCheckAuth= ()=>{
//     // creating a ref to avoid multiple refresh token calls
//     const isrefreshing=useRef<boolean>(false);
//     const api_fetch=useCallback(async (url:string,options={})=>{
//         //inckuding credentials in fetch request
//         options={...options,credentials:"include"}
//         try{
//             // fetching from the given url
//             // --->if we get 401 error we will try to refresh token once
//             let response=await fetch(url,options)
//         //    if the response is ok we will return the response
//         if(response.ok){
//             return response
//         }
//         // now we check if the response is 401(which means access token expired)
//         if(response.status==401){
//             // we check if the isrefreshing is true
//             if(isrefreshing.current){
//                 // if true we wait for some time and try again
//                 console.log('Waiting for token to refresh...')
//                 // we wait for 3 seconds before retrying
//                 await new Promise(resolve=>setTimeout(resolve,3000))
//                 response=await fetch(url,options)
//             }else{
//                 //we set the is refreshing to true to avoid multiple calls
//                 isrefreshing.current=true;
//                 console.log('Refreshing token...')
//                 //we make call for refresh token
//                 await create_refresh_token()
//                 // we retry the original request once here
//                 response=await fetch(url,options)
//                 // we set isrefreshing to false after the operation
//                 isrefreshing.current=false;
//                 if(response.ok){
//                     return response
//                 }else{
//                     // if retry fails we throw error
//                     const result=await response.json()
//                     throw new Error(result.message || "Retry failed after token refresh.");
//                 }
//             }
//         }
//         }catch(err){
//             console.log(err)
//             throw new Error(err.message)
//         }
        
//     },[])




//     return {api_fetch}

// }

// import { useCallback, useContext, useRef, createContext, useState } from "react";

// // --- TEMPORARY/ASSUMED TYPES AND CONTEXT DEFINITIONS ---
// // NOTE: You must replace this with your actual ThemeContext or AuthContext definition.
// interface AuthContextValue {
//     /** Function to log the user out and clear tokens/state */
//     logoutUser: () => void;
//     // ... other context values
// }

// // Placeholder Context (You should use your actual context)
// export const ThemeContext = createContext<AuthContextValue>({
//     logoutUser: () => console.log("LOGOUT placeholder executed.")
// });

// // --- API CONSTANTS ---
// const BASE_URL = 'http://localhost:3800/'; 
// const REFRESH_TOKEN_URL = `${BASE_URL}auth/refresh_token`;


// /**
//  * Helper function to call the refresh token endpoint.
//  * This is designed to be called only when a 401 is initially detected.
//  * @returns The successful Response object after token refresh.
//  */
// const create_refresh_token = async (): Promise<Response> => {
//     try {
//         // No Content-Type header needed for a cookie-based refresh POST request
//         const response = await fetch(REFRESH_TOKEN_URL, {
//             method: "POST",
//             credentials: "include",
//         });

//         if (!response.ok) {
//             // This happens if the refresh token cookie itself is invalid/expired
//             throw new Error('Refresh token failed. Session is expired.');
//         }
//         return response;
//     } catch (err: any) {
//         console.error("Error during token refresh attempt:", err);
//         // Re-throw the error to be caught by the calling function (useInternalCheckAuth)
//         throw new Error(err.message);
//     }
// };

// /**
//  * Custom React Hook that provides an enhanced fetch utility.
//  * It automatically includes credentials and attempts a single token refresh and retry
//  * if a 401 Unauthorized status is received.
//  */
// export const useInternalCheckAuth = () => {
//     // Access context for state management (critical for forced logout)
//     // const { logoutUser } = useContext(ThemeContext);
    
//     // Flag to prevent multiple concurrent token refresh calls (race condition blocker)
//     const isrefreshing = useRef<boolean>(false);
//     const retryCount = useRef<number>(0);

//     /**
//      * Enhanced fetch wrapper.
//      * @param endpoint The API endpoint (e.g., 'profile/data').
//      * @param config The fetch configuration object (method, body, headers, etc.).
//      * @returns A Promise that resolves to the successful Response object.
//      */
//     const api_fetch = useCallback(async (endpoint: string, config: RequestInit = {}): Promise<Response> => {
//         const url = `${BASE_URL}${endpoint}`;
        
//         // Ensure credentials are included to send/receive HTTP cookies (tokens)
//         const requestConfig: RequestInit = {
//             ...config,
//             credentials: "include",
//         };

//         try {
//             // --- 1. FIRST ATTEMPT ---
//             let response = await fetch(url, requestConfig);
            
//             // Success or non-401 failure (e.g., 404, 500)
//             if (response.ok || response.status !== 401) {
//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || `API request failed with status ${response.status}.`);
//                 }
//                 return response;
//             }

//             // --- 2. 401 DETECTED: INITIATE TOKEN REFRESH & RETRY ---
//             if (response.status === 401) {
//                 console.log("Access token expired. Attempting to refresh token...");
                
//                 // If a refresh is already in progress, we wait a moment and retry.
//                 // NOTE: A more complex queue pattern is better, but this simple check prevents spamming the refresh endpoint.
//                 if (isrefreshing.current && retryCount.current < 2) {
//                     // Give the in-progress refresh time to complete and update cookies
//                     await new Promise(resolve => setTimeout(resolve, 50)); 
//                     retryCount.current++;
                    
//                     // Retry the original request
//                     response = await fetch(url, requestConfig);

//                     if (response.ok) {
//                          retryCount.current = 0;
//                          return response;
//                     } 
//                     // If retry still fails after waiting, proceed to the standard refresh failure logic below
//                 } 

//                 if (!isrefreshing.current) {
//                     isrefreshing.current = true;
//                     retryCount.current = 0; // Reset count for the new refresh cycle

//                     try {
//                         // Attempt to refresh the token (updates cookies automatically)
//                         await create_refresh_token();
                        
//                         // --- 3. AUTO-RETRY THE ORIGINAL REQUEST ---
//                         console.log("Token successfully refreshed. Retrying original request...");

//                         response = await fetch(url, requestConfig);

//                         if (!response.ok) {
//                             const errorData = await response.json();
//                             throw new Error(errorData.message || "Retry failed after token refresh.");
//                         }
                        
//                         return response;

//                     } catch (refreshErr) {
//                         // If the refresh token fails, force logout
//                         console.error("Critical: Session expired. Refresh token failed.");
//                         logoutUser(); // <--- CRITICAL: Logs user out of the app
//                         throw refreshErr; // Re-throw the session expired error
//                     } finally {
//                         isrefreshing.current = false;
//                     }
//                 }
//             }
            
//             // Fallback for any unexpected non-ok response
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `API request failed with status ${response.status}.`);
//             }
            
//             return response;
            
//         } catch (err: any) {
//             // Re-throw any errors (network, JSON parsing, or custom thrown errors)
//             console.error("API Fetch Error:", err.message);
//             throw err;
//         }
//     }, [logoutUser]); // Dependency on logoutUser from context

//     return { api_fetch };
// };

