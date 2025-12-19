import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = "79709c19ccdd420fad255610242403";

  const handleSearch = async () => {
    if (!location) return;
    setLoading(true);
    setError("");
    try {
      // Fetch weather
      const weatherRes = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`
      );
      const weatherData = await weatherRes.json();
      if (weatherData.error) {
        setError(weatherData.error.message);
        setWeather(null);
      } else {
        setWeather(weatherData);
      }

      // Fetch alerts
      const alertsRes = await fetch(
        `http://api.weatherapi.com/v1/alerts.json?key=${API_KEY}&q=${location}`
      );
      const alertsData = await alertsRes.json();
      setAlerts(alertsData.alerts || []);

      // Fetch forecast for next 3 days
      const forecastRes = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=no&alerts=no`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData.forecast ? forecastData.forecast.forecastday : []);
    } catch {
      setError("Failed to fetch weather, alerts, or forecast.");
      setWeather(null);
      setAlerts([]);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const getBackground = () => {
    if (!weather) return darkMode ? "#1a1a1a" : "linear-gradient(to right, #74ebd5, #ACB6E5)";
    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes("sun") || condition.includes("clear")) return darkMode ? "#333" : "linear-gradient(to right, #fceabb, #f8b500)";
    if (condition.includes("cloud")) return darkMode ? "#2c2c2c" : "linear-gradient(to right, #bdc3c7, #2c3e50)";
    if (condition.includes("rain") || condition.includes("drizzle")) return darkMode ? "#1a1a2e" : "linear-gradient(to right, #4e54c8, #8f94fb)";
    if (condition.includes("snow")) return darkMode ? "#2e2e3e" : "linear-gradient(to right, #83a4d4, #b6fbff)";
    if (condition.includes("thunder")) return darkMode ? "#1a1a1a" : "linear-gradient(to right, #373B44, #4286f4)";
    return darkMode ? "#1a1a1a" : "linear-gradient(to right, #74ebd5, #ACB6E5)";
  };

  const getFunnyTip = () => {
    if (!weather) return "";
    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes("sun") || condition.includes("clear")) return "Sunny! Time to show off those sunglasses 😎";
    if (condition.includes("cloud")) return "Cloudy skies. Maybe bring a light jacket ☁️";
    if (condition.includes("rain") || condition.includes("drizzle")) return "Oh oh.. you should bring an umbrella ☔";
    if (condition.includes("snow")) return "Snowy day! Build a snowman or stay cozy ❄️";
    if (condition.includes("thunder")) return "Thunderstorm alert! Stay safe indoors ⚡";
    if (condition.includes("mist") || condition.includes("fog")) return "Foggy! Drive carefully 🌫️";
    return "Weather is a mystery today! Enjoy your day 🌈";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: getBackground(),
        transition: "background 0.5s ease",
        color: darkMode ? "#fff" : "#000",
        paddingTop: "40px",
      }}
    >
      {/* Weather Card */}
      <div
        style={{
          background: darkMode ? "#222" : "rgba(255, 255, 255, 0.9)",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: darkMode ? "0 8px 20px rgba(0,0,0,0.6)" : "0 8px 20px rgba(0,0,0,0.2)",
          textAlign: "center",
          minWidth: "300px",
          position: "relative",
          marginRight: "20px",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: darkMode ? "#fff" : "#333" }}>Weather App</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: darkMode ? "#fff" : "#4A90E2",
            color: darkMode ? "#000" : "#fff",
            cursor: "pointer",
          }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <input
          type="text"
          placeholder="Enter a location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            padding: "10px",
            width: "80%",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "15px",
            backgroundColor: darkMode ? "#444" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        />
        <br />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#4A90E2",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Search
        </button>

        {loading && <p style={{ marginTop: "15px" }}>Loading...</p>}
        {error && <p style={{ marginTop: "15px", color: "red" }}>{error}</p>}

        <AnimatePresence>
          {weather && (
            <motion.div
              key={weather.location.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              style={{
                marginTop: "30px",
                padding: "20px",
                backgroundColor: darkMode ? "#333" : "#f0f4f8",
                borderRadius: "10px",
                boxShadow: darkMode ? "0 4px 10px rgba(0,0,0,0.5)" : "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>
                {weather.location.name}, {weather.location.country}
              </h2>
              <p style={{ fontSize: "18px", margin: "10px 0" }}>
                {weather.current.temp_c}°C - {weather.current.condition.text}
              </p>
              <p style={{ fontStyle: "italic", color: darkMode ? "#ddd" : "#555", marginBottom: "10px" }}>
                {getFunnyTip()}
              </p>
              <img src={weather.current.condition.icon} alt="weather icon" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forecast Mini Cards */}
        {forecast.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            {forecast.map((day, index) => {
              const chance = day.day.daily_chance_of_rain;
              let bgColor = darkMode ? "#444" : "#fff";

              if (chance <= 30) bgColor = darkMode ? "#2e7d32" : "#d0f0c0"; // green
              else if (chance <= 70) bgColor = darkMode ? "#f9a825" : "#fff9c4"; // yellow
              else bgColor = darkMode ? "#c62828" : "#ffcdd2"; // red

              // Determine icon based on condition
              const condition = day.day.condition.text.toLowerCase();
              let icon = "🌈"; // default
              if (condition.includes("rain") || condition.includes("drizzle")) icon = "🌧️";
              else if (condition.includes("snow")) icon = "❄️";
              else if (condition.includes("sun") || condition.includes("clear")) icon = "☀️";
              else if (condition.includes("cloud")) icon = "☁️";
              else if (condition.includes("thunder")) icon = "⚡";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  style={{
                    background: bgColor,
                    padding: "10px",
                    borderRadius: "10px",
                    textAlign: "center",
                    width: "90px",
                    boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <h4>{new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}</h4>
                  <p style={{ fontSize: "18px", margin: "5px 0" }}>{icon}</p>
                  <p style={{ fontSize: "12px", margin: "5px 0" }}>Max Wind</p>
                  <p style={{ fontSize: "14px", margin: "0" }}>{day.day.maxwind_mph} mph</p>
                  <p style={{ fontSize: "14px", margin: "0" }}>{day.day.maxwind_kph} kph</p>
                  <p style={{ fontSize: "12px", marginTop: "5px" }}>Chance Rain: {chance}%</p>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Alerts Panel */}
      <AnimatePresence>
        {weather && (
          <motion.div
            key={weather.location.name + "-alerts"}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
            style={{
              background: darkMode ? "#222" : "rgba(255,255,255,0.9)",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: darkMode ? "0 8px 20px rgba(0,0,0,0.6)" : "0 8px 20px rgba(0,0,0,0.2)",
              minWidth: "250px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>Weather Alerts</h2>
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div key={index} style={{ marginBottom: "15px", textAlign: "left" }}>
                  <strong>{alert.headline}</strong>
                  <p style={{ fontSize: "14px", margin: "5px 0" }}>{alert.msg}</p>
                  <p style={{ fontSize: "12px", color: darkMode ? "#aaa" : "#555" }}>
                    From: {alert.effective} - To: {alert.expires}
                  </p>
                </div>
              ))
            ) : (
              <p>No alerts for this location.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
