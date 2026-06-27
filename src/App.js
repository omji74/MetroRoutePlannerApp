import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import SearchBox from "./components/SearchBox";
import RouteResult from "./components/RouteResult";
import MetroScene3D from "./components/MetroScene3D";
import InstallPWA from "./components/InstallPWA";
import MetroLines from "./components/MetroLines";
import { allStations } from "./data/metroGraph";
import { dijkstra } from "./algorithm/dijkstra";
import useTheme from "./hooks/useTheme";
import "./styles/global.css";

export default function App() {
  const [src, setSrc] = useState("");
  const [dst, setDst] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("planner");
  const [isPeak, setIsPeak] = useState(false);
  const { theme, toggle } = useTheme();
  
  // Visitor counter state
  const [visitorCount, setVisitorCount] = useState(1284593);
  const [activeCommuters, setActiveCommuters] = useState(48);

  // Detect peak travel hours (8-11 AM and 5-9 PM)
  useEffect(() => {
    const hour = new Date().getHours();
    setIsPeak((hour >= 8 && hour < 11) || (hour >= 17 && hour < 21));
  }, []);

  // Visitor counter logic
  useEffect(() => {
    const savedCount = localStorage.getItem("dmrc-visitor-count");
    let count = savedCount ? parseInt(savedCount, 10) : 1284593;
    
    count += 1;
    setVisitorCount(count);
    localStorage.setItem("dmrc-visitor-count", count.toString());

    // Simulated live updates every 4 seconds
    const interval = setInterval(() => {
      setVisitorCount(prev => {
        const next = prev + Math.floor(Math.random() * 3) + 1;
        localStorage.setItem("dmrc-visitor-count", next.toString());
        return next;
      });
      setActiveCommuters(Math.floor(Math.random() * 25) + 40); // 40-65 live active
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Calculate route with a small artificial delay to show Dijkstra processing
  const handleSearch = useCallback(() => {
    if (!src || !dst || src === dst) return;
    setLoading(true);
    setTimeout(() => {
      setResult(dijkstra(src, dst));
      setLoading(false);
    }, 600);
  }, [src, dst]);

  const swap = () => {
    const temp = src;
    setSrc(dst);
    setDst(temp);
  };

  return (
    <div className={`app-container ${theme}`}>
      {/* Decorative background glows */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      {/* Header containing brand and theme switcher */}
      <Header theme={theme} toggleTheme={toggle} />

      {/* Slide-in PWA Toast Popup */}
      <InstallPWA />

      {/* 3D Train Scene */}
      <div className="scene-wrap">
        <MetroScene3D result={result} />
        <div className="scene-overlay">
          <div className="scene-label">Live 3D Network Visualization</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-bar">
        {[
          { id: "planner", label: "🗺  Route Planner" },
          { id: "lines", label: "🚇  Lines & Network" },
          { id: "info", label: "ℹ  Travel Info" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Peak hour warning */}
      {isPeak && activeTab === "planner" && (
        <div style={{ padding: "0 16px 8px" }}>
          <div className="peak-banner">
            ⚠️ Peak Hour Warning: Heavy commuter traffic detected. Transfers might take longer. Allow extra travel time.
          </div>
        </div>
      )}

      {/* Tab Content Area */}
      <main className="tab-content" style={{ flex: 1 }}>
        {activeTab === "planner" && (
          <div className="planner-grid">
            {/* Search inputs card */}
            <div className="card">
              <div className="card-label">Plan Your Journey</div>

              <div className="field-group">
                <label className="field-label">
                  <span className="dot" style={{ background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                  From (Source Station)
                </label>
                <SearchBox
                  stations={allStations}
                  value={src}
                  setValue={setSrc}
                  placeholder="Select source station..."
                />
              </div>

              <button onClick={swap} className="swap-btn">⇅ Swap Stations</button>

              <div className="field-group">
                <label className="field-label">
                  <span className="dot" style={{ background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
                  To (Destination Station)
                </label>
                <SearchBox
                  stations={allStations}
                  value={dst}
                  setValue={setDst}
                  placeholder="Select destination station..."
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!src || !dst || src === dst || loading}
                className="search-btn"
              >
                {loading ? "🔄 Calculating Route..." : "🚇 Find Best Route"}
              </button>

              {/* Popular quick links */}
              <div className="quick-section">
                <div className="quick-title">Popular Routes</div>
                {[
                  ["Shaheed Sthal (New Bus Adda)", "Phase 3"],
                  ["Rajiv Chowk", "Millennium City Centre Gurugram"],
                  ["New Delhi", "IGI Airport T3"],
                  ["Kashmere Gate", "Botanical Garden"],
                ].map(([s, d]) => (
                  <button
                    key={s + "-" + d}
                    className="quick-btn"
                    onClick={() => {
                      setSrc(s);
                      setDst(d);
                    }}
                  >
                    <span style={{ color: "#3b82f6", marginRight: 6 }}>●</span>
                    {s.length > 20 ? s.slice(0, 18) + "..." : s} &rarr; {d.length > 18 ? d.slice(0, 15) + "..." : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Results output column */}
            <div className="result-column">
              {loading ? (
                <div className="empty-state">
                  <div className="loader" />
                  <div className="empty-title" style={{ marginTop: 16 }}>Running Dijkstra's Algorithm</div>
                  <div className="empty-desc">Finding the shortest path and optimizing transfers...</div>
                </div>
              ) : (
                <RouteResult result={result} />
              )}
            </div>
          </div>
        )}

        {activeTab === "lines" && <MetroLines />}

        {activeTab === "info" && (
          <div className="info-grid">
            {[
              {
                title: "Operating Hours",
                icon: "🕐",
                items: [
                  "First train: 5:30 AM – 6:00 AM",
                  "Last train: 10:30 PM – 11:30 PM",
                  "Frequency: 3–7 min (peak hours)",
                  "Frequency: 10–15 min (off-peak hours)",
                ],
              },
              {
                title: "Fare Structure",
                icon: "🎫",
                items: [
                  "0–2 km: ₹11",
                  "2–5 km: ₹21",
                  "5–12 km: ₹32",
                  "12–21 km: ₹43",
                  "21–32 km: ₹54",
                  "32+ km: ₹64",
                  "Smart Card: 10% discount on all journeys",
                  "Virtual Smart Card: 20% discount on all journeys",
                ],
              },
              {
                title: "Travel Tips",
                icon: "💡",
                items: [
                  "Keep token or card throughout the entire journey",
                  "No eating, drinking, or smoking inside trains",
                  "Priority seats reserved for elderly and disabled",
                  "Security check is mandatory at all station gates",
                  "CCTV cameras operate throughout the network",
                ],
              },
              {
                title: "Contact & Help",
                icon: "📞",
                items: [
                  "Helpline Call: 155370",
                  "Lost & Found: 011-2341-6504",
                  "Official Website: delhimetrorail.com",
                  "Mobile App: Delhi Metro Sarthi",
                  "Twitter/X: @OfficialDMRC",
                ],
              },
            ].map((card) => (
              <div key={card.title} className="card">
                <div className="info-icon">{card.icon}</div>
                <div className="card-label">{card.title}</div>
                {card.items.map((item) => (
                  <div key={item} className="info-item">
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer containing brand details and Visitor Counter */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-text">
            Delhi Metro Rail Corporation Ltd. &bull; Route Planner System
          </span>
        </div>
        
        <div className="footer-subtext" style={{ marginBottom: 12 }}>
          Network data as of June 2026 &bull; 271+ stations &bull; Helpline: 155370
        </div>

        {/* Live Visitor Counter */}
        <div className="visitor-counter">
          <div className="visitor-badge">
            <span className="visitor-icon">👥</span>
            Total Visits: <strong className="visitor-num">{visitorCount.toLocaleString()}</strong>
          </div>
          <div className="visitor-badge active-commuters">
            <span className="active-dot">●</span>
            Active Commuters: <strong>{activeCommuters}</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
