const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addFuel = async (req, res) => {
  const { vehicleId, tripId, liters, cost } = req.body;

  const fuel = await prisma.fuelLog.create({
    data: { vehicleId, tripId, liters, cost }
  });

  res.json(fuel);
};

exports.getFuel = async (req, res) => {
  const fuel = await prisma.fuelLog.findMany({
    include: { vehicle: true }
  });

  res.json(fuel);
};