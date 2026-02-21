import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("");

  const [form, setForm] = useState({
    name: "",
    licenseNumber: "",
    licenseExpiry: "",
    completionRate: "",
    safetyScore: "",
    complaints: ""
  });

  const handleAccess = (err) => {
    if (err?.response?.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        html: `Allowed Roles:<br/><b>Admin<br/>Manager</b>`
      });
    }
  };

  const loadDrivers = async () => {
    try {
      const res = await api.get("/drivers");
      setDrivers(res.data);
    } catch (err) {
      handleAccess(err);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const createDriver = async () => {
    const {
      name,
      licenseNumber,
      licenseExpiry,
      completionRate,
      safetyScore,
      complaints
    } = form;

    if (!name || !licenseNumber || !licenseExpiry) {
      return Swal.fire("Error", "All fields required", "error");
    }

    if (isNaN(completionRate) || isNaN(safetyScore) || isNaN(complaints)) {
      return Swal.fire("Error", "Numeric fields must be numbers", "error");
    }

    const expiry = new Date(licenseExpiry);
    const today = new Date();

    const status = expiry < today ? "Suspended" : "On Duty";

    try {
      await api.post("/drivers", {
        name,
        licenseNumber,
        licenseExpiry,
        completionRate: Number(completionRate),
        safetyScore: Number(safetyScore),
        complaints: Number(complaints),
        status
      });

      Swal.fire("Success", "Driver Added", "success");
      setShowModal(false);
      setForm({
        name: "",
        licenseNumber: "",
        licenseExpiry: "",
        completionRate: "",
        safetyScore: "",
        complaints: ""
      });
      loadDrivers();
    } catch (err) {
      handleAccess(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/drivers/${id}/status`, { status });
      loadDrivers();
    } catch (err) {
      handleAccess(err);
    }
  };

  const filtered = useMemo(() => {
    let data = [...drivers];

    if (search) {
      data = data.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.licenseNumber.includes(search)
      );
    }

    if (filter !== "all") data = data.filter(d => d.status === filter);

    if (sort === "name") data.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "safety") data.sort((a, b) => b.safetyScore - a.safetyScore);
    if (sort === "completion") data.sort((a, b) => b.completionRate - a.completionRate);

    return data;
  }, [drivers, search, filter, sort]);

  return (
    <>
      <h3>Driver Performance & Safety</h3>

      <div className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Search driver..." value={search} onChange={e => setSearch(e.target.value)} />

        <select className="form-select" onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="On Duty">On Duty</option>
          <option value="Break">Break</option>
          <option value="Suspended">Suspended</option>
        </select>

        <select className="form-select" onChange={e => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="safety">Safety Score</option>
          <option value="completion">Completion Rate</option>
        </select>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Driver
        </button>
      </div>

      <table className="table card-soft">
        <thead>
          <tr>
            <th>Name</th>
            <th>License #</th>
            <th>Expiry</th>
            <th>Completion %</th>
            <th>Safety %</th>
            <th>Complaints</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.licenseNumber}</td>
              <td>{new Date(d.licenseExpiry).toLocaleDateString()}</td>
              <td>{d.completionRate}%</td>
              <td>{d.safetyScore}%</td>
              <td>{d.complaints}</td>
              <td>
                <select value={d.status} onChange={e => updateStatus(d.id, e.target.value)} className="form-select form-select-sm">
                  <option>On Duty</option>
                  <option>Break</option>
                  <option>Suspended</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CLEAN MODAL */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#fff",
            padding: 24,
            borderRadius: 14,
            width: 450,
            boxShadow: "0 15px 40px rgba(0,0,0,.25)",
            animation: "scaleIn .25s ease"
          }}>

            <h5>Add Driver</h5>

            {["name","licenseNumber","licenseExpiry","completionRate","safetyScore","complaints"].map(f => (
              <input
                key={f}
                className="form-control mb-2"
                type={f==="licenseExpiry" ? "date" : "text"}
                placeholder={f}
                value={form[f]}
                onChange={e => setForm({...form,[f]:e.target.value})}
              />
            ))}

            <div className="d-flex gap-2">
              <button className="btn btn-success w-100" onClick={createDriver}>Create</button>
              <button className="btn btn-secondary w-100" onClick={()=>setShowModal(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}