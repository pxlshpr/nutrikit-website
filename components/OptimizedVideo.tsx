"use client";

import { useEffect, useRef, useState } from "react";

interface OptimizedVideoProps {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
  autoplay?: boolean;
}

/**
 * Custom hook for lazy loading videos with IntersectionObserver
 */
function useVideoLazyLoad(priority: boolean = false) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.25,
        rootMargin: "100px"
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [priority]);

  return { videoRef, isInView };
}

/**
 * Custom hook for detecting theme preference
 */
function useThemeDetection() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check initial preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");

    // Listen for changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return theme;
}

/**
 * Custom hook for detecting data saver preference
 */
function usePrefersReducedData() {
  const [prefersSaveData, setPrefersSaveData] = useState(false);

  useEffect(() => {
    // Check navigator.connection.saveData (if available)
    const connection = (navigator as any).connection;
    if (connection?.saveData) {
      setPrefersSaveData(true);
      return;
    }

    // Check prefers-reduced-data media query
    const mediaQuery = window.matchMedia("(prefers-reduced-data: reduce)");
    setPrefersSaveData(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersSaveData(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersSaveData;
}


/**
 * OptimizedVideo Component
 *
 * Features:
 * - Lazy loading via IntersectionObserver
 * - Theme detection (light/dark)
 * - Play button overlay (ONLY when data saver mode is enabled)
 * - Data saver mode detection (respects user bandwidth preferences)
 * - Format negotiation (WebM → MP4 fallback)
 * - Normal behavior: Auto-plays when scrolled into view
 * - Data saver behavior: Shows play button, doesn't download until clicked
 */
export function OptimizedVideo({
  name,
  alt,
  className = "",
  priority = false,
  autoplay = false
}: OptimizedVideoProps) {
  const { videoRef, isInView } = useVideoLazyLoad(priority);
  const theme = useThemeDetection();
  const prefersSaveData = usePrefersReducedData();

  const [userWantsVideo, setUserWantsVideo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  // Determine if we should load the video
  // If data saver is OFF: load immediately when in view
  // If data saver is ON: only load after user clicks play
  const shouldLoadVideo = isInView && (
    prefersSaveData
      ? userWantsVideo  // Only load if user clicked play
      : true            // Auto-load when in view
  );

  // Handle play button click (only shown in data saver mode)
  const handlePlayClick = () => {
    setUserWantsVideo(true);

    // Play video if it's ready
    if (videoElementRef.current) {
      videoElementRef.current.play().catch(() => {
        // Video might not be ready yet, will autoplay when it loads
      });
    }
  };

  return (
    <div
      ref={videoRef}
      className={`relative w-full h-full bg-black overflow-hidden ${className}`}
    >
      {/* Video element - only render if should load */}
      {shouldLoadVideo && (
        <video
          ref={videoElementRef}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loop
          muted
          playsInline
          disablePictureInPicture
          poster={`/screenshots/${name}-${theme}.png`}
          onCanPlay={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          autoPlay={!prefersSaveData}
        >
          {/* WebM (VP9) - Primary format */}
          <source src={`/videos/${name}-${theme}.webm`} type="video/webm; codecs=vp9" />
          {/* MP4 (H.264) - Fallback for Safari < 14.1 */}
          <source src={`/videos/${name}-${theme}.mp4`} type="video/mp4; codecs=avc1.4D401E" />
          {/* Poster image fallback */}
          <img
            src={`/screenshots/${name}-${theme}.png`}
            alt={alt}
            className="w-full h-full object-cover object-top"
          />
        </video>
      )}

      {/* Poster image (shown before video loads) */}
      {!shouldLoadVideo && (
        <img
          src={`/screenshots/${name}-${theme}.png`}
          alt={alt}
          className="w-full h-full object-cover object-top"
        />
      )}

      {/* Play button overlay - ONLY shown when data saver is enabled and user hasn't clicked yet */}
      {prefersSaveData && !userWantsVideo && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:bg-black/40"
          onClick={handlePlayClick}
          role="button"
          tabIndex={0}
          aria-label={`Play video - ${alt}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePlayClick();
            }
          }}
        >
          {/* Play icon */}
          <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)] text-black flex items-center justify-center transition-transform duration-200 hover:scale-110">
            <svg
              className="w-8 h-8 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Loading state (spinner) */}
      {shouldLoadVideo && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="animate-spin">
            <div className="w-8 h-8 border-2 border-[var(--accent-primary)]/30 border-t-[var(--accent-primary)] rounded-full" />
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
          <svg
            className="w-12 h-12 mb-3 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4v2m0-8a4 4 0 110 8 4 4 0 010-8z"
            />
          </svg>
          <p className="text-sm">Video failed to load</p>
          <button
            onClick={() => {
              setHasError(false);
              setUserWantsVideo(false);
            }}
            className="mt-2 text-xs px-3 py-1 bg-[var(--accent-primary)] text-black rounded hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
