import { useState } from "react";
import Select from "react-select";

export default function SearchBox({ value, setValue, stations, placeholder }) {
  const options = stations.map((item) => ({
    label: item,
    value: item,
  }));

  const [listening, setListening] = useState(false);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Configured for Indian English accents
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      setListening(false);
      const results = event.results[0];
      const spokenPhrases = Array.from(results).map(alt => alt.transcript.trim().toLowerCase());
      console.log("Spoken alternatives heard:", spokenPhrases);

      let bestMatch = null;

      // 1. First-pass: Check for exact matches
      for (const phrase of spokenPhrases) {
        const exact = stations.find(s => s.toLowerCase() === phrase);
        if (exact) {
          bestMatch = exact;
          break;
        }
      }

      // 2. Second-pass: Check for substring containment matches
      if (!bestMatch) {
        for (const phrase of spokenPhrases) {
          const containment = stations.find(s => {
            const stationLower = s.toLowerCase();
            return stationLower.includes(phrase) || phrase.includes(stationLower);
          });
          if (containment) {
            bestMatch = containment;
            break;
          }
        }
      }

      // 3. Third-pass: Calculate word intersections for fuzzy keywords
      if (!bestMatch) {
        for (const phrase of spokenPhrases) {
          const spokenWords = phrase.split(/\s+/);
          const scoredStations = stations.map(s => {
            const stationLower = s.toLowerCase();
            let score = 0;
            spokenWords.forEach(word => {
              if (word.length > 2 && stationLower.includes(word)) {
                score += 1;
              }
            });
            return { station: s, score };
          }).filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

          if (scoredStations.length > 0) {
            bestMatch = scoredStations[0].station;
            break;
          }
        }
      }

      if (bestMatch) {
        setValue(bestMatch);
      } else {
        const transcript = event.results[0][0].transcript;
        alert(`Could not match "${transcript}" to a Delhi Metro station. Please try speaking clearly.`);
      }
    };

    recognition.start();
  };

  return (
    <div className="search-box-wrap" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <Select
          options={options}
          value={
            value
              ? {
                  label: value,
                  value: value,
                }
              : null
          }
          onChange={(e) => setValue(e ? e.value : "")}
          placeholder={placeholder}
          className="metro-search"
          isClearable
        />
      </div>
      <button
        type="button"
        onClick={startSpeechRecognition}
        className={`mic-btn ${listening ? "listening" : ""}`}
        title="Speak station name"
      >
        {listening ? "🎙️" : "🎤"}
      </button>
    </div>
  );
}
