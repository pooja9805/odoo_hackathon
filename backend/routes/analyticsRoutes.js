const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getAnalytics, exportCSV } = require("../controllers/analyticsController");

router.get("/", auth, role(["Finance"]), getAnalytics);
router.get("/export", auth, role(["Finance"]), exportCSV);

module.exports = router;