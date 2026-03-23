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
      <pre className="whitespace-pre font-mono text-fg-secondary">{children}</pre>
    </div>
  );
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

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-bg-card border border-edge rounded-2xl p-5 text-center">
      <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-fg-muted">{label}</div>
    </div>
  );
}

/* ═══════════════════ arch diagram nodes ═══════════════════ */

function ArchNode({
  label,
  sub,
  variant,
}: {
  label: string;
  sub?: string;
  variant?: "highlight" | "key" | "output" | "default";
}) {
  const styles: Record<string, string> = {
    default: "border-edge bg-bg-page",
    highlight: "border-blue/30 bg-[#60A5FA10]",
    key: "border-purple/30 bg-[#7C3AED10]",
    output: "border-green/30 bg-[#4ADE8010]",
  };
  const labelColors: Record<string, string> = {
    default: "",
    highlight: "text-blue",
    key: "text-purple",
    output: "text-green",
  };
  const v = variant ?? "default";

  return (
    <div
      className={`border rounded-lg px-3 py-2 text-center shrink-0 ${styles[v]}`}
    >
      <div className={`text-xs md:text-sm font-semibold whitespace-nowrap ${labelColors[v]}`}>
        {label}
      </div>
      {sub && (
        <div className="text-[10px] md:text-xs text-fg-muted font-mono mt-0.5 whitespace-nowrap">
          {sub}
        </div>
      )}
    </div>
  );
}

function Arrow() {
  return <span className="text-fg-muted text-lg shrink-0">→</span>;
}

