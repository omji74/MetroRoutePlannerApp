import { useState } from "react";
import { LINE_CONFIG } from "../data/metroGraph";

export default function Timeline({ segments }) {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (!segments || segments.length === 0) return null;

  return (
    <div className="card journey-card">
      <div className="card-label">Step-by-Step Journey</div>
      <div className="timeline-container">
        {segments.map((seg, si) => {
          const cfg = LINE_CONFIG[seg.line] || { color: "#888" };
          const isLast = si === segments.length - 1;
          const stationCount = seg.stations.length;
          const isSegmentExpanded = !!expanded[si];

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

                  {/* Clickable expandable station list */}
                  {stationCount > 2 && (
                    <div 
                      className={`tl-via-list clickable ${isSegmentExpanded ? "expanded" : ""}`}
                      onClick={() => toggleExpand(si)}
                    >
                      {!isSegmentExpanded ? (
                        <div className="via-collapsed-view">
                          <span>via {seg.stations.slice(1, -1).slice(0, 3).join(" → ")}
                          {stationCount > 5 ? " …" : ""}</span>
                          <span className="expand-badge" style={{ color: cfg.color }}>
                            + Show all {stationCount - 2} stations
                          </span>
                        </div>
                      ) : (
                        <div className="via-expanded-view">
                          <div className="via-title" style={{ color: cfg.color }}>
                            Passing through {stationCount - 2} stations:
                          </div>
                          <div className="via-stations-vertical">
                            {seg.stations.slice(1, -1).map((st, sidx) => (
                              <div key={sidx} className="via-station-row">
                                <span className="via-dot" style={{ backgroundColor: cfg.color }} />
                                <span className="via-station-text">{st}</span>
                              </div>
                            ))}
                          </div>
                          <div className="collapse-badge">&minus; Collapse list</div>
                        </div>
                      )}
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
