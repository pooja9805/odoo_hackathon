const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAnalytics = async (req, res) => {
  // Only completed trips matter for analytics
  const trips = await prisma.trip.findMany({
    where: { status: "Completed" }
  });

  // Only fuel linked to trips
  const fuels = await prisma.fuelLog.findMany({
    where: { tripId: { not: null } }
  });

  const maintenance = await prisma.maintenanceLog.findMany();

  const totalFuel = fuels.reduce((a, b) => a + b.cost, 0);
  const totalMaintenance = maintenance.reduce((a, b) => a + b.cost, 0);
  const totalRevenue = trips.reduce((a, b) => a + b.revenue, 0);
  const totalDistance = trips.reduce((a, b) => a + b.distance, 0);

  // Total liters (safe)
  const totalLiters = fuels.reduce((a, b) => a + b.liters, 0) || 1;

  // Fuel efficiency km/L
  const fuelEfficiency = totalDistance / totalLiters;

  // Cost per km
  const costPerKm = totalDistance
    ? (totalFuel + totalMaintenance) / totalDistance
    : 0;

  // ROI (mock acquisition cost = 100000)
  const roi = ((totalRevenue - (totalFuel + totalMaintenance)) / 100000) * 100;

  res.json({
    totalFuel,
    totalMaintenance,
    totalRevenue,
    roi: roi.toFixed(2),
    fuelEfficiency: fuelEfficiency.toFixed(2),
    costPerKm: costPerKm.toFixed(2)
  });
};

exports.exportCSV = async (req, res) => {
  const trips = await prisma.trip.findMany();

  let csv = "TripID,Revenue\n";
  trips.forEach(t => {
    csv += `${t.id},${t.revenue}\n`;
  });

  res.header("Content-Type", "text/csv");
  res.send(csv);
};