import { useNavigate } from 'react-router-dom';
import { useProfiles } from '../hooks/useProfiles';
import { UserList } from '../components/UserList';

export function SavedProfilesScreen() {
  const navigate = useNavigate();
  const { data: profiles = [], isLoading, error } = useProfiles();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900">Saved Profiles</h1>
          {profiles.length > 0 && (
            <span className="ml-auto text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {profiles.length}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {!isLoading && profiles.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No saved profiles yet</p>
            <p className="text-xs text-gray-400 mt-1">Fetch profiles and save the ones you like</p>
            <button
              onClick={() => navigate('/list')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Fetch Profiles
            </button>
          </div>
        ) : (
          <UserList
            profiles={profiles}
            source="history"
            isLoading={isLoading}
            error={error}
          />
        )}
      </main>
    </div>
  );
}
