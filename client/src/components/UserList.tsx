import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile, Source } from '../types/user';
import { FilterBar } from './FilterBar';
import { UserRow } from './UserRow';

interface UserListProps {
  profiles: Profile[];
  source: Source;
  isLoading: boolean;
  error: Error | null;
}

export function UserList({ profiles, source, isLoading, error }: UserListProps) {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const filtered = profiles.filter((p) => {
    const nameMatch =
      nameFilter === '' ||
      `${p.first} ${p.last}`.toLowerCase().includes(nameFilter.toLowerCase());
    const countryMatch =
      countryFilter === '' ||
      p.country.toLowerCase().includes(countryFilter.toLowerCase());
    return nameMatch && countryMatch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <FilterBar
          nameFilter=""
          countryFilter=""
          onNameChange={() => {}}
          onCountryChange={() => {}}
        />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
            <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/5" />
              <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">Failed to load profiles. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <FilterBar
        nameFilter={nameFilter}
        countryFilter={countryFilter}
        onNameChange={setNameFilter}
        onCountryChange={setCountryFilter}
      />
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-gray-400">No profiles match your filter.</p>
          </div>
        ) : (
          filtered.map((profile) => (
            <UserRow
              key={profile.id}
              profile={profile}
              onClick={() =>
                navigate(`/profile/${profile.id}`, { state: { profile, source } })
              }
            />
          ))
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2 text-right">
        {filtered.length} of {profiles.length} profiles
      </p>
    </div>
  );
}
