import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoHistory } from "react-icons/go";
import { getCurrentWindow } from "@tauri-apps/api/window";

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 48;
const MIN_TIMER = 1;
const MAX_TIMER = 120;

interface FooterPanelProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  setNewSession: () => void;
  setTimer: (minutes: number) => void;
  onShowHistory: () => void;
  viewMode: "markdown" | "preview";
  setViewMode: (mode: "markdown" | "preview") => void;
}

const FooterPanel: React.FC<FooterPanelProps> = ({
  fontSize,
  setFontSize,
  setNewSession,
  setTimer,
  onShowHistory,
  viewMode,
  setViewMode,
}) => {
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [secondsLeft, setSecondsLeft] = useState(timerMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clamp values between min and max
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  // Font size handlers
  const handleFontScroll = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      setFontSize(clamp(fontSize + delta, MIN_FONT_SIZE, MAX_FONT_SIZE));
    },
    [fontSize, setFontSize]
  );

  const toggleFullScreen = async () => {
    const window = await getCurrentWindow();
    console.log("Window:", window); // should not be undefined

    const isFullscreen = await window.isFullscreen();
    console.log("Was fullscreen:", isFullscreen);

    await window.setFullscreen(!isFullscreen);
    console.log("Now fullscreen:", !isFullscreen);
  };

  // Timer logic
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(timerMinutes * 60);
    }
  }, [timerMinutes, isRunning]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (setTimer) setTimer(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, setTimer]);

  const handleTimerScroll = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      setTimerMinutes((prev) => clamp(prev + delta, MIN_TIMER, MAX_TIMER));
    },
    []
  );

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  const formatTimerDisplay = useCallback(() => {
    if (isRunning) {
      return formatTime(secondsLeft);
    } else {
      return `${timerMinutes}:00`;
    }
  }, [isRunning, secondsLeft, timerMinutes, formatTime]);

  return (
    <footer className="flex justify-between items-center px-6 py-3 bg-[var(--background)] border-t border-[var(--border-color)]">
      {/* Left: Font controls */}
      <div className="flex items-center gap-6">
        {/* Font size with scroll only */}
        <div
          onWheel={handleFontScroll}
          className="cursor-pointer select-none min-w-[3rem] text-center hover:opacity-50 transition-opacity"
          title="Scroll to change font size"
        >
          {fontSize}px
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
            viewMode === "markdown"
              ? "underline decoration-2 underline-offset-4 text-blue-600"
              : "hover:opacity-50 font-normal"
          }`}
          onClick={() => setViewMode("markdown")}
        >
          Markdown
        </button>
        <button
          className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
            viewMode === "preview"
              ? "underline decoration-2 underline-offset-4 text-blue-600"
              : "hover:opacity-50 font-normal"
          }`}
          onClick={() => setViewMode("preview")}
        >
          Preview
        </button>
      </div>

      {/* Right: Timer and actions */}
      <div className="flex items-center gap-6">
        {/* Timer */}
        <div
          className="cursor-pointer hover:opacity-50 select-none transition-opacity"
          onWheel={handleTimerScroll}
          onClick={toggleTimer}
          title="Click to start/stop, scroll to adjust time"
        >
          {formatTimerDisplay()}
        </div>

        <div className="flex items-center gap-3">
          <p
            className="cursor-pointer hover:opacity-50 transition-opacity"
            onClick={setNewSession}
          >
            New
          </p>
          <span className="opacity-50">•</span>
          <p
            className="cursor-pointer hover:opacity-50 transition-opacity"
            onClick={toggleFullScreen}
          >
            Full Screen
          </p>
          <span className="opacity-50">•</span>
          <p
            className="cursor-pointer hover:opacity-50 transition-opacity"
            onClick={onShowHistory}
          >
            <GoHistory size={18} />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPanel;
