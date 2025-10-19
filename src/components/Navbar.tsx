import React, { useState } from "react";
import MusicPlayer from "./MusicPlayer";
import { SlEarphones } from "react-icons/sl";

interface NavbarProps {
  theme: string;
  setTheme: (theme: string) => void;
  onSave: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, setTheme, onSave }) => {
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleMusicPlayer = () => {
    setShowMusicPlayer(!showMusicPlayer);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-8 py-4 select-none">
        {/* Left: Theme toggle */}
        <div
          onClick={toggleTheme}
          className="cursor-pointer hover:opacity-50 transition-opacity"
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
            className="cursor-pointer hover:opacity-50 transition-opacity px-3 py-1 border-[var(--text-color)]"
          >
            Save
          </button>

          {/* Music controls */}
          <div className="relative">
            <button
              onClick={toggleMusicPlayer}
              className={`cursor-pointer transition-all duration-300 p-2 rounded-full ${
                showMusicPlayer 
                  ? "bg-[var(--accent-color)] text-white" 
                  : "hover:bg-[var(--hover-bg)] hover:opacity-70"
              }`}
            >
              <SlEarphones size={17} />
            </button>
          </div>
        </div>
      </nav>

      {/* Music Player Widget */}
      {showMusicPlayer && (
        <MusicPlayer onClose={() => setShowMusicPlayer(false)} />
      )}
    </>
  );
};

export default Navbar;