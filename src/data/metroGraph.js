// DMRC OFFICIAL COLORS & LINE DATA
export const LINE_CONFIG = {
  "Red Line": { color: "#E8192C", bg: "#1a0305", short: "L1", hex: 0xe8192c },
  "Yellow Line": { color: "#FCD116", bg: "#1a1500", short: "L2", hex: 0xfcd116 },
  "Blue Line": { color: "#0054A6", bg: "#000d1a", short: "L3", hex: 0x0054a6 },
  "Green Line": { color: "#00843D", bg: "#001208", short: "L5", hex: 0x00843d },
  "Violet Line": { color: "#7B2D8B", bg: "#12031a", short: "L6", hex: 0x7b2d8b },
  "Orange Line": { color: "#F26522", bg: "#1a0800", short: "AE", hex: 0xf26522 },
  "Pink Line": { color: "#F99FC9", bg: "#1a0612", short: "L7", hex: 0xf99fc9 },
  "Magenta Line": { color: "#C72B7A", bg: "#1a0310", short: "L8", hex: 0xc72b7a },
  "Aqua Line": { color: "#00B5EF", bg: "#001a20", short: "L9", hex: 0x00b5ef },
  "Gray Line": { color: "#A0A0A0", bg: "#111111", short: "L10", hex: 0xa0a0a0 },
  "Rapid Metro": { color: "#006937", bg: "#001208", short: "RM", hex: 0x006937 },
};

export const graph = {};

function addEdge(a, b, line, t) {
  if (!graph[a]) graph[a] = [];
  if (!graph[b]) graph[b] = [];
  if (!graph[a].find(e => e.station === b && e.line === line))
    graph[a].push({ station: b, line, time: t });
  if (!graph[b].find(e => e.station === a && e.line === line))
    graph[b].push({ station: a, line, time: t });
}

// RED LINE
["Rithala", "Rohini West", "Rohini East", "Pitampura", "Kohat Enclave", "Netaji Subhash Place",
  "Keshav Puram", "Kanhaiya Nagar", "Inderlok", "Shastri Nagar", "Pratap Nagar",
  "Pulbangash", "Tis Hazari", "Kashmere Gate", "Shastri Park", "Seelampur", "Welcome",
  "Shahdara", "Mansarovar Park", "Jhilmil", "Dilshad Garden", "Shaheed Nagar",
  "Raj Bagh", "Rajdhani Park", "Mohan Nagar", "Arthala", "Hindon River",
  "Hindon River", "Shaheed Sthal (New Bus Adda)"
].reduce((p, c) => { if (p) addEdge(p, c, "Red Line", 3); return c; }, null);

// YELLOW LINE
["Samaypur Badli", "Rohini Sector 18, 19", "Haiderpur Badli Mor", "Jahangirpuri",
  "Adarsh Nagar", "Azadpur", "Model Town", "GTB Nagar", "Vishwa Vidyalaya",
  "Vidhan Sabha", "Civil Lines", "Kashmere Gate", "Chandni Chowk", "Chawri Bazar",
  "New Delhi", "Rajiv Chowk", "Patel Chowk", "Central Secretariat", "Seva Teerth",
  "Lok Kalyan Marg", "Jor Bagh", "INA", "AIIMS", "Green Park", "Hauz Khas",
  "Malviya Nagar", "Saket", "Qutab Minar", "Chhattarpur", "Sultanpur", "Ghitorni",
  "Arjangarh", "Guru Dronacharya", "Sikanderpur", "Phase 1", "MG Road",
  "IFFCO Chowk", "Millennium City Centre Gurugram"
].reduce((p, c) => { if (p) addEdge(p, c, "Yellow Line", 2); return c; }, null);

// BLUE LINE — main
["Dwarka Sector 21", "Dwarka Sector 8", "Dwarka Sector 9", "Dwarka Sector 10",
  "Dwarka Sector 11", "Dwarka Sector 12", "Dwarka Sector 13", "Dwarka Sector 14",
  "Dwarka", "Dwarka Mor", "Nawada", "Uttam Nagar West", "Uttam Nagar East",
  "Janakpuri West", "Janakpuri East", "Tilak Nagar", "Subhash Nagar", "Tagore Garden",
  "Rajouri Garden", "Ramesh Nagar", "Moti Nagar", "Kirti Nagar", "Shadipur",
  "Patel Nagar", "Rajendra Place", "Karol Bagh", "Jhandewalan", "Ramakrishna Ashram Marg",
  "Rajiv Chowk", "Barakhamba Road", "Mandi House", "Supreme Court", "Pragati Maidan",
  "Indraprastha", "Yamuna Bank", "Laxmi Nagar", "Nirman Vihar", "Preet Vihar",
  "Karkarduma", "Anand Vihar ISBT", "Kaushambi", "Vaishali"
].reduce((p, c) => { if (p) addEdge(p, c, "Blue Line", 2); return c; }, null);

