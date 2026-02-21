import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {

 const nav = useNavigate();

 const [kpi,setKpi]=useState({});
 const [trips,setTrips]=useState([]);

 const [search,setSearch]=useState("");
 const [status,setStatus]=useState("");

 useEffect(()=>{
  api.get("/dashboard").then(r=>setKpi(r.data));
  api.get("/trips").then(r=>{
   setTrips(r.data);
  });
 },[]);

 const filtered = useMemo(()=>{
  let t=[...trips];

  if(search){
   t=t.filter(x=>
    x.vehicle?.model?.toLowerCase().includes(search.toLowerCase()) ||
    x.driver?.name?.toLowerCase().includes(search.toLowerCase())
   );
  }

  if(status){
   t=t.filter(x=>x.status===status);
  }

  return t;

 },[search,status,trips]);

 return(
 <div className="dashboard">

  {/* Top Bar */}
  <div className="dash-top">

   <input
    placeholder="Search Vehicle / Driver..."
    value={search}
    onChange={e=>setSearch(e.target.value)}
   />

   <select onChange={e=>setStatus(e.target.value)}>
    <option value="">All Status</option>
    <option>Draft</option>
    <option>Dispatched</option>
    <option>Completed</option>
    <option>Cancelled</option>
   </select>

   <div className="dash-actions">
    <button className="btn-primary" onClick={()=>nav("/trips")}>
     New Trip
    </button>

    <button className="btn-outline" onClick={()=>nav("/vehicles")}>
     New Vehicle
    </button>
   </div>

  </div>

  {/* KPI */}
  <div className="kpis">

   <div className="kpi green">
    <h4>Active Fleet</h4>
    <h2>{kpi.activeFleet}</h2>
   </div>

   <div className="kpi orange">
    <h4>Maintenance Alert</h4>
    <h2>{kpi.inShop}</h2>
   </div>

   <div className="kpi blue">
    <h4>Pending Trips</h4>
    <h2>{kpi.pendingTrips}</h2>
   </div>

  </div>

  {/* Trips */}
  <div className="card-soft">

   <table>
    <thead>
     <tr>
      <th>ID</th>
      <th>Vehicle</th>
      <th>Driver</th>
      <th>Status</th>
     </tr>
    </thead>

    <tbody>
     {filtered.map(t=>(
      <tr key={t.id}>
       <td>{t.id}</td>
       <td>{t.vehicle?.model}</td>
       <td>{t.driver?.name}</td>
       <td>
        <span className={`status ${t.status}`}>
         {t.status}
        </span>
       </td>
      </tr>
     ))}
    </tbody>

   </table>

  </div>

 </div>
 );
}