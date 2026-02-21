const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createTrip,
  dispatchTrip,
  cancelTrip,
  completeTrip,
  getTrips
} = require("../controllers/tripController");

router.post("/", auth, role(["Dispatcher"]), createTrip);
router.get("/", auth, getTrips);

router.patch("/:id/dispatch", auth, role(["Dispatcher"]), dispatchTrip);
router.patch("/:id/cancel", auth, role(["Dispatcher"]), cancelTrip);
router.patch("/:id/complete", auth, completeTrip);

module.exports = router;