const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createVehicle = async (req, res) => {
  const { model, type, licensePlate, capacity, odometer } = req.body;

  const vehicle = await prisma.vehicle.create({
    data: { model, type, licensePlate, capacity, odometer }
  });

  res.json(vehicle);
};

exports.updateVehicleStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const vehicle = await prisma.vehicle.update({
    where: { id: Number(id) },
    data: { status }
  });

  res.json(vehicle);
};

exports.updateVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: Number(id) },
      data: req.body
    });

    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: "Vehicle update failed" });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.update({
    where: { id: Number(id) },
    data: { status: "Retired" }
  });

  res.json(vehicle);
};

exports.getVehicles = async(req,res)=>{
 const {type,status}=req.query;
 const vehicles = await prisma.vehicle.findMany({
  where:{
   ...(type && {type}),
   ...(status && {status})
  }
 });
 res.json(vehicles);
};