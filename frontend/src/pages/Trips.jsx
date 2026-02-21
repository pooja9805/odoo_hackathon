import { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const [form, setForm] = useState({
    vehicleId: "",
    driverId: "",
    cargo: "",
    origin: "",
    destination: "",
    distance: "",
    estimatedFuel: ""
  });

  // ---------------- LOAD DATA ----------------
  const load = async () => {
    try {
      const [t, v, d] = await Promise.all([
        api.get("/trips"),
        api.get("/vehicles"),
        api.get("/drivers")
      ]);

      setTrips(t.data);

      // Only AVAILABLE vehicles
      setVehicles(v.data.filter(v => v.status === "Available"));

      // Only ON DUTY drivers
      setDrivers(d.data.filter(d => d.status === "On Duty"));
    } catch (err) {
      Swal.fire("Error", "Failed to load data", "error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    for (let k in form) {
      if (!form[k]) return "All fields are required";
    }

    if (
      isNaN(form.cargo) ||
      isNaN(form.distance) ||
      isNaN(form.estimatedFuel)
    ) {
      return "Cargo, distance and fuel must be numbers";
    }

    return null;
  };

  // ---------------- CREATE TRIP ----------------
  const create = async () => {
    const err = validate();
    if (err) {
      Swal.fire("Invalid Input", err, "error");
      return;
    }

    try {
      await api.post("/trips", {
        vehicleId: Number(form.vehicleId),
        driverId: Number(form.driverId),
        cargo: Number(form.cargo),
        origin: form.origin,
        destination: form.destination,
        distance: Number(form.distance),
        estimatedFuel: Number(form.estimatedFuel)
      });

      Swal.fire("Success", "Trip created", "success");

      setForm({
        vehicleId: "",
        driverId: "",
        cargo: "",
        origin: "",
        destination: "",
        distance: "",
        estimatedFuel: ""
      });

      setShowForm(false);
      load();
    } catch (e) {
      Swal.fire(
        "Error",
        e.response?.data?.message || "Trip creation failed",
        "error"
      );
    }
  };

  // ---------------- ACTIONS ----------------
  const dispatch = id =>
    api.patch(`/trips/${id}/dispatch`).then(load);

  const complete = id =>
    api
      .patch(`/trips/${id}/complete`, {
        revenue: 5000,
        finalOdometer: 12000
      })
      .then(load);

  // ---------------- FILTER / SORT ----------------
  let list = trips.filter(t =>
    t.vehicle?.model?.toLowerCase().includes(search.toLowerCase()) ||
    t.origin?.toLowerCase().includes(search.toLowerCase())
  );

  if (filter) list = list.filter(t => t.status === filter);
  if (sort === "new") list = [...list].reverse();
  if (sort === "cargo") list.sort((a, b) => b.cargo - a.cargo);

  // ---------------- UI ----------------
  return (
    <div>
      <h2 className="mb-3">Trip Dispatcher</h2>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select className="form-select" onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option>Draft</option>
          <option>Dispatched</option>
          <option>Completed</option>
        </select>

        <select className="form-select" onChange={e => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="new">Newest</option>
          <option value="cargo">By Cargo</option>
        </select>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          New Trip
        </button>
      </div>

      {showForm && (
        <div className="card-soft p-3 mb-3 animate">
          <div className="row g-2">
            <select
              className="form-select col"
              value={form.vehicleId}
              onChange={e =>
                setForm({ ...form, vehicleId: e.target.value })
              }
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.model}
                </option>
              ))}
            </select>

            <select
              className="form-select col"
              value={form.driverId}
              onChange={e =>
                setForm({ ...form, driverId: e.target.value })
              }
            >
              <option value="">Select Driver</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {["cargo", "origin", "destination", "distance", "estimatedFuel"].map(
              f => (
                <input
                  key={f}
                  className="form-control col"
                  placeholder={f}
                  value={form[f]}
                  onChange={e =>
                    setForm({ ...form, [f]: e.target.value })
                  }
                />
              )
            )}

            <button
              className="btn btn-success mt-2"
              onClick={create}
            >
              Confirm & Dispatch Trip
            </button>
          </div>
        </div>
      )}

      <table className="table card-soft">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Origin</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {list.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.vehicle?.model}</td>
              <td>{t.driver?.name}</td>
              <td>{t.origin}</td>
              <td>
                <span
                  className={`badge ${
                    t.status === "Draft"
                      ? "bg-secondary"
                      : t.status === "Dispatched"
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                >
                  {t.status}
                </span>
              </td>
              <td>
                {t.status === "Draft" && (
                  <button
                    onClick={() => dispatch(t.id)}
                    className="btn btn-sm btn-warning"
                  >
                    Dispatch
                  </button>
                )}
                {t.status === "Dispatched" && (
                  <button
                    onClick={() => complete(t.id)}
                    className="btn btn-sm btn-success"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}