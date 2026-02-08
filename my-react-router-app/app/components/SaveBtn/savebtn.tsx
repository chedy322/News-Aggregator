import React from 'react'


interface BtnProps{
 cb:()=>void,
 txtfield:string
}
const styles=`
.btncontainer{
margin:10px 0;
}
.btncontainer > button{
color:white;
width:90px;
height:30px;
background-color: #1a73e8;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
border:none;
border-radius:8px;
font-weight:500;
transition:background-color 0.2s,box-shadow 0.2s;
}

.btncontainer>button:hover{
background-color: #155bb5;
box-shadow: 0 4px 10px rgba(26, 115, 232, 0.4);
cursor:pointer;

}

`
function Savebtn({cb,txtfield}:BtnProps) {
  return (
    <div className='btncontainer'>
        <style>{styles}</style>
        <button onClick={cb}>
           {txtfield}
        </button>
    </div>
  )
}

export default Savebtn
