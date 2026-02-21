import { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

export default function Vehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const load = () => {
    api.get("/vehicles").then(r => setVehicles(r.data));
  };

  useEffect(load, []);

  // ---------- ADD VEHICLE ----------
  const addVehicle = async () => {

    const { value: form } = await Swal.fire({
      title: "New Vehicle Registration",
      html: `
      <input id="plate" class="swal2-input" placeholder="License Plate">
      <input id="model" class="swal2-input" placeholder="Model">
      <input id="type" class="swal2-input" placeholder="Type (Van/Truck/Bike)">
      <input id="capacity" class="swal2-input" placeholder="Capacity (kg)">
      <input id="odo" class="swal2-input" placeholder="Initial Odometer">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          licensePlate: document.getElementById("plate").value,
          model: document.getElementById("model").value,
          type: document.getElementById("type").value,
          capacity: document.getElementById("capacity").value,
          odometer: document.getElementById("odo").value
        };
      }
    });

    if (!form) return;

    if (!form.licensePlate || !form.model || !form.type)
      return Swal.fire("All fields required");

    if (isNaN(form.capacity) || isNaN(form.odometer))
      return Swal.fire("Capacity & Odometer must be numbers");

    await api.post("/vehicles", {
      ...form,
      capacity: Number(form.capacity),
      odometer: Number(form.odometer)
    });

    Swal.fire("Vehicle Added Successfully 🚗");
    load();
  };

  // ---------- DELETE ----------
  const remove = id => {
    Swal.fire({
      title: "Delete vehicle?",
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        await api.delete(`/vehicles/${id}`);
        load();
      }
    });
  };

  // ---------- FILTERING ----------
  let filtered = vehicles
  .filter(v => v.status !== "Retired")
  .filter(v =>
    v.model.toLowerCase().includes(search.toLowerCase())
  );

  if (statusFilter)
    filtered = filtered.filter(v => v.status === statusFilter);

  if (sortBy === "capacity")
    filtered.sort((a, b) => b.capacity - a.capacity);

  if (sortBy === "odometer")
    filtered.sort((a, b) => b.odometer - a.odometer);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Vehicle Registry</h3>
        <button className="btn btn-primary" onClick={addVehicle}>+ New Vehicle</button>
      </div>

      {/* SEARCH / FILTER BAR */}
      <div className="card-soft p-3 mb-3 d-flex gap-2">

        <input
          className="form-control"
          placeholder="Search model..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select className="form-select" onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option>Available</option>
          <option>On Trip</option>
          <option>In Shop</option>
        </select>

        <select className="form-select" onChange={e => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="capacity">Capacity</option>
          <option value="odometer">Odometer</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="card-soft p-3">

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Plate</th>
              <th>Model</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Odometer</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.licensePlate}</td>
                <td>{v.model}</td>
                <td>{v.type}</td>
                <td>{v.capacity}</td>
                <td>{v.odometer}</td>
                <td>
                  <span className={`badge ${v.status === "Available" ? "bg-success" : "bg-warning"}`}>
                    {v.status}
                  </span>
                </td>
                <td>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(v.id)}>
                    Retire
                    </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
}