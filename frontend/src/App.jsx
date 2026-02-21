import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Trips from "./pages/Trips";
import Drivers from "./pages/Drivers";
import Maintenance from "./pages/Maintenance";
import Fuel from "./pages/Fuel";
import Analytics from "./pages/Analytics";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}