import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useInternalCheckAuth } from '~/hooks/api_hook';
import { user_info } from '~/utils/Api/user';
import { ThemeContext } from '~/utils/context';

function Google_callback_page() {
    const navigate=useNavigate()
    const {setting_user_data}=useContext(ThemeContext)
   const {api_fetch}=useInternalCheckAuth()
    useEffect(()=>{
async function handle_login(){
    try{
        const response=await user_info(api_fetch);
        console.log("google login response",response)
        if(response){
            setting_user_data({
               _id: response._id,
               username:response.username,
               email:response.email,
               role:response.role
            })
            navigate('/profile')
        }
    }catch(err){    
        alert(err.message)
        navigate('/login')
    }
}
handle_login()
    },[])
  return (
   <h5>Finalizing login...</h5>
  )
}

export default Google_callback_page
