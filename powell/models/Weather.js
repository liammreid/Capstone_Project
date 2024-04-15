const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    max_temp: {
        type: String,
        required: true,
    },
    min_temp: {
        type: String,
        required: true,
    },
    avg_wind_speed: {
        type: String,
        required: true,
    },
    haze: {
        type: String,
        required: true,
    },
    thunderstorm: {
        type: String,
        required: true,
    },
    short_forecast: {
        type: String,
        required: true,
    },
    imageURL: {type: String
    },
    optimal_boating_day: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Weather', weatherSchema);