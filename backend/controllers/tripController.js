const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE TRIP (DRAFT)
exports.createTrip = async (req, res) => {
  const { vehicleId, driverId, cargo, origin, destination, distance, estimatedFuel } = req.body;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || vehicle.status !== "Available")
    return res.status(400).json({ message: "Vehicle not available" });

  if (cargo > vehicle.capacity)
    return res.status(400).json({ message: "Cargo exceeds capacity" });

  const driver = await prisma.driver.findUnique({ where: { id: driverId } });
  if (!driver || driver.status !== "Available")
    return res.status(400).json({ message: "Driver not available" });

  if (new Date(driver.licenseExpiry) < new Date())
    return res.status(400).json({ message: "License expired" });

  const trip = await prisma.trip.create({
    data: {
      cargo,
      origin,
      destination,
      distance,
      estimatedFuel,
      vehicleId,
      driverId,
      status: "Draft"
    }
  });

  res.json(trip);
};

// DISPATCH
exports.dispatchTrip = async (req, res) => {
  const trip = await prisma.trip.update({
    where: { id: Number(req.params.id) },
    data: { status: "Dispatched" }
  });

  await prisma.vehicle.update({
    where: { id: trip.vehicleId },
    data: { status: "On Trip" }
  });

  await prisma.driver.update({
    where: { id: trip.driverId },
    data: { status: "On Trip" }
  });

  res.json(trip);
};

// CANCEL
exports.cancelTrip = async (req, res) => {
  const trip = await prisma.trip.update({
    where: { id: Number(req.params.id) },
    data: { status: "Cancelled" }
  });

  res.json(trip);
};

// COMPLETE
exports.completeTrip = async (req, res) => {
  const { revenue, finalOdometer } = req.body;

  const trip = await prisma.trip.update({
    where: { id: Number(req.params.id) },
    data: { status: "Completed", revenue }
  });

  await prisma.vehicle.update({
    where: { id: trip.vehicleId },
    data: { status: "Available", odometer: finalOdometer }
  });

  await prisma.driver.update({
    where: { id: trip.driverId },
    data: { status: "Available" }
  });

  res.json(trip);
};

// GET TRIPS
exports.getTrips = async (req, res) => {
  const trips = await prisma.trip.findMany({
    include: { vehicle: true, driver: true }
  });

  res.json(trips);
};