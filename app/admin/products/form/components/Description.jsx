"use client";

import { useState, useRef, useEffect } from "react";

const styleButtons = [
  { command: "bold", icon: "B" },
  { command: "italic", icon: "I" },
  { command: "underline", icon: "U" },
  { command: "strikeThrough", icon: "S" },
  { command: "insertOrderedList", icon: "1." },
  { command: "insertUnorderedList", icon: "•" },
  { command: "createLink", icon: "🔗" },
];

export default function RichTextEditor({ data, handleData }) {
  const editorRef = useRef(null);

  const handleCommand = (command) => {
    if (command === "createLink") {
      const url = prompt("Enter URL:");
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, null);
    }
  };

  const handleInput = () => {
    handleData("description", editorRef.current.innerHTML);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = data?.description || "";
    }
  }, [data]);

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl h-full">
      <h1 className="font-semibold">Description</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        {styleButtons.map((btn) => (
          <button
            key={btn.command}
            type="button"
            onClick={() => handleCommand(btn.command)}
            className="px-2 py-1 border rounded hover:bg-pink-50 text-pink-600 font-bold"
          >
            {btn.icon}
          </button>
        ))}
        {/* Color Picker */}
        <input
          type="color"
          onChange={(e) => document.execCommand("foreColor", false, e.target.value)}
          className="w-10 h-8 p-0 border rounded"
        />
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="border p-3 rounded h-64 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-pink-300"
      ></div>
    </section>
  );
}
