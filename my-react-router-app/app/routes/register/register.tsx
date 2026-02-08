import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { register } from '~/utils/Api/authentication';
import './register.css'
function Register() {
interface form_type{
    username:string;
    email:string;
    password:string;
}
    const [form,setForm]=useState<form_type>({
 username:"",
    email:"",
    password:""
    })
    const navigate=useNavigate()
    const [success,setSuccess]=useState<string|null>(null)
    const [error,setError]=useState<string|null>(null)
    function handle_change(e: React.ChangeEvent<HTMLInputElement>){
      setForm({...form,[e.target.name]:e.target.value})
    }
async function handle_submit(e: React.FormEvent<HTMLFormElement>){
e.preventDefault()
try{
      console.log(form)
      if(form.email.length<=0||form.password.length<=0||form.username.length<=0){
        console.log('error')
        // setError("Please enter your credentials...")
        setError("Please enter your credentials...")
        setTimeout(()=>{
          setError("")
        },3000)
        return
      }
      const result=await register(form)
      // this to stop redirecting on errors from api
      if(result){
        setSuccess(result)
        setTimeout(()=>{
          setSuccess("")
        },3000)
      }
      navigate('/login')
    }catch(err){
      const message = err?.message || "An unexpected error occurred during reset.";
      setError(message)
      setTimeout(()=>{
          setError("")
        },3000)
    }finally{
      setForm({
         email:'',
    password:'',
    username:""
      })
    }
  }


  return (
    <div className='register-page-container'>
    <div className='register-card'>
      <h1>Register Now</h1>
        <form onSubmit={handle_submit}>
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handle_change}/>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handle_change}/>
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handle_change}/>
          <h5 onClick={()=>{
            navigate('/login')
          }}>I already have an account</h5>
        <button type="submit">Submit</button>
        {
        error&&<h6>{error}</h6>
        }
        {
        success&&<h6>{success}</h6>
        }
      </form>
      </div>
    </div>
  )
}

export default Register
