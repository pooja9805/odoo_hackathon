const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  addMaintenance,
  getMaintenance
} = require("../controllers/maintenanceController");

router.post("/", auth, role(["Manager"]), addMaintenance);
router.get("/", auth, getMaintenance);

module.exports = router;