// BLUE LINE — Noida branch
["Yamuna Bank", "Akshardham", "Mayur Vihar Phase 1", "Mayur Vihar Ext", "New Ashok Nagar",
  "Noida Sector 15", "Noida Sector 16", "Noida Sector 18", "Botanical Garden",
  "Golf Course", "Noida City Centre", "Sector 34 Noida", "Sector 52 Noida",
  "Sector 61 Noida", "Sector 59 Noida", "Sector 62 Noida", "Noida Electronic City"
].reduce((p, c) => { if (p) addEdge(p, c, "Blue Line", 2); return c; }, null);

// GREEN LINE
["Inderlok", "Ashok Park Main", "Satguru Ram Singh Marg", "Kirti Nagar",
  "Mayapuri", "Naraina Vihar", "Delhi Cantt", "Durgabai Deshmukh South Campus",
  "Sir M Visvesvaraya Moti Bagh", "Bhikaji Cama Place", "Sarojini Nagar",
  "INA", "South Extension", "Lajpat Nagar", "Moolchand", "Kailash Colony",
  "Nehru Place", "Kalkaji Mandir", "Govind Puri", "Harkesh Nagar Okhla",
  "Jasola Apollo", "Sarita Vihar", "Mohan Estate", "Tughlakabad", "Badarpur Border",
  "Sarai", "NHPC Chowk", "Mewla Maharajpur", "Sector 28 Faridabad",
  "Bad Kal Mor", "Old Faridabad", "Neelam Chowk Ajronda", "Bata Chowk",
  "Escorts Mujesar", "Sant Surdas (Sihi)", "Raja Nahar Singh (Ballabhgarh)"
].reduce((p, c) => { if (p) addEdge(p, c, "Green Line", 3); return c; }, null);

// VIOLET LINE
["Kashmere Gate", "Lal Qila", "Jama Masjid", "Delhi Gate", "ITO",
  "Mandi House", "Janpath", "Khan Market", "Jawaharlal Nehru Stadium",
  "Jangpura", "Lajpat Nagar", "Moolchand", "Kailash Colony",
  "Nehru Place", "Kalkaji Mandir", "Okhla NSIC", "Sukhdev Vihar",
  "Jamia Millia Islamia", "Okhla Vihar", "Jasola Vihar Shaheen Bagh",
  "Kalindi Kunj", "Okhla Bird Sanctuary", "Botanical Garden",
  "Noida Sector 142", "Noida Sector 143", "Noida Sector 144", "Noida Sector 145",
  "Noida Sector 146", "Noida Sector 147", "Noida Sector 148", "Knowledge Park II",
  "Pari Chowk", "Alpha 1", "Delta 1", "GNIDA Office", "Depot Station Greater Noida"
].reduce((p, c) => { if (p) addEdge(p, c, "Violet Line", 2); return c; }, null);

// ORANGE LINE (Airport Express)
["New Delhi", "Shivaji Stadium", "Dhaula Kuan", "Delhi Aerocity",
  "IGI Airport T3", "Dwarka Sector 21"
].reduce((p, c) => { if (p) addEdge(p, c, "Orange Line", 4); return c; }, null);

// PINK LINE
["Majlis Park", "Azadpur", "Shalimar Bagh", "Netaji Subhash Place", "Shakurpur",
  "Punjabi Bagh West", "ESI Hospital", "Rajouri Garden", "Mayapuri", "Naraina Vihar",
  "Delhi Cantt", "Durgabai Deshmukh South Campus", "Sir M Visvesvaraya Moti Bagh",
  "Bhikaji Cama Place", "Sarojini Nagar", "INA", "South Extension", "Lajpat Nagar",
  "Vinobapuri", "Ashram", "Hazrat Nizamuddin", "Mayur Vihar Phase 1",
  "Mayur Vihar Pocket 1", "Trilokpuri Sanjay Lake", "East Vinod Nagar-Mayur Vihar 2",
  "Mandawali-West Vinod Nagar", "IP Extension", "Anand Vihar", "Karkarduma Court",
  "Jhilmil", "Dilshad Garden", "Jaffrabad", "Maujpur-Babarpur", "Gokulpuri",
  "Johri Enclave", "Shiv Vihar"
].reduce((p, c) => { if (p) addEdge(p, c, "Pink Line", 3); return c; }, null);

