# React & TypeScript Learning Notes

This document captures key React and TypeScript concepts learned while building writeSimply, focusing on areas that required deeper understanding.

## Table of Contents

- [Component Architecture & Data Flow](#component-architecture--data-flow)
- [Props and Interfaces](#props-and-interfaces)
- [React Hooks](#react-hooks)
- [Event Handling](#event-handling)
- [TypeScript Concepts](#typescript-concepts)
- [CSS and Styling](#css-and-styling)
- [State Management](#state-management)

---

## Component Architecture & Data Flow

### The "Data Down, Events Up" Pattern

**Key Learning:** React follows a unidirectional data flow where data flows down through props and events bubble up through function calls.

**Simple Explanation:** Think of it like a company hierarchy:

- **Boss (App.tsx)** = Has all the information and makes decisions
- **Employees (Components)** = Do specific jobs and report back

**Example from writeSimply:**

```typescript
// App.tsx (Parent) - Data flows DOWN
<Editor
  font={appState.font} // ⬇️ "Use this font"
  fontSize={appState.fontSize} // ⬇️ "Use this size"
  content={appState.editorContent} // ⬇️ "Display this text"
  onContentChange={setEditorContent} // ⬇️ "Call this when text changes"
/>;

// Editor.tsx (Child) - Events flow UP
const handleChange = (e) => {
  const newContent = e.target.value;
  onContentChange(newContent); // ⬆️ "Hey App, text changed!"
};
```

**The Complete Flow:**

1. User types "Hello" in Editor
2. Editor calls `onContentChange("Hello")` ⬆️ (event up)
3. App receives call and updates `appState.editorContent = "Hello"`
4. Updated content flows back down to Editor ⬇️ (data down)
5. Editor displays the new text

---

## Props and Interfaces

### Interface vs Component - The Contract Pattern

**Key Learning:** Interfaces define the "contract" (what props are expected), while components implement the actual functionality.

**Think of it like a restaurant:**

- **Interface (Menu)** = Tells you what you CAN order, but it's not actual food
- **Component (Kitchen)** = Takes the order and makes real food

**Example:**

```typescript
// Interface = The Contract/Menu
interface EditorProps {
  font: string; // ← "font prop must be a string"
  fontSize: number; // ← "fontSize prop must be a number"
  onSave?: () => void; // ← "onSave prop is optional and takes no params"
}

// Component = The Implementation/Kitchen
const Editor: React.FC<EditorProps> = ({ font, fontSize, onSave }) => {
  // TypeScript ensures:
  // - font is definitely a string
  // - fontSize is definitely a number
  // - onSave might exist and takes no parameters

  return (
    <div style={{ fontFamily: font, fontSize: `${fontSize}px` }}>Content</div>
  );
};

// Usage = Placing an Order
<Editor
  font="Nunito" // ✅ string - matches interface
  fontSize={18} // ✅ number - matches interface
  onSave={handleSave} // ✅ function - matches interface
/>;
```

### When to Use Interfaces vs Inline Types

**Use Interface when:**

- ✅ Multiple props (2+ props)
- ✅ Complex types (unions, objects, functions)
- ✅ Reusable components
- ✅ Team development

**Use Inline when:**

- ✅ Very simple components (1-2 simple props)
- ✅ One-time use components

---

## React Hooks

### useCallback - Function Memoization

**Key Learning:** `useCallback` prevents functions from being recreated on every render, which improves performance and prevents unnecessary re-renders.

**Mental Model:** Think of it like bookmarking a recipe:

- **Without useCallback:** You rewrite the recipe every time you cook
- **With useCallback:** You bookmark it once and reuse the same recipe

**Example:**

```typescript
// Without useCallback (BAD - function recreated every render)
const getRandomQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// With useCallback (GOOD - function created once)
const getRandomQuote = useCallback(() => {
  return quotes[Math.floor(Math.random() * quotes.length)];
}, []); // ← Empty array means "never recreate this function"

// Why it matters in useEffect:
useEffect(() => {
  setPlaceholder(getRandomQuote());
}, [getRandomQuote]); // ← Without useCallback, this would run every render!
```

**Dependency Array Rules:**

- `[]` = Never recreate (function never changes)
- `[someValue]` = Recreate only when `someValue` changes
- No array = Recreate every render (defeats the purpose)

---

## Event Handling

### Keyboard Event Handling

**Key Learning:** React provides access to keyboard events with cross-platform compatibility considerations.

**Example - Cmd+S Save Shortcut:**

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  // Cross-platform save shortcut
  if ((e.metaKey || e.ctrlKey) && e.key === "s") {
    e.preventDefault(); // Stop browser's default save dialog
    onSave?.(); // Call our save function
  }
};

// Key properties:
// e.metaKey = Command key on Mac (⌘)
// e.ctrlKey = Control key on Windows/Linux (Ctrl)
// || = OR operator - either one works
// e.preventDefault() = Stop browser's default behavior
```

**Why preventDefault():**

- Without it: Browser shows "Save webpage" dialog
- With it: Browser's save dialog is blocked, your save function runs instead

---

## TypeScript Concepts

### Function Type Syntax

**Key Learning:** TypeScript uses `() => void` syntax to define function types in interfaces.

**Breaking down the syntax:**

```typescript
onSave?: () => void;
//       ↑  ↑   ↑
//       │  │   └── Returns nothing
//       │  └────── Arrow function syntax
//       └───────── Takes no parameters

// Other examples:
onClick?: () => void;                    // No params, returns nothing
onContentChange?: (content: string) => void;  // Takes string, returns nothing
formatNumber?: (num: number) => string;       // Takes number, returns string
isValid?: () => boolean;                      // No params, returns boolean
```

### Optional vs Required Props

```typescript
interface EditorProps {
  font: string; // Required - must be provided
  fontSize: number; // Required - must be provided
  theme?: string; // Optional - can be undefined
  onSave?: () => void; // Optional - can be undefined
}

// Using optional props safely:
const Editor = ({ font, fontSize, theme, onSave }) => {
  // Check if optional prop exists before using:
  onSave?.(); // Only call onSave if it exists

  // Or provide defaults:
  const currentTheme = theme || "light";
};
```

---

## CSS and Styling

### CSS Custom Properties (CSS Variables)

**Key Learning:** CSS variables allow theme-based styling that can be changed dynamically.

**Example:**

```css
/* Define variables for each theme */
:root[data-theme="light"] {
  --background: #ffffff;
  --text-color: #1a1a1a;
}

:root[data-theme="dark"] {
  --background: #1a1a1a;
  --text-color: #ffffff;
}

/* Use variables in components */
.editor {
  background: var(--background);
  color: var(--text-color);
  transition: all 0.3s ease; /* Smooth theme transitions */
}
```

### Typography Enhancement

**Key Learning:** Good typography involves multiple properties working together.

**Example:**

```css
.editor-typography {
  font-family: "Nunito", sans-serif;
  letter-spacing: 0.01em; /* Space between characters */
  word-spacing: 0.02em; /* Space between words */
  line-height: 1.8; /* Space between lines */
  font-weight: 400; /* Thickness of font */
  -webkit-font-smoothing: antialiased; /* Smoother rendering */
}
```

---

## State Management

### AppState as Single Source of Truth

**Key Learning:** Centralizing all app state in one object makes data flow predictable and debugging easier.

**Mental Model:** Think of AppState like a car dashboard with gauges:

```typescript
const appState = {
  theme: "light", // 🌞 Theme gauge shows "light"
  font: "Nunito", // 🔤 Font gauge shows "Nunito"
  fontSize: 18, // 📏 Size gauge shows "18"
  editorContent: "Hello", // 📝 Content shows "Hello"
};

// When you write font={appState.font}, you're saying:
// "Editor, look at the font gauge on the dashboard and use whatever it says"
```

### State Update Pattern

**Key Learning:** React state updates use the "spread operator" to keep most state the same while changing specific values.

**Example:**

```typescript
// Current state:
appState = { theme: "light", font: "Nunito", fontSize: 18 };

// Update just the theme:
setAppState((prev) => ({ ...prev, theme: "dark" }));
//           ↑      ↑    ↑
//           │      │    └── Change this one value
//           │      └────── Keep everything else the same (spread)
//           └───────────── Previous state

// Result:
appState = { theme: "dark", font: "Nunito", fontSize: 18 };
//           ↑ Changed      ↑ Kept same     ↑ Kept same
```

**Why this pattern:**

- Preserves all other state values
- React can detect what actually changed
- Prevents accidental state loss

---

## Component Communication Patterns

### Parent-Child Communication

**Key Learning:** Components communicate through a well-defined interface of props and callbacks.

**Example Flow:**

```typescript
// 1. Parent defines function
const handleSave = async () => {
  // Save logic here
  console.log("Document saved!");
};

// 2. Parent passes function to child
<Editor onSave={handleSave} />;

// 3. Child receives function as prop
const Editor = ({ onSave }) => {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      onSave?.(); // 4. Child calls parent function
    }
  };
};

// 5. Parent function executes
// 6. User sees "Document saved!" message
```

**Key insight:** The child (Editor) doesn't know HOW to save - it just knows it can call a function when needed. The parent (App) provides the actual save implementation.

---

## Common Patterns and Best Practices

### Component File Structure

**Recommended pattern for all components:**

```typescript
// 1. Imports
import React, { useState, useCallback } from "react";

// 2. Interface definition
interface ComponentProps {
  // Props definition
}

// 3. Component implementation
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return <div>JSX</div>;
};

// 4. Export
export default Component;
```

### When to Extract Interfaces

**Always use interfaces for:**

- Components with 2+ props
- Components that will be reused
- Components with complex prop types
- Team development scenarios

**Example of growth:**

```typescript
// Simple start:
const Button = ({ text }: { text: string }) => <button>{text}</button>;

// As it grows, extract interface:
interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant,
  disabled,
}) => {
  // More complex component logic
};
```

---

## Debugging Mental Models

### Tracing Data Flow

**When something isn't working, trace the flow:**

1. **Where is the data defined?** (Usually in App.tsx state)
2. **How does it flow down?** (Through props)
3. **How does it flow back up?** (Through function calls)
4. **Where might it be getting lost?** (Check prop passing)

**Example debugging process:**

```typescript
// Issue: Font size not updating when user scrolls

// 1. Check: Is state updating in App.tsx?
console.log('appState.fontSize:', appState.fontSize); // ✅ Updates

// 2. Check: Is prop being passed to Editor?
<Editor fontSize={appState.fontSize} /> // ✅ Passed

// 3. Check: Is Editor receiving the prop?
const Editor = ({ fontSize }) => {
  console.log('Editor received fontSize:', fontSize); // ✅ Received

// 4. Check: Is prop being used in styling?
style={{ fontSize: `${fontSize}px` }} // ❌ Missing 'px'!
```

### Understanding Re-renders

**Key insight:** Components re-render when props or state change.

**What triggers re-renders:**

- ✅ State changes (`useState`)
- ✅ Prop changes (parent passed new values)
- ✅ Parent re-renders (usually)

**What doesn't trigger re-renders:**

- ❌ Variables that aren't state
- ❌ Function calls that don't change state
- ❌ CSS changes

---

_This document will continue to grow as we encounter new concepts and patterns!_
