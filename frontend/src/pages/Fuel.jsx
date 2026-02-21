import { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

export default function Fuel() {

  const [logs,setLogs] = useState([]);
  const [vehicles,setVehicles] = useState([]);
  const [trips,setTrips] = useState([]);

  const [search,setSearch] = useState("");
  const [sort,setSort] = useState("new");

  const [form,setForm] = useState({
    vehicleId:"",
    tripId:"",
    liters:"",
    cost:""
  });

  const load = ()=>{
    api.get("/fuel").then(r=>setLogs(r.data));
    api.get("/vehicles").then(r=>setVehicles(r.data));
    api.get("/trips").then(r=>setTrips(r.data));
  };

  useEffect(load,[]);

  const submit = async()=>{

    if(!form.vehicleId || !form.tripId || !form.liters || !form.cost){
      return Swal.fire("Missing Fields","Fill all inputs","warning");
    }

    if(isNaN(form.liters) || isNaN(form.cost)){
      return Swal.fire("Invalid Input","Numbers only","error");
    }

    try{
      await api.post("/fuel",{
        vehicleId:Number(form.vehicleId),
        tripId:Number(form.tripId),
        liters:Number(form.liters),
        cost:Number(form.cost)
      });

      Swal.fire("Success","Expense Added","success");

      setForm({vehicleId:"",tripId:"",liters:"",cost:""});
      load();

    }catch{
      Swal.fire("Error","Failed to add expense","error");
    }
  };

  let filtered = logs.filter(l =>
    l.vehicle?.model?.toLowerCase().includes(search.toLowerCase())
  );

  if(sort==="old") filtered.reverse();

  return(
  <>

  <h3>Expense & Fuel Logging</h3>

  {/* TOOLBAR */}
  <div className="d-flex gap-2 mb-3">
    <input className="form-control" placeholder="Search vehicle..."
      onChange={e=>setSearch(e.target.value)}/>

    <select className="form-select" onChange={e=>setSort(e.target.value)}>
      <option value="new">Newest</option>
      <option value="old">Oldest</option>
    </select>

    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#fuelModal">
      Add Expense
    </button>
  </div>

  {/* TABLE */}
  <div className="card-soft p-3">

    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Vehicle</th>
          <th>Trip</th>
          <th>Liters</th>
          <th>Cost</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map(l=>(
          <tr key={l.id}>
            <td>{l.id}</td>
            <td>{l.vehicle?.model}</td>
            <td>{l.tripId}</td>
            <td>{l.liters}</td>
            <td>{l.cost}</td>
          </tr>
        ))}
      </tbody>

    </table>

  </div>

  {/* MODAL */}
  <div className="modal fade" id="fuelModal">
    <div className="modal-dialog">
      <div className="modal-content p-3">

        <h5>Add Expense</h5>

        <select className="form-select mb-2"
          onChange={e=>setForm({...form,vehicleId:e.target.value})}>
          <option>Select Vehicle</option>
          {vehicles.map(v=><option key={v.id} value={v.id}>{v.model}</option>)}
        </select>

        <select className="form-select mb-2"
          onChange={e=>setForm({...form,tripId:e.target.value})}>
          <option>Select Trip</option>
          {trips.map(t=><option key={t.id} value={t.id}>{t.id}</option>)}
        </select>

        <input className="form-control mb-2" placeholder="Liters"
          onChange={e=>setForm({...form,liters:e.target.value})}/>

        <input className="form-control mb-3" placeholder="Cost"
          onChange={e=>setForm({...form,cost:e.target.value})}/>

        <button className="btn btn-success w-100" onClick={submit}>
          Create
        </button>

      </div>
    </div>
  </div>

  </>
  );
}