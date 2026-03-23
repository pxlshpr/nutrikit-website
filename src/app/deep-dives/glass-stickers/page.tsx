"use client";

import Link from "next/link";
import { SiteHeader, SiteFooter, FadeUp } from "../../../components/shared";
import type { ReactNode } from "react";

/* ═══════════════════ tiny reusable bits ═══════════════════ */

function Tag({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-md"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
    >
      {children}
    </span>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[0.85em] bg-purple-soft px-1.5 py-0.5 rounded text-purple">
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-bg-page border border-edge rounded-xl p-4 my-3 overflow-x-auto text-[13px] leading-relaxed">
      <pre className="whitespace-pre font-mono">
        {highlightSwift(children)}
      </pre>
    </div>
  );
}

/** Lightweight Swift syntax highlighter — no dependencies */
function highlightSwift(code: string): ReactNode[] {
  const keywords = new Set([
    "let", "var", "func", "return", "if", "else", "guard", "for", "in",
    "import", "struct", "class", "enum", "case", "switch", "default",
    "true", "false", "nil", "self", "try", "await", "async", "do",
    "catch", "throw", "throws", "static", "private", "public",
  ]);

  const typeWords = new Set([
    "CGRect", "CGFloat", "CGSize", "CGPoint", "CGImage", "CIImage",
    "UIImage", "UIWindow", "UIImageView", "UIHostingController",
    "AVAssetReader", "AVAssetWriter", "AVAssetExportSession",
    "AVMutableComposition", "AVVideoCodecType", "CVPixelBuffer",
    "CIContext", "String", "Any", "Int", "Double", "Bool",
    "UIGraphicsImageRenderer", "UIViewController",
  ]);

  // Token regex: comments, strings, numbers, dotAccess, words, other
  const tokenRx = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|(\.[a-zA-Z_]\w*)|([a-zA-Z_]\w*)|(\\\.[a-zA-Z_]\w*)|([^\s])/g;

  const result: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRx.exec(code)) !== null) {
    // Whitespace gap before this token
    if (match.index > lastIndex) {
      result.push(code.slice(lastIndex, match.index));
    }
    lastIndex = match.index + match[0].length;

    const token = match[0];
    const key = result.length;

    if (match[1]) {
      // Comment
      result.push(<span key={key} className="text-fg-faint italic">{token}</span>);
    } else if (match[2]) {
      // String
      result.push(<span key={key} className="text-green">{token}</span>);
    } else if (match[3]) {
      // Number
      result.push(<span key={key} className="text-gold">{token}</span>);
    } else if (match[6]) {
      // Keypath like \.stickerUseGlassEffect
      result.push(<span key={key} className="text-purple">{token}</span>);
    } else if (match[4]) {
      // Dot access like .zero, .hevc
      result.push(<span key={key} className="text-purple">{token}</span>);
    } else if (match[5]) {
      // Word
      if (keywords.has(token)) {
        result.push(<span key={key} className="text-pink">{token}</span>);
      } else if (typeWords.has(token)) {
        result.push(<span key={key} className="text-blue">{token}</span>);
      } else {
        result.push(<span key={key} className="text-fg-secondary">{token}</span>);
      }
    } else {
      result.push(<span key={key} className="text-fg-secondary">{token}</span>);
    }
  }

  // Trailing whitespace
  if (lastIndex < code.length) {
    result.push(code.slice(lastIndex));
  }

  return result;
}

function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[#60A5FA10] border-l-[3px] border-blue rounded-r-xl p-4 mt-3 text-sm text-fg-secondary leading-relaxed">
      <strong className="text-blue">{title}</strong> {children}
    </div>
  );
}

