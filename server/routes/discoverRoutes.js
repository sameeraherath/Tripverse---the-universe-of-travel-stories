const express = require("express");
const router = express.Router();
const {
  getWeather,
  getFlights,
  getHotels,
  getAttractions,
  getCurrency,
  getAggregatedInfo,
} = require("../controllers/discoverController");
const authMiddleware = require("../middleware/authMiddleware");

// Individual endpoints (can be accessed without auth for flexibility)
router.get("/weather/:location", getWeather);
router.get("/flights/:from/:to/:date", getFlights);
router.get("/hotels/:location/:checkIn/:checkOut", getHotels);
router.get("/attractions/:location", getAttractions);
router.get("/currency/:base?", getCurrency);

// Aggregated endpoint (requires authentication)
router.get("/aggregate/:location", authMiddleware, getAggregatedInfo);

module.exports = router;

