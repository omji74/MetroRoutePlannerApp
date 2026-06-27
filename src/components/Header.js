import DMRCLogo from "./DMRCLogo";
import RapidMetroLogo from "./RapidMetroLogo";
import ThemeToggle from "./ThemeTogggle";

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="header">
      <div className="logo-row">
        <DMRCLogo size={50} />

        <div className="title-block">
          <h2 className="title-main">Delhi Metro Rail Corporation</h2>

          <p className="title-sub">Route Planner & Journey Guide</p>
        </div>

        <div className="rapid">
          <RapidMetroLogo size={40} />

          <div className="rapid-text">
            <div className="rapid-title">RAPID METRO</div>
            <div className="rapid-subtitle">Gurgaon Network</div>
          </div>
        </div>

        <div className="theme-toggle-wrap">
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
      </div>
    </header>
  );
}

