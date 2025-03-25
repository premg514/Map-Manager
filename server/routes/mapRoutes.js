// routes/mapRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const MapModel = require('../models/Map')
const router = express.Router();

router.post("/save-map", authMiddleware, async (req, res) => {
  try {
    const { title, description, center, zoom } = req.body;

    if (!Array.isArray(center) || center.length !== 2 || typeof zoom !== "number") {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const mapData = new MapModel({ title, description, center, zoom });
    await mapData.save();

    res.status(201).json({ message: "Map data saved successfully", mapData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});




router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const mapData = await MapModel.findById(id);
    if (!mapData) {
      return res.status(404).json({ message: "Map data not found" });
    }

    res.status(200).json(mapData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMap = await MapModel.findByIdAndDelete(id);
    if (!deletedMap) {
      return res.status(404).json({ message: "Map data not found" });
    }

    res.status(200).json({ message: "Map data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});




module.exports = router;
