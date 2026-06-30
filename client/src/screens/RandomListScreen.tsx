import { useNavigate } from 'react-router-dom';
import { useRandomUsers } from '../hooks/useRandomUsers';
import { UserList } from '../components/UserList';

export function RandomListScreen() {
  const navigate = useNavigate();
  const { data: profiles = [], isLoading, error } = useRandomUsers();

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
          <h1 className="font-semibold text-gray-900">Random Profiles</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        <UserList
          profiles={profiles}
          source="list"
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}
