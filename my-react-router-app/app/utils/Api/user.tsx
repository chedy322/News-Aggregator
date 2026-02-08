import { useInternalCheckAuth } from "~/hooks/api_hook";



export const url="http://localhost:3800/";
export interface User_type{
id:number;
username:string;
email:string;
preferences:string[];
image?:string;
}

// :Promise<User_type|null>
export const user_info=async(api_fetch):Promise<User_type>=>{
    try{
//         const response=await fetch(`${url}user/me`, {
//             method:"GET",
//             credentials: 'include',
//                headers:{
//     "Content-Type": "application/json",
//   }
//         })
const response=await api_fetch(`${url}user/me`, {
            method:"GET",
            credentials: 'include',
               headers:{
    "Content-Type": "application/json",
  }
        })
if(!response.ok){
    const result=await response.json()
    throw new Error(result.message)
}
const result=await response.json();
return result.user_data
// const response=await apiClient<User_type>('user/me',{
//       method:"GET",
//             credentials: 'include',
//                headers:{
//     "Content-Type": "application/json",
//   }
// })
// return response
    }catch(err){
        console.log(err)
        throw new Error(err.message)
    }
}

// update user profile
export const update_user_info=async(updated_user_info,api_fetch):Promise<string>=>{
    try{
           const response=await api_fetch(`${url}user/update_user`, {
            method:"POST",
            credentials: 'include',
  body:updated_user_info

        })
        if(!response.ok){
            const result=await response.json()
            throw new Error(result.message)
        }
        const result=await response.json();
        return result.message
    }catch(err)
    {
        console.log(err)
        throw new Error('Failed to handle the operation.Please try again...')
    }
}