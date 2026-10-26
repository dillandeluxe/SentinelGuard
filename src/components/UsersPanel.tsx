'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSystem } from '../lib/store';

type Role = 'Guard' | 'Resident' | 'Admin';
type Profile = { id: string; name: string; email: string | null; role: Role; unitNumber: string | null };

const selectClass =
  'w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 disabled:opacity-50';

// Admin list of accounts: set each one's role and, for residents, their unit. RLS lets only admins read and change all profiles.
export const UsersPanel: React.FC = () => {
  const { units } = useSystem();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setMyId(data.user?.id ?? null));
    supabase
      .from('profiles')
      .select('id, name, email, role, unitNumber')
      .order('email')
      .then(({ data, error }) => (error ? setStatus(`Could not load users: ${error.message}`) : setProfiles(data)));
  }, []);

  if (!supabase) return null;
  const db = supabase;

  const save = async (profile: Profile, patch: Partial<Pick<Profile, 'role' | 'unitNumber'>>) => {
    const label = profile.email || profile.name || 'user';
    // .select() so a change RLS refused (0 rows) is reported instead of looking saved.
    const { data, error } = await db.from('profiles').update(patch).eq('id', profile.id).select('id');
    if (error || !data?.length) {
      setStatus(`Could not update ${label}: ${error?.message ?? 'not permitted for your account'}`);
      return;
    }
    setProfiles((prev) => prev.map((p) => (p.id === profile.id ? { ...p, ...patch } : p)));
    setStatus(`Saved ${label}. They see the change the next time they sign in.`);
  };

  return (
    <div className="card-carbon p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-xs font-semibold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          Users &amp; Access
        </span>
        <span className="text-xs font-mono text-slate-500">{profiles.length} accounts</span>
      </div>
      <p className="text-xs text-slate-400">
        New sign-ups start as Resident with no unit. Link residents to their unit so they can issue passes.
      </p>

      {profiles.length === 0 ? (
        <div className="text-xs text-slate-500 text-center py-4 font-mono">No accounts yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 font-mono">
                <th className="py-2 pr-3 font-normal">Account</th>
                <th className="py-2 pr-3 font-normal w-32">Role</th>
                <th className="py-2 font-normal w-36">Unit</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isMe = p.id === myId;
                return (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="py-2 pr-3">
                      <span className="text-white block">{p.name || '—'}{isMe && <span className="text-emerald-400"> (you)</span>}</span>
                      <span className="text-slate-500 font-mono">{p.email}</span>
                    </td>
                    <td className="py-2 pr-3">
                      <select
                        aria-label={`Role for ${p.email || p.name}`}
                        value={p.role}
                        // Stops an admin from demoting themselves and losing access to this screen.
                        disabled={isMe}
                        title={isMe ? "You can't change your own role" : undefined}
                        onChange={(e) => save(p, { role: e.target.value as Role })}
                        className={selectClass}
                      >
                        <option value="Resident">Resident</option>
                        <option value="Guard">Guard</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-2">
                      <select
                        aria-label={`Unit for ${p.email || p.name}`}
                        value={p.unitNumber ?? ''}
                        disabled={p.role !== 'Resident'}
                        onChange={(e) => save(p, { unitNumber: e.target.value || null })}
                        className={selectClass}
                      >
                        <option value="">No unit</option>
                        {units.map((u) => (
                          <option key={u.id} value={u.unitNumber}>{u.unitNumber}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {status && (
        <p role="status" className="text-xs font-mono text-amber-300">
          {status}
        </p>
      )}
    </div>
  );
};
