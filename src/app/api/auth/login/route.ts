import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Credenziali mancanti' }, { status: 400 });
    }

    const user = await validateCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
    }

    const token = await createSession(user.id);

    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}
