import { useEffect, useState } from "react"
import { user_info, type User_type } from "~/utils/Api/user"
import { useInternalCheckAuth } from "./api_hook"

export const useUser=()=>{
    const [user_data,setUserData]=useState<User_type>()
    const [loading,setLoading]=useState<boolean>(true)
    const [fetching_error,setFetchingError]=useState<string|null>(null)
    const {api_fetch}=useInternalCheckAuth()

    useEffect(()=>{
        async function fetch_user(){
             try{
                const result=await user_info(api_fetch)
                setUserData(result)
    }catch(err){
        console.log(err)    
        setFetchingError(err.message)
    }finally{
        setLoading(false)
    }
}
        fetch_user()
    },[])
    return {loading,user_data,fetching_error}
   
}