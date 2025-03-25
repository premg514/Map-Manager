const mongoose = require("mongoose");

const MapSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    center: {
        type: [Number], // Array of numbers for latitude and longitude
        required: true,
    },
    zoom: {
        type: Number,
        required: true,
        default: 5, // Default zoom level
    },
});

const MapModel = mongoose.model("Map", MapSchema);

module.exports = MapModel;