// MAGENTA LINE
["Janakpuri West", "Dabri Mor-Janakpur South", "Dashratpuri", "Palam",
  "Sadar Bazar Cantonment", "Terminal 1 IGI Airport", "Shankar Vihar", "Vasant Vihar",
  "Munirka", "RK Puram", "IIT Delhi", "Hauz Khas", "Panchsheel Park", "Chirag Delhi",
  "Greater Kailash", "Nehru Enclave", "Kalkaji Mandir", "Okhla NSIC", "Sukhdev Vihar",
  "Jamia Millia Islamia", "Okhla Vihar", "Jasola Vihar Shaheen Bagh",
  "Kalindi Kunj", "Okhla Bird Sanctuary", "Botanical Garden"
].reduce((p, c) => { if (p) addEdge(p, c, "Magenta Line", 3); return c; }, null);

// AQUA LINE (NMRC)
["Noida Sector 51", "Noida Sector 50", "Noida Sector 76", "Noida Sector 101",
  "Noida Sector 81", "NSEZ", "Noida Sector 83", "Noida Sector 137", "Noida Sector 142"
].reduce((p, c) => { if (p) addEdge(p, c, "Aqua Line", 3); return c; }, null);

// GRAY LINE
["Dwarka", "Nangli", "Najafgarh"].reduce((p, c) => { if (p) addEdge(p, c, "Gray Line", 8); return c; }, null);

// RAPID METRO (Gurgaon)
["Sikanderpur", "Belvedere Towers", "Sector 53 54", "Sector 54 Chowk",
  "Sector 55 56", "Phase 3"
].reduce((p, c) => { if (p) addEdge(p, c, "Rapid Metro", 3); return c; }, null);

export const INTERCHANGES = [
  ["Kashmere Gate", "Yellow Line", "Red Line", 6],
  ["Kashmere Gate", "Violet Line", "Red Line", 6],
  ["Kashmere Gate", "Violet Line", "Yellow Line", 5],
  ["Rajiv Chowk", "Blue Line", "Yellow Line", 5],
  ["Mandi House", "Violet Line", "Blue Line", 5],
  ["INA", "Pink Line", "Yellow Line", 5],
  ["INA", "Green Line", "Yellow Line", 5],
  ["Central Secretariat", "Violet Line", "Yellow Line", 5],
  ["Inderlok", "Green Line", "Red Line", 5],
  ["Kirti Nagar", "Green Line", "Blue Line", 5],
  ["Netaji Subhash Place", "Pink Line", "Red Line", 5],
  ["Rajouri Garden", "Pink Line", "Blue Line", 5],
  ["Lajpat Nagar", "Pink Line", "Green Line", 5],
  ["Lajpat Nagar", "Pink Line", "Violet Line", 5],
  ["Kalkaji Mandir", "Magenta Line", "Violet Line", 5],
  ["Kalkaji Mandir", "Magenta Line", "Green Line", 5],
  ["Hauz Khas", "Magenta Line", "Yellow Line", 5],
  ["Botanical Garden", "Magenta Line", "Blue Line", 5],
  ["Janakpuri West", "Magenta Line", "Blue Line", 5],
  ["Azadpur", "Pink Line", "Yellow Line", 5],
  ["New Delhi", "Orange Line", "Yellow Line", 5],
  ["Dwarka Sector 21", "Orange Line", "Blue Line", 5],
  ["Anand Vihar", "Pink Line", "Blue Line", 5],
  ["Sikanderpur", "Rapid Metro", "Yellow Line", 5],
  ["Mayur Vihar Phase 1", "Pink Line", "Blue Line", 5],
  ["Moolchand", "Violet Line", "Green Line", 5],
];

// Add interchange links to the graph
INTERCHANGES.forEach(([station, lineA, lineB, t]) => {
  if (graph[station]) {
    // We add them as special edges, but we will handle line changes directly in the search state
    graph[station].push({ station, line: lineA, time: t, interchange: true, fromLine: lineB });
    graph[station].push({ station, line: lineB, time: t, interchange: true, fromLine: lineA });
  }
});

export const allStations = Object.keys(graph).sort();
