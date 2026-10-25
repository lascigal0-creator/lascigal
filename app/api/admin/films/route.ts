import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { getAllScrollFilms } from '@/lib/scroll-film';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const films = getAllScrollFilms();
    return NextResponse.json({ films });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newFilm = await req.json();
    if (!newFilm.slug || !newFilm.title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    const jsonPath = path.join(process.cwd(), 'data', 'scroll-films.json');
    let existingFilms: any[] = [];
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf-8');
      existingFilms = JSON.parse(content);
    }

    const index = existingFilms.findIndex((f) => f.slug === newFilm.slug);
    if (index >= 0) {
      existingFilms[index] = { ...existingFilms[index], ...newFilm };
    } else {
      existingFilms.push(newFilm);
    }

    fs.writeFileSync(jsonPath, JSON.stringify(existingFilms, null, 2), 'utf-8');

    return NextResponse.json({ success: true, film: newFilm });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
