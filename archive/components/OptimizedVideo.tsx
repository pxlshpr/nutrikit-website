"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface OptimizedVideoProps {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
  autoplay?: boolean;
  transparent?: boolean;
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
 * - Canvas rendering for videos with transparency (alpha channel support)
 */
export function OptimizedVideo({
  name,
  alt,
  className = "",
  priority = false,
  autoplay = false,
  transparent = false
}: OptimizedVideoProps) {
  const { videoRef, isInView } = useVideoLazyLoad(priority);
  const theme = useThemeDetection();
  const prefersSaveData = usePrefersReducedData();

  const [userWantsVideo, setUserWantsVideo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [currentTheme, setCurrentTheme] = useState(theme);

  // Determine if we should load the video
  // If data saver is OFF: load immediately when in view
  // If data saver is ON: only load after user clicks play
  const shouldLoadVideo = isInView && (
    prefersSaveData
      ? userWantsVideo  // Only load if user clicked play
      : true            // Auto-load when in view
  );

  // Canvas rendering loop for transparent videos
  const renderToCanvas = useCallback(() => {
    const video = videoElementRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Clear and draw the current frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0);

    // Continue the loop
    animationFrameRef.current = requestAnimationFrame(renderToCanvas);
  }, []);

  // Start/stop canvas rendering based on video state
  useEffect(() => {
    if (!transparent) return;

    const video = videoElementRef.current;
    if (!video) return;

    const handlePlay = () => {
      renderToCanvas();
    };

    const handlePause = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handlePause);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [transparent, renderToCanvas, shouldLoadVideo]);

  // Handle theme changes - switch video source when theme changes
  useEffect(() => {
    if (theme !== currentTheme && videoElementRef.current && shouldLoadVideo) {
      const video = videoElementRef.current;
      const wasPlaying = !video.paused;
      const currentTime = video.currentTime;

      // Update theme state
      setCurrentTheme(theme);

      // Force video to reload with new sources
      video.load();

      // If video was playing, resume playback
      if (wasPlaying) {
        video.currentTime = currentTime;
        video.play().catch(() => {
          // Playback might fail, that's okay
        });
      }
    }
  }, [theme, currentTheme, shouldLoadVideo]);

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
      className={`relative w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    >
      {/* Canvas for transparent video rendering - kept for fallback if needed */}
      {/* Currently disabled since we use HEVC/WebM with native alpha support */}

      {/* Video element - visible for transparent videos (no canvas needed with proper alpha video) */}
      {shouldLoadVideo && (
        <video
          key={`video-${name}-${theme}`}
          ref={videoElementRef}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ background: 'transparent' }}
          loop
          muted
          playsInline
          disablePictureInPicture
          poster={!transparent ? `/screenshots/${name}-${theme}.png` : undefined}
          onCanPlay={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          autoPlay={!prefersSaveData}
        >
          {/* HEVC with alpha - Safari (must be first for Safari to pick it up) */}
          {transparent && (
            <source src={`/videos/${name}-${theme}.mov`} type='video/mp4; codecs="hvc1"' />
          )}
          {/* WebM (VP9) - Chrome/Firefox */}
          <source src={`/videos/${name}-${theme}.webm`} type="video/webm" />
          {/* MP4 (H.264) - Fallback for older browsers */}
          {!transparent && (
            <source src={`/videos/${name}-${theme}.mp4`} type="video/mp4" />
          )}
          {/* Poster image fallback */}
          {!transparent && (
            <img
              src={`/screenshots/${name}-${theme}.png`}
              alt={alt}
              className="w-full h-full object-contain"
            />
          )}
        </video>
      )}

      {/* Poster image (shown before video loads) */}
      {!shouldLoadVideo && !transparent && (
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
