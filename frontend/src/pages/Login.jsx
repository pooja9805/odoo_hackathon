import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login(){

 const nav = useNavigate();

 const [isRegister,setIsRegister] = useState(false);

 const [form,setForm] = useState({
  name:"",
  email:"",
  password:"",
  role:"Manager"
 });

 const submit = async()=>{

  try{

   if(isRegister){

    await api.post("/auth/register",form);
    alert("Registered successfully! Now login.");
    setIsRegister(false);
    return;

   }else{

    const res = await api.post("/auth/login",{
     email:form.email,
     password:form.password
    });

    localStorage.setItem("token",res.data.token);
    localStorage.setItem("role",res.data.role);

    nav("/dashboard");
   }

  }catch(err){
   alert(err.response?.data?.message || "Something went wrong");
  }

 };

 return(
 <div className="center-screen">

  <div className="card-soft p-4" style={{width:"400px"}}>

   <h2 className="text-center mb-3">FleetFlow</h2>

   {isRegister && (
    <input
     className="form-control mb-2"
     placeholder="Name"
     value={form.name}
     onChange={e=>setForm({...form,name:e.target.value})}
    />
   )}

   <input
    className="form-control mb-2"
    placeholder="Email"
    value={form.email}
    onChange={e=>setForm({...form,email:e.target.value})}
   />

   <input
    type="password"
    className="form-control mb-2"
    placeholder="Password"
    value={form.password}
    onChange={e=>setForm({...form,password:e.target.value})}
   />

   {isRegister && (
    <select
     className="form-select mb-2"
     value={form.role}
     onChange={e=>setForm({...form,role:e.target.value})}
    >
     <option>Manager</option>
     <option>Dispatcher</option>
     <option>Safety</option>
     <option>Finance</option>
    </select>
   )}

   <button className="btn btn-primary w-100 mb-2" onClick={submit}>
    {isRegister ? "Register" : "Login"}
   </button>

   <div className="text-center">

    {isRegister ? (
     <span>
      Already have an account?{" "}
      <span
       style={{color:"blue",cursor:"pointer"}}
       onClick={()=>setIsRegister(false)}
      >
       Login
      </span>
     </span>
    ):(
     <span>
      New here?{" "}
      <span
       style={{color:"blue",cursor:"pointer"}}
       onClick={()=>setIsRegister(true)}
      >
       Register
      </span>
     </span>
    )}

   </div>

  </div>

 </div>
 );
}