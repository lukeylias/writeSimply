import React, { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./styles/global.css";
import "./styles/themes.css";
import "./App.css";

import Editor from "./components/Editor";
import FooterPanel from "./components/FooterPanel";
import Navbar from "./components/Navbar";
import HistoryPanel from "./components/HistoryPanel";

// Types for writing session
interface WritingFile {
  name: string;
  text: string;
  font: string;
  font_size: number;
  theme: string;
}

interface AppState {
  theme: string;
  font: string;
  fontSize: number;
  editorContent: string;
}

const DEFAULT_THEME = "light";
const DEFAULT_FONT = "serif";
const DEFAULT_FONT_SIZE = 20;

function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const savedFont = localStorage.getItem("font");
      const savedFontSize = localStorage.getItem("fontSize");
      const savedContent = localStorage.getItem("editorContent");
      
      return {
        theme: savedTheme || DEFAULT_THEME,
        font: savedFont || DEFAULT_FONT,
        fontSize: savedFontSize ? parseInt(savedFontSize) : DEFAULT_FONT_SIZE,
        editorContent: savedContent || "",
      };
    } catch (error) {
      console.error("Error loading saved preferences:", error);
      return {
        theme: DEFAULT_THEME,
        font: DEFAULT_FONT,
        fontSize: DEFAULT_FONT_SIZE,
        editorContent: "",
      };
    }
  });

  const [showHistory, setShowHistory] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      document.documentElement.dataset.theme = appState.theme;
      localStorage.setItem("theme", appState.theme);
      localStorage.setItem("font", appState.font);
      localStorage.setItem("fontSize", appState.fontSize.toString());
      localStorage.setItem("editorContent", appState.editorContent);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  }, [appState]);

  // State updaters
  const setTheme = useCallback((theme: string) => {
    setAppState(prev => ({ ...prev, theme }));
  }, []);

  const setFont = useCallback((font: string) => {
    setAppState(prev => ({ ...prev, font }));
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    setAppState(prev => ({ ...prev, fontSize }));
  }, []);

  const setEditorContent = useCallback((content: string) => {
    setAppState(prev => ({ ...prev, editorContent: content }));
  }, []);

  // Save session to file with name
  const handleSave = useCallback(async () => {
    try {
      const fileName = prompt("Enter a name for your writing session:");
      if (!fileName) return;

      const file: WritingFile = {
        name: fileName,
        text: appState.editorContent,
        font: appState.font,
        font_size: appState.fontSize,
        theme: appState.theme,
      };

      const result = await invoke<string>("save_file", { file });
      console.log("Save result:", result);
      alert("File saved successfully!");
      
      // Refresh file list
      refreshFileList();
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Error saving file: " + error);
    }
  }, [appState]);

  // Load file list for history
  const refreshFileList = useCallback(async () => {
    try {
      const files = await invoke<string[]>("list_files");
      setFileList(files);
    } catch (error) {
      console.error("Error loading file list:", error);
    }
  }, []);

  // Load session from file
  const handleLoadFile = useCallback(async (fileName: string) => {
    try {
      const file = await invoke<WritingFile>("load_file", { name: fileName });
      
      setAppState(prev => ({
        ...prev,
        editorContent: file.text,
        font: file.font,
        fontSize: file.font_size,
        theme: file.theme,
      }));

      setShowHistory(false);
      console.log("File loaded successfully:", fileName);
    } catch (error) {
      console.error("Error loading file:", error);
      alert("Error loading file: " + error);
    }
  }, []);

  // Delete file
  const handleDeleteFile = useCallback(async (fileName: string) => {
    try {
      if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
        await invoke<string>("delete_file", { name: fileName });
        refreshFileList();
        console.log("File deleted:", fileName);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file: " + error);
    }
  }, [refreshFileList]);

  const handleNewSession = useCallback(() => {
    setEditorContent("");
  }, [setEditorContent]);

  const handleSetTimer = useCallback((minutes: number) => {
    console.log(`Timer set: ${minutes} minutes`);
  }, []);

  const toggleHistory = useCallback(() => {
    setShowHistory(prev => {
      if (!prev) {
        refreshFileList();
      }
      return !prev;
    });
  }, [refreshFileList]);

  return (
    <div className="app-container min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-color)] transition-colors duration-300 relative">
      <Navbar 
        theme={appState.theme} 
        setTheme={setTheme}
        onSave={handleSave}
      />
      
      <main className="flex-1">
        <Editor 
          font={appState.font} 
          fontSize={appState.fontSize} 
          theme={appState.theme}
          content={appState.editorContent}
          onContentChange={setEditorContent}
        />
      </main>

    <FooterPanel
  font={appState.font}
  fontSize={appState.fontSize}
  setFont={setFont}
  setFontSize={setFontSize}
  setNewSession={handleNewSession}
  setTimer={handleSetTimer}
  onShowHistory={() => setShowHistory(true)}
/>

<HistoryPanel
  files={fileList}
  onLoadFile={handleLoadFile}
  onDeleteFile={handleDeleteFile}
  onClose={() => setShowHistory(false)}
  isOpen={showHistory}
/>
    </div>
  );
}

export default App;