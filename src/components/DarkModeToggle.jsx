import { useEffect, useState } from "react";

function DarkModeToggle() {
  // Default to true for dark mode
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light") {
      document.body.classList.remove("dark-mode");
      setIsDark(false);
    } else {
      // Default to dark mode if nothing is stored
      document.body.classList.add("dark-mode");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const body = document.body;

    if (isDark) {
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }

    setIsDark(!isDark);
  };

  return (
    <div className="darkmode-topbar">
      <button className="darkmode-toggle" onClick={toggleDarkMode}>
        {isDark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

export default DarkModeToggle;
