'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Allow login by username (map to email)
    const loginEmail = email.includes('@') ? email : `${email}@geklab.demo`;

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (authError) {
      setError('Credenziali non valide');
      setLoading(false);
      return;
    }

    onLogin();
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🌿</span>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mt-2">PerMè</h1>
          <p className="text-sm text-[var(--color-text-light)] mt-1">Il tuo percorso di salute</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-[var(--color-text-light)] mb-1">
              Utente
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-cream-dark)] bg-[var(--color-cream)] text-sm text-[var(--color-text)]
                         placeholder:text-[var(--color-text-lighter)] focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
              placeholder="Nome utente o email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-[var(--color-text-light)] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-cream-dark)] bg-[var(--color-cream)] text-sm text-[var(--color-text)]
                         placeholder:text-[var(--color-text-lighter)] focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
              placeholder="Password"
            />
          </div>

          {error && (
            <p className="text-xs text-[var(--color-terracotta)] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-50"
          >
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
