import { useState, useEffect } from "react";

export default function InstallPWA() {
  const [install, setInstall] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();

      setInstall(e);
    });
  }, []);

  if (!install) return null;

  return (
    <button
      className="install"
      onClick={() => {
        install.prompt();
      }}
    >
      📱 Install Metro App
    </button>
  );
}
