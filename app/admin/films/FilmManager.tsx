'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import JSZip from 'jszip';
import { mediaUrl } from '@/lib/media';
import { ScrollFilmPageData } from '@/lib/scroll-film';

interface Props {
  initialFilms: ScrollFilmPageData[];
}

export default function FilmManager({ initialFilms }: Props) {
  const [films, setFilms] = useState<ScrollFilmPageData[]>(initialFilms);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'extractor'>('list');

  // Video frame extraction state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [extractorSlug, setExtractorSlug] = useState<string>('las-cigal');
  const [extracting, setExtracting] = useState<boolean>(false);
  const [extractProgress, setExtractProgress] = useState<number>(0);
  const [extractStatus, setExtractStatus] = useState<string>('');
  const [extractedZipBlob, setExtractedZipBlob] = useState<Blob | null>(null);
  const [lastFramePreview, setLastFramePreview] = useState<string | null>(null);

  // New film form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [heroImage, setHeroImage] = useState('stills/las-cigal-hero.webp');
  const [filmFolder, setFilmFolder] = useState('frames-las-cigal');
  const [frameCount, setFrameCount] = useState(120);
  const [filmLabel, setFilmLabel] = useState('120-Frame Interactive Walkthrough');
  const [intro1, setIntro1] = useState('');
  const [intro2, setIntro2] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Handle title change and auto-slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(autoSlug);
    setFilmFolder(`frames-${autoSlug}`);
  };

  // Browser-side frame extractor: seeks HTML5 video, draws to 1280px canvas, and generates 120-frame WebP zip
  const runBrowserExtraction = async () => {
    if (!videoFile) return;

    try {
      setExtracting(true);
      setExtractedZipBlob(null);
      setExtractProgress(0);
      setExtractStatus('Preparing video file in memory...');

      const zip = new JSZip();
      const videoUrl = URL.createObjectURL(videoFile);
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Failed to load video file in browser'));
      });

      const duration = video.duration;
      if (!duration || duration <= 0) {
        throw new Error('Could not determine video duration.');
      }

      const canvas = document.createElement('canvas');
      const targetWidth = 1280;
      const aspect = (video.videoHeight || 720) / (video.videoWidth || 1280);
      const targetHeight = Math.round(targetWidth * aspect);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available.');

      const totalFrames = 120;
      setExtractStatus(`Extracting 120 evenly-spaced frames from ${duration.toFixed(1)}s video...`);

      for (let k = 1; k <= totalFrames; k++) {
        // Evenly-spaced across duration: k / totalFrames * duration
        const targetTime = (k / totalFrames) * duration;
        video.currentTime = Math.min(duration - 0.05, Math.max(0, targetTime));

        await new Promise<void>((res) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            res();
          };
          video.addEventListener('seeked', onSeeked);
        });

        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

        // Convert canvas frame to WebP blob
        const blob = await new Promise<Blob | null>((res) => {
          canvas.toBlob((b) => res(b), 'image/webp', 0.82);
        });

        if (blob) {
          const pad = String(k).padStart(5, '0');
          zip.file(`frame_${pad}.webp`, blob);
          if (k === 1 || k === 60 || k === 120) {
            setLastFramePreview(canvas.toDataURL('image/webp', 0.5));
          }
        }

        const pct = Math.round((k / totalFrames) * 90);
        setExtractProgress(pct);
        setExtractStatus(`Captured frame ${k} of ${totalFrames} (${pct}%)...`);
      }

      setExtractStatus('Compiling frames into ZIP archive...');
      setExtractProgress(95);

      const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setExtractProgress(95 + Math.round((metadata.percent / 100) * 5));
      });

      setExtractedZipBlob(zipBlob);
      setExtractProgress(100);
      setExtractStatus(`Complete! 120 WebP frames packaged into frames-${extractorSlug || 'film'}.zip`);
      URL.revokeObjectURL(videoUrl);
    } catch (err: any) {
      setExtractStatus(`Extraction error: ${err.message}`);
    } finally {
      setExtracting(false);
    }
  };

  const handleDownloadZip = () => {
    if (!extractedZipBlob) return;
    const url = URL.createObjectURL(extractedZipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frames-${extractorSlug || 'film'}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save new scroll film to data store
  const handleSaveFilm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const payload: Partial<ScrollFilmPageData> = {
        slug,
        title,
        tagline,
        heroImage,
        filmFolder,
        frameCount,
        filmLabel,
        introParagraphs: [intro1, intro2],
        stats: [
          { label: 'Venue Capacity', value: '1,000+ Guests', icon: 'fas fa-users' },
          { label: 'Climate Control', value: 'Central A/C', icon: 'fas fa-snowflake' },
          { label: 'Car Parking', value: '300-400 Cars', icon: 'fas fa-square-parking' },
        ],
        highlights: [
          { title: 'Grand Architectural Layout', description: 'Engineered for seamless guest flow, ceremony sightlines, and photography.', icon: 'fas fa-eye' },
          { title: 'Dedicated Hospitality Suite', description: 'Climate-controlled private suites with dressing amenities and en-suite facilities.', icon: 'fas fa-door-closed' },
        ],
        timeline: [
          { timeOrStep: '01', title: 'Grand Arrival', description: 'Welcoming portico with paved forecourt and direct parking access.' },
          { timeOrStep: '02', title: 'Main Celebration', description: 'Central aisle procession and raised stage ceremony.' },
        ],
        features: [
          'Full-facility power backup with automated transfer switch',
          'High-resolution acoustic and lighting setup',
          'Touchless sanitation and dedicated catering service corridors',
        ],
        howTo: [
          { title: 'Location & Arrival', description: 'Easily accessible via main roadway with clear directional signage.' },
          { title: 'Booking Inquiries', description: 'Contact our office to verify availability and arrange a private tour.' },
        ],
        gallery: [
          { image: heroImage, title: 'Main View', caption: title },
        ],
        relatedSlugs: [],
      };

      const res = await fetch('/api/admin/films', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save film');

      setSaveSuccess(true);
      // Refresh local list
      const updated = await fetch('/api/admin/films').then((r) => r.json());
      if (updated.films) setFilms(updated.films);
      setTimeout(() => setActiveTab('list'), 1200);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 16px' }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '14px 20px',
            fontWeight: 600,
            fontSize: '14px',
            color: activeTab === 'list' ? '#be9f76' : '#64748b',
            borderBottom: activeTab === 'list' ? '2px solid #be9f76' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-film" style={{ marginRight: '8px' }}></i>
          All Scroll Films ({films.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            padding: '14px 20px',
            fontWeight: 600,
            fontSize: '14px',
            color: activeTab === 'add' ? '#be9f76' : '#64748b',
            borderBottom: activeTab === 'add' ? '2px solid #be9f76' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i>
          Add New Scroll Film
        </button>
        <button
          onClick={() => setActiveTab('extractor')}
          style={{
            padding: '14px 20px',
            fontWeight: 600,
            fontSize: '14px',
            color: activeTab === 'extractor' ? '#be9f76' : '#64748b',
            borderBottom: activeTab === 'extractor' ? '2px solid #be9f76' : '2px solid transparent',
            background: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-file-video" style={{ marginRight: '8px' }}></i>
          In-Browser Frame Extractor (120 WebP)
        </button>
      </div>

      {/* Tab 1: List Films */}
      {activeTab === 'list' && (
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {films.map((film) => (
              <div
                key={film.slug}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: '170px', width: '100%', backgroundColor: '#0a0c10' }}>
                  {film.heroImage ? (
                    <Image
                      src={mediaUrl(film.heroImage)}
                      alt={film.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                      No hero image
                    </div>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '20px',
                    }}
                  >
                    {film.frameCount || 120} Frames
                  </div>
                </div>

                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                    {film.title}
                  </h3>
                  <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748b', lineHeight: 1.5, flex: 1 }}>
                    {film.tagline}
                  </p>

                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>
                      <strong>Folder:</strong> <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{film.filmFolder}</code>
                    </div>
                    <div>
                      <strong>URL:</strong> <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>/film/{film.slug}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                      href={`/film/${film.slug}`}
                      target="_blank"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        backgroundColor: '#be9f76',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: '12px' }}></i>
                      <span>View Live Tour</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Add New Film Form */}
      {activeTab === 'add' && (
        <div style={{ padding: '24px', maxWidth: '800px' }}>
          <form onSubmit={handleSaveFilm} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {saveSuccess && (
              <div style={{ padding: '12px 16px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '8px', fontSize: '14px' }}>
                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                Scroll film created successfully! Redirecting...
              </div>
            )}
            {saveError && (
              <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', fontSize: '14px' }}>
                <i className="fas fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                {saveError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Film Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Garden Pavilion & Gazebo Walkthrough"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Page Slug (auto-derived) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. garden-pavilion"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Frames Folder Name *
                </label>
                <input
                  type="text"
                  required
                  value={filmFolder}
                  onChange={(e) => setFilmFolder(e.target.value)}
                  placeholder="frames-garden-pavilion"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Tagline *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. An open-air tropical courtyard designed for sunset ceremonies."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Hero / Poster Still Image *
                </label>
                <input
                  type="text"
                  required
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="stills/las-cigal-hero.webp"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Frame Count (Standard: 120) *
                </label>
                <input
                  type="number"
                  required
                  value={frameCount}
                  onChange={(e) => setFrameCount(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Intro Paragraph 1 *
              </label>
              <textarea
                required
                rows={3}
                value={intro1}
                onChange={(e) => setIntro1(e.target.value)}
                placeholder="First descriptive paragraph introducing the venue architecture..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Intro Paragraph 2 *
              </label>
              <textarea
                required
                rows={3}
                value={intro2}
                onChange={(e) => setIntro2(e.target.value)}
                placeholder="Second paragraph describing guest experience and key features..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                backgroundColor: '#be9f76',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: 'fit-content',
              }}
            >
              {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-floppy-disk"></i>}
              <span>Save &amp; Publish Scroll Page</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: In-Browser Frame Extractor */}
      {activeTab === 'extractor' && (
        <div style={{ padding: '24px', maxWidth: '840px' }}>
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 6px', color: '#166534', fontSize: '15px', fontWeight: 700 }}>
              <i className="fas fa-shield-halved" style={{ marginRight: '8px' }}></i>
              100% Client-Side Video Frame Extraction
            </h4>
            <p style={{ margin: 0, color: '#15803d', fontSize: '13.5px', lineHeight: 1.5 }}>
              This tool extracts exactly 120 evenly-spaced WebP frames (1280px wide) directly inside your browser using HTML5 Canvas. The video is never uploaded to any server, completely avoiding serverless upload size limits and request timeouts.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Select Video File (MP4, MOV, WebM)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setVideoFile(f);
                    const base = f.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setExtractorSlug(base);
                  }
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px dashed #cbd5e1',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                }}
              />
              {videoFile && (
                <div style={{ fontSize: '13px', color: '#059669', marginTop: '6px', fontWeight: 500 }}>
                  Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Folder / Slug Name
              </label>
              <input
                type="text"
                value={extractorSlug}
                onChange={(e) => setExtractorSlug(e.target.value)}
                placeholder="las-cigal"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Will package frames as <code>frames-{extractorSlug || 'name'}.zip</code> containing <code>frame_00001.webp</code> to <code>frame_00120.webp</code>.
              </span>
            </div>

            {extracting && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 600, color: '#1e293b' }}>
                  <span>{extractStatus}</span>
                  <span>{extractProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${extractProgress}%`, height: '100%', backgroundColor: '#be9f76', transition: 'width 0.2s ease' }}></div>
                </div>
              </div>
            )}

            {lastFramePreview && (
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Live Frame Preview:</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lastFramePreview} alt="Preview" style={{ width: '240px', height: '135px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={runBrowserExtraction}
                disabled={!videoFile || extracting}
                style={{
                  backgroundColor: !videoFile || extracting ? '#cbd5e1' : '#be9f76',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: !videoFile || extracting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {extracting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>}
                <span>{extracting ? 'Extracting Frames...' : 'Start Browser Extraction (120 Frames)'}</span>
              </button>

              {extractedZipBlob && (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                  }}
                >
                  <i className="fas fa-download"></i>
                  <span>Download frames-{extractorSlug}.zip</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
