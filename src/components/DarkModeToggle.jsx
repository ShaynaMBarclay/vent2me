import { useEffect, useState } from "react";

function DarkModeToggle() {
const [isDark, setIsDark] = useState(false);

useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
        document.body.classList.add("dark-mode");
        setIsDark(true);
    } else {
        document.body.classList.remove("dark-mode");
        setIsDark(false);
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