export default function MetroLines() {
  const lines = [
    { name: "Red Line (L1)", color: "#E8192C", km: "34.5", st: 29, from: "Rithala", to: "Shaheed Sthal", desc: "North–East corridor connecting Delhi and Ghaziabad." },
    { name: "Yellow Line (L2)", color: "#FCD116", km: "49.1", st: 37, from: "Samaypur Badli", to: "Huda City Centre", desc: "North–South corridor connecting Delhi and Gurugram." },
    { name: "Blue Line (L3/4)", color: "#0054A6", km: "57.1", st: 58, from: "Dwarka Sec 21", to: "Vaishali / Noida E-City", desc: "East–West main line connecting Delhi, Noida, and Ghaziabad." },
    { name: "Green Line (L5)", color: "#00843D", km: "29.6", st: 21, from: "Inderlok / Kirti Nagar", to: "Brigadier Hoshiar Singh", desc: "Feeder corridor to Western suburbs." },
    { name: "Violet Line (L6)", color: "#7B2D8B", km: "46.3", st: 34, from: "Kashmere Gate", to: "Raja Nahar Singh", desc: "Heritage line connecting Central Delhi to Faridabad." },
    { name: "Orange Line (AE)", color: "#F26522", km: "22.7", st: 6, from: "New Delhi", to: "Dwarka Sector 21", desc: "Airport Express link with 135 km/h high-speed trains." },
    { name: "Pink Line (L7)", color: "#F99FC9", km: "59.1", st: 38, from: "Majlis Park", to: "Shiv Vihar", desc: "Ring line covering outer circular corridors." },
    { name: "Magenta Line (L8)", color: "#C72B7A", km: "37.5", st: 25, from: "Janakpuri West", to: "Botanical Garden", desc: "Outer Ring Line with driverless operations." },
    { name: "Aqua Line (NMRC)", color: "#00B5EF", km: "29.7", st: 21, from: "Noida Sector 51", to: "Depot Station", desc: "Noida Metro linking Greater Noida." },
    { name: "Gray Line (L10)", color: "#A0A0A0", km: "5.4", st: 3, from: "Dwarka", to: "Najafgarh", desc: "Rural feeder corridor in South West Delhi." },
    { name: "Rapid Metro (RM)", color: "#006937", km: "11.7", st: 7, from: "Sikanderpur", to: "Phase 3", desc: "Gurugram light rail network connecting to Yellow Line." },
  ];

  return (
    <div className="lines-grid">
      {lines.map((l) => (
        <div key={l.name} className="line-card" style={{ borderColor: l.color + "33" }}>
          <div className="line-card-header">
            <div className="line-color-dot" style={{ backgroundColor: l.color }} />
            <div className="line-title">{l.name}</div>
          </div>
          <div className="line-desc">
            <strong>{l.from} &harr; {l.to}</strong>
            <div className="line-desc-accent" style={{ marginTop: 4 }}>{l.desc}</div>
          </div>
          <div className="line-stats">
            <div>
              <div className="line-stat-num" style={{ color: l.color }}>{l.km}</div>
              <div className="line-stat-unit">km</div>
            </div>
            <div>
              <div className="line-stat-num" style={{ color: l.color }}>{l.st}</div>
              <div className="line-stat-unit">stations</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
