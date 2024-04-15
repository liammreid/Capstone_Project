const WeatherData = require("../models/Weather");

exports.getWeatherData = async (req, res, next) => {
  try {
    const weatherData = await WeatherData.find().sort({ date: "asc" });
    res.render("weather", { pageTitle: "Weather Forecast", weatherData, path: req.baseUrl });
  } catch (e) {
    console.error("Error fetching weather data: ", e);
    res.status(500).render("error", { pageTitle: "Error", message: "Internal server error", path: req.baseUrl });
  }
};
