"use client";

import { useState } from "react";

type BackgroundType =
  | "none"
  | "particles"
  | "plasma"
  | "holographic"
  | "lava"
  | "crt"
  | "chromatic"
  | "matrix"
  | "waves"
  | "glow"
  | "aurora"
  | "mesh";

const options: { value: BackgroundType; label: string; desc: string }[] = [
  { value: "none", label: "None", desc: "Solid background only" },
  { value: "particles", label: "Particles", desc: "Floating dots" },
  { value: "plasma", label: "Plasma", desc: "Morphing color blobs" },
  { value: "holographic", label: "Holographic", desc: "Rainbow shimmer" },
  { value: "lava", label: "Lava Lamp", desc: "Gooey metaballs" },
  { value: "crt", label: "CRT", desc: "Retro scanlines" },
  { value: "chromatic", label: "Chromatic", desc: "RGB aberration" },
  { value: "matrix", label: "Matrix", desc: "Digital rain" },
  { value: "waves", label: "Waves", desc: "Flowing lines" },
  { value: "glow", label: "Glow", desc: "Spinning conic" },
  { value: "aurora", label: "Aurora", desc: "Floating orbs" },
  { value: "mesh", label: "Mesh", desc: "Original gradient" },
];

export default function BackgroundSwitcher() {
  const [bg, setBg] = useState<BackgroundType>("plasma");
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = options.find((o) => o.value === bg);

  return (
    <>
      {/* Particles */}
      {bg === "particles" && (
        <div className="particles-overlay">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
      )}

      {/* Plasma - morphing gradient blobs */}
      {bg === "plasma" && <div className="plasma-overlay" />}

      {/* Holographic - rainbow shimmer */}
      {bg === "holographic" && <div className="holographic-overlay" />}

      {/* Lava Lamp - gooey metaballs */}
      {bg === "lava" && (
        <div className="lava-overlay">
          <div className="lava-blob" />
          <div className="lava-blob" />
          <div className="lava-blob" />
          <div className="lava-blob" />
        </div>
      )}

      {/* CRT - retro scanlines */}
      {bg === "crt" && <div className="crt-overlay" />}

      {/* Chromatic - RGB split */}
      {bg === "chromatic" && (
        <div className="chromatic-overlay">
          <div className="chromatic-layer red" />
          <div className="chromatic-layer green" />
          <div className="chromatic-layer blue" />
        </div>
      )}

      {/* Matrix - digital rain */}
      {bg === "matrix" && (
        <div className="matrix-overlay">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="matrix-column" />
          ))}
        </div>
      )}

      {/* Waves - flowing lines */}
      {bg === "waves" && (
        <div className="waves-overlay">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="wave-line" />
          ))}
        </div>
      )}

      {/* Glow - spinning conic */}
      {bg === "glow" && <div className="glow-overlay" />}

      {/* Aurora - floating orbs */}
      {bg === "aurora" && (
        <div className="aurora-overlay">
          <div className="aurora-orb aurora-1" />
          <div className="aurora-orb aurora-2" />
          <div className="aurora-orb aurora-3" />
        </div>
      )}

      {/* Mesh - original gradient */}
      {bg === "mesh" && (
        <>
          <div className="mesh-gradient-transparent" />
          <div className="noise-overlay" />
        </>
      )}

      {/* Dropdown menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 max-h-80 overflow-y-auto glass rounded-xl shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setBg(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  bg === option.value
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-white/10 text-foreground/80"
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted">{option.desc}</div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 text-xs font-mono rounded-full glass-subtle opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
        >
          <span>{currentOption?.label}</span>
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}
