// routes/dashboardRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const MapModel = require('../models/Map')
const router = express.Router();



router.get("/", authMiddleware, async (req, res) => {
  try {
    const mapData = await MapModel.find(); 
    if (!mapData) {
      return res.status(404).json({ message: "No map data found" });
    }

    res.status(200).json(mapData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
