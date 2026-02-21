const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getKPIs } = require("../controllers/dashboardController");

router.get("/", auth, getKPIs);

module.exports = router;