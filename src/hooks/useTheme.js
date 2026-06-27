import { useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  function toggle() {
    let t = theme === "dark" ? "light" : "dark";

    setTheme(t);

    localStorage.setItem("theme", t);
  }

  return {
    theme,
    toggle,
  };
}
