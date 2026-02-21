import {useEffect,useState} from "react";
import api from "../api";

export default function Analytics(){

 const [data,setData]=useState(null);

 useEffect(()=>{
  api.get("/analytics").then(r=>setData(r.data));
 },[]);

 if(!data) return null;

 return(
 <>
 <h3>Analytics</h3>
 <p>Total Fuel: {data.totalFuel}</p>
 <p>Total Maintenance: {data.totalMaintenance}</p>
 <p>ROI: {data.roi}%</p>
 <p>Fuel Efficiency: {data.fuelEfficiency}</p>
 </>
 );
}