function ArrowDown() {
  return (
    <div className="flex justify-center py-1">
      <span className="text-fg-muted text-lg">↓</span>
    </div>
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

      {/* Breadcrumb */}
      <div className="pt-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[13px]">
          <Link
            href="/deep-dives"
            className="text-fg-muted hover:text-fg transition-colors"
          >
            Deep Dives
          </Link>
          <span className="text-fg-muted">/</span>
          <span className="font-semibold text-blue">Glass Stickers</span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="px-6 md:px-12 pt-10 pb-14 md:pt-14 md:pb-18"
        style={{
          background:
            "radial-gradient(ellipse at center, #60A5FA08 0%, transparent 70%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
          <FadeUp>
            <span className="text-[11px] font-bold tracking-[3px] uppercase text-blue">
              Deep Dive
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Shareable Glass Stickers
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-fg-secondary text-base md:text-lg leading-relaxed max-w-xl">
              How we render real iOS 26 liquid glass effects on meal stickers
              you can share as images or videos.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              <Tag color={BLUE}>SwiftUI</Tag>
              <Tag color={ORANGE}>Metal</Tag>
              <Tag color={RED}>AVFoundation</Tag>
              <Tag color={GREEN}>Core Animation</Tag>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════ CONTENT ════════════════════ */}
      <article className="max-w-3xl mx-auto px-6 md:px-12 pb-16 space-y-16 md:space-y-20">
        {/* ---------- WHAT IT IS ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div>
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-blue">
                The Idea
              </span>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">
                What are glass stickers?
              </h2>
            </div>
          </FadeUp>
          <FadeUp>
            <p className="text-fg-secondary leading-relaxed">
              NutriKit lets you share your meals as beautiful stickers —
              nutrition overlays that sit on top of your own photos or videos.
              The sticker looks like a piece of frosted glass: you can see the
              background blurred through it, light catches the edges, and the
              whole thing feels physical.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                n: "1",
                t: "Pick your photo or video",
                d: "Choose a background from your library. The sticker appears on top with real glass effects — drag it around, pinch to resize, tap to cycle through variants.",
              },
              {
                n: "2",
                t: "iOS 26 does the glass",
                d: "We use Apple's native .glassEffect() — the same system that renders glass on tab bars and buttons. The glass blurs, refracts, and lights up based on what's behind it.",
              },
              {
                n: "3",
                t: "The hard part: capturing it",
                d: "Glass effects live in Apple's compositor — they can't be exported with ImageRenderer. We capture them by drawing the actual window hierarchy, which gives us the real composited pixels.",
              },
              {
                n: "4",
                t: "For video: every single frame",
                d: "Video export renders each frame one by one — decode a frame, update the background, capture the glass compositor, write to the output. At 30fps for a 10-second clip, that's 300 renders.",
              },
            ].map((card, i) => (
              <FadeUp key={card.n} delay={i * 0.06}>
                <div className="bg-bg-card border border-edge rounded-2xl p-5 md:p-6 h-full relative">
                  <span className="absolute top-3 right-4 text-3xl font-extrabold text-fg opacity-[0.03]">
                    {card.n}
                  </span>
                  <h3 className="font-[family-name:var(--font-sora)] text-base font-bold mb-2">
                    {card.t}
                  </h3>
                  <p className="text-fg-secondary text-sm leading-relaxed">
                    {card.d}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="bg-[#60A5FA08] border border-[#60A5FA20] rounded-2xl p-5 md:p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA30] to-transparent" />
              <p className="text-fg-secondary text-sm leading-relaxed">
                <strong className="text-fg">Three export modes:</strong>{" "}
                Transparent PNG sticker (no background), image composite
                (sticker + photo), and frame-by-frame video (sticker + video
                with audio). Each one has a fundamentally different rendering
                pipeline.
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ---------- THREE MODES ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div>
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-fg-muted">
                Export Modes
              </span>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">
                Three ways to share
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                n: "1",
                t: "Plain Sticker",
                fmt: "PNG",
                fmtColor: GREEN,
                numColor: GREEN,
                d: "No background — just the nutrition sticker as a transparent PNG. Uses SwiftUI's ImageRenderer directly.",
                steps: ["SwiftUI View", "ImageRenderer", ".png"],
              },
              {
                n: "2",
                t: "Image + Sticker",
                fmt: "JPEG",
                fmtColor: BLUE,
                numColor: BLUE,
                d: "Glass sticker composited onto a photo. Captured from the live screen via drawHierarchy.",
                steps: ["Screen Capture", "Crop 9:16", "Composite", ".jpg"],
              },
              {
                n: "3",
                t: "Video + Sticker",
                fmt: "MP4",
                fmtColor: PURPLE,
                numColor: PURPLE,
                d: "Every frame decoded, composited with glass in an offscreen window, captured, and re-encoded.",
                steps: [
                  "Decode",
                  "Glass Render",
                  "Capture",
                  "Encode",
                  "Mux Audio",
                ],
              },
            ].map((mode, i) => (
              <FadeUp key={mode.n} delay={i * 0.06}>
                <div className="bg-bg-card border border-edge rounded-2xl overflow-hidden h-full flex flex-col">
                  <div
                    className="px-5 py-4 flex items-center gap-3 border-b border-edge"
                    style={{ background: `${mode.numColor}08` }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: mode.numColor }}
                    >
                      {mode.n}
                    </div>
                    <h3 className="text-sm font-semibold flex-1">{mode.t}</h3>
                    <span
                      className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{
                        background: `${mode.fmtColor}15`,
                        color: mode.fmtColor,
                      }}
                    >
                      {mode.fmt}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <p className="text-fg-secondary text-sm leading-relaxed flex-1">
                      {mode.d}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {mode.steps.map((s, si) => (
                        <span key={si} className="contents">
                          {si > 0 && (
                            <span className="text-fg-muted text-xs">→</span>
                          )}
                          <span
                            className="font-mono font-medium px-1.5 py-0.5 rounded"
                            style={{
                              background: `${BLUE}12`,
                              color: BLUE,
                            }}
                          >
                            {s}
                          </span>
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
            <div>
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-blue">
                Glass System
              </span>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">
                The GlassBackground modifier
              </h2>
              <p className="text-fg-secondary mt-3 leading-relaxed">
                Every sticker variant wraps its content in a{" "}
                <Code>.glassBackground()</Code> modifier that adapts based on
                three environment flags — choosing between native liquid glass,
                semi-transparent fallbacks, or transparent mode for video
                compositing.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                flag: "transparentMode = true",
                color: GREEN,
                d: "Content clipped to shape only. No background. Used during video export — the offscreen window's drawHierarchy captures the glass from the host window.",
                code: ".clipShape(shape)",
              },
              {
                flag: "useGlassEffect = true",
                color: BLUE,
                d: "iOS 26 native liquid glass. The system handles blur, refraction, and specular highlights automatically.",
                code: '.glassEffect(.clear, in: RoundedRectangle(...))',
              },
              {
                flag: "Dark mode fallback",
                color: PURPLE,
                d: "Layered semi-transparent backgrounds — black + white opacity overlay — with a gradient border stroke to simulate glass edges.",
                code: "black(0.30–0.85) + white(0.08–0.25) + gradient stroke",
              },
              {
                flag: "Light mode fallback",
                color: ORANGE,
                d: "Simple semi-transparent white background with a thin black border. Clean and readable.",
                code: "white(0.75–0.95) + black(0.1) stroke",
              },
            ].map((b, i) => (
              <FadeUp key={b.flag} delay={i * 0.05}>
                <div className="bg-bg-card border border-edge rounded-xl overflow-hidden h-full">
                  <div
                    className="px-4 py-2.5 text-xs font-semibold font-mono border-b border-edge"
                    style={{ background: `${b.color}10`, color: b.color }}
                  >
                    {b.flag}
                  </div>
                  <div className="p-4">
                    <p className="text-fg-secondary text-sm leading-relaxed mb-2">
                      {b.d}
                    </p>
                    <code className="text-[12px] font-mono text-fg-muted">
                      {b.code}
                    </code>
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
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-blue">
                Image Pipeline
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight">
              Photo export — one-shot capture
            </h2>
            <p className="text-fg-secondary mt-3 leading-relaxed">
              When the user shares a sticker on a photo, we composite the glass
              effect at full resolution. The trick: capture the glass compositor
              from the actual screen, then blend it onto the high-res
              background.
            </p>
          </FadeUp>

          <div>
            <PipelineStage
              num={1}
              color={BLUE}
              title="Crop the background"
              tags={[{ label: "CGImage", color: GREEN }]}
            >
              <p>
                The user&apos;s photo is aspect-fill displayed in a 9:16 frame
                with pan support. We calculate the visible crop region in{" "}
                <strong>original pixel coordinates</strong> — accounting for the
                display scale and any user panning.
              </p>
              <CodeBlock>{`// Scale from display points to image pixels
let pixelScale = imgPixelW / displayed.width

// Viewport origin (accounting for pan)
let visibleOriginX = (displayed.width - frameSize.width) / 2
                   - imagePanOffset.width

// Convert to pixel crop rect
let cropRect = CGRect(
    x: visibleOriginX * pixelScale,
    y: visibleOriginY * pixelScale,
    width: frameSize.width * pixelScale,
    height: frameSize.height * pixelScale
)`}</CodeBlock>
            </PipelineStage>

            <PipelineStage
              num={2}
              color={BLUE}
              title="Capture the glass from screen"
              tags={[
                { label: "UIWindow", color: GREEN },
                { label: "drawHierarchy", color: PURPLE },
              ]}
            >
              <p>
                <Code>ImageRenderer</Code> can&apos;t capture glass effects —
                they live in Apple&apos;s compositor, outside SwiftUI&apos;s
                render tree. Instead, we capture the{" "}
                <strong>actual key window</strong> via{" "}
                <Code>drawHierarchy</Code>.
              </p>
              <CodeBlock>{`// Get the actual app window
let window = windowScene.windows
    .first(where: { $0.isKeyWindow })

// Render the entire window to a bitmap
let fullScreenImage = renderer.image { _ in
    window.drawHierarchy(
        in: window.bounds,
        afterScreenUpdates: true
    )
}

// Crop to just the 9:16 export frame
let screenCropRect = CGRect(
    x: previewGlobalFrame.origin.x * screenScale,
    y: previewGlobalFrame.origin.y * screenScale,
    ...
)`}</CodeBlock>
              <Callout title="Why drawHierarchy?">
                It&apos;s the only public API that captures compositor-level
                effects. It renders the full CALayer tree including backdrop
                filters, glass effects, and vibrancy.
              </Callout>
            </PipelineStage>

            <PipelineStage
              num={3}
              color={BLUE}
              title="Composite at full resolution"
              tags={[{ label: "UIGraphicsImageRenderer", color: GREEN }]}
            >
              <p>
                Two images layered: the <strong>full-res cropped background</strong>{" "}
                and the <strong>screen capture with glass</strong>. The screen
                capture scales up to match the full-res background — the blur
                makes this imperceptible.
              </p>
              <CodeBlock>{`let finalImage = renderer.image { _ in
    // Full-res background (sharp, original quality)
    UIImage(cgImage: croppedBgCG).draw(in: fullRect)

    // Screen capture with glass (scaled up)
    UIImage(cgImage: screenCropCG).draw(in: fullRect)
}`}</CodeBlock>
            </PipelineStage>

            <PipelineStage
              num={4}
              color={BLUE}
              title="Export as JPEG"
              tags={[
                { label: "JPEG 95%", color: ORANGE },
                { label: "UIActivityViewController", color: GREEN },
              ]}
            >
              <p>
                Final image compressed to JPEG at 95% quality, saved to a temp
                file, and presented via the system share sheet — ready for
                Instagram Stories, iMessage, or anywhere else.
              </p>
            </PipelineStage>
          </div>

          <FadeUp>
            <div className="grid grid-cols-3 gap-3">
              <StatCard value="1" label="drawHierarchy call" color={BLUE} />
              <StatCard value="Full-res" label="Background quality" color={BLUE} />
              <StatCard value="9:16" label="Story aspect ratio" color={BLUE} />
            </div>
          </FadeUp>
        </section>

        {/* ---------- VIDEO PIPELINE ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-purple shadow-[0_0_6px_#7C3AED]" />
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-purple">
                Video Pipeline
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight">
              Video export — frame by frame
            </h2>
            <p className="text-fg-secondary mt-3 leading-relaxed">
              Video is where things get wild. We can&apos;t just overlay a
              static sticker — the glass effect must update every frame because
              the background changes. So we decode each frame, render it into
              an offscreen window with the glass sticker, capture the
              compositor output, and encode it to a new video.
            </p>
          </FadeUp>

          <div>
            <PipelineStage
              num={1}
              color={PURPLE}
              title="Build the offscreen render window"
              tags={[
                { label: "UIWindow", color: GREEN },
                { label: "UIHostingController", color: PURPLE },
              ]}
            >
              <p>
                We create a hidden <Code>UIWindow</Code> sized to the export
                frame. Inside it: a <Code>UIImageView</Code> for the video
                frame background, and a <Code>UIHostingController</Code>{" "}
                hosting the SwiftUI sticker view with{" "}
                <Code>.glassEffect</Code> enabled.
              </p>
              <p>
                The window is positioned at window level <Code>-1000</Code> so
                it&apos;s invisible to the user but still part of the
                compositor pipeline.
              </p>
              <CodeBlock>{`let window = UIWindow(windowScene: windowScene)
window.frame = CGRect(origin: .zero, size: exportFrameSize)
window.windowLevel = UIWindow.Level(rawValue: -1000)
window.isHidden = false  // must be visible to compositor

// Background: UIImageView (updated per frame)
let imageView = UIImageView(frame: ...)
rootVC.view.addSubview(imageView)

// Sticker: UIHostingController with glass effect
let stickerContent = variant.stickerView(for: meal)
    .environment(\\.stickerUseGlassEffect, true)
let hostingVC = UIHostingController(rootView: stickerContent)`}</CodeBlock>
              <Callout title="Why a real UIWindow?">
                Glass effects require the compositor to actually render the view
                hierarchy. An offscreen render target wouldn&apos;t trigger the
                compositor. The window must be <Code>isHidden = false</Code> —
                we just push it behind everything else.
              </Callout>
            </PipelineStage>

            <PipelineStage
              num={2}
              color={PURPLE}
              title="Decode video frames"
              tags={[
                { label: "AVAssetReader", color: RED },
                { label: "CIImage", color: ORANGE },
              ]}
            >
              <p>
                <Code>AVAssetReader</Code> with a track output set to{" "}
                <Code>32BGRA</Code> pixel format. Each frame comes as a{" "}
                <Code>CMSampleBuffer</Code>. We handle orientation (iPhone
                videos are typically rotated 90°) via{" "}
                <Code>CIImage.oriented()</Code>, then crop to the 9:16 export
                region.
              </p>
              <CodeBlock>{`// Orient the raw frame (iPhone portrait = .right)
var frameCI = CIImage(cvPixelBuffer: pixelBuffer)
frameCI = frameCI.oriented(videoOrientation)

// Crop to 9:16 export region with pan offset
frameCI = frameCI
    .cropped(to: cropRect)
    .transformed(by: CGAffineTransform(
        translationX: -cropRect.origin.x,
        y: -cropRect.origin.y
    ))`}</CodeBlock>
            </PipelineStage>

            <PipelineStage
              num={3}
              color={PURPLE}
              title="Two-pass glass capture"
              tags={[
                { label: "drawHierarchy ×2", color: GREEN },
                { label: "Compositor", color: PURPLE },
              ]}
            >
              <p>
                This is the heart of the video pipeline. For each frame, we
                update the <Code>UIImageView</Code> with the new video frame,
                then perform a <strong>two-pass drawHierarchy</strong>:
              </p>
              <ul className="list-none space-y-1 my-2">
                <li className="flex gap-2">
                  <span className="text-purple shrink-0">▸</span>
                  <span>
                    <strong>Pass 1:</strong> Force the compositor to process the
                    new background — the glass effect needs to &quot;see&quot;
                    the updated frame
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple shrink-0">▸</span>
                  <span>
                    <strong>Pass 2:</strong> Capture the actual output — now the
                    glass effect correctly reflects the current frame
                  </span>
                </li>
              </ul>
              <CodeBlock>{`// Update background to current video frame
backgroundImageView.image = frameUIImage
renderWindow.rootViewController?.view.layoutIfNeeded()

// Pass 1: force compositor to process new background
_ = renderer.image { _ in
    renderWindow.drawHierarchy(
        in: renderWindow.bounds,
        afterScreenUpdates: true
    )
}

// Pass 2: capture with glass reflecting current frame
let captured = renderer.image { _ in
    renderWindow.drawHierarchy(
        in: renderWindow.bounds,
        afterScreenUpdates: true
    )
}`}</CodeBlock>
              <Callout title="Why two passes?">
                The glass compositor is asynchronous. After updating the
                UIImageView, the first drawHierarchy forces the layout change.
                But the glass may still reflect the previous frame. The second
                pass captures the fully-updated output.
              </Callout>
            </PipelineStage>

            <PipelineStage
              num={4}
              color={PURPLE}
              title="Encode to HEVC"
              tags={[
                { label: "AVAssetWriter", color: RED },
                { label: "HEVC", color: ORANGE },
              ]}
            >
              <p>
                The captured bitmap is converted to a{" "}
                <Code>CVPixelBuffer</Code> via <Code>CIContext.render()</Code>{" "}
                and appended to an <Code>AVAssetWriter</Code>. Output is
                HEVC-encoded at the export frame size × screen scale. Progress
                updates every 3 frames.
              </p>
              <CodeBlock>{`let writerSettings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.hevc,
    AVVideoWidthKey: outputPixelW,
    AVVideoHeightKey: outputPixelH,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: outputPixelW * outputPixelH * 10,
        AVVideoExpectedSourceFrameRateKey: nominalFrameRate
    ]
]`}</CodeBlock>
            </PipelineStage>

            <PipelineStage
              num={5}
              color={PURPLE}
              title="Mux audio back in"
              tags={[
                { label: "AVMutableComposition", color: RED },
                { label: "Passthrough", color: GREEN },
              ]}
            >
              <p>
                The frame-by-frame pipeline only produces video. The original
                audio track is re-attached using{" "}
                <Code>AVMutableComposition</Code> — inserting both the new video
                and original audio, then exporting via{" "}
                <Code>AVAssetExportSession</Code> with passthrough (no
                re-encoding).
              </p>
              <CodeBlock>{`let composition = AVMutableComposition()

// Add our rendered video
compVideoTrack.insertTimeRange(timeRange,
    of: exportedVideoTrack, at: .zero)

// Add original audio (untouched)
compAudioTrack.insertTimeRange(timeRange,
    of: originalAudioTrack, at: .zero)

// Export with passthrough — no re-encoding
let session = AVAssetExportSession(
    asset: composition,
    presetName: AVAssetExportPresetPassthrough
)`}</CodeBlock>
            </PipelineStage>

            <PipelineStage
              num={6}
              color={PURPLE}
              title="Clean up and share"
              tags={[{ label: "UIActivityViewController", color: GREEN }]}
            >
              <p>
                The offscreen render window is hidden and deallocated. The
                video-only intermediate file is deleted. The final MP4 is
                presented via the share sheet. The user sees a progress bar
                throughout.
              </p>
            </PipelineStage>
          </div>

          <FadeUp>
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                value="2×"
                label="drawHierarchy per frame"
                color={PURPLE}
              />
              <StatCard value="HEVC" label="Video codec" color={PURPLE} />
              <StatCard
                value="Passthrough"
                label="Audio mux (no re-encode)"
                color={PURPLE}
              />
            </div>
          </FadeUp>
        </section>

        {/* ---------- ARCHITECTURE DIAGRAM ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div>
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-fg-muted">
                Architecture
              </span>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">
                Full pipeline diagrams
              </h2>
            </div>
          </FadeUp>

          {/* Image pipeline diagram */}
          <FadeUp>
            <div className="bg-bg-card border border-edge rounded-2xl p-5 md:p-6 overflow-x-auto space-y-3">
              <h3 className="text-base font-bold text-blue mb-4">
                Image Export
              </h3>

              {/* Row 1 */}
              <div className="flex items-center gap-2 flex-wrap">
                <ArchNode label="User's Photo" sub="UIImage" />
                <Arrow />
                <ArchNode label="Crop to 9:16" sub="CGImage.cropping()" />
                <Arrow />
                <ArchNode label="Full-Res Background" variant="highlight" />
              </div>

              <div className="text-center text-fg-muted text-lg">+</div>

              {/* Row 2 */}
              <div className="flex items-center gap-2 flex-wrap">
                <ArchNode label="Live Screen" sub="Key Window" />
                <Arrow />
                <ArchNode
                  label="drawHierarchy"
                  sub="afterScreenUpdates: true"
                />
                <Arrow />
                <ArchNode
                  label="Crop to 9:16 region"
                  sub="previewGlobalFrame"
                />
                <Arrow />
                <ArchNode label="Glass Overlay" variant="highlight" />
              </div>

              <ArrowDown />

              {/* Output */}
              <div className="flex justify-center">
                <ArchNode label="Composite → JPEG 95%" variant="output" />
              </div>
            </div>
          </FadeUp>

          {/* Video pipeline diagram */}
          <FadeUp>
            <div className="bg-bg-card border border-edge rounded-2xl p-5 md:p-6 overflow-x-auto space-y-3">
              <h3 className="text-base font-bold text-purple mb-4">
                Video Export
              </h3>

              {/* Row 1: Decode */}
              <div className="flex items-center gap-2 flex-wrap">
                <ArchNode label="Source Video" sub="AVAssetReader" />
                <Arrow />
                <ArchNode
                  label="Decode Frame"
                  sub="CVPixelBuffer → CIImage"
                />
                <Arrow />
                <ArchNode
                  label="Orient + Crop"
                  sub=".oriented() · .cropped()"
                />
              </div>

              <ArrowDown />

              {/* Row 2: Render */}
              <div className="flex items-center gap-2 flex-wrap">
                <ArchNode
                  label="UIImageView"
                  sub="in offscreen UIWindow"
                />
                <Arrow />
                <ArchNode
                  label="drawHierarchy × 2"
                  sub="Glass compositor capture"
                  variant="key"
                />
              </div>

              <ArrowDown />

              {/* Row 3: Encode */}
              <div className="flex items-center gap-2 flex-wrap">
                <ArchNode
                  label="CIContext.render"
                  sub="→ CVPixelBuffer"
                />
                <Arrow />
                <ArchNode label="AVAssetWriter" sub="HEVC encode" />
              </div>

              <ArrowDown />

              {/* Row 4: Mux */}
              <div className="flex items-center gap-2 flex-wrap">
                <ArchNode
                  label="AVMutableComposition"
                  sub="Mux original audio"
                />
                <Arrow />
                <ArchNode label="Final .mp4" variant="output" />
              </div>

              <p className="text-center text-xs font-medium text-purple mt-3 tracking-wider">
                ← repeat for every frame →
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ---------- COMPARISON ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div>
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-fg-muted">
                Side by Side
              </span>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">
                Image vs Video
              </h2>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-card border border-edge rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-edge bg-[#60A5FA08]">
                  <h3 className="font-semibold text-blue">Image Export</h3>
                </div>
                <ul className="p-5 space-y-3 text-sm text-fg-secondary">
                  {[
                    <>Single <strong>drawHierarchy</strong> call on live key window</>,
                    "Background cropped from original full-res image",
                    "Glass captured at screen resolution, composited over full-res",
                    "Output: JPEG at 95% quality",
                    "Near-instant — feels immediate",
                    "No offscreen window needed",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-fg-muted shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-bg-card border border-edge rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-edge bg-[#7C3AED08]">
                  <h3 className="font-semibold text-purple">Video Export</h3>
                </div>
                <ul className="p-5 space-y-3 text-sm text-fg-secondary">
                  {[
                    <>
                      <strong>Two drawHierarchy calls per frame</strong> on
                      offscreen window
                    </>,
                    "Each frame decoded via AVAssetReader + CIImage",
                    "Offscreen UIWindow with real glass compositor",
                    "Output: HEVC-encoded MP4 with muxed audio",
                    "Progress bar — can take 10–30s for a short clip",
                    "Cancellable via Task with cleanup",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-fg-muted shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ---------- KEY INSIGHT ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div>
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-blue">
                Key Insight
              </span>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">
                Why drawHierarchy is everything
              </h2>
              <p className="text-fg-secondary mt-3 leading-relaxed">
                The entire sticker export system is built around one limitation:{" "}
                <strong>
                  glass effects can&apos;t be captured through SwiftUI&apos;s
                  ImageRenderer
                </strong>
                . They only exist in the compositor.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "✕",
                t: "ImageRenderer",
                d: "Renders the SwiftUI view tree directly — but glass effects are compositor-level. You get a flat, un-glassed render.",
              },
              {
                icon: "✓",
                t: "drawHierarchy",
                d: "Captures what the CALayer tree actually looks like on screen — including backdrop filters, glass, and blending.",
              },
              {
                icon: "⚡",
                t: "The tradeoff",
                d: "drawHierarchy is slow — it forces a full compositor pass. For images, fine. For video, hundreds of calls = progress bar.",
              },
              {
                icon: "⎕",
                t: "The UIWindow trick",
                d: "For video, we can't use the live screen (progress overlay). So we create a hidden window at level -1000 — invisible but composited.",
              },
            ].map((card, i) => (
              <FadeUp key={card.t} delay={i * 0.05}>
                <div className="bg-bg-card border border-edge rounded-xl p-5 h-full">
                  <div className="text-xl mb-2 opacity-60">{card.icon}</div>
                  <h4 className="font-[family-name:var(--font-sora)] font-bold mb-1.5">
                    {card.t}
                  </h4>
                  <p className="text-fg-secondary text-sm leading-relaxed">
                    {card.d}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ---------- TECH STACK ---------- */}
        <section className="space-y-8">
          <FadeUp>
            <div>
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-fg-muted">
                Technology
              </span>
              <h2 className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold tracking-tight mt-2">
                The stack
              </h2>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-card border border-edge rounded-2xl p-5">
                <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-fg-muted mb-4">
                  SwiftUI Layer
                </h4>
                <div className="space-y-3">
                  {[
                    [".glassEffect(.clear)", "Native liquid glass"],
                    ["GlassBackground", "Custom ViewModifier"],
                    ["StickerPalette", "Glass-aware colors"],
                    ["TextElementBackground", "Inner element materials"],
                    ["Environment flags", "opacity · glass · transparent"],
                  ].map(([code, desc]) => (
                    <div
                      key={code}
                      className="flex items-center justify-between gap-3 py-2 border-b border-edge/50 last:border-0"
                    >
                      <code className="font-mono text-xs text-purple bg-purple-soft px-2 py-0.5 rounded shrink-0">
                        {code}
                      </code>
                      <span className="text-xs text-fg-muted text-right">
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-bg-card border border-edge rounded-2xl p-5">
                <h4 className="text-[11px] font-bold tracking-[2px] uppercase text-fg-muted mb-4">
                  Capture + Export Layer
                </h4>
                <div className="space-y-3">
                  {[
                    ["drawHierarchy", "Compositor capture"],
                    ["UIWindow (level -1000)", "Offscreen render target"],
                    ["AVAssetReader/Writer", "Frame decode/encode"],
                    ["CIContext + CIImage", "Orient, crop, render"],
                    ["AVMutableComposition", "Audio muxing"],
                    ["UIHostingController", "SwiftUI → UIKit bridge"],
                  ].map(([code, desc]) => (
                    <div
                      key={code}
                      className="flex items-center justify-between gap-3 py-2 border-b border-edge/50 last:border-0"
                    >
                      <code className="font-mono text-xs text-purple bg-purple-soft px-2 py-0.5 rounded shrink-0">
                        {code}
                      </code>
                      <span className="text-xs text-fg-muted text-right">
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </section>
      </article>

      {/* CTA */}
      <section
        className="py-16 md:py-20 px-6"
        style={{
          background:
            "linear-gradient(to bottom, #60A5FA06 0%, var(--color-bg-page) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold tracking-tight">
              Try the glass stickers yourself
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              href="/#download"
              className="inline-block bg-purple hover:bg-purple/90 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get the Beta
            </Link>
          </FadeUp>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
