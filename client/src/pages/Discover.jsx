import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import discoverApi from "../utils/discoverApi";
import {
  Loader2,
  MapPin,
  Cloud,
  Star,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const Discover = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handleSearch = async () => {
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    if (!token) {
      toast.error("Please login to use Discover feature");
      navigate("/login");
      return;
    }

    // Show coming soon message
    toast.info(
      "This feature is coming soon! Stay tuned for exciting travel insights.",
      {
        position: "top-center",
        autoClose: 3000,
      }
    );
    return;

    // Original code below (commented out for future use)
    // setLoading(true);
    // try {
    //   const result = await discoverApi.getAggregatedInfo(location.trim());
    //   setData(result);
    //   toast.success(`Travel information for ${location} loaded successfully!`);
    // } catch (error) {
    //   console.error("Error fetching travel info:", error);
    //   toast.error(
    //     error.response?.data?.message || "Failed to fetch travel information"
    //   );
    //   setData(null);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-white font-medium border border-gray-200 mb-4">
            <MapPin className="w-4 h-4" fill="currentColor" />
            <span>Tripverse Discover</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-dark mb-4">
            Explore Your Destination
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Get comprehensive travel information including weather, attractions,
            and currency rates
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter location (e.g., Paris, France or Tokyo, Japan)"
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-lg"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !location.trim()}
              className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-full border border-gray-200 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5" />
                  <span>Discover</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
          </div>
        )}

        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weather Card */}
            {data.weather && !data.weather.error && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-dark">Weather</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-gray-dark">
                      {data.weather.location}, {data.weather.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Temperature</span>
                    <span className="text-3xl font-bold text-orange-500">
                      {Math.round(data.weather.temperature)}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Feels Like</span>
                    <span className="font-semibold text-gray-dark">
                      {Math.round(data.weather.feelsLike)}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Condition</span>
                    <span className="font-semibold text-gray-dark capitalize">
                      {data.weather.description}
                    </span>
                  </div>
                  {data.weather.humidity && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Humidity</span>
                      <span className="font-semibold text-gray-dark">
                        {data.weather.humidity}%
                      </span>
                    </div>
                  )}
                  {data.weather.windSpeed && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Wind Speed</span>
                      <span className="font-semibold text-gray-dark">
                        {data.weather.windSpeed} m/s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attractions Card */}
            {data.attractions && !data.attractions.error && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Star
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-dark">
                    Top Attractions
                  </h2>
                </div>
                {data.attractions.attractions &&
                data.attractions.attractions.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.attractions.attractions.map((attraction, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-dark mb-1">
                          {attraction.name}
                        </div>
                        {attraction.rating && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star
                              className="w-4 h-4 text-yellow-500"
                              fill="currentColor"
                            />
                            <span>{attraction.rating}</span>
                            {attraction.userRatingsTotal && (
                              <span className="text-gray-500">
                                ({attraction.userRatingsTotal} reviews)
                              </span>
                            )}
                          </div>
                        )}
                        {attraction.address && (
                          <div className="text-sm text-gray-500 mt-1">
                            {attraction.address}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No attractions found for this location</p>
                  </div>
                )}
              </div>
            )}

            {/* Currency Card */}
            {data.currency && !data.currency.error && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-dark">
                    Currency Exchange
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Base Currency</span>
                    <span className="font-semibold text-gray-dark">
                      {data.currency.base}
                    </span>
                  </div>
                  {data.currency.date && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold text-gray-dark text-sm">
                        {data.currency.date}
                      </span>
                    </div>
                  )}
                  {data.currency.rates && (
                    <div className="mt-4">
                      <div className="text-sm font-semibold text-gray-600 mb-2">
                        Popular Exchange Rates:
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {Object.entries(data.currency.rates)
                          .filter(([key]) =>
                            [
                              "EUR",
                              "GBP",
                              "JPY",
                              "CAD",
                              "AUD",
                              "INR",
                              "CNY",
                            ].includes(key)
                          )
                          .slice(0, 7)
                          .map(([currency, rate]) => (
                            <div
                              key={currency}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <span className="font-medium text-gray-dark">
                                {currency}
                              </span>
                              <span className="text-gray-600">
                                {rate.toFixed(4)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Messages */}
            {data.weather?.error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    Weather data unavailable
                  </span>
                </div>
              </div>
            )}
            {data.attractions?.error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    Attractions data unavailable
                  </span>
                </div>
              </div>
            )}
            {data.currency?.error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    Currency data unavailable
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🌍</div>
            <h3 className="text-2xl font-bold text-gray-dark mb-3">
              Discover Travel Information
            </h3>
            <p className="text-gray-medium mb-6 max-w-md mx-auto">
              Enter a location above to get comprehensive travel information
              including weather conditions, popular attractions, and currency
              exchange rates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
