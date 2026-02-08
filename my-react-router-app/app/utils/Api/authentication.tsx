

let url="http://localhost:3800/"
interface User_type{
id:number;
username:string;
email:string;
role:number;
}
// setError:(s:string)=>void
export const register=async(data:register_data):Promise<string>=>{
try{
    const response=await fetch(`${url}auth/register`,{
        method:"POST",
  headers: {
    "Content-Type": "application/json",
  },
  body:JSON.stringify(data)
    })
    if(!response.ok){
        const result=await response.json()
        throw new Error(result.message)
    }
    const result=await response.json()
    return result.message
}catch(err){
    throw new Error(err.message)
}
}
interface login_data{
    email:String;
    password:String;
}
export const login=async(data:login_data):Promise<User_type>=>{
    try{
const response=await fetch(`${url}auth/login`,{
            method:"POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials:"include",
  body:JSON.stringify(data)
})

if(!response.ok){
    const result=await response.json()
    throw new Error(result.message)
}
const result=await response.json()
// store user_data from result in local storage after calling this function
return result.user_data
}catch(err){
        throw new Error(err.message)
    }
}



export async function logout():Promise<boolean>{
    try{
        const response=await fetch(url+'user/logout',{
        method:"POST",
        credentials:"include",
        headers:{
    "Content-Type": "application/json",
  }
})

if(!response.ok){
    const result=await response.json()
    throw new Error(result.message)
}
return true
    }catch(err){
        throw new Error(err.message)
    }
}

// password checker 
export const token_checker=async (token:string):Promise<Boolean>=>{
    try {
        const response=await fetch(url+"reset/check_token?token="+token,{
            method:"GET",
              credentials:"include",
        headers:{
    "Content-Type": "application/json",
  }
        })
        console.log(response)
        if(!response.ok){
            const result=await response.json()
            throw new Error(result.message)
        }
        return true
    }catch(err){
        console.log(err)
        throw new Error(err.message)
    }
}



// request password reset
export const request_password_reset=async(user_email:string):Promise<string>=>{
    try{
 const response=await fetch(url+"reset/request_password",{
      method:"POST",
              credentials:"include",
        headers:{
    "Content-Type": "application/json",
  },
  body:JSON.stringify({
    email:user_email
  })
 })
 if(!response.ok){
    const result=await response.json()
    throw new Error(result.message)
}

const result=await response.json()
 return result.message
    }catch(err){
        console.log(err)
        throw new Error(err.message)
    }
}

// reset password
export const reset_password=async(new_password:string,token:string):Promise<string>=>{
    try{
        const response=await fetch(url+"reset/reset_password?token="+token,{
              method:"POST",
        credentials:"include",
        headers:{
    "Content-Type": "application/json",
  },
  body:JSON.stringify({new_password})
        })
        if(!response.ok){
            const result=await response.json()
            throw new Error(result.message)
        }
        const result=await response.json()
        return result.message

    }catch(err){
        console.log(err)
        throw new Error(err.message)
    }
}