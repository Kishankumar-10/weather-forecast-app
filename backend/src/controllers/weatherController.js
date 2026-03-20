const weatherService = require('../services/weatherService');

const getWeather = async (req, res) => {
  let { city } = req.query;

  // 1. Normalize input: Trim and Lowercase
  if (city) {
    city = city.trim().toLowerCase();
  }

  // 4. Debugging log: Log received city input
  console.log(`[Controller] Received city input: "${city}"`);

  // 2. Validate input: If city is empty
  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

  try {
    const weatherData = await weatherService.fetchWeather(city);
    res.json(weatherData);
  } catch (error) {
    // 3. Improve error handling: If OpenWeather returns 404
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "City not found. Please check spelling." });
    }

    // 5. Do NOT crash the server on other errors
    console.error(`[Controller] Error fetching weather for "${city}":`, error.message);
    res.status(500).json({ message: "Error fetching weather data" });
  }
};

module.exports = {
  getWeather
};
