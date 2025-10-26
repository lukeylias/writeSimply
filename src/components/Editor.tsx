import React, { useState, useRef, useEffect, useCallback } from "react";
import quotes from "../assets/motivationalQuotes.json";

interface EditorProps {
  font: string;
  fontSize: number;
  theme?: string;
  content?: string;
  onContentChange?: (content: string) => void;
  onSave?: () => void;
  viewMode: "markdown" | "preview";
}

const Editor: React.FC<EditorProps> = ({
  font,
  fontSize,
  theme,
  content = "",
  onContentChange,
  onSave,
  viewMode = "preview",
}) => {
  const [placeholder, setPlaceholder] = useState<string>("");
  const [localContent, setLocalContent] = useState<string>(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get random quote
  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);

  // Initialize placeholder + focus
  useEffect(() => {
    setPlaceholder(getRandomQuote());
    textareaRef.current?.focus();
  }, [getRandomQuote]);

  // Refocus on theme change
  useEffect(() => {
    textareaRef.current?.focus();
  }, [theme]);

  // Handle external "clear" event
  useEffect(() => {
    const handleClear = () => {
      setLocalContent("");
      onContentChange?.("");
      textareaRef.current?.focus();
    };
    window.addEventListener("editor:clear", handleClear);
    return () => window.removeEventListener("editor:clear", handleClear);
  }, [onContentChange]);

  // Sync content from parent
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onContentChange?.(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Existing save shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      onSave?.();
      return;
    }

    // Tab handling for lists
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert tab or spaces
      const tabChar = "  "; // 2 spaces (or use '\t' for actual tab)
      const newContent =
        localContent.substring(0, start) +
        tabChar +
        localContent.substring(end);

      setLocalContent(newContent);

      // Move cursor after the tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + tabChar.length;
      }, 0);
      return;
    }

    // Enter key - maintain indentation
    if (e.key === "Enter") {
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const currentLine =
        localContent.substring(0, start).split("\n").pop() || "";

      // Check if current line is indented
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : "";

      // Check if it's a list item
      const listMatch = currentLine.match(/^(\s*)[-*](\s+)/);
      const numberedListMatch = currentLine.match(/^(\s*)\d+\.(\s+)/);

      if (listMatch || numberedListMatch) {
        e.preventDefault();

        let newContent;
        if (numberedListMatch) {
          // For numbered lists, increment the number
          const currentNum = parseInt(currentLine.match(/\d+/)?.[0] || "1");
          const nextNum = currentNum + 1;
          newContent =
            localContent.substring(0, start) +
            "\n" +
            indent +
            nextNum +
            ". " +
            localContent.substring(start);
        } else {
          // For bullet lists, use same bullet
          const bullet = listMatch[0].replace(/\s*$/, " "); // Remove trailing spaces, add one
          newContent =
            localContent.substring(0, start) +
            "\n" +
            bullet +
            localContent.substring(start);
        }

        setLocalContent(newContent);

        // Position cursor after the new list marker
        setTimeout(() => {
          const newPos =
            start +
            1 +
            (numberedListMatch
              ? indent.length + (currentNum + 1).toString().length + 2
              : listMatch[0].length);
          textarea.selectionStart = textarea.selectionEnd = newPos;
        }, 0);
      }
    }
  };

  const parseMarkdownToHtml = useCallback((text: string) => {
    const lines = text.split("\n");
    let result: string[] = [];
    let listStack: { type: "ol" | "ul"; indent: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Check for headings first (close all lists)
      if (trimmedLine.match(/^#{1,3}\s*/)) {
        // Close all open lists
        while (listStack.length > 0) {
          const list = listStack.pop()!;
          result.push(`</${list.type}>`);
        }

        if (trimmedLine.match(/^#{3}\s*/)) {
          const heading = trimmedLine.replace(/^#{3}\s*/, "");
          result.push(`<h3 key="${i}" class="text-h3">${heading}</h3>`);
        } else if (trimmedLine.match(/^#{2}\s*/)) {
          const heading = trimmedLine.replace(/^#{2}\s*/, "");
          result.push(`<h2 key="${i}" class="text-h2">${heading}</h2>`);
        } else if (trimmedLine.match(/^#{1}\s*/)) {
          const heading = trimmedLine.replace(/^#{1}\s*/, "");
          result.push(`<h1 key="${i}" class="text-h1">${heading}</h1>`);
        }
        continue;
      }

      // Calculate indentation level
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;

      // Check for ordered lists
      if (trimmedLine.match(/^\d+\.\s+/)) {
        handleListItem("ol", indent, trimmedLine.replace(/^\d+\.\s+/, ""));
        continue;
      }

      // Check for unordered lists
      if (trimmedLine.match(/^[-*]\s+/)) {
        handleListItem("ul", indent, trimmedLine.replace(/^[-*]\s+/, ""));
        continue;
      }

      // Empty lines or regular paragraphs close all lists
      if (trimmedLine === "") {
        while (listStack.length > 0) {
          const list = listStack.pop()!;
          result.push(`</${list.type}>`);
        }
        if (trimmedLine === "") {
          result.push(`<br key="${i}" />`);
        }
        continue;
      }

      // Regular paragraph - close all lists
      while (listStack.length > 0) {
        const list = listStack.pop()!;
        result.push(`</${list.type}>`);
      }
      result.push(`<p key="${i}" class="text-body">${line}</p>`);
    }

    // Helper function to handle list items
    function handleListItem(type: "ol" | "ul", indent: number, text: string) {
      // Close lists that are deeper than current indent
      while (
        listStack.length > 0 &&
        listStack[listStack.length - 1].indent >= indent
      ) {
        const list = listStack.pop()!;
        result.push(`</${list.type}>`);
      }

      // If we need to open a new list at this level
      if (
        listStack.length === 0 ||
        listStack[listStack.length - 1].indent < indent
      ) {
        listStack.push({ type, indent });
        result.push(`<${type} class="markdown-${type}">`);
      } else if (listStack[listStack.length - 1].type !== type) {
        // Different list type at same level
        const list = listStack.pop()!;
        result.push(`</${list.type}>`);
        listStack.push({ type, indent });
        result.push(`<${type} class="markdown-${type}">`);
      }

      result.push(`<li class="markdown-li">${text}</li>`);
    }

    // Close any remaining open lists
    while (listStack.length > 0) {
      const list = listStack.pop()!;
      result.push(`</${list.type}>`);
    }

    return result.join("");
  }, []);

  return (
    <div className="flex-1 flex justify-center items-center px-4 overflow-hidden">
      {viewMode === "markdown" ? (
        // Markdown View - Raw textarea with markdown visible
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`
            w-full max-w-4xl h-full p-8 
            leading-relaxed resize-none 
            border-none outline-none 
            bg-[var(--background)] text-[var(--text-color)]
            caret-blue transition-all duration-300
            placeholder-gray-500
            editor-typography  
          `}
          style={{
            fontFamily:
              'Monaco, "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
            fontSize: `${fontSize}px`,
            lineHeight: "1.6",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          placeholder={placeholder}
          spellCheck={false}
        />
      ) : (
        // Preview View - Rendered markdown
        <div
          className="w-full max-w-4xl h-full p-8 editor-typography overflow-y-auto"
          style={{
            fontFamily: font,
            fontSize: `${fontSize}px`,
            fontWeight: 200,
            lineHeight: "1.6",
            background: "var(--background)",
            color: "var(--text-color)",
            scrollbarWidth: "none", // ← Firefox
            msOverflowStyle: "none", // ← IE/Edge
            whiteSpace: "pre-wrap", // ← Preserve line breaks
            wordWrap: "break-word", // ← Break long words
          }}
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHtml(localContent),
          }}
        />
      )}
    </div>
  );
};

export default Editor;
