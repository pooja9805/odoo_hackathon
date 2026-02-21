const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createVehicle,
  getVehicles,
  updateVehicleStatus,
  deleteVehicle,
  updateVehicle
} = require("../controllers/vehicleController");

router.post("/", auth, role(["Manager"]), createVehicle);
router.get("/", auth, getVehicles);
router.patch("/:id/status", auth, role(["Manager"]), updateVehicleStatus);
router.put("/:id", auth, role(["Manager"]), updateVehicle);
router.delete("/:id", auth, role(["Manager"]), deleteVehicle);

module.exports = router;