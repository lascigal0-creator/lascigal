'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { resolveFrameUrl } from '@/lib/scroll-film';
import { mediaUrl } from '@/lib/media';

interface ScrollFilmProps {
  slug: string;
  title: string;
  tagline: string;
  filmFolder: string;
  frameCount?: number;
  heroImage: string;
  filmLabel?: string;
  filmFromTo?: { from: string; to: string };
}

export default function ScrollFilm({
  title,
  tagline,
  filmFolder,
  frameCount = 120,
  heroImage,
  filmLabel = '120-Frame Interactive Walkthrough',
  filmFromTo,
}: ScrollFilmProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loaded frame images cache
  const framesCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const posterImgRef = useRef<HTMLImageElement | null>(null);

  // Eased scrubbing animation state
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);

  // UI state
  const [currentFrameNum, setCurrentFrameNum] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [firstFrameReady, setFirstFrameReady] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 2. Cover-fit draw helper
  const drawImageCover = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Compute aspect-ratio cover scaling
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const dx = (width - drawWidth) / 2;
    const dy = (height - drawHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  }, []);

  // 3. Render current frame
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const img = framesCacheRef.current.get(frameIndex);
      if (img && img.complete && img.naturalWidth > 0) {
        drawImageCover(img);
        return;
      }

      // Fallback to nearest loaded frame, or poster image
      for (let offset = 1; offset < frameCount; offset++) {
        const prev = framesCacheRef.current.get(frameIndex - offset);
        if (prev && prev.complete && prev.naturalWidth > 0) {
          drawImageCover(prev);
          return;
        }
        const next = framesCacheRef.current.get(frameIndex + offset);
        if (next && next.complete && next.naturalWidth > 0) {
          drawImageCover(next);
          return;
        }
      }

      if (posterImgRef.current && posterImgRef.current.complete) {
        drawImageCover(posterImgRef.current);
      }
    },
    [drawImageCover, frameCount]
  );

  // 4. Eased scrubbing loop (requestAnimationFrame)
  const startScrubLoop = useCallback(() => {
    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.05) {
        // Easing interpolation: smooth lerp
        currentFrameRef.current += diff * 0.22;
        const rounded = Math.min(frameCount, Math.max(1, Math.round(currentFrameRef.current)));
        setCurrentFrameNum(rounded);
        renderFrame(rounded);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
  }, [frameCount, renderFrame]);

  // 5. Canvas sizing with DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    renderFrame(Math.round(currentFrameRef.current));
  }, [renderFrame]);

  // 6. Preloading: Eagerly load first ~30 frames, stream remaining progressively
  useEffect(() => {
    if (prefersReducedMotion) return;

    let cancelled = false;

    // Load poster image first so canvas is NEVER blank
    const poster = new Image();
    poster.crossOrigin = 'anonymous';
    poster.src = mediaUrl(heroImage);
    poster.onload = () => {
      posterImgRef.current = poster;
      if (!cancelled && !firstFrameReady) {
        resizeCanvas();
        drawImageCover(poster);
      }
    };

    // Helper to load a single frame
    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (framesCacheRef.current.has(index)) {
          resolve();
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = resolveFrameUrl(filmFolder, index);

        img.onload = () => {
          if (!cancelled) {
            framesCacheRef.current.set(index, img);
            setLoadedCount((c) => c + 1);
            if (index === 1) {
              setFirstFrameReady(true);
              renderFrame(1);
            }
          }
          resolve();
        };

        img.onerror = () => {
          // Frame load error handled gracefully
          resolve();
        };
      });
    };

    // Eager batch: frames 1 to min(30, frameCount)
    const eagerCount = Math.min(30, frameCount);
    const eagerPromises: Promise<void>[] = [];
    for (let i = 1; i <= eagerCount; i++) {
      eagerPromises.push(loadFrame(i));
    }

    Promise.all(eagerPromises).then(() => {
      if (cancelled) return;

      // Progressive streaming of remaining frames (31 to frameCount)
      let nextIndex = eagerCount + 1;
      const streamNextBatch = () => {
        if (cancelled || nextIndex > frameCount) return;

        const batchSize = 6;
        const batch: Promise<void>[] = [];
        for (let i = 0; i < batchSize && nextIndex <= frameCount; i++) {
          batch.push(loadFrame(nextIndex++));
        }

        Promise.all(batch).then(() => {
          if (!cancelled && nextIndex <= frameCount) {
            // Idle queue or small delay between chunks to avoid bandwidth contention
            setTimeout(streamNextBatch, 40);
          }
        });
      };

      streamNextBatch();
    });

    return () => {
      cancelled = true;
    };
  }, [filmFolder, frameCount, heroImage, prefersReducedMotion, firstFrameReady, drawImageCover, renderFrame, resizeCanvas]);

  // 7. Scroll listener to compute target frame
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      // Distance from top of container to top of viewport
      const topOffset = -rect.top;
      const progress = Math.min(1, Math.max(0, topOffset / scrollableDistance));

      setScrollProgress(progress);

      // Target frame between 1 and frameCount
      const target = Math.min(frameCount, Math.max(1, Math.round(progress * (frameCount - 1)) + 1));
      targetFrameRef.current = target;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    // Initial resize and start easing loop
    resizeCanvas();
    startScrubLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [frameCount, prefersReducedMotion, resizeCanvas, startScrubLoop]);

  // If user prefers reduced motion, render static cinematic poster fallback
  if (prefersReducedMotion) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '80vh', minHeight: '520px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(heroImage)}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, rgba(15, 23, 42, 0.7) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '48px 32px',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(190, 159, 118, 0.25)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '4px 14px',
                borderRadius: '30px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '14px',
              }}
            >
              {filmLabel}
            </span>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 5vw, 54px)',
                color: '#ffffff',
                margin: '0 0 14px',
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {title}
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', maxWidth: '640px', lineHeight: 1.6, margin: '0 0 20px' }}>
              {tagline}
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#ffffff',
                fontSize: '13px',
              }}
            >
              <i className="fas fa-universal-access" style={{ color: '#be9f76' }}></i>
              <span>Reduced-motion mode active: displaying static high-resolution gallery below.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fade out title overlay as user scrolls through the first 25% of the film section
  const overlayOpacity = Math.max(0, 1 - scrollProgress * 4);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '350vh', // Tall scroll track allows responsive, cinematic scrubbing
        backgroundColor: '#0a0c10',
      }}
    >
      {/* Full-viewport sticky viewing window */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Cinematic Film Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {/* Top Progress Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${scrollProgress * 100}%`,
              backgroundColor: '#be9f76',
              boxShadow: '0 0 8px rgba(190, 159, 118, 0.8)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>

        {/* Film HUD Badges (Top corners) */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(10, 12, 16, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              fontSize: '11.5px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#be9f76',
                display: 'inline-block',
                boxShadow: '0 0 6px #be9f76',
              }}
            />
            {filmLabel}
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(10, 12, 16, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '11px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '999px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            Frame {currentFrameNum} / {frameCount}
          </span>
          {filmFromTo && (
            <span
              style={{
                display: 'none',
                backgroundColor: 'rgba(10, 12, 16, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#be9f76',
                fontSize: '11px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '999px',
              }}
              className="las_hud_timestamp"
            >
              {scrollProgress < 0.5 ? filmFromTo.from : filmFromTo.to}
            </span>
          )}
        </div>

        {/* Title + Tagline Overlay (Fades out as user scrolls) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10, 12, 16, 0.95) 0%, rgba(10, 12, 16, 0.3) 55%, rgba(10, 12, 16, 0.7) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '60px 32px',
            opacity: overlayOpacity,
            pointerEvents: overlayOpacity > 0.1 ? 'auto' : 'none',
            transition: 'opacity 0.15s ease-out',
            zIndex: 5,
          }}
        >
          <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(190, 159, 118, 0.25)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                padding: '5px 16px',
                borderRadius: '30px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '16px',
                backdropFilter: 'blur(6px)',
              }}
            >
              Interactive Scroll Film
            </span>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(28px, 5.2vw, 56px)',
                color: '#ffffff',
                margin: '0 0 16px',
                fontWeight: 700,
                lineHeight: 1.15,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.92)',
                fontSize: 'clamp(14px, 1.8vw, 18px)',
                maxWidth: '720px',
                margin: '0 auto 28px',
                lineHeight: 1.6,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              {tagline}
            </p>

            {/* Scroll Indicator Prompt */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 22px',
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                animation: 'lasBounce 2s infinite ease-in-out',
              }}
            >
              <span>Scroll to Scrub Film</span>
              <i className="fas fa-arrow-down" style={{ color: '#be9f76' }}></i>
            </div>
          </div>
        </div>

        {/* Minimal Scroll scrubbing guide on bottom right (Visible during scrubbing) */}
        {overlayOpacity === 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              zIndex: 10,
              backgroundColor: 'rgba(10, 12, 16, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '999px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className="fas fa-arrows-up-down" style={{ color: '#be9f76', fontSize: '11px' }}></i>
            <span>Scroll down = Forward • Scroll up = Backward</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes lasBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }
        @media (min-width: 640px) {
          :global(.las_hud_timestamp) {
            display: inline-block !important;
          }
        }
      `}</style>
    </div>
  );
}
