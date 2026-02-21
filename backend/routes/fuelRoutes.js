const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const { addFuel, getFuel } = require("../controllers/fuelController");

router.post("/", auth, role(["Finance", "Manager"]), addFuel);
router.get("/", auth, getFuel);

module.exports = router;