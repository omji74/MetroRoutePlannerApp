export default function ThemeToggle({ toggle, theme }) {
  return (
    <button className="theme-btn" onClick={toggle}>
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
