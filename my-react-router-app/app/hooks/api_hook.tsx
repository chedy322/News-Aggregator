import { useCallback, useRef } from "react"
import { logout } from "~/utils/Api/authentication";


const BASE_URL = 'http://localhost:3800/'; 
const REFRESH_TOKEN_URL = `${BASE_URL}auth/refresh_token`;
/**Creating wrapper function that will handle token expiration automatically 
*@param url string - endpoint to fetch 
*@param options RequestInit - fetch options(method,headers,body etc)
*@returns Response
*/
const create_refresh_token=async()=>{
    try{
        const response=await fetch(REFRESH_TOKEN_URL,{
            method:"POST",
            headers:{
    "Content-Type": "application/json",
            },
            credentials:"include",
        })
        if(!response.ok){
            throw new Error('Failed to refresh token')
        }
        return response
    }catch(err){
        console.log(err)
        throw new Error(err.message)
    }
}

export const useInternalCheckAuth=()=>{
    // creating a ref to avoid multiple refresh token calls
    const isrefreshing=useRef<boolean>(false);
    const api_fetch=useCallback(async (url:string,options={})=>{
        //inckuding credentials in fetch request
        options={...options,credentials:"include"}
        try{
            // fetching from the given url
            // --->if we get 401 error we will try to refresh token once
            let response=await fetch(url,options)
        //    if the response is ok we will return the response
        if(response.ok){
            return response
        }
        if(!response.ok){
            const result=await response.json()
            throw new Error(result.message)
        }
        // now we check if the response is 401(which means access token expired)
        if(response.status==401){
            // we check if the isrefreshing is true
            if(isrefreshing.current){
                // if true we wait for some time and try again
                console.log('Waiting for token to refresh...')
                // we wait for 3 seconds before retrying
                await new Promise(resolve=>setTimeout(resolve,3000))
                response=await fetch(url,options)
            }else{
                try{
                //we set the is refreshing to true to avoid multiple calls
                isrefreshing.current=true;
                console.log('Refreshing token...')
                //we make call for refresh token
                await create_refresh_token()
                // we retry the original request once here
                response=await fetch(url,options)
                // we set isrefreshing to false after the operation
                isrefreshing.current=false;
                if(response.ok){
                    return response
                }else{
                    // if retry fails we throw error
                    const result=await response.json()
                    // addedd logout function to clear user data
                    // await logout();
                    throw new Error(result.message || "Retry failed after token refresh.");
                }
                }
                catch(err){
                    // logout user if the refresh token fails
                    isrefreshing.current=false;
                    await logout();
                    throw new Error('Session expired. Please login again.');
                }
            }
        }
        
    } catch(err){
            console.log(err)
            throw new Error(err.message)
        }
    
    },[])

    return {api_fetch}

}