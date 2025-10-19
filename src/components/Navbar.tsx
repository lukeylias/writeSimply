import React from "react";
import MusicPlayer from "./MusicPlayer";

interface NavbarProps {
  theme: string;
  setTheme: (theme: string) => void;
  onSave: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, setTheme, onSave }) => {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 select-none">
      {/* Left: Theme toggle */}
      <div
        onClick={toggleTheme}
        className="cursor-pointer hover:opacity-55"
      >
        {theme === "light" ? (
          <p className="text-black">Dark</p>
        ) : (
          <p className="text-white">Light</p>
        )}
      </div>

      {/* Right: Save button and Music controls */}
      <div className="flex items-center gap-6">
        {/* Save button */}
        <button
          onClick={onSave}
          className="cursor-pointer hover:opacity-70 transition-opacity px-3 py-1  border-[var(--text-color)]"
        >
          Save
        </button>

        {/* Music controls */}
        <MusicPlayer />
      </div>
    </nav>
  );
};

export default Navbar;