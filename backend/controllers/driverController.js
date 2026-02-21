const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* GET ALL DRIVERS */

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

/* CREATE DRIVER */

exports.createDriver = async (req, res) => {
  try {
    const {
      name,
      licenseNumber,
      licenseExpiry
    } = req.body;

    if (!name || !licenseNumber || !licenseExpiry) {
      return res.status(400).json({ message: "All fields required" });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseExpiry: new Date(licenseExpiry),
        completionRate: 0,
        safetyScore: 100,
        complaints: 0,
        status: "OnDuty"
      }
    });

    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create driver" });
  }
};

/* UPDATE STATUS */

exports.updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await prisma.driver.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json({ message: "Status updated" });
  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
};

/* DELETE DRIVER */

exports.deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.driver.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Driver removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete driver" });
  }
};