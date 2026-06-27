import { graph, INTERCHANGES } from "../data/metroGraph";

function getLinesForStation(station) {
  const lines = new Set();
  if (graph[station]) {
    for (const edge of graph[station]) {
      if (edge.line && !edge.interchange) {
        lines.add(edge.line);
      }
    }
  }
  return Array.from(lines);
}

function getInterchangePenalty(station, lineA, lineB) {
  const match = INTERCHANGES.find(
    ([st, lA, lB]) =>
      st === station &&
      ((lA === lineA && lB === lineB) || (lA === lineB && lB === lineA))
  );
  return match ? match[3] : 5; // Default penalty is 5 minutes
}

export function dijkstra(src, dst) {
  if (!src || !dst || !graph[src] || !graph[dst]) return null;

  if (src === dst) {
    const srcLines = getLinesForStation(src);
    const line = srcLines[0] || "Unknown Line";
    return {
      path: [src],
      segments: [{ line, stations: [src] }],
      totalTime: 0,
      stations: 1,
      changes: 0,
      fare: 0
    };
  }

  const dist = {};
  const visited = new Set();
  const pq = [];

  // Initialize source state for all lines passing through src
  const srcLines = getLinesForStation(src);
  for (const line of srcLines) {
    const key = `${src}::${line}`;
    dist[key] = 0;
    pq.push({
      cost: 0,
      station: src,
      line: line,
      path: [{ station: src, line }]
    });
  }

  // Sort queue by cost
  pq.sort((a, b) => a.cost - b.cost);

  let bestResult = null;

  while (pq.length > 0) {
    // Pop element with minimum cost
    const current = pq.shift();
    const { cost: d, station: u, line: curLine, path } = current;

    const stateKey = `${u}::${curLine}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    // If destination is reached
    if (u === dst) {
      bestResult = current;
      break;
    }

    // 1. Move to adjacent stations on the SAME line
    if (graph[u]) {
      for (const edge of graph[u]) {
        // Only travel along the same line (skip interchange edges here)
        if (edge.line === curLine && !edge.interchange) {
          const v = edge.station;
          const nextKey = `${v}::${curLine}`;
          const newCost = d + edge.time;

          if (dist[nextKey] === undefined || newCost < dist[nextKey]) {
            dist[nextKey] = newCost;
            pq.push({
              cost: newCost,
              station: v,
              line: curLine,
              path: [...path, { station: v, line: curLine }]
            });
          }
        }
      }
    }

    // 2. Transfer to a different line at the CURRENT station (interchange)
    const stationLines = getLinesForStation(u);
    for (const newLine of stationLines) {
      if (newLine !== curLine) {
        const nextKey = `${u}::${newLine}`;
        const penalty = getInterchangePenalty(u, curLine, newLine);
        const newCost = d + penalty;

        if (dist[nextKey] === undefined || newCost < dist[nextKey]) {
          dist[nextKey] = newCost;
          pq.push({
            cost: newCost,
            station: u,
            line: newLine,
            // Add transfer state
            path: [...path, { station: u, line: newLine }]
          });
        }
      }
    }

    // Re-sort the queue
    pq.sort((a, b) => a.cost - b.cost);
  }

  if (!bestResult) return null;

  // Build segments from path
  const segments = [];
  let currentSeg = null;

  for (const step of bestResult.path) {
    if (!currentSeg || currentSeg.line !== step.line) {
      if (currentSeg) {
        segments.push(currentSeg);
      }
      currentSeg = {
        line: step.line,
        stations: [step.station]
      };
    } else {
      if (currentSeg.stations[currentSeg.stations.length - 1] !== step.station) {
        currentSeg.stations.push(step.station);
      }
    }
  }
  if (currentSeg) {
    segments.push(currentSeg);
  }

  // Get distinct list of stations
  const pathStations = [];
  for (const step of bestResult.path) {
    if (pathStations.length === 0 || pathStations[pathStations.length - 1] !== step.station) {
      pathStations.push(step.station);
    }
  }

  const changes = segments.length - 1;
  const totalTime = bestResult.cost;

  // Fare calculation
  const fare = totalTime <= 10 ? 10 :
               totalTime <= 20 ? 20 :
               totalTime <= 35 ? 30 :
               totalTime <= 50 ? 40 :
               totalTime <= 65 ? 50 : 60;

  return {
    path: pathStations,
    segments,
    totalTime,
    stations: pathStations.length,
    changes,
    fare
  };
}
