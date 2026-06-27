import { useState, useEffect } from "react";
import DMRCLogo from "./DMRCLogo";

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setVisible(true);

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Simulate for standard desktop/mobile browsers that do not fire beforeinstallprompt instantly
    const hasSeenPrompt = sessionStorage.getItem("pwa-prompt-seen");
    if (!hasSeenPrompt) {
      const showTimer = setTimeout(() => {
        setVisible(true);
        sessionStorage.setItem("pwa-prompt-seen", "true");

        // Dismiss after 4 seconds
        const dismissTimer = setTimeout(() => {
          setVisible(false);
        }, 4000);

        return () => clearTimeout(dismissTimer);
      }, 2500);

      return () => clearTimeout(showTimer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA install accepted");
        }
        setInstallPrompt(null);
        setVisible(false);
      });
    } else {
      // Fallback message for unsupported browsers
      alert("App installation requested! Tap your browser menu and choose 'Add to Home Screen' to install this app.");
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="pwa-toast">
      <div className="pwa-toast-inner" onClick={handleInstall}>
        <div className="pwa-toast-logo">
          <DMRCLogo size={32} />
        </div>
        <div className="pwa-toast-body">
          <div className="pwa-toast-title">Install Delhi Metro App</div>
          <div className="pwa-toast-text">Add to Home Screen for fast offline access</div>
        </div>
      </div>
      <button className="pwa-toast-close" onClick={() => setVisible(false)}>
        &times;
      </button>
    </div>
  );
}
