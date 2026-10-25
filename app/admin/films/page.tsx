import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllScrollFilms } from '@/lib/scroll-film';
import FilmManager from './FilmManager';

export const dynamic = 'force-dynamic';

export default async function AdminFilmsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const films = getAllScrollFilms();

  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 700, color: '#0f172a' }}>
          Scroll-Film Interactive Tours
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>
          Manage your cinematic 120-frame scroll films, view live preview links, add new tour entries, or extract 120 WebP frames directly in your browser.
        </p>
      </div>

      <FilmManager initialFilms={films} />
    </div>
  );
}
