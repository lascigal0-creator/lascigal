'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AboutPageManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    let cleanVal = value;
    if (key === 'director_video_url') {
      const match = value.match(/src=["']?([^"'\s>]+)/i);
      if (match) cleanVal = match[1];
    }
    setSettings((prev) => ({ ...prev, [key]: cleanVal }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        director_title: settings['director_title'] || '',
        director_message: settings['director_message'] || '',
        director_video_url: settings['director_video_url'] || '',
        director_eyebrow: settings['director_eyebrow'] || 'Message from Management',
        director_signatory_name: settings['director_signatory_name'] || 'Management',
        director_signatory_role: settings['director_signatory_role'] || 'Las Cigal Convention Centre',
        director_signatory_sub: settings['director_signatory_sub'] || 'Kalampoor, Muvattupuzha, Kerala',
      };
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Response was not JSON
      }

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Your admin session has expired. Please refresh the page and log in again.');
        }
        throw new Error(data?.error || `Failed to save About Us settings (Status: ${res.status})`);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const rawVid = settings['director_video_url'] || 'https://www.youtube.com/embed/AzCr_TVEpe0?si=M3fNrsrxDAMWlMbA';
  const vidMatch = rawVid.match(/src=["']?([^"'\s>]+)/i);
  const currentVideo = vidMatch ? vidMatch[1] : rawVid.split(/[\s"']/)[0] || 'https://www.youtube.com/embed/AzCr_TVEpe0';

  return (
    <form onSubmit={handleSave}>
      {saved && (
        <div style={{ padding: '14px 20px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✓</span>
          <span>About Us page content successfully saved and published!</span>
        </div>
      )}

      {/* 1. DIRECTOR'S WORD & STORY */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
              💼 Director&apos;s Word & Welcome Message
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#6b7280' }}>
              Displayed prominently on the dedicated About Us page along with your official showcase video.
            </p>
          </div>
          <Link
            href="/aboutus"
            target="_blank"
            style={{ fontSize: '12.5px', color: '#c5a880', fontWeight: 600, textDecoration: 'none', border: '1px solid #c5a880', padding: '6px 12px', borderRadius: '5px' }}
          >
            ↗ Preview Live /aboutus
          </Link>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Section Title / Headline</label>
          <input
            type="text"
            value={settings['director_title'] || ''}
            onChange={(e) => handleChange('director_title', e.target.value)}
            placeholder="e.g. Lascigal – Creating Spaces That Tell Your Story"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Director&apos;s Message (Full Story Paragraphs)
          </label>
          <textarea
            rows={8}
            value={settings['director_message'] || ''}
            onChange={(e) => handleChange('director_message', e.target.value)}
            placeholder="Enter director message here..."
            style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', lineHeight: 1.6 }}
          ></textarea>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Tip: Use double line breaks between paragraphs to format readable spacing.</span>
        </div>

        {/* Signatory / Author Details */}
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Signatory / Author (e.g. Management)</label>
            <input
              type="text"
              value={settings['director_signatory_name'] || ''}
              onChange={(e) => handleChange('director_signatory_name', e.target.value)}
              placeholder="Management"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Signatory Title / Role</label>
            <input
              type="text"
              value={settings['director_signatory_role'] || ''}
              onChange={(e) => handleChange('director_signatory_role', e.target.value)}
              placeholder="Las Cigal Convention Centre"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Location / Subtitle</label>
            <input
              type="text"
              value={settings['director_signatory_sub'] || ''}
              onChange={(e) => handleChange('director_signatory_sub', e.target.value)}
              placeholder="Kalampoor, Muvattupuzha, Kerala"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* 2. SHOWCASE VIDEO EMBED */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          🎬 Showcase Video Embed (YouTube)
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#6b7280' }}>
          Embed your official venue walkthrough or celebratory video on the About Us page.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            YouTube Embed URL
          </label>
          <input
            type="text"
            value={settings['director_video_url'] || ''}
            onChange={(e) => handleChange('director_video_url', e.target.value)}
            placeholder="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
          />
          <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginTop: '4px' }}>
            Must be an embed URL format (e.g. <code>https://www.youtube.com/embed/...</code>)
          </span>
        </div>

        {/* Live Video Preview Box */}
        {currentVideo && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              Live Player Preview:
            </label>
            <div style={{ maxWidth: '640px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', aspectRatio: '16 / 9', backgroundColor: '#000' }}>
              <iframe
                src={currentVideo}
                title="Lascigal Showcase Video Preview"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={saving}
        style={{
          padding: '14px 40px',
          backgroundColor: '#c5a880',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(197, 168, 128, 0.3)',
        }}
      >
        {saving ? 'Publishing Changes...' : 'Save & Publish About Us Page'}
      </button>
    </form>
  );
}
