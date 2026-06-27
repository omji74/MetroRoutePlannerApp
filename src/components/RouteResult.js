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
