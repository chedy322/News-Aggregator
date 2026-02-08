import { useContext } from 'react';
import './Nav.css'
import { Link, useNavigate } from "react-router";
import { ThemeContext } from '~/utils/context';


export default function Nav(){
    const{userData,authLoading}=useContext(ThemeContext)
  const navigate=useNavigate()
  const navigate_web=(link:string)=>{
    navigate(link)
  }
  interface Items{
    id:number;
    name:string;
    link:string;
}
const nav_items:Items[]=[
    {
        id:1,
        name:"Home",
        link:"/"
    },
      ...(userData ? [{
      id: 2,
      name: "Fyp",
      link: "/fyp"
    }]:[]),
    {
         id:3,
        name:"News",
        link:"/news"
    },
    {
         id:4,
         name:userData?"Profile":"Login",
        link:userData?"/profile":"/login"
    }
]

// if(authLoading){
//      return (<div>Loading...</div>)
// }
    
    return (
        <div>
<ul>
    <Link to='/'>Home </Link>
    <Link to="/news" >News </Link>
    {
        userData&&<Link to='/fyp' >Fyp </Link>
    }

    {
        (userData?<Link to='profile'>Profile </Link>:<Link to='/login'>Login </Link>)
    }

    
</ul>
 </div>
    )
    
    
};    

