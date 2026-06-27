import Timeline from "./Timeline";

export default function RouteResult({ result }) {
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

  // Calculate smart card savings (10% discount)
  const smartCardSavings = Math.round(result.fare * 0.1);

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
            ₹{result.fare}
          </div>
          <div className="stat-lbl">Single Fare</div>
        </div>
      </div>

      {/* Smart Card Promo */}
      <div className="savings-badge">
        🎫 Smart Card Fare: ₹{result.fare - smartCardSavings} &middot; Save 10% (₹{smartCardSavings}) using DMRC Smart Card
      </div>

      {/* Timeline Journey Card */}
      <Timeline segments={result.segments} />
    </div>
  );
}
