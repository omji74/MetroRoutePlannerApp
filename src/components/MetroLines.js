import { useState } from "react";
import { INTERCHANGES, LINE_CONFIG } from "../data/metroGraph";

// Define the ordered station lists for each metro line
const LINE_STATIONS = {
  "Red Line": [
    "Rithala", "Rohini West", "Rohini East", "Pitampura", "Kohat Enclave", "Netaji Subhash Place",
    "Keshav Puram", "Kanhaiya Nagar", "Inderlok", "Shastri Nagar", "Pratap Nagar",
    "Pulbangash", "Tis Hazari", "Kashmere Gate", "Shastri Park", "Seelampur", "Welcome",
    "Shahdara", "Mansarovar Park", "Jhilmil", "Dilshad Garden", "Shaheed Nagar",
    "Raj Bagh", "Rajdhani Park", "Mohan Nagar", "Arthala", "Hindon River", "Shaheed Sthal (New Bus Adda)"
  ],
  "Yellow Line": [
    "Samaypur Badli", "Rohini Sector 18, 19", "Haiderpur Badli Mor", "Jahangirpuri",
    "Adarsh Nagar", "Azadpur", "Model Town", "GTB Nagar", "Vishwa Vidyalaya",
    "Vidhan Sabha", "Civil Lines", "Kashmere Gate", "Chandni Chowk", "Chawri Bazar",
    "New Delhi", "Rajiv Chowk", "Patel Chowk", "Central Secretariat", "Seva Teerth",
    "Lok Kalyan Marg", "Jor Bagh", "INA", "AIIMS", "Green Park", "Hauz Khas",
    "Malviya Nagar", "Saket", "Qutab Minar", "Chhattarpur", "Sultanpur", "Ghitorni",
    "Arjangarh", "Guru Dronacharya", "Sikanderpur", "Phase 1", "MG Road",
    "IFFCO Chowk", "Millennium City Centre Gurugram"
  ],
  "Blue Line": {
    main: [
      "Dwarka Sector 21", "Dwarka Sector 8", "Dwarka Sector 9", "Dwarka Sector 10",
      "Dwarka Sector 11", "Dwarka Sector 12", "Dwarka Sector 13", "Dwarka Sector 14",
      "Dwarka", "Dwarka Mor", "Nawada", "Uttam Nagar West", "Uttam Nagar East",
      "Janakpuri West", "Janakpuri East", "Tilak Nagar", "Subhash Nagar", "Tagore Garden",
      "Rajouri Garden", "Ramesh Nagar", "Moti Nagar", "Kirti Nagar", "Shadipur",
      "Patel Nagar", "Rajendra Place", "Karol Bagh", "Jhandewalan", "Ramakrishna Ashram Marg",
      "Rajiv Chowk", "Barakhamba Road", "Mandi House", "Supreme Court", "Pragati Maidan",
      "Indraprastha", "Yamuna Bank", "Laxmi Nagar", "Nirman Vihar", "Preet Vihar",
      "Karkarduma", "Anand Vihar ISBT", "Kaushambi", "Vaishali"
    ],
    branch: [
      "Yamuna Bank", "Akshardham", "Mayur Vihar Phase 1", "Mayur Vihar Ext", "New Ashok Nagar",
      "Noida Sector 15", "Noida Sector 16", "Noida Sector 18", "Botanical Garden",
      "Golf Course", "Noida City Centre", "Sector 34 Noida", "Sector 52 Noida",
      "Sector 61 Noida", "Sector 59 Noida", "Sector 62 Noida", "Noida Electronic City"
    ]
  },
  "Green Line": [
    "Inderlok", "Ashok Park Main", "Satguru Ram Singh Marg", "Kirti Nagar",
    "Mayapuri", "Naraina Vihar", "Delhi Cantt", "Durgabai Deshmukh South Campus",
    "Sir M Visvesvaraya Moti Bagh", "Bhikaji Cama Place", "Sarojini Nagar",
    "INA", "South Extension", "Lajpat Nagar", "Moolchand", "Kailash Colony",
    "Nehru Place", "Kalkaji Mandir", "Govind Puri", "Harkesh Nagar Okhla",
    "Jasola Apollo", "Sarita Vihar", "Mohan Estate", "Tughlakabad", "Badarpur Border",
    "Sarai", "NHPC Chowk", "Mewla Maharajpur", "Sector 28 Faridabad",
    "Bad Kal Mor", "Old Faridabad", "Neelam Chowk Ajronda", "Bata Chowk",
    "Escorts Mujesar", "Sant Surdas (Sihi)", "Raja Nahar Singh (Ballabhgarh)"
  ],
  "Violet Line": [
    "Kashmere Gate", "Lal Qila", "Jama Masjid", "Delhi Gate", "ITO",
    "Mandi House", "Janpath", "Khan Market", "Jawaharlal Nehru Stadium",
    "Jangpura", "Lajpat Nagar", "Moolchand", "Kailash Colony",
    "Nehru Place", "Kalkaji Mandir", "Okhla NSIC", "Sukhdev Vihar",
    "Jamia Millia Islamia", "Okhla Vihar", "Jasola Vihar Shaheen Bagh",
    "Kalindi Kunj", "Okhla Bird Sanctuary", "Botanical Garden",
    "Noida Sector 142", "Noida Sector 143", "Noida Sector 144", "Noida Sector 145",
    "Noida Sector 146", "Noida Sector 147", "Noida Sector 148", "Knowledge Park II",
    "Pari Chowk", "Alpha 1", "Delta 1", "GNIDA Office", "Depot Station Greater Noida"
  ],
  "Orange Line": [
    "New Delhi", "Shivaji Stadium", "Dhaula Kuan", "Delhi Aerocity",
    "IGI Airport T3", "Dwarka Sector 21"
  ],
  "Pink Line": [
    "Majlis Park", "Azadpur", "Shalimar Bagh", "Netaji Subhash Place", "Shakurpur",
    "Punjabi Bagh West", "ESI Hospital", "Rajouri Garden", "Mayapuri", "Naraina Vihar",
    "Delhi Cantt", "Durgabai Deshmukh South Campus", "Sir M Visvesvaraya Moti Bagh",
    "Bhikaji Cama Place", "Sarojini Nagar", "INA", "South Extension", "Lajpat Nagar",
    "Vinobapuri", "Ashram", "Hazrat Nizamuddin", "Mayur Vihar Phase 1",
    "Mayur Vihar Pocket 1", "Trilokpuri Sanjay Lake", "East Vinod Nagar-Mayur Vihar 2",
    "Mandawali-West Vinod Nagar", "IP Extension", "Anand Vihar", "Karkarduma Court",
    "Jhilmil", "Dilshad Garden", "Jaffrabad", "Maujpur-Babarpur", "Gokulpuri",
    "Johri Enclave", "Shiv Vihar"
  ],
  "Magenta Line": [
    "Janakpuri West", "Dabri Mor-Janakpur South", "Dashratpuri", "Palam",
    "Sadar Bazar Cantonment", "Terminal 1 IGI Airport", "Shankar Vihar", "Vasant Vihar",
    "Munirka", "RK Puram", "IIT Delhi", "Hauz Khas", "Panchsheel Park", "Chirag Delhi",
    "Greater Kailash", "Nehru Enclave", "Kalkaji Mandir", "Okhla NSIC", "Sukhdev Vihar",
    "Jamia Millia Islamia", "Okhla Vihar", "Jasola Vihar Shaheen Bagh",
    "Kalindi Kunj", "Okhla Bird Sanctuary", "Botanical Garden"
  ],
  "Aqua Line": [
    "Noida Sector 51", "Noida Sector 50", "Noida Sector 76", "Noida Sector 101",
    "Noida Sector 81", "NSEZ", "Noida Sector 83", "Noida Sector 137", "Noida Sector 142"
  ],
  "Gray Line": [
    "Dwarka", "Nangli", "Najafgarh"
  ],
  "Rapid Metro": [
    "Sikanderpur", "Belvedere Towers", "Sector 53 54", "Sector 54 Chowk",
    "Sector 55 56", "Guru Dronacharya", "Phase 3"
  ]
};

