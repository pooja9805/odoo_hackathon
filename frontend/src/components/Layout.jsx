import { Outlet, Link, useNavigate } from "react-router-dom";

export default function Layout() {
  const nav = useNavigate();

  const logout = () => {
    localStorage.clear();
    nav("/");
  };

  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <div className="p-3 bg-white shadow" style={{ width: 230, minHeight: "100vh" }}>
        <h4 className="text-primary fw-bold">FleetFlow</h4>

        {[
          ["Dashboard","dashboard"],
          ["Vehicles","vehicles"],
          ["Trips","trips"],
          ["Drivers","drivers"],
          ["Maintenance","maintenance"],
          ["Fuel","fuel"],
          ["Analytics","analytics"]
        ].map(([n,p])=>(
          <Link key={p} to={`/${p}`} className="d-block my-2 text-decoration-none">
            {n}
          </Link>
        ))}

        <button onClick={logout} className="btn btn-sm btn-danger mt-4">Logout</button>
      </div>

      {/* MAIN */}
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>

    </div>
  );
}