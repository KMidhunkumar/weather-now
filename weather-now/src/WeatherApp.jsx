import { useState } from "react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setWeather(null);

      // Step 1: Get city coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        setWeather({ error: "City not found" });
        setLoading(false);
        return;
      }
      const { latitude, longitude } = geoData.results[0];

      // Step 2: Fetch current weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData.current_weather);
      setLoading(false);
    } catch (error) {
      setWeather({ error: "Failed to fetch weather" });
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px", fontFamily: "Arial" }}>
      <h1>🌦 Weather Now</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={fetchWeather} disabled={!city || loading}>
        {loading ? "Loading..." : "Check"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {weather && !weather.error && (
          <>
            <p>🌡 Temperature: {weather.temperature}°C</p>
            <p>💨 Wind: {weather.windspeed} km/h</p>
            <p>🧭 Direction: {weather.winddirection}°</p>
          </>
        )}
        {weather?.error && <p style={{ color: "red" }}>{weather.error}</p>}
      </div>
    </div>
  );
}
