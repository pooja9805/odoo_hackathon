const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getKPIs = async (req, res) => {
  const activeFleet = await prisma.vehicle.count({
    where: { status: "On Trip" }
  });

  const inShop = await prisma.vehicle.count({
    where: { status: "In Shop" }
  });

  const totalVehicles = await prisma.vehicle.count();

  const trips = await prisma.trip.count({
    where: { status: "Draft" }
  });

  res.json({
    activeFleet,
    inShop,
    utilization: totalVehicles
      ? Math.round((activeFleet / totalVehicles) * 100)
      : 0,
    pendingTrips: trips
  });
};