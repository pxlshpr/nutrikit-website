"use client";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [color, setColor] = useState("#1a1a2e");

  useEffect(() => {
    // Update or create the theme-color meta tag
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [color]);

  const presets = [
    { name: "Black", color: "#000000" },
    { name: "Near Black", color: "#0a0a0a" },
    { name: "Dark Purple", color: "#0a0612" },
    { name: "Dark Blue", color: "#0a0a1a" },
    { name: "Dark Gray", color: "#1a1a1a" },
    { name: "White", color: "#ffffff" },
    { name: "Near White", color: "#f5f5f5" },
    { name: "Light Purple", color: "#f8f5fc" },
    { name: "Light Blue", color: "#f0f0ff" },
    { name: "Light Gray", color: "#e5e5e5" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: color,
        padding: "60px 20px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1 style={{ color: isLight(color) ? "#000" : "#fff", fontSize: "24px" }}>
        Theme Color Tester
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: "60px", height: "40px", cursor: "pointer" }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "120px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", maxWidth: "400px" }}>
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => setColor(preset.color)}
            style={{
              padding: "8px 12px",
              fontSize: "12px",
              borderRadius: "8px",
              border: color === preset.color ? "2px solid #007aff" : "1px solid #ccc",
              backgroundColor: preset.color,
              color: isLight(preset.color) ? "#000" : "#fff",
              cursor: "pointer",
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <p style={{ color: isLight(color) ? "#333" : "#ccc", fontSize: "14px", textAlign: "center" }}>
        Current: {color}
      </p>
    </div>
  );
}

function isLight(color: string): boolean {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}
