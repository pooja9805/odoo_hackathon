import { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

export default function Maintenance() {

 const [logs,setLogs]=useState([]);
 const [vehicles,setVehicles]=useState([]);

 const [form,setForm]=useState({
  vehicleId:"",
  details:"",
  cost:"",
  date:""
 });

 const load=()=>{
  api.get("/maintenance").then(r=>setLogs(r.data));
  api.get("/vehicles").then(r=>setVehicles(r.data));
 };

 useEffect(load,[]);

 const create=async()=>{

  if(!form.vehicleId || !form.details || !form.cost || !form.date){
   return Swal.fire("Missing Fields","Fill all fields","warning");
  }

  if(isNaN(form.cost)){
   return Swal.fire("Invalid Cost","Cost must be number","error");
  }

  try{
   await api.post("/maintenance",{
    vehicleId:Number(form.vehicleId),
    details:form.details,
    cost:Number(form.cost),
    date:form.date
   });

   Swal.fire("Success","Service Created","success");

   setForm({vehicleId:"",details:"",cost:"",date:""});
   load();

  }catch{
   Swal.fire("Error","Failed to create service","error");
  }
 };

 return(
 <>
 <h3>Maintenance & Service Logs</h3>

 <div className="card-soft p-3 mb-3">
  <div className="row">

   <div className="col">
    <select className="form-select"
     value={form.vehicleId}
     onChange={e=>setForm({...form,vehicleId:e.target.value})}>
     <option value="">Select Vehicle</option>
     {vehicles.map(v=>(
      <option key={v.id} value={v.id}>{v.model}</option>
     ))}
    </select>
   </div>

   <div className="col">
    <input className="form-control"
     placeholder="Issue / Service"
     value={form.details}
     onChange={e=>setForm({...form,details:e.target.value})}/>
   </div>

   <div className="col">
    <input type="date"
     className="form-control"
     value={form.date}
     onChange={e=>setForm({...form,date:e.target.value})}/>
   </div>

   <div className="col">
    <input className="form-control"
     placeholder="Cost"
     value={form.cost}
     onChange={e=>setForm({...form,cost:e.target.value})}/>
   </div>

   <div className="col">
    <button className="btn btn-primary w-100" onClick={create}>
     Create Service
    </button>
   </div>

  </div>
 </div>

 <div className="card-soft p-3">

 <table className="table">
  <thead>
   <tr>
    <th>ID</th>
    <th>Vehicle</th>
    <th>Issue</th>
    <th>Date</th>
    <th>Cost</th>
   </tr>
  </thead>

  <tbody>
   {logs.map(l=>(
    <tr key={l.id}>
     <td>{l.id}</td>
     <td>{l.vehicle?.model}</td>
     <td>{l.details}</td>
     <td>{new Date(l.date).toLocaleDateString()}</td>
     <td>{l.cost}</td>
    </tr>
   ))}
  </tbody>
 </table>

 </div>
 </>
 );
}