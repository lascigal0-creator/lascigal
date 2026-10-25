'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mediaUrl } from '@/lib/media';
import { ScrollFilmGalleryItem } from '@/lib/scroll-film';

interface ScrollFilmGalleryProps {
  items: ScrollFilmGalleryItem[];
  title: string;
}

export default function ScrollFilmGallery({ items, title }: ScrollFilmGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') setActiveIdx((prev) => (prev !== null ? (prev + 1) % items.length : null));
      if (e.key === 'ArrowLeft') setActiveIdx((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIdx, items.length]);

  if (!items || items.length === 0) return null;

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIdx(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setActiveIdx(idx);
            }}
            style={{
              position: 'relative',
              height: '240px',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid rgba(190, 159, 118, 0.25)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            className="las_gallery_card"
          >
            <Image
              src={mediaUrl(item.image)}
              alt={item.title || `${title} photo ${idx + 1}`}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '16px',
                color: '#ffffff',
              }}
            >
              {item.title && (
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#ffffff' }}>{item.title}</div>
              )}
              {item.caption && (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
                  {item.caption}
                </div>
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#be9f76',
                fontSize: '13px',
              }}
            >
              <i className="fas fa-expand"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          onClick={() => setActiveIdx(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(10, 12, 16, 0.94)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <button
            onClick={() => setActiveIdx(null)}
            aria-label="Close lightbox"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            ✕
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
                }}
                aria-label="Previous image"
                style={{
                  position: 'absolute',
                  left: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null ? (prev + 1) % items.length : null));
                }}
                aria-label="Next image"
                style={{
                  position: 'absolute',
                  right: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                ›
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '1100px',
              maxHeight: '85vh',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '70vh',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Image
                src={mediaUrl(items[activeIdx].image)}
                alt={items[activeIdx].title || title}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            {(items[activeIdx].title || items[activeIdx].caption) && (
              <div
                style={{
                  marginTop: '16px',
                  textAlign: 'center',
                  color: '#ffffff',
                }}
              >
                {items[activeIdx].title && (
                  <h4 style={{ margin: '0 0 6px', fontSize: '18px', color: '#be9f76', fontWeight: 600 }}>
                    {items[activeIdx].title}
                  </h4>
                )}
                {items[activeIdx].caption && (
                  <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    {items[activeIdx].caption}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .las_gallery_card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(190, 159, 118, 0.2) !important;
        }
      `}</style>
    </>
  );
}
