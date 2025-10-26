# writeSimply - TLDR Documentation

## Project Overview

**writeSimply** is a minimalist, distraction-free desktop writing application built with Tauri (Rust + TypeScript/React). It's designed for pure writing without subscriptions, clutter, or unnecessary features.

## 🎯 Core Purpose

A clean, offline-first writing environment that focuses on the essentials: writing, customization, and productivity features like timers and music.

## 🏗️ Technical Architecture

### Frontend Stack

- **Framework**: React 19.1.0 with TypeScript
- **Styling**: TailwindCSS 4.1.14
- **Build Tool**: Vite 7.0.4
- **Icons**: Lucide React + React Icons

### Backend Stack

- **Framework**: Tauri 2.x (Rust)
- **File System**: JSON-based local storage
- **Audio**: Native OS audio players (afplay/ffplay/powershell)

### Key Dependencies

- `@tauri-apps/api` - Core Tauri bindings
- `@tauri-apps/plugin-dialog` - File dialogs
- `@tauri-apps/plugin-fs` - File system operations
- `serde` + `serde_json` - Rust serialization

## 📁 Project Structure

```
writeSimply/
├── src/                          # React frontend
│   ├── components/              # UI components
│   │   ├── Editor.tsx          # Main text editor
│   │   ├── Navbar.tsx          # Top navigation
│   │   ├── FooterPanel.tsx     # Font/timer controls
│   │   ├── MusicPlayer.tsx     # Audio player
│   │   ├── HistoryPanel.tsx    # Saved files list
│   │   └── Notification.tsx    # Toast notifications
│   ├── assets/
│   │   └── motivationalQuotes.json # Writing prompts
│   └── App.tsx                 # Main application
├── src-tauri/                  # Rust backend
│   ├── src/
│   │   ├── lib.rs             # Core Tauri commands
│   │   └── main.rs            # Entry point
│   └── tauri.conf.json        # App configuration
└── public/                    # Static assets
```

## 🔧 Core Features

### 1. **Distraction-Free Writing**

- Clean, minimal interface
- Multiple themes (light/dark/sepia)
- Customizable fonts and sizes
- Motivational placeholder quotes
- Full-screen mode

### 2. **File Management**

- Local JSON file storage
- Save/load writing sessions
- File history panel
- Auto-save indicators
- File rename capabilities

### 3. **Customization**

- Font family selection (Serif, Sans-serif, Monospace, Random fonts)
- Font size adjustment (8-48px)
- Theme switching
- Scroll-based controls

### 4. **Productivity Tools**

- Writing timer (1-120 minutes)
- Session management
- Progress tracking
- Writing session state persistence

### 5. **Music Player**

- Cross-platform audio support
- Folder-based music library
- Playlist management
- Background playback
- Repeat functionality

## 🎨 UI/UX Design Philosophy

### Minimalism First

- No visual clutter
- Essential controls only
- Keyboard-friendly
- Context-sensitive UI

### User Experience

- Instant startup
- Offline functionality
- Smooth transitions
- Responsive design
- Accessibility considerations

## 💾 Data Storage

### File Format

```json
{
  "name": "document_name",
  "text": "content",
  "font": "serif",
  "font_size": 20,
  "theme": "light"
}
```

### Storage Location

- **App Data Directory**: Platform-specific user data folder
- **Local Storage**: Browser localStorage for preferences
- **File Organization**: JSON files with `.json` extension

## 🔧 Tauri Commands (Rust Backend)

### File Operations

- `save_file(file: WritingFile)` - Save document to disk
- `load_file(name: String)` - Load document from disk
- `list_files()` - Get list of saved documents
- `delete_file(name: String)` - Remove document

### Audio Operations

- `play_audio(path: String)` - Play audio file
- `stop_audio()` - Stop current playback
- `is_audio_playing()` - Check playback status

### Utility

- `get_user_folder()` - Get app data directory

## 🎵 Audio Implementation

### Cross-Platform Support

- **macOS**: `afplay` command
- **Linux**: `ffplay` command
- **Windows**: PowerShell Media.SoundPlayer

### Supported Formats

MP3, WAV, OGG, M4A, FLAC, AAC

## ⚡ Performance Considerations

### Frontend Optimization

- React functional components with hooks
- Callback memoization with `useCallback`
- State batching for performance
- Efficient re-renders

### Backend Efficiency

- Rust's memory safety and performance
- Minimal system resource usage
- Native OS integration
- Fast startup times

## 🔄 State Management

### Application State

```typescript
interface AppState {
  theme: string;
  font: string;
  fontSize: number;
  editorContent: string;
}
```

### Persistence Strategy

- **localStorage**: User preferences and current content
- **File System**: Saved documents and sessions
- **Memory**: Temporary UI state

## 🛠️ Development & Build

### Development

```bash
npm run dev      # Start development server
npm run tauri dev # Start Tauri development
```

### Production Build

```bash
npm run build    # Build frontend
npm run tauri build # Build desktop app
```

### CI/CD

- GitHub Actions workflow
- Multi-platform builds (Windows, macOS, Linux)
- Automated artifact generation

## 🎯 Target Audience

### Primary Users

- Writers and authors
- Bloggers and content creators
- Students and researchers
- Minimalism enthusiasts

### Use Cases

- Distraction-free writing
- Note-taking and journaling
- Creative writing projects
- Academic writing
- Daily writing habits

## 🔮 AI Agent Context

### For Feature Development

- **Focus**: Maintain simplicity and minimalism
- **Priority**: Writing experience over feature complexity
- **Constraints**: Offline-first, no subscriptions, privacy-focused

### For Bug Fixes

- **Critical Areas**: File operations, audio playback, cross-platform compatibility
- **Testing**: Focus on edge cases in file management and audio

### For Ideation

- **Enhancement Areas**: Writing productivity, user experience, accessibility
- **Avoid**: Feature bloat, complex integrations, online dependencies

### Code Patterns

- React functional components with TypeScript
- Tauri command pattern for backend communication
- CSS custom properties for theming
- Error handling with user notifications

## 📊 Project Metrics

- **Size**: Lightweight desktop application
- **Dependencies**: Minimal, focused on core functionality
- **Performance**: Fast startup, responsive UI
- **Compatibility**: Cross-platform (Windows, macOS, Linux)

## 🔗 Integration Points

### External Systems

- File system (reading/writing documents)
- OS audio subsystem (music playback)
- OS file dialogs (folder selection)

### Internal Architecture

- React frontend ↔ Tauri commands ↔ Rust backend
- State synchronization between components
- Event-driven UI updates

---

## 🤖 AI Agent Guidelines

When working with this project:

1. **Preserve Simplicity**: Always consider if a feature adds genuine value vs. complexity
2. **Cross-Platform**: Ensure any changes work on Windows, macOS, and Linux
3. **Performance First**: Optimize for fast startup and smooth operation
4. **User Privacy**: Keep everything local, no telemetry or tracking
5. **Accessibility**: Consider keyboard navigation and screen readers
6. **Error Handling**: Provide clear, actionable user feedback
7. **Code Quality**: Follow existing patterns and TypeScript best practices

This project exemplifies the philosophy that powerful software doesn't need to be complex - it just needs to do its core job exceptionally well.
