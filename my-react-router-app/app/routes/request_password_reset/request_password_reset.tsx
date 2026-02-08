import React, { useState } from 'react'
import { request_password_reset } from '~/utils/Api/authentication'
import './request_password_reset.css'

function Request_password_reset() {
    interface form_type{
        email:string
    }
    const [sucess,setSuccess]=useState<string|null>(null)
    const [error,setError]=useState<string|null>(null)
    const [form,setForm]=useState<form_type>({
        email:""
    })
    // handle value change
    function handle_change(e:React.ChangeEvent<HTMLInputElement>){
        setForm({...form,[e.target.name]:e.target.value})
    }
      // handle password reset
  async function handle_password_reset(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
try{
    if(!form.email||form.email.length<=0){
           setError("Please enter your credentials...")
        setTimeout(()=>{
          setError("")
        },3000)
        return
    }
const response=await request_password_reset(form.email)
if(response){
 setSuccess(response)
  setTimeout(()=>{
          setSuccess("")
        },3000)
 return
}
}catch(err){
  console.log(err)
  setError(err.message)
   setTimeout(()=>{
          setError("")
        },3000)
  return
}
  }
  return (
    <div className="reset-container">
            <form onSubmit={handle_password_reset} className="reset-form">

                <label className="input-label">Email Address</label>
                <input
                    type="email"
                    name="email"
                    onChange={handle_change}
                    value={form.email}
                    required
                    className="reset-input"
                />

                <button type="submit" className="reset-btn">Submit</button>

            </form>

            {error && <h6 className="msg msg-error">{error}</h6>}
            {sucess && <h6 className="msg msg-success">{sucess}</h6>}
        </div>
  )
}

export default Request_password_reset
