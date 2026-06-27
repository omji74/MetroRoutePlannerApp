import { LINE_CONFIG } from "../data/metroGraph";

export default function Timeline({ segments }) {
  if (!segments || segments.length === 0) return null;

  return (
    <div className="card journey-card">
      <div className="card-label">Step-by-Step Journey</div>
      <div className="timeline-container">
        {segments.map((seg, si) => {
          const cfg = LINE_CONFIG[seg.line] || { color: "#888" };
          const isLast = si === segments.length - 1;
          const stationCount = seg.stations.length;

          return (
            <div key={si} className="timeline-group">
              {/* Segment */}
              <div className="tl-segment">
                <div className="tl-left">
                  <div
                    className="tl-circle"
                    style={{
                      borderColor: cfg.color,
                      color: cfg.color,
                      boxShadow: `0 0 12px ${cfg.color}44`,
                    }}
                  >
                    {si + 1}
                  </div>
                  {!isLast && <div className="tl-line" style={{ background: cfg.color }} />}
                </div>
                <div className="tl-body">
                  <div className="tl-station-name">{seg.stations[0]}</div>
                  
                  <div className="tl-line-badge-row">
                    <span
                      className="tl-line-badge"
                      style={{
                        background: cfg.color + "15",
                        color: cfg.color,
                        borderColor: cfg.color + "44",
                      }}
                    >
                      ● {seg.line}
                    </span>
                    <span className="tl-station-count">
                      {stationCount} station{stationCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  {stationCount > 2 && (
                    <div className="tl-via-list">
                      via {seg.stations.slice(1, -1).slice(0, 4).join(" → ")}
                      {stationCount > 6 ? " …" : ""}
                    </div>
                  )}

                  <div className="tl-station-name tl-destination" style={{ color: cfg.color }}>
                    {seg.stations[stationCount - 1]}
                  </div>
                </div>
              </div>

              {/* Interchange */}
              {!isLast && (
                <div className="tl-interchange">
                  <div className="tl-interchange-icon">🔄</div>
                  <div className="tl-interchange-details">
                    <div className="tl-interchange-title">
                      Change Line at {seg.stations[stationCount - 1]}
                    </div>
                    <div className="tl-interchange-text">
                      {seg.line} &rarr; {segments[si + 1]?.line} &middot; ~5–8 min platform change
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