export default function MetroLines() {
  const [activeLine, setActiveLine] = useState(null);

  const lines = [
    { name: "Red Line (L1)", color: "#E8192C", km: "34.5", st: 29, from: "Rithala", to: "Shaheed Sthal", desc: "North–East corridor connecting Delhi and Ghaziabad." },
    { name: "Yellow Line (L2)", color: "#FCD116", km: "49.1", st: 37, from: "Samaypur Badli", to: "Millennium City Centre Gurugram", desc: "North–South corridor connecting Delhi and Gurugram." },
    { name: "Blue Line (L3/4)", color: "#0054A6", km: "57.1", st: 58, from: "Dwarka Sec 21", to: "Vaishali / Noida E-City", desc: "East–West main line connecting Delhi, Noida, and Ghaziabad." },
    { name: "Green Line (L5)", color: "#00843D", km: "29.6", st: 21, from: "Inderlok / Kirti Nagar", to: "Raja Nahar Singh", desc: "Feeder corridor to Western suburbs." },
    { name: "Violet Line (L6)", color: "#7B2D8B", km: "46.3", st: 34, from: "Kashmere Gate", to: "Raja Nahar Singh", desc: "Heritage line connecting Central Delhi to Faridabad." },
    { name: "Orange Line (AE)", color: "#F26522", km: "22.7", st: 6, from: "New Delhi", to: "Dwarka Sector 21", desc: "Airport Express link with 135 km/h high-speed trains." },
    { name: "Pink Line (L7)", color: "#F99FC9", km: "59.1", st: 38, from: "Majlis Park", to: "Shiv Vihar", desc: "Ring line covering outer circular corridors." },
    { name: "Magenta Line (L8)", color: "#C72B7A", km: "37.5", st: 25, from: "Janakpuri West", to: "Botanical Garden", desc: "Outer Ring Line with driverless operations." },
    { name: "Aqua Line (NMRC)", color: "#00B5EF", km: "29.7", st: 21, from: "Noida Sector 51", to: "Depot Station", desc: "Noida Metro linking Greater Noida." },
    { name: "Gray Line (L10)", color: "#A0A0A0", km: "5.4", st: 3, from: "Dwarka", to: "Najafgarh", desc: "Rural feeder corridor in South West Delhi." },
    { name: "Rapid Metro (RM)", color: "#006937", km: "11.7", st: 7, from: "Sikanderpur", to: "Phase 3", desc: "Gurugram light rail network connecting to Yellow Line." },
  ];

  // Helper to determine interchanges for a station
  const getInterchangesForStation = (stationName, currentLineKey) => {
    const matchingInterchanges = INTERCHANGES.filter(([st]) => st === stationName);
    if (matchingInterchanges.length === 0) return [];
    
    // Get unique other lines
    const otherLines = Array.from(new Set(
      matchingInterchanges.flatMap(([_, lA, lB]) => [lA, lB])
    )).filter(lineName => lineName !== currentLineKey);
    
    return otherLines;
  };

  const renderStationRow = (station, index, stationsList, lineKey, color) => {
    const otherLines = getInterchangesForStation(station, lineKey);
    return (
      <div key={station + "-" + index} className="line-station-row">
        <div className="line-station-dot-container">
          <span 
            className="line-station-dot" 
            style={{ 
              backgroundColor: color, 
              boxShadow: `0 0 6px ${color}` 
            }} 
          />
          {index < stationsList.length - 1 && <span className="line-station-line" />}
        </div>
        <div className="line-station-name">{station}</div>
        {otherLines.length > 0 && (
          <div className="line-station-interchanges">
            {otherLines.map(ol => (
              <span 
                key={ol} 
                className="line-station-badge" 
                style={{ 
                  backgroundColor: LINE_CONFIG[ol]?.color || "#4b5563"
                }}
              >
                {LINE_CONFIG[ol]?.short || ol.split(" ")[0]}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStationsList = (lineName, color) => {
    const cleanLineKey = Object.keys(LINE_STATIONS).find(k => lineName.startsWith(k));
    if (!cleanLineKey) return null;

    const data = LINE_STATIONS[cleanLineKey];

    if (cleanLineKey === "Blue Line") {
      // Special case for branched Blue line
      return (
        <div className="line-stations-container">
          <div className="line-stations-title">🚇 Main Line (Vaishali Branch)</div>
          <div className="line-stations-list">
            {data.main.map((st, idx) => renderStationRow(st, idx, data.main, cleanLineKey, color))}
          </div>
          
          <div className="line-stations-title" style={{ marginTop: 20 }}>🚇 Noida Electronic City Branch</div>
          <div className="line-stations-list">
            {data.branch.map((st, idx) => renderStationRow(st, idx, data.branch, cleanLineKey, color))}
          </div>
        </div>
      );
    }

    return (
      <div className="line-stations-container">
        <div className="line-stations-title">🚇 Station Network Timeline</div>
        <div className="line-stations-list">
          {data.map((st, idx) => renderStationRow(st, idx, data, cleanLineKey, color))}
        </div>
      </div>
    );
  };

  return (
    <div className="lines-grid">
      {lines.map((l) => {
        const isActive = activeLine === l.name;
        return (
          <div 
            key={l.name} 
            onClick={() => setActiveLine(isActive ? null : l.name)}
            className={`line-card ${isActive ? "active-line-card" : ""}`} 
            style={{ 
              borderColor: isActive ? l.color : l.color + "33",
              boxShadow: isActive ? `0 8px 30px ${l.color}25, inset 0 1px 1px rgba(255, 255, 255, 0.05)` : "var(--card-shadow)",
              cursor: "pointer",
              gridColumn: isActive ? "1 / -1" : "auto", // Spans full row on click for premium responsive details layout!
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <div className="line-card-header">
              <div className="line-color-dot" style={{ backgroundColor: l.color }} />
              <div className="line-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {l.name}
                {isActive && <span style={{ fontSize: "10px", padding: "2px 8px", background: l.color + "22", color: l.color, borderRadius: 20, fontWeight: 700 }}>Active</span>}
              </div>
            </div>
            
            <div className="line-desc">
              <strong>{l.from} &harr; {l.to}</strong>
              <div className="line-desc-accent" style={{ marginTop: 4 }}>{l.desc}</div>
            </div>

            <div className="line-stats" style={{ marginBottom: isActive ? 16 : 0 }}>
              <div>
                <div className="line-stat-num" style={{ color: l.color }}>{l.km}</div>
                <div className="line-stat-unit">km</div>
              </div>
              <div>
                <div className="line-stat-num" style={{ color: l.color }}>{l.st}</div>
                <div className="line-stat-unit">stations</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 16, transform: isActive ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  ▼
                </span>
              </div>
            </div>

            {isActive && renderStationsList(l.name, l.color)}
          </div>
        );
      })}
    </div>
  );
}
