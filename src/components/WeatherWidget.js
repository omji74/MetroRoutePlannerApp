import React, { useState, useEffect } from "react";
import "../styles/weather.css";

// Define the simulated weather conditions for testing
const PRESETS = {
  pleasant: {
    key: "pleasant",
    name: "Pleasant Spring",
    temp: 24,
    feelsLike: 24,
    humidity: 50,
    wind: 10,
    rainProb: 10,
    desc: "Clear Sky / Pleasant",
    icon: "🍃",
    advisory: "🍃 Weather is optimal for travel. All lines are operating on normal schedule. Enjoy your journey!",
    advisoryClass: "advisory-pleasant"
  },
  rain: {
    key: "rain",
    name: "Monsoon Rain",
    temp: 28,
    feelsLike: 32,
    humidity: 88,
    wind: 18,
    rainProb: 95,
    desc: "Heavy Monsoon Rain",
    icon: "⛈️",
    advisory: "☔ Elevated tracks are wet. Speed restrictions active on Red & Blue Lines. Boarding queues might be longer. Carry an umbrella.",
    advisoryClass: "advisory-rain"
  },
  cold: {
    key: "cold",
    name: "Winter Fog",
    temp: 9,
    feelsLike: 7,
    humidity: 95,
    wind: 8,
    rainProb: 5,
    desc: "Dense Morning Fog",
    icon: "🌫️",
    advisory: "🌫️ Dense fog in NCR. Visibility < 50m. Speed limit of 30 km/h on all elevated line sections. Expect delays of 10-15 minutes.",
    advisoryClass: "advisory-cold"
  },
  summer: {
    key: "summer",
    name: "Summer Heatwave",
    temp: 43,
    feelsLike: 47,
    humidity: 35,
    wind: 14,
    rainProb: 0,
    desc: "Scorching Heatwave",
    icon: "☀️",
    advisory: "☀️ Extreme Heatwave. Outdoor temp is 43°C. Station cooling is operating at maximum capacity. Stay hydrated. Carry a water bottle.",
    advisoryClass: "advisory-summer"
  }
};

export default function WeatherWidget({ onWeatherChange }) {
  const [mode, setMode] = useState("live"); // 'live' or preset keys
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(PRESETS.pleasant);
  
  // HUD states
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  const isLive = mode === "live";

  // Clock effect
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      setDateStr(now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Map live WMO weather codes to our preset modes
  const mapWmoCodeToCondition = (code, temp) => {
    if (temp >= 36) return "summer";
    if (temp <= 16) return "cold";

    // 51-67, 80-82, 95-99 are rain
    if (
      (code >= 51 && code <= 67) ||
      (code >= 80 && code <= 82) ||
      (code >= 95 && code <= 99)
    ) {
      return "rain";
    }

    // 45, 48 are fog
    if (code === 45 || code === 48) {
      return "cold";
    }

    return "pleasant";
  };

  const getWmoDescription = (code) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code === 45 || code === 48) return "Foggy";
    if (code >= 51 && code <= 55) return "Light Drizzle";
    if (code >= 61 && code <= 65) return "Rainy";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95 && code <= 99) return "Thunderstorms";
    return "Partly Cloudy";
  };

  const getWmoIcon = (condKey) => {
    switch (condKey) {
      case "rain":
        return "🌧️";
      case "cold":
        return "🌫️";
      case "summer":
        return "☀️";
      default:
        return "🍃";
    }
  };

  // Fetch live weather data for New Delhi (28.6139° N, 77.2090° E)
  const fetchLiveWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,precipitation_probability_max&timezone=Asia%2FKolkata"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
      }
      const data = await response.json();
      
      const temp = Math.round(data.current.temperature_2m);
      const feelsLike = Math.round(data.current.apparent_temperature);
      const humidity = data.current.relative_humidity_2m;
      const wind = Math.round(data.current.wind_speed_10m);
      const wmoCode = data.current.weather_code;
      const rainProb = data.daily.precipitation_probability_max[0] || 0;

      const conditionKey = mapWmoCodeToCondition(wmoCode, temp);
      const presetTemplate = PRESETS[conditionKey];

      const liveResult = {
        key: conditionKey,
        name: "New Delhi (Live)",
        temp,
        feelsLike,
        humidity,
        wind,
        rainProb,
        desc: getWmoDescription(wmoCode),
        icon: getWmoIcon(conditionKey),
        advisory: presetTemplate.advisory,
        advisoryClass: presetTemplate.advisoryClass
      };

      setWeatherData(liveResult);
      if (onWeatherChange) {
        onWeatherChange(liveResult);
      }
    } catch (err) {
      console.error(err);
      setError("Network offline. Defaulting to Delhi Spring weather.");
      setWeatherData(PRESETS.pleasant);
      if (onWeatherChange) {
        onWeatherChange(PRESETS.pleasant);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to load live data or change presets
  useEffect(() => {
    if (isLive) {
      fetchLiveWeather();
    } else {
      const simulated = PRESETS[mode];
      setWeatherData(simulated);
      if (onWeatherChange) {
        onWeatherChange(simulated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Generate rain drops dynamically
  const renderRaindrops = () => {
    const drops = [];
    for (let i = 0; i < 15; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const duration = 0.8 + Math.random() * 0.6;
      drops.push(
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
          }}
        />
      );
    }
    return <div className="weather-rain-container">{drops}</div>;
  };

  const getThemeClass = () => {
    switch (weatherData.key) {
      case "rain":
        return "weather-rain";
      case "cold":
        return "weather-cold";
      case "summer":
        return "weather-summer";
      default:
        return "weather-pleasant";
    }
  };

  return (
    <div 
      className="weather-hud-container"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Compact Pill */}
      <div 
        className={`weather-hud-pill ${isLive ? "" : "simulated"}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>🕒 {timeStr || "00:00:00"} • {dateStr}</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>{weatherData.icon} {weatherData.temp}°C</span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span>{weatherData.key === "pleasant" && mode === "live" ? "Delhi" : weatherData.name.replace(" (Live)", "")}</span>
        <span className="pulse-dot" />
      </div>

      {/* Expanded Details Card */}
      {isExpanded && (
        <div className="weather-hud-details">
          <div className={`weather-card ${getThemeClass()}`} style={{ marginBottom: 0 }}>
            {/* Background visual graphics */}
            {weatherData.key === "rain" && renderRaindrops()}
            {weatherData.key === "cold" && (
              <div className="weather-mist-container">
                <div className="mist-cloud mist-1" />
                <div className="mist-cloud mist-2" />
                <div className="mist-cloud mist-3" />
              </div>
            )}
            {weatherData.key === "summer" && (
              <div className="weather-sun-container">
                <div className="sun-glow" />
                <div className="sun-ray" />
              </div>
            )}

            {/* Card Header */}
            <div className="card-label">Commuter Weather Status</div>
            
            {/* Mode status indicator */}
            <div className={`weather-badge-status ${isLive ? "" : "simulated"}`}>
              <span className="weather-status-dot" />
              {isLive ? "Live API" : "Simulated"}
            </div>

            {/* Main Info */}
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: "8px" }}>
                <div className="loader" style={{ width: "32px", height: "32px", borderWidth: "3px" }} />
                <div style={{ fontSize: "11px", fontWeight: "600", opacity: 0.8 }}>Updating live Delhi weather...</div>
              </div>
            ) : error && isLive ? (
              <div style={{ padding: "8px 0", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#fca5a5", fontWeight: "600" }}>⚠️ {error}</div>
                <button 
                  onClick={fetchLiveWeather} 
                  className="weather-sim-pill" 
                  style={{ marginTop: "8px", background: "rgba(255,255,255,0.15)", border: "none" }}
                >
                  Retry Fetch
                </button>
              </div>
            ) : (
              <>
                <div className="weather-info-main">
                  <div className="weather-temp-container">
                    <div className="weather-temp">{weatherData.temp}°C</div>
                    <div className="weather-feels">Feels like {weatherData.feelsLike}°C</div>
                    <div className="weather-desc">{weatherData.desc}</div>
                  </div>
                  <div className="weather-icon-large">{weatherData.icon}</div>
                </div>

                {/* Quick Metrics */}
                <div className="weather-details-row">
                  <div className="weather-detail-item">
                    <span className="weather-detail-val">{weatherData.humidity}%</span>
                    <span className="weather-detail-lbl">Humidity</span>
                  </div>
                  <div className="weather-detail-item">
                    <span className="weather-detail-val">{weatherData.wind} km/h</span>
                    <span className="weather-detail-lbl">Wind</span>
                  </div>
                  <div className="weather-detail-item">
                    <span className="weather-detail-val">{weatherData.rainProb}%</span>
                    <span className="weather-detail-lbl">Rain Prob</span>
                  </div>
                </div>

                {/* Expected Rain Highlight */}
                {weatherData.rainProb >= 40 && weatherData.key !== "rain" && (
                  <div className="expected-rain-banner">
                    <span>☔</span>
                    <span><strong>Rain Expected:</strong> {weatherData.rainProb}% chance today. Carry an umbrella!</span>
                  </div>
                )}

                {/* Advisory Notice */}
                <div className={`weather-advisory ${weatherData.advisoryClass}`}>
                  {weatherData.advisory}
                </div>
              </>
            )}

            {/* Simulator Toggles */}
            <div className="weather-sim-controller">
              <div className="weather-sim-title">Test Weather Scenarios</div>
              <div className="weather-sim-pills">
                <button
                  onClick={(e) => { e.stopPropagation(); setMode("live"); }}
                  className={`weather-sim-pill ${isLive ? "active" : ""}`}
                >
                  Live API
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMode("rain"); }}
                  className={`weather-sim-pill ${mode === "rain" ? "active" : ""}`}
                >
                  Monsoon
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMode("cold"); }}
                  className={`weather-sim-pill ${mode === "cold" ? "active" : ""}`}
                >
                  Winter Fog
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMode("summer"); }}
                  className={`weather-sim-pill ${mode === "summer" ? "active" : ""}`}
                >
                  Heatwave
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMode("pleasant"); }}
                  className={`weather-sim-pill ${mode === "pleasant" ? "active" : ""}`}
                >
                  Pleasant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
