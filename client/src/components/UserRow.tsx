import { Profile } from '../types/user';

interface UserRowProps {
  profile: Profile;
  onClick: () => void;
}

export function UserRow({ profile, onClick }: UserRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-indigo-50 transition-colors text-left group border-b border-gray-100 last:border-0"
    >
      <img
        src={profile.picture_thumbnail}
        alt={`${profile.first} ${profile.last}`}
        className="w-11 h-11 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-indigo-200 transition"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate text-sm">
          {profile.title} {profile.first} {profile.last}
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {profile.gender === 'male' ? 'Male' : 'Female'} &middot; {profile.country}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{profile.phone}</p>
      </div>
      <div className="flex-shrink-0 text-gray-300 group-hover:text-indigo-400 transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
