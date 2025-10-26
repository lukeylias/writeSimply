# ✅ writeSimply — Focused Learning Roadmap (Task List)

A practical checklist to guide development and learning while keeping the app clean, minimal, and focused.

---

## 🎯 Goal

Refine the writing experience — focusing only on **typography feel**, **text type selection**, and **smart auto-lists**.

---

## 🧩 Phase 1: Typography & Text Feel

**Focus:** Improve the overall look and readability of text.

- [ ] Review current text styling (font size, line height, padding).
- [ ] Adjust line spacing and paragraph rhythm for easier reading.
- [ ] Fine-tune heading and body text weights, colors, and spacing.
- [ ] Ensure text feels balanced in both light and dark themes.
- [ ] Add smooth visual transitions between themes or states.
- [ ] Keep existing font/size controls — do not add new ones.

**Concepts Practised:**  
`useState`, conditional classnames, Tailwind styling, CSS variables.

---

## ✏️ Phase 2: Text Formatting (Headings + Body)

**Focus:** Let users toggle text type between “Heading” and “Body.”

- [ ] Define a simple data model for text blocks (e.g. `{ type: 'heading' | 'body', content: string }`).
- [ ] Convert editor text into block-based state.
- [ ] Implement ability to select a text block.
- [ ] Add toggle (or keyboard shortcut) to switch type:
  - [ ] `Ctrl + 1` → Heading
  - [ ] `Ctrl + 2` → Body
- [ ] Apply different visual styles based on type.
- [ ] Ensure formatting persists during editing.
- [ ] Verify re-renders don’t reset cursor position or break flow.

**Concepts Practised:**  
Event handling, state arrays, mapping over blocks, keyboard shortcuts.

---

## 🪶 Phase 3: Smart Lists

**Focus:** Add automatic bullet and numbered list detection while typing.

- [ ] Detect when user types:
  - [ ] `- ` → Convert to bullet list
  - [ ] `1. ` → Convert to numbered list
- [ ] Automatically indent or style list items appropriately.
- [ ] Handle Enter key to continue or exit a list.
- [ ] Keep typing experience smooth and inline (no Markdown parser).
- [ ] Handle undo gracefully (e.g., backspace removes list formatting).

**Concepts Practised:**  
`onKeyDown` events, string pattern detection, controlled input updates.

---

## 🧠 Development Principles

- [ ] Keep every change focused on simplicity and writing flow.
- [ ] Avoid unnecessary settings or configuration UIs.
- [ ] Maintain all functionality offline and local.
- [ ] Document learnings after each phase in `notes.md`.

---

## 📆 Suggested Order

1. [ ] Polish typography and text rhythm
2. [ ] Add heading/body toggle functionality
3. [ ] Implement auto-lists

---

**End Goal:**  
A smooth, minimal, beautifully readable writing app that feels effortless to use — and helps you deepen your confidence with React fundamentals through purposeful, contained experiments.
