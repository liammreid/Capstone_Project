const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Route to fetch all weather data, sorted by date
router.get('/', weatherController.getWeatherData);



module.exports = router;
