const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// Cache for frequently accessed data (simple in-memory cache)
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Helper function to get cached data
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

// Helper function to set cached data
const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Get weather information
const getWeather = async (req, res) => {
  const { location } = req.params;
  
  if (!location) {
    return res.status(400).json({ message: "Location is required" });
  }

  const cacheKey = `weather_${location}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.WEATHER_API_KEY}&units=metric`,
      { timeout: 5000 }
    );
    
    const weatherData = {
      location: response.data.name,
      country: response.data.sys?.country,
      temperature: response.data.main?.temp,
      feelsLike: response.data.main?.feels_like,
      description: response.data.weather?.[0]?.description,
      icon: response.data.weather?.[0]?.icon,
      humidity: response.data.main?.humidity,
      windSpeed: response.data.wind?.speed,
      pressure: response.data.main?.pressure,
    };

    setCachedData(cacheKey, weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather:", error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};

// Get flights information
const getFlights = async (req, res) => {
  const { from, to, date } = req.params;
  
  if (!from || !to || !date) {
    return res.status(400).json({ message: "From, to, and date are required" });
  }

  // For now, return a placeholder since flight APIs require complex authentication
  // In production, integrate with Amadeus API or similar
  res.json({
    message: "Flight search functionality coming soon",
    from,
    to,
    date,
  });
};

// Get hotels information
const getHotels = async (req, res) => {
  const { location, checkIn, checkOut } = req.params;
  
  if (!location || !checkIn || !checkOut) {
    return res.status(400).json({ message: "Location, check-in, and check-out dates are required" });
  }

  // For now, return a placeholder since hotel APIs require complex authentication
  // In production, integrate with Booking.com API or similar
  res.json({
    message: "Hotel search functionality coming soon",
    location,
    checkIn,
    checkOut,
  });
};

// Get attractions information
const getAttractions = async (req, res) => {
  const { location } = req.params;
  
  if (!location) {
    return res.status(400).json({ message: "Location is required" });
  }

  const cacheKey = `attractions_${location}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    // Using Google Places API Text Search
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+${encodeURIComponent(location)}&key=${process.env.ATTRACTIONS_API_KEY}`,
      { timeout: 5000 }
    );

    if (response.data.status === "ZERO_RESULTS") {
      return res.json({ attractions: [], location });
    }

    const attractions = response.data.results?.slice(0, 10).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      types: place.types,
      placeId: place.place_id,
    })) || [];

    const attractionsData = { attractions, location };
    setCachedData(cacheKey, attractionsData);
    res.json(attractionsData);
  } catch (error) {
    console.error("Error fetching attractions:", error.message);
    // Fallback: return empty attractions if API fails
    res.json({ attractions: [], location, error: "Failed to fetch attractions" });
  }
};

// Get currency exchange rates
const getCurrency = async (req, res) => {
  const { base } = req.params;
  const baseCurrency = base || "USD";
  
  const cacheKey = `currency_${baseCurrency}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    // Using ExchangeRate-API (free tier)
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      { timeout: 5000 }
    );

    const currencyData = {
      base: response.data.base,
      date: response.data.date,
      rates: response.data.rates,
    };

    setCachedData(cacheKey, currencyData);
    res.json(currencyData);
  } catch (error) {
    console.error("Error fetching currency:", error.message);
    res.status(500).json({ message: "Failed to fetch currency data" });
  }
};

// Get aggregated travel information
const getAggregatedInfo = async (req, res) => {
  const { location } = req.params;
  
  if (!location) {
    return res.status(400).json({ message: "Location is required" });
  }

  const cacheKey = `aggregate_${location}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    // Make parallel API calls for better performance
    const [weatherResult, attractionsResult, currencyResult] = await Promise.allSettled([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.WEATHER_API_KEY}&units=metric`,
        { timeout: 5000 }
      ).then(res => ({
        location: res.data.name,
        country: res.data.sys?.country,
        temperature: res.data.main?.temp,
        feelsLike: res.data.main?.feels_like,
        description: res.data.weather?.[0]?.description,
        icon: res.data.weather?.[0]?.icon,
        humidity: res.data.main?.humidity,
        windSpeed: res.data.wind?.speed,
      })).catch(err => ({ error: "Weather data unavailable" })),
      
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist+attractions+in+${encodeURIComponent(location)}&key=${process.env.ATTRACTIONS_API_KEY}`,
        { timeout: 5000 }
      ).then(res => {
        if (res.data.status === "ZERO_RESULTS") {
          return { attractions: [] };
        }
        return {
          attractions: res.data.results?.slice(0, 5).map((place) => ({
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
          })) || [],
        };
      }).catch(err => ({ attractions: [], error: "Attractions data unavailable" })),
      
      axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`,
        { timeout: 5000 }
      ).then(res => ({
        base: res.data.base,
        date: res.data.date,
        rates: res.data.rates,
      })).catch(err => ({ error: "Currency data unavailable" })),
    ]);

    const aggregatedData = {
      location,
      timestamp: new Date().toISOString(),
      weather: weatherResult.status === "fulfilled" ? weatherResult.value : { error: weatherResult.reason?.message || "Weather data unavailable" },
      attractions: attractionsResult.status === "fulfilled" ? attractionsResult.value : { attractions: [], error: "Attractions data unavailable" },
      currency: currencyResult.status === "fulfilled" ? currencyResult.value : { error: "Currency data unavailable" },
    };

    setCachedData(cacheKey, aggregatedData);
    res.json(aggregatedData);
  } catch (error) {
    console.error("Error aggregating travel info:", error.message);
    res.status(500).json({ message: "Failed to aggregate travel information" });
  }
};

module.exports = {
  getWeather,
  getFlights,
  getHotels,
  getAttractions,
  getCurrency,
  getAggregatedInfo,
};