function PipelineStage({
  num,
  color,
  title,
  tags,
  children,
}: {
  num: number;
  color: string;
  title: string;
  tags: { label: string; color: string }[];
  children: ReactNode;
}) {
  return (
    <FadeUp>
      <div className="flex gap-4 md:gap-5">
        <div className="flex flex-col items-center gap-0 shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white z-10"
            style={{ background: color, boxShadow: `0 0 0 4px ${color}20` }}
          >
            {num}
          </div>
          <div
            className="w-0.5 flex-1 mt-1 opacity-30"
            style={{ background: color }}
          />
        </div>
        <div className="pb-8 min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-sora)] text-lg md:text-xl font-bold mb-2">
            {title}
          </h3>
          <div className="text-fg-secondary text-sm md:text-[15px] leading-relaxed space-y-3">
            {children}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((t) => (
              <Tag key={t.label} color={t.color}>
                {t.label}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ═══════════════════ Pipeline diagram (vertical) ═══════════════════ */

function DiagramStep({
  label,
  sub,
  variant = "default",
}: {
  label: string;
  sub?: string;
  variant?: "default" | "highlight" | "key" | "output";
}) {
  const bg: Record<string, string> = {
    default: "bg-bg-page border-edge",
    highlight: "bg-[#60A5FA10] border-blue/25",
    key: "bg-[#7C3AED10] border-purple/25",
    output: "bg-[#4ADE8010] border-green/25",
  };
  const text: Record<string, string> = {
    default: "text-fg",
    highlight: "text-blue",
    key: "text-purple",
    output: "text-green",
  };

  return (
    <div className={`inline-flex flex-col items-center px-4 py-2.5 rounded-lg border ${bg[variant]}`}>
      <span className={`text-sm font-semibold ${text[variant]}`}>{label}</span>
      {sub && <span className="text-[11px] font-mono text-fg-muted mt-0.5">{sub}</span>}
    </div>
  );
}

function DiagramArrow({ dir = "right" }: { dir?: "right" | "down" }) {
  return dir === "down" ? (
    <div className="flex justify-center py-1"><span className="text-fg-muted">↓</span></div>
  ) : (
    <span className="text-fg-muted mx-1">→</span>
  );
}

/* ═══════════════════ MAIN PAGE ═══════════════════ */

const BLUE = "#60A5FA";
const PURPLE = "#7C3AED";
const GREEN = "#4ADE80";
const ORANGE = "#D97706";
const RED = "#EF4444";

export default function GlassStickersPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader variant="article" />

      {/* ═══════ HERO ═══════ */}
      <section className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden px-6 pt-16">
        {/* Glow */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(96,165,250,0.08)_0%,_rgba(124,58,237,0.04)_40%,_transparent_70%)] pointer-events-none animate-[glowPulse_6s_ease-in-out_infinite]" />

        <div className="text-center relative z-10">
          <p className="text-xs font-medium text-fg-muted tracking-[0.08em] uppercase mb-4">NutriKit &middot; iOS 26 &middot; SwiftUI</p>
          <h1 className="font-[family-name:var(--font-sora)] text-[clamp(2.2rem,7vw,4rem)] font-extrabold tracking-tight leading-[1.1] mb-4">
            Shareable{" "}
            <span className="bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent bg-[length:200%_200%] animate-[shimmer_4s_ease-in-out_infinite]">
              Glass Stickers
            </span>
          </h1>
          <p className="text-fg-secondary text-[clamp(0.95rem,2.5vw,1.15rem)] max-w-[480px] mx-auto mb-9">
            How we render real liquid glass effects on meal stickers you can share as images or videos
          </p>
          <a href="#simple" className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-blue font-medium text-sm border border-blue/25 bg-[#60A5FA10] hover:bg-[#60A5FA18] transition-all hover:-translate-y-0.5">
            See How It Works <span className="animate-[bounce_2s_ease-in-out_infinite]">↓</span>
          </a>
        </div>

        {/* Glass sticker mockup */}
        <div className="relative w-[260px] h-[180px] mt-11 z-10">
          {/* Background card — dark/light variants */}
          <div className="absolute inset-0 rounded-[18px] overflow-hidden bg-gradient-to-br from-[#dbeafe] to-[#e0e7ff] dark:from-[#1a1a2e] dark:to-[#16213e]">
            <div className="absolute w-[90px] h-[90px] rounded-full bg-[radial-gradient(circle,_rgba(96,165,250,0.4),_transparent)] dark:bg-[radial-gradient(circle,_rgba(96,165,250,0.4),_transparent)] top-[10%] left-[10%] animate-[floatA_8s_ease-in-out_infinite]" />
            <div className="absolute w-[70px] h-[70px] rounded-full bg-[radial-gradient(circle,_rgba(167,139,250,0.4),_transparent)] dark:bg-[radial-gradient(circle,_rgba(167,139,250,0.4),_transparent)] top-[40%] right-[10%] animate-[floatB_8s_ease-in-out_infinite]" />
            <div className="absolute w-[50px] h-[50px] rounded-full bg-[radial-gradient(circle,_rgba(52,211,153,0.3),_transparent)] dark:bg-[radial-gradient(circle,_rgba(52,211,153,0.3),_transparent)] bottom-[10%] left-[30%] animate-[floatC_8s_ease-in-out_infinite]" />
          </div>
          {/* Glass panel — light: white frosted / dark: dark frosted */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[90px] rounded-[18px] backdrop-blur-xl overflow-hidden
            bg-white/50 border border-white/60 shadow-[0_8px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
            dark:bg-white/[0.07] dark:border-white/[0.12] dark:shadow-[0_8px_28px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div className="p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-[6px] bg-gradient-to-br from-blue to-purple opacity-70" />
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#1a1a2e] dark:text-white/85">642</span>
                  <span className="text-[10px] font-medium text-[#6B7280] dark:text-fg-muted">kcal</span>
                </div>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                <div className="flex-[4] bg-[#5ac8fa] rounded-l-full" />
                <div className="flex-[3] bg-[#ff9f43]" />
                <div className="flex-[3] bg-[#ff6b6b] rounded-r-full" />
              </div>
            </div>
            <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[60%] bg-[radial-gradient(ellipse,_rgba(255,255,255,0.12),_transparent)] dark:bg-[radial-gradient(ellipse,_rgba(255,255,255,0.12),_transparent)] -rotate-[15deg] animate-[highlightSlide_6s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ═══════ WHAT IT IS ═══════ */}
      <section className="py-20 md:py-24 px-6" id="simple">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-blue">The Idea</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-[2.4rem] font-bold tracking-tight mt-2 mb-4 leading-tight">What are glass stickers?</h2>
            <p className="text-fg-secondary leading-relaxed max-w-[620px] mb-10">
              NutriKit lets you share your meals as beautiful stickers — nutrition overlays that sit on top of your own photos or videos. The sticker looks like a piece of frosted glass: you can see the background blurred through it, light catches the edges, and the whole thing feels physical.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              {
                n: "1",
                t: "Pick your photo or video",
                d: "Choose a background from your library. The sticker appears on top with real glass effects — drag it around, pinch to resize, tap to cycle through variants.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-blue">
                    <rect x="8" y="4" width="32" height="40" rx="6" />
                    <circle cx="24" cy="20" r="8" opacity="0.5" />
                    <path d="M12 32h24" opacity="0.3" />
                    <path d="M12 36h16" opacity="0.3" />
                  </svg>
                ),
              },
              {
                n: "2",
                t: "iOS 26 does the glass",
                d: "We use Apple's native .glassEffect() — the same system that renders glass on tab bars and buttons. The glass blurs, refracts, and lights up based on what's behind it.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-blue">
                    <rect x="10" y="14" width="28" height="20" rx="6" />
                    <path d="M14 20h6" strokeWidth="2.5" />
                    <path d="M14 26h10" opacity="0.5" />
                    <circle cx="34" cy="20" r="4" opacity="0.4" />
                  </svg>
                ),
              },
              {
                n: "3",
                t: "The hard part: capturing it",
                d: "Glass effects live in Apple's compositor — they can't be exported with ImageRenderer. We capture them by drawing the actual window hierarchy, which gives us the real composited pixels.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-blue">
                    <rect x="6" y="6" width="36" height="36" rx="4" />
                    <rect x="12" y="18" width="24" height="16" rx="4" strokeDasharray="3 2" />
                    <path d="M6 6l36 36M42 6L6 42" opacity="0.15" />
                  </svg>
                ),
              },
              {
                n: "4",
                t: "For video: every single frame",
                d: "Video export renders each frame one by one — decode a frame, update the background, capture the glass compositor, write to the output. At 30fps for a 10-second video, that's 300 renders.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-blue">
                    <rect x="6" y="6" width="36" height="36" rx="4" />
                    <path d="M18 18l6 4-6 4z" fill="currentColor" opacity="0.4" />
                    <path d="M28 14v20" opacity="0.3" strokeDasharray="2 2" />
                    <path d="M32 18l-4-4-4 4" opacity="0.3" />
                  </svg>
                ),
              },
            ].map((card, i) => (
              <FadeUp key={card.n} delay={i * 0.06}>
                <div className="bg-bg-card border border-edge rounded-2xl p-6 h-full relative">
                  <span className="absolute top-3 right-4 text-[2.5rem] font-extrabold text-fg opacity-[0.03] leading-none">{card.n}</span>
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="font-[family-name:var(--font-sora)] text-base font-bold mb-2">{card.t}</h3>
                  <p className="text-fg-secondary text-sm leading-relaxed">{card.d}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="bg-[#60A5FA08] border border-[#60A5FA20] rounded-2xl p-5 md:p-6 relative overflow-hidden max-w-[700px]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA30] to-transparent" />
              <p className="text-fg-secondary text-sm leading-relaxed">
                <strong className="text-fg">Three export modes:</strong>{" "}
                Transparent PNG sticker (no background), image composite (sticker + photo), and frame-by-frame video (sticker + video with audio). Each one has a fundamentally different rendering pipeline.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════ CONTENT — wraps all remaining sections ═══════ */}
      <article className="max-w-3xl mx-auto px-6 pb-16 space-y-20 md:space-y-24">

        {/* ---------- THREE MODES ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-fg-muted">Export Modes</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">Three ways to share</h2>
            <p className="text-fg-secondary mt-3 leading-relaxed max-w-[620px]">Each mode solves a different problem — from simple SwiftUI rendering to full compositor capture to frame-by-frame video encoding.</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { n: "1", t: "Plain Sticker", fmt: "PNG", c: GREEN, d: "No background — just the nutrition sticker as a transparent PNG. Uses SwiftUI's ImageRenderer directly.", steps: ["SwiftUI View", "ImageRenderer", ".png"] },
              { n: "2", t: "Image + Sticker", fmt: "JPEG", c: BLUE, d: "Glass sticker composited onto a photo. Captured from the live screen via drawHierarchy.", steps: ["Screen Capture", "Crop 9:16", "Composite", ".jpg"] },
              { n: "3", t: "Video + Sticker", fmt: "MP4", c: PURPLE, d: "Every frame decoded, composited with glass in an offscreen window, captured, and re-encoded.", steps: ["Decode", "Glass Render", "Capture", "Encode", "Mux Audio"] },
            ].map((m, i) => (
              <FadeUp key={m.n} delay={i * 0.06}>
                <div className="bg-bg-card border border-edge rounded-2xl overflow-hidden h-full flex flex-col">
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-edge" style={{ background: `${m.c}08` }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: m.c }}>{m.n}</div>
                    <h3 className="text-sm font-semibold flex-1">{m.t}</h3>
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded" style={{ background: `${m.c}15`, color: m.c }}>{m.fmt}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <p className="text-fg-secondary text-sm leading-relaxed flex-1">{m.d}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {m.steps.map((s, si) => (
                        <span key={si} className="contents">
                          {si > 0 && <span className="text-fg-muted text-xs">→</span>}
                          <span className="font-mono font-medium px-1.5 py-0.5 rounded" style={{ background: `${BLUE}12`, color: BLUE }}>{s}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ---------- GLASS SYSTEM ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-blue">Glass System</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">The GlassBackground modifier</h2>
            <p className="text-fg-secondary mt-3 leading-relaxed max-w-[620px]">Every sticker variant wraps its content in a <Code>.glassBackground()</Code> modifier that adapts based on three environment flags — choosing between native liquid glass, semi-transparent fallbacks, or transparent mode for video compositing.</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { flag: "transparentMode = true", color: GREEN, d: "Content clipped to shape only. No background. Used during video export.", code: ".clipShape(shape)" },
              { flag: "useGlassEffect = true", color: BLUE, d: "iOS 26 native liquid glass. Blur, refraction, and specular highlights automatic.", code: ".glassEffect(.clear, in: ...)" },
              { flag: "Dark mode fallback", color: PURPLE, d: "Layered semi-transparent backgrounds with gradient border stroke.", code: "black + white + gradient stroke" },
              { flag: "Light mode fallback", color: ORANGE, d: "Semi-transparent white background with thin black border.", code: "white(0.75–0.95) + stroke" },
            ].map((b, i) => (
              <FadeUp key={b.flag} delay={i * 0.05}>
                <div className="bg-bg-card border border-edge rounded-xl overflow-hidden h-full">
                  <div className="px-4 py-2.5 text-xs font-semibold font-mono border-b border-edge" style={{ background: `${b.color}10`, color: b.color }}>{b.flag}</div>
                  <div className="p-4">
                    <p className="text-fg-secondary text-sm leading-relaxed mb-2">{b.d}</p>
                    <code className="text-[12px] font-mono text-fg-muted">{b.code}</code>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ---------- IMAGE PIPELINE ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue shadow-[0_0_6px_#60A5FA]" />
              <span className="text-xs font-bold tracking-[3px] uppercase text-blue">Image Pipeline</span>
            </div>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight">Photo export — one-shot capture</h2>
            <p className="text-fg-secondary mt-3 leading-relaxed max-w-[620px]">When the user shares a sticker on a photo, we need to composite the glass effect at full resolution. The trick: capture the glass compositor from the actual screen, then blend it onto the high-res background.</p>
          </FadeUp>
          <div>
            <PipelineStage num={1} color={BLUE} title="Crop the background" tags={[{ label: "CGImage", color: GREEN }]}>
              <p>Calculate the visible crop region in <strong>original pixel coordinates</strong> — accounting for display scale and user panning.</p>
              <CodeBlock>{`let pixelScale = imgPixelW / displayed.width
let visibleOriginX = (displayed.width - frameSize.width) / 2
                   - imagePanOffset.width
let cropRect = CGRect(
    x: visibleOriginX * pixelScale,
    y: visibleOriginY * pixelScale,
    width: frameSize.width * pixelScale,
    height: frameSize.height * pixelScale
)`}</CodeBlock>
            </PipelineStage>
            <PipelineStage num={2} color={BLUE} title="Capture the glass from screen" tags={[{ label: "UIWindow", color: GREEN }, { label: "drawHierarchy", color: PURPLE }]}>
              <p><Code>ImageRenderer</Code> can&apos;t capture glass effects — they live in Apple&apos;s compositor. Instead, we capture the <strong>actual key window</strong> via <Code>drawHierarchy</Code>.</p>
              <CodeBlock>{`let window = windowScene.windows
    .first(where: { $0.isKeyWindow })

let fullScreenImage = renderer.image { _ in
    window.drawHierarchy(
        in: window.bounds,
        afterScreenUpdates: true
    )
}`}</CodeBlock>
              <Callout title="Why drawHierarchy?">It&apos;s the only public API that captures compositor-level effects — backdrop filters, glass, and vibrancy.</Callout>
            </PipelineStage>
            <PipelineStage num={3} color={BLUE} title="Composite at full resolution" tags={[{ label: "UIGraphicsImageRenderer", color: GREEN }]}>
              <p>Two images layered: <strong>full-res cropped background</strong> and <strong>screen capture with glass</strong>. The blur makes the upscale imperceptible.</p>
              <CodeBlock>{`let finalImage = renderer.image { _ in
    UIImage(cgImage: croppedBgCG).draw(in: fullRect)
    UIImage(cgImage: screenCropCG).draw(in: fullRect)
}`}</CodeBlock>
            </PipelineStage>
            <PipelineStage num={4} color={BLUE} title="Export as JPEG" tags={[{ label: "JPEG 95%", color: ORANGE }, { label: "UIActivityViewController", color: GREEN }]}>
              <p>Compressed to JPEG at 95% quality, saved to a temp file, presented via the system share sheet.</p>
            </PipelineStage>
          </div>
          <FadeUp>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "1", l: "drawHierarchy call", c: BLUE },
                { v: "Full-res", l: "Background quality", c: BLUE },
                { v: "9:16", l: "Story aspect ratio", c: BLUE },
              ].map((s) => (
                <div key={s.l} className="bg-bg-card border border-edge rounded-2xl py-5 px-3 text-center">
                  <div className="text-lg md:text-xl font-bold mb-1" style={{ color: s.c }}>{s.v}</div>
                  <div className="text-[11px] text-fg-muted leading-tight">{s.l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* ---------- VIDEO PIPELINE ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-purple shadow-[0_0_6px_#7C3AED]" />
              <span className="text-xs font-bold tracking-[3px] uppercase text-purple">Video Pipeline</span>
            </div>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight">Video export — frame by frame</h2>
            <p className="text-fg-secondary mt-3 leading-relaxed max-w-[620px]">Video is where things get wild. We can&apos;t just overlay a static sticker — the glass effect must update every frame because the background changes. So we decode each frame, render it into an offscreen window with the glass sticker, capture the compositor output, and encode it to a new video.</p>
          </FadeUp>
          <div>
            <PipelineStage num={1} color={PURPLE} title="Build the offscreen render window" tags={[{ label: "UIWindow", color: GREEN }, { label: "UIHostingController", color: PURPLE }]}>
              <p>A hidden <Code>UIWindow</Code> at level <Code>-1000</Code>. Inside: a <Code>UIImageView</Code> for video frames, and a <Code>UIHostingController</Code> with <Code>.glassEffect</Code>.</p>
              <CodeBlock>{`let window = UIWindow(windowScene: windowScene)
window.windowLevel = UIWindow.Level(rawValue: -1000)
window.isHidden = false  // must be visible to compositor

let stickerContent = variant.stickerView(for: meal)
    .environment(\\.stickerUseGlassEffect, true)
let hostingVC = UIHostingController(rootView: stickerContent)`}</CodeBlock>
              <Callout title="Why a real UIWindow?">Glass effects require the compositor. The window must be isHidden = false — we just push it behind everything else.</Callout>
            </PipelineStage>
            <PipelineStage num={2} color={PURPLE} title="Decode video frames" tags={[{ label: "AVAssetReader", color: RED }, { label: "CIImage", color: ORANGE }]}>
              <p>Each frame via <Code>AVAssetReader</Code> as <Code>32BGRA</Code>. We handle orientation via <Code>CIImage.oriented()</Code>, then crop to the 9:16 export region.</p>
              <CodeBlock>{`var frameCI = CIImage(cvPixelBuffer: pixelBuffer)
frameCI = frameCI.oriented(videoOrientation)
frameCI = frameCI
    .cropped(to: cropRect)
    .transformed(by: CGAffineTransform(
        translationX: -cropRect.origin.x,
        y: -cropRect.origin.y
    ))`}</CodeBlock>
            </PipelineStage>
            <PipelineStage num={3} color={PURPLE} title="Two-pass glass capture" tags={[{ label: "drawHierarchy ×2", color: GREEN }, { label: "Compositor", color: PURPLE }]}>
              <p>The heart of the video pipeline. For each frame, a <strong>two-pass drawHierarchy</strong>:</p>
              <ul className="list-none space-y-1 my-2">
                <li className="flex gap-2"><span className="text-purple shrink-0">▸</span><span><strong>Pass 1:</strong> Force the compositor to process the new background</span></li>
                <li className="flex gap-2"><span className="text-purple shrink-0">▸</span><span><strong>Pass 2:</strong> Capture the output with glass now reflecting the current frame</span></li>
              </ul>
              <CodeBlock>{`backgroundImageView.image = frameUIImage
renderWindow.rootViewController?.view.layoutIfNeeded()

// Pass 1: force compositor update
_ = renderer.image { _ in
    renderWindow.drawHierarchy(
        in: renderWindow.bounds, afterScreenUpdates: true)
}

// Pass 2: capture with glass reflecting current frame
let captured = renderer.image { _ in
    renderWindow.drawHierarchy(
        in: renderWindow.bounds, afterScreenUpdates: true)
}`}</CodeBlock>
              <Callout title="Why two passes?">The glass compositor is async. The first pass forces layout; the second captures the fully-updated output.</Callout>
            </PipelineStage>
            <PipelineStage num={4} color={PURPLE} title="Encode to HEVC" tags={[{ label: "AVAssetWriter", color: RED }, { label: "HEVC", color: ORANGE }]}>
              <p>Captured bitmap → <Code>CVPixelBuffer</Code> via <Code>CIContext.render()</Code> → <Code>AVAssetWriter</Code>. HEVC-encoded at export frame size × screen scale.</p>
            </PipelineStage>
            <PipelineStage num={5} color={PURPLE} title="Mux audio back in" tags={[{ label: "AVMutableComposition", color: RED }, { label: "Passthrough", color: GREEN }]}>
              <p>Original audio re-attached via <Code>AVMutableComposition</Code> + <Code>AVAssetExportSession</Code> with passthrough — no re-encoding.</p>
            </PipelineStage>
            <PipelineStage num={6} color={PURPLE} title="Clean up and share" tags={[{ label: "UIActivityViewController", color: GREEN }]}>
              <p>Offscreen window deallocated. Intermediate file deleted. Final MP4 presented via share sheet with progress bar throughout.</p>
            </PipelineStage>
          </div>
          <FadeUp>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "2×", l: "drawHierarchy per frame", c: PURPLE },
                { v: "HEVC", l: "Video codec", c: PURPLE },
                { v: "No re-encode", l: "Audio mux", c: PURPLE },
              ].map((s) => (
                <div key={s.l} className="bg-bg-card border border-edge rounded-2xl py-5 px-3 text-center">
                  <div className="text-lg md:text-xl font-bold mb-1" style={{ color: s.c }}>{s.v}</div>
                  <div className="text-[11px] text-fg-muted leading-tight">{s.l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* ---------- ARCHITECTURE DIAGRAMS ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-fg-muted">Architecture</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">Full pipeline diagrams</h2>
          </FadeUp>

          {/* IMAGE diagram — centered vertical */}
          <FadeUp>
            <div className="bg-bg-card border border-edge rounded-2xl p-5 md:p-6">
              <h3 className="text-base font-bold text-blue mb-5">Image Export</h3>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <DiagramStep label="User's Photo" sub="UIImage" />
                  <DiagramArrow />
                  <DiagramStep label="Crop to 9:16" sub="CGImage.cropping()" />
                </div>
                <DiagramArrow dir="down" />
                <DiagramStep label="Full-Res Background" variant="highlight" />

                <div className="text-fg-muted text-lg py-1">+</div>

                <div className="flex items-center gap-2">
                  <DiagramStep label="Live Screen" sub="Key Window" />
                  <DiagramArrow />
                  <DiagramStep label="drawHierarchy" />
                </div>
                <DiagramArrow dir="down" />
                <div className="flex items-center gap-2">
                  <DiagramStep label="Crop 9:16" sub="previewGlobalFrame" />
                  <DiagramArrow />
                  <DiagramStep label="Glass Overlay" variant="highlight" />
                </div>

                <DiagramArrow dir="down" />
                <DiagramStep label="Composite → JPEG 95%" variant="output" />
              </div>
            </div>
          </FadeUp>

          {/* VIDEO diagram — centered vertical */}
          <FadeUp>
            <div className="bg-bg-card border border-edge rounded-2xl p-5 md:p-6">
              <h3 className="text-base font-bold text-purple mb-5">Video Export</h3>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <DiagramStep label="Source Video" sub="AVAssetReader" />
                  <DiagramArrow />
                  <DiagramStep label="Decode Frame" sub="CVPixelBuffer → CIImage" />
                </div>
                <DiagramArrow dir="down" />
                <DiagramStep label="Orient + Crop" sub=".oriented() · .cropped()" />
                <DiagramArrow dir="down" />
                <DiagramStep label="UIImageView" sub="in offscreen UIWindow" />
                <DiagramArrow dir="down" />
                <DiagramStep label="drawHierarchy × 2" sub="Glass compositor capture" variant="key" />
                <DiagramArrow dir="down" />
                <div className="flex items-center gap-2">
                  <DiagramStep label="CIContext.render" sub="→ CVPixelBuffer" />
                  <DiagramArrow />
                  <DiagramStep label="AVAssetWriter" sub="HEVC encode" />
                </div>
                <DiagramArrow dir="down" />
                <div className="flex items-center gap-2">
                  <DiagramStep label="Mux Audio" sub="AVMutableComposition" />
                  <DiagramArrow />
                  <DiagramStep label="Final .mp4" variant="output" />
                </div>
                <p className="text-xs font-medium text-purple mt-3 tracking-wider">← repeat for every frame →</p>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ---------- COMPARISON ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-fg-muted">Side by Side</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">Image vs Video</h2>
          </FadeUp>
          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { t: "Image Export", c: BLUE, items: [<>Single <strong>drawHierarchy</strong> call on live key window</>, "Background cropped from original full-res image", "Glass captured at screen resolution, composited over full-res", "Output: JPEG at 95% quality", "Near-instant — feels immediate", "No offscreen window needed"] },
                { t: "Video Export", c: PURPLE, items: [<><strong>Two drawHierarchy calls per frame</strong> on offscreen window</>, "Each frame decoded via AVAssetReader + CIImage", "Offscreen UIWindow with real glass compositor", "Output: HEVC-encoded MP4 with muxed audio", "Progress bar — can take 10–30s", "Cancellable via Task with cleanup"] },
              ].map((col) => (
                <div key={col.t} className="bg-bg-card border border-edge rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-edge" style={{ background: `${col.c}08` }}>
                    <h3 className="font-semibold" style={{ color: col.c }}>{col.t}</h3>
                  </div>
                  <ul className="p-5 space-y-3 text-sm text-fg-secondary">
                    {col.items.map((item, i) => (
                      <li key={i} className="flex gap-2"><span className="text-fg-muted shrink-0">→</span><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* ---------- KEY INSIGHT ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-blue">Key Insight</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">Why drawHierarchy is everything</h2>
            <p className="text-fg-secondary mt-3 leading-relaxed max-w-[620px]">The entire sticker export system is built around one limitation: <strong>glass effects can&apos;t be captured through SwiftUI&apos;s ImageRenderer</strong>. They only exist in the compositor.</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "✕", t: "ImageRenderer", d: "Renders the SwiftUI view tree directly — but glass effects are compositor-level. You get a flat, un-glassed render." },
              { icon: "✓", t: "drawHierarchy", d: "Captures what the CALayer tree actually looks like on screen — including backdrop filters, glass, and blending." },
              { icon: "⚡", t: "The tradeoff", d: "drawHierarchy is slow — it forces a full compositor pass. For video, hundreds of calls = progress bar." },
              { icon: "⎕", t: "The UIWindow trick", d: "For video, we can't use the live screen. So we create a hidden window at level -1000 — invisible but composited." },
            ].map((card, i) => (
              <FadeUp key={card.t} delay={i * 0.05}>
                <div className="bg-bg-card border border-edge rounded-xl p-5 h-full">
                  <div className="text-xl mb-2 opacity-60">{card.icon}</div>
                  <h4 className="font-[family-name:var(--font-sora)] font-bold mb-1.5">{card.t}</h4>
                  <p className="text-fg-secondary text-sm leading-relaxed">{card.d}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ---------- STICKER VARIANTS ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-fg-muted">Variants</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">5 sticker designs</h2>
            <p className="text-fg-secondary mt-3 leading-relaxed max-w-[620px]">Each variant uses the same glass system but shows different levels of detail. The user swipes through them in a carousel (no background) or taps to cycle (with background).</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Minimal */}
            <FadeUp>
              <div className="bg-bg-card border border-edge rounded-2xl p-5 h-full">
                <div className="text-sm font-semibold mb-3">Minimal</div>
                {/* Mini preview */}
                <div className="bg-bg-page/60 border border-edge rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-[5px] bg-gradient-to-br from-blue to-purple opacity-60" />
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold">642</span>
                        <span className="text-[9px] text-fg-muted">kcal</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b]" /><span className="text-[9px] font-medium">42g</span></div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#5ac8fa]" /><span className="text-[9px] font-medium">68g</span></div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#ff9f43]" /><span className="text-[9px] font-medium">28g</span></div>
                    </div>
                  </div>
                  <div className="flex h-1 rounded-full overflow-hidden mt-2 gap-px">
                    <div className="flex-[4] bg-[#5ac8fa] rounded-l-full" />
                    <div className="flex-[3] bg-[#ff9f43]" />
                    <div className="flex-[3] bg-[#ff6b6b] rounded-r-full" />
                  </div>
                </div>
                <div className="text-xs text-fg-secondary leading-relaxed">App icon + calories + macro dots + distribution bar. Compact single row.</div>
              </div>
            </FadeUp>

            {/* Standard */}
            <FadeUp delay={0.06}>
              <div className="bg-bg-card border border-edge rounded-2xl p-5 h-full">
                <div className="text-sm font-semibold mb-3">Standard</div>
                <div className="bg-bg-page/60 border border-edge rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-[5px] bg-gradient-to-br from-blue to-purple opacity-60" />
                      <div>
                        <div className="text-[10px] font-bold leading-none">Lunch</div>
                        <div className="text-[8px] text-fg-muted">12:30 PM</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold bg-white/5 px-2 py-0.5 rounded-full">642 kcal</div>
                  </div>
                  <div className="h-px bg-edge mb-2" />
                  <div className="grid grid-cols-3 gap-1 text-center mb-2">
                    <div><span className="text-[10px] font-bold">42g</span><div className="text-[7px] text-fg-muted">Protein</div></div>
                    <div><span className="text-[10px] font-bold">68g</span><div className="text-[7px] text-fg-muted">Carbs</div></div>
                    <div><span className="text-[10px] font-bold">28g</span><div className="text-[7px] text-fg-muted">Fat</div></div>
                  </div>
                  <div className="flex h-1 rounded-full overflow-hidden gap-px">
                    <div className="flex-[4] bg-[#5ac8fa] rounded-l-full" />
                    <div className="flex-[3] bg-[#ff9f43]" />
                    <div className="flex-[3] bg-[#ff6b6b] rounded-r-full" />
                  </div>
                </div>
                <div className="text-xs text-fg-secondary leading-relaxed">Header with meal name/time, calorie badge, macro columns with indicators.</div>
              </div>
            </FadeUp>

            {/* Detailed */}
            <FadeUp delay={0.12}>
              <div className="bg-bg-card border border-edge rounded-2xl p-5 h-full">
                <div className="text-sm font-semibold mb-3">Detailed</div>
                <div className="bg-bg-page/60 border border-edge rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-[5px] bg-gradient-to-br from-blue to-purple opacity-60" />
                      <div className="text-[10px] font-bold">Lunch</div>
                    </div>
                    <div className="text-[10px] font-semibold bg-white/5 px-2 py-0.5 rounded-full">642</div>
                  </div>
                  <div className="h-px bg-edge mb-2" />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-fg-secondary">Grilled Chicken</span>
                      <div className="flex h-1 w-10 rounded-full overflow-hidden gap-px">
                        <div className="flex-[2] bg-[#ff6b6b]" /><div className="flex-[1] bg-[#5ac8fa]" /><div className="flex-[1] bg-[#ff9f43]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-fg-secondary">Brown Rice</span>
                      <div className="flex h-1 w-8 rounded-full overflow-hidden gap-px">
                        <div className="flex-[1] bg-[#ff6b6b]" /><div className="flex-[5] bg-[#5ac8fa]" /><div className="flex-[1] bg-[#ff9f43]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-fg-secondary">Avocado</span>
                      <div className="flex h-1 w-6 rounded-full overflow-hidden gap-px">
                        <div className="flex-[1] bg-[#ff6b6b]" /><div className="flex-[1] bg-[#5ac8fa]" /><div className="flex-[4] bg-[#ff9f43]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-fg-secondary leading-relaxed">Full layout with food item list. Each item gets its own per-item macro bar.</div>
              </div>
            </FadeUp>

            {/* Detailed + Emoji */}
            <FadeUp delay={0.18}>
              <div className="bg-bg-card border border-edge rounded-2xl p-5 h-full">
                <div className="text-sm font-semibold mb-3">Detailed + Emoji</div>
                <div className="bg-bg-page/60 border border-edge rounded-xl p-3 mb-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5"><span className="text-xs">🍗</span><span className="text-[9px] text-fg-secondary">Grilled Chicken</span></div>
                      <div className="flex h-1 w-10 rounded-full overflow-hidden gap-px">
                        <div className="flex-[2] bg-[#ff6b6b]" /><div className="flex-[1] bg-[#5ac8fa]" /><div className="flex-[1] bg-[#ff9f43]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5"><span className="text-xs">🍚</span><span className="text-[9px] text-fg-secondary">Brown Rice</span></div>
                      <div className="flex h-1 w-8 rounded-full overflow-hidden gap-px">
                        <div className="flex-[1] bg-[#ff6b6b]" /><div className="flex-[5] bg-[#5ac8fa]" /><div className="flex-[1] bg-[#ff9f43]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5"><span className="text-xs">🥑</span><span className="text-[9px] text-fg-secondary">Avocado</span></div>
                      <div className="flex h-1 w-6 rounded-full overflow-hidden gap-px">
                        <div className="flex-[1] bg-[#ff6b6b]" /><div className="flex-[1] bg-[#5ac8fa]" /><div className="flex-[4] bg-[#ff9f43]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-fg-secondary leading-relaxed">Same as detailed but with food emoji icons next to each item.</div>
              </div>
            </FadeUp>

            {/* Full Detail */}
            <FadeUp delay={0.24}>
              <div className="bg-bg-card border border-edge rounded-2xl p-5 h-full">
                <div className="text-sm font-semibold mb-3">Full Detail</div>
                <div className="bg-bg-page/60 border border-edge rounded-xl p-3 mb-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">🍗</span>
                        <div><span className="text-[9px]">Grilled Chicken</span><span className="text-[8px] text-fg-muted">, breast</span></div>
                      </div>
                      <div className="flex h-1 w-8 rounded-full overflow-hidden gap-px">
                        <div className="flex-[2] bg-[#ff6b6b]" /><div className="flex-[1] bg-[#5ac8fa]" /><div className="flex-[1] bg-[#ff9f43]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">🍚</span>
                        <div><span className="text-[9px]">Brown Rice</span><span className="text-[8px] text-fg-muted">, long grain</span></div>
                      </div>
                      <div className="flex h-1 w-6 rounded-full overflow-hidden gap-px">
                        <div className="flex-[1] bg-[#ff6b6b]" /><div className="flex-[5] bg-[#5ac8fa]" /><div className="flex-[1] bg-[#ff9f43]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-fg-secondary leading-relaxed">Everything — emoji, food detail text, brand names. The maximalist option.</div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ---------- TECH STACK ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <span className="text-xs font-bold tracking-[3px] uppercase text-fg-muted">Technology</span>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">The stack</h2>
          </FadeUp>
          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "SwiftUI Layer", items: [[".glassEffect(.clear)", "Native liquid glass"], ["GlassBackground", "Custom ViewModifier"], ["StickerPalette", "Glass-aware colors"], ["TextElementBackground", "Inner element materials"], ["Environment flags", "opacity · glass · transparent"]] },
                { title: "Capture + Export Layer", items: [["drawHierarchy", "Compositor capture"], ["UIWindow (level -1000)", "Offscreen render target"], ["AVAssetReader/Writer", "Frame decode/encode"], ["CIContext + CIImage", "Orient, crop, render"], ["AVMutableComposition", "Audio muxing"], ["UIHostingController", "SwiftUI → UIKit bridge"]] },
              ].map((card) => (
                <div key={card.title} className="bg-bg-card border border-edge rounded-2xl p-5">
                  <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-fg-muted mb-4">{card.title}</h4>
                  <div className="space-y-3">
                    {card.items.map(([code, desc]) => (
                      <div key={code} className="flex items-center justify-between gap-3 py-2 border-b border-edge/50 last:border-0">
                        <code className="font-mono text-xs text-purple bg-purple-soft px-2 py-0.5 rounded shrink-0 truncate max-w-[55%]">{code}</code>
                        <span className="text-xs text-fg-muted text-right">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>
      </article>

      {/* CTA */}
      <section className="py-16 md:py-20 px-6" style={{ background: "linear-gradient(to bottom, #60A5FA06 0%, var(--color-bg-page) 100%)" }}>
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold tracking-tight">Try the glass stickers yourself</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link href="/#download" className="inline-block bg-purple hover:bg-purple/90 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              Get the Beta
            </Link>
          </FadeUp>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
