import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router';
import { login } from '~/utils/Api/authentication';
import { ThemeContext } from '~/utils/context';
import { encrypt } from '~/utils/helper';
import './login.css'
function Login() {
  interface Form_type{
    email:string;
    password:string;
  }
  const[form,setForm]=useState<Form_type>({
    email:'',
    password:'',
  })
  const [error,setError]=useState<string|null>(null)
  const [success,setSuccess]=useState<string|null>(null)
  const {setting_user_data}=useContext(ThemeContext)
  const navigate=useNavigate()
  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
     setForm({...form,[e.target.name]:e.target.value})
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    try{
      if(form.email.length<=0||form.password.length<=0){
        // setError("Please enter your credentials...")
        setError("Please enter your credentials...")
        setTimeout(()=>{
          setError("")
        },3000)
        return
      }
      const result=await login(form)
      // this to stop redirecting on errors from api
      if(result){
        setSuccess("Logged in successfully.Redirecting...")
        setTimeout(()=>{
          setSuccess("")
        },3000)
        // set localstorage
        setting_user_data(result)
        // redirect
        navigate('/profile')
      }
    }catch(err){
    const message = err?.message || "An unexpected error occurred during reset.";
      setError(message)
      setTimeout(()=>{
          setError("")
        },3000)
    }finally{
      setForm({
         email:'',
    password:''
      })
    }
  }


  return (
    <div className='login-page-container'>
      <div className=' login-card'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
      <input name="email" onChange={handleChange} value={form.email} type='email' placeholder='Email' />
      <input name="password" onChange={handleChange} value={form.password} type="password" placeholder='Password' />
      <button type='submit'>Submit</button>
      
      </form>
      <h5 onClick={()=>{
        navigate('/register')
      }}>Register Now</h5>
      <div>
        {/* <button onClick={handle_google_login}>Google login</button> */}
        <button><a href="http://localhost:3800/auth/login/google">Google login</a></button>
          <button onClick={()=>navigate('/request_password_reset')}>
        Forgot password
       </button>
      </div>
      {
        error&&<h6>{error}</h6>
      }{

      success&&<h6>{success}</h6>
      }
      </div>
    </div>
  )
}

export default Login
