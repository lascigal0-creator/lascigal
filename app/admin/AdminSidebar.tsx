'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { mediaUrl } from '@/lib/media';

interface AdminSidebarProps {
  sessionUser: string;
  pendingCount?: number;
  logo?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminSidebar({
  sessionUser,
  pendingCount = 0,
  logo = 'images/laslogo1.png',
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') return null;

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/admin', icon: 'fa-chart-pie', exact: true },
      ],
    },
    {
      title: 'PAGES & CONTENT',
      items: [
        { label: 'Home Page', href: '/admin/pages/home', icon: 'fa-house' },
        { label: 'About Us', href: '/admin/pages/about', icon: 'fa-circle-info' },
        { label: 'Contact Us', href: '/admin/pages/contact', icon: 'fa-phone' },
        { label: 'Facilities & Amenities', href: '/admin/facilities', icon: 'fa-building-columns' },
        { label: 'Events & Portfolio', href: '/admin/events', icon: 'fa-calendar-days' },
        { label: 'Photo Gallery', href: '/admin/gallery', icon: 'fa-images' },
        { label: 'Scroll Films', href: '/admin/films', icon: 'fa-film' },
      ],
    },
    {
      title: 'LEADS & INBOX',
      items: [
        {
          label: 'Booking Inquiries',
          href: '/admin/inbox',
          icon: 'fa-envelope-open-text',
          badge: pendingCount > 0 ? pendingCount : undefined,
        },
      ],
    },
    {
      title: 'BRAND & SYSTEM',
      items: [
        { label: 'Brand & SEO', href: '/admin/pages/brand', icon: 'fa-palette' },
        { label: 'All Settings', href: '/admin/settings', icon: 'fa-sliders' },
        { label: 'Cloudflare Media', href: '/admin/media', icon: 'fa-cloud-arrow-up' },
      ],
    },
  ];

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#111318',
        color: '#e2e8f0',
        borderRight: '1px solid #1e222d',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #1e222d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(logo)}
            alt="Lascigal Logo"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' }}>
              Lascigal
            </div>
            <div style={{ color: '#c5a880', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Admin Panel
            </div>
          </div>
        </Link>
        <span
          style={{
            backgroundColor: 'rgba(197, 168, 128, 0.15)',
            color: '#c5a880',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '4px',
            border: '1px solid rgba(197, 168, 128, 0.3)',
          }}
        >
          LIVE
        </span>
      </div>

      {/* Navigation Groups */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {navSections.map((sec) => (
          <div key={sec.title}>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: '#64748b',
                padding: '0 10px 6px',
                letterSpacing: '1px',
              }}
            >
              {sec.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {sec.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: '7px',
                      textDecoration: 'none',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#fff' : '#94a3b8',
                      backgroundColor: isActive ? 'rgba(197, 168, 128, 0.18)' : 'transparent',
                      borderLeft: isActive ? '3px solid #c5a880' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                      <i
                        className={`fas ${item.icon}`}
                        style={{
                          width: '18px',
                          textAlign: 'center',
                          color: isActive ? '#c5a880' : '#64748b',
                          fontSize: '14px',
                        }}
                      ></i>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '10px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Area with Quick Links & Logout */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #1e222d',
          backgroundColor: '#0d0f14',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#c5a880',
            padding: '8px',
            borderRadius: '6px',
            fontSize: '12.5px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <span>↗ View Public Website</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#c5a880',
                color: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              A
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Administrator
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sessionUser}
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            title="Log Out"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '15px',
              padding: '6px 8px',
              borderRadius: '4px',
            }}
          >
            <i className="fas fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      <aside
        className="admin_desktop_sidebar"
        style={{
          width: '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          flexShrink: 0,
          display: 'block',
          zIndex: 40,
        }}
      >
        {sidebarContent}
      </aside>

      {/* 2. MOBILE TOP BAR */}
      <div
        className="admin_mobile_header"
        style={{
          display: 'none',
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '56px',
          backgroundColor: '#111318',
          borderBottom: '1px solid #1e222d',
          padding: '0 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '6px',
          }}
          aria-label="Open Navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(logo)} alt="Logo" style={{ height: '28px', width: 'auto' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Lascigal Admin</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          style={{ color: '#c5a880', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}
        >
          Live ↗
        </Link>
      </div>

      {/* 3. MOBILE OFFCANVAS DRAWER */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(3px)',
            }}
          ></div>
          <div
            style={{
              position: 'relative',
              width: '270px',
              maxWidth: '85vw',
              height: '100%',
              zIndex: 101,
            }}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Responsive CSS for desktop vs mobile sidebar display */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .admin_desktop_sidebar {
            display: none !important;
          }
          .admin_mobile_header {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
