require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");
const tripRoutes = require("./routes/tripRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const fuelRoutes = require("./routes/fuelRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("FleetFlow Backend Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000"); 
});