import Timeline from "./Timeline";

function RouteWeatherAlert({ weather, segments }) {
  const lineNames = Array.from(new Set(segments.map(s => s.line)));
  const lineList = lineNames.join(", ");
  
  let alertText = "";
  let alertClass = "";
  let icon = "";

  if (weather.key === "rain") {
    alertClass = "alert-rain";
    icon = "⛈️";
    alertText = `Speed limits are active on elevated sections of ${lineList} due to heavy rainfall. Transfer platforms might be slippery. Allow an extra 5-10 minutes for your trip.`;
  } else if (weather.key === "cold") {
    alertClass = "alert-cold";
    icon = "🌫️";
    alertText = `Low visibility safety protocols are active on ${lineList} due to dense morning fog. Safety speed restrictions are in effect. Allow an extra 10-15 minutes.`;
  } else if (weather.key === "summer") {
    alertClass = "alert-summer";
    icon = "☀️";
    alertText = `Outdoor temperature is high (${weather.temp}°C). Elevators and above-ground platforms along ${lineList} might feel warm. Carry water to stay hydrated.`;
  }

  if (!alertText) return null;

  return (
    <div className={`route-weather-alert ${alertClass}`}>
      <span className="route-weather-alert-icon">{icon}</span>
      <div>
        <strong style={{ display: "block", marginBottom: "4px" }}>Weather Impact Advisory:</strong>
        {alertText}
      </div>
    </div>
  );
}

export default function RouteResult({ result, weather }) {
  if (!result) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🚇</div>
        <div className="empty-title">Plan Your Journey</div>
        <div className="empty-desc">
          Select a source and destination station to find the shortest route, total travel time, transfers, and fare.
        </div>
      </div>
    );
  }

  const tokenFare = result.fare;
  const smartCardSavings = Math.round(tokenFare * 0.1);
  const virtualCardSavings = Math.round(tokenFare * 0.2);

  const smartCardFare = tokenFare - smartCardSavings;
  const virtualCardFare = tokenFare - virtualCardSavings;

  return (
    <div className="result-container">
      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-val">
            {result.totalTime}
            <span className="stat-unit"> min</span>
          </div>
          <div className="stat-lbl">Total Time</div>
        </div>

        <div className="stat-card">
          <div className="stat-val">{result.stations}</div>
          <div className="stat-lbl">Stations</div>
        </div>

        <div className="stat-card">
          <div className="stat-val">{result.changes}</div>
          <div className="stat-lbl">Transfers</div>
        </div>

        <div className="stat-card">
          <div className="stat-val">
            ₹{virtualCardFare}
          </div>
          <div className="stat-lbl">Best Fare</div>
        </div>
      </div>

      {/* Weather Route Advisory */}
      {weather && weather.key !== "pleasant" && (
        <RouteWeatherAlert weather={weather} segments={result.segments} />
      )}

      {/* Fare Comparison Glass Cards */}
      <div className="card fare-card">
        <div className="card-label">🎫 Fare Options & Discounts</div>
        <div className="fare-grid">
          <div className="fare-option-card">
            <div className="fare-name">Single Token</div>
            <div className="fare-price">₹{tokenFare}</div>
            <div className="fare-desc">Standard fare</div>
          </div>
          
          <div className="fare-option-card">
            <div className="fare-name">Physical Smart Card</div>
            <div className="fare-price">₹{smartCardFare}</div>
            <div className="fare-desc text-green">Save ₹{smartCardSavings} (10%)</div>
          </div>

          <div className="fare-option-card active-card">
            <div className="fare-tag">🔥 Virtual Smart Card</div>
            <div className="fare-name">Virtual Smart Card</div>
            <div className="fare-price">₹{virtualCardFare}</div>
            <div className="fare-desc text-green-glow">Save ₹{virtualCardSavings} (20% Off)</div>
          </div>
        </div>
      </div>

      {/* Timeline Journey Card */}
      <Timeline segments={result.segments} />
    </div>
  );
}
