const router = require("express").Router();
const ctrl = require("../controllers/driverController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, ctrl.getDrivers);
router.post("/", auth, ctrl.createDriver);
router.patch("/:id/status", auth, ctrl.updateDriverStatus);
router.delete("/:id", auth, ctrl.deleteDriver);

module.exports = router;