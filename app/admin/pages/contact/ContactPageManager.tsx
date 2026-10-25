'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContactPageManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const contactSettings = {
        phone_primary: settings.phone_primary || '',
        phone_secondary: settings.phone_secondary || '',
        whatsapp_number: settings.whatsapp_number || '',
        email_address: settings.email_address || '',
        address_line1: settings.address_line1 || '',
        address_pincode: settings.address_pincode || '',
        google_maps_url: settings.google_maps_url || '',
        google_maps_embed: settings.google_maps_embed || '',
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: contactSettings }),
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
        throw new Error(data?.error || `Failed to save Contact settings (Status: ${res.status})`);
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

  const currentMap = settings['google_maps_embed'];

  return (
    <form onSubmit={handleSave}>
      {saved && (
        <div style={{ padding: '14px 20px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '25px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>✓</span>
          <span>Contact channels, phone numbers, and location map successfully updated across all pages!</span>
        </div>
      )}

      {/* 1. DIRECT COMMUNICATION CHANNELS */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
              📞 Direct Contact Numbers & WhatsApp
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#6b7280' }}>
              Updated instantly in the desktop header, mobile menu, footer, and inquiry response buttons.
            </p>
          </div>
          <Link
            href="/contactus"
            target="_blank"
            style={{ fontSize: '12.5px', color: '#c5a880', fontWeight: 600, textDecoration: 'none', border: '1px solid #c5a880', padding: '6px 12px', borderRadius: '5px' }}
          >
            ↗ Preview Live /contactus
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Primary Phone (Call & Header)</label>
            <input
              type="text"
              value={settings['phone_primary'] || ''}
              onChange={(e) => handleChange('phone_primary', e.target.value)}
              placeholder="e.g. 7306107515"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Secondary Phone</label>
            <input
              type="text"
              value={settings['phone_secondary'] || ''}
              onChange={(e) => handleChange('phone_secondary', e.target.value)}
              placeholder="e.g. 9745897834"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>WhatsApp (Include country code e.g. 91...)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={settings['whatsapp_number'] || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="e.g. 917306107515"
                style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
              {settings['whatsapp_number'] && (
                <a
                  href={`https://wa.me/${settings['whatsapp_number']}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Test Chat
                </a>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Official Email Address</label>
            <input
              type="email"
              value={settings['email_address'] || ''}
              onChange={(e) => handleChange('email_address', e.target.value)}
              placeholder="e.g. lascigal@gmail.com"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* 2. PHYSICAL ADDRESS & GOOGLE MAPS */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '25px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
          📍 Location, Address & Google Maps Embed
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#6b7280' }}>
          Configures the address cards and the full-width interactive map in the website footer.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Address Line</label>
            <input
              type="text"
              value={settings['address_line1'] || ''}
              onChange={(e) => handleChange('address_line1', e.target.value)}
              placeholder="e.g. Las Cigal Convention Center, Kalampoor, Muvattupuzha"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Pincode</label>
            <input
              type="text"
              value={settings['address_pincode'] || ''}
              onChange={(e) => handleChange('address_pincode', e.target.value)}
              placeholder="Enter PIN code when confirmed"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Google Maps Link (One-tap directions)</label>
            <input
              type="text"
              value={settings['google_maps_url'] || ''}
              onChange={(e) => handleChange('google_maps_url', e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Google Maps Iframe Embed URL
            </label>
            <input
              type="text"
              value={settings['google_maps_embed'] || ''}
              onChange={(e) => handleChange('google_maps_embed', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
            <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginTop: '4px' }}>
              From Google Maps: Share ➔ Embed a map ➔ Copy the URL inside <code>src=&quot;...&quot;</code>
            </span>
          </div>
        </div>

        {/* Live Google Map Preview */}
        {currentMap && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              Live Embedded Map Preview:
            </label>
            <div style={{ width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#eee' }}>
              <iframe
                src={currentMap}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Google Maps Preview"
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
        {saving ? 'Publishing Changes...' : 'Save & Publish Contact Details'}
      </button>
    </form>
  );
}
