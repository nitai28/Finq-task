import { useState } from 'react';
import { useProfileDetail } from '../hooks/useProfileDetail';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileActions } from '../components/ProfileActions';

export function ProfileDetailScreen() {
  const { profile, isSaved, isBusy, handleSave, handleDelete, handleUpdate, goBack } = useProfileDetail();

  const [nameTitle, setNameTitle] = useState(profile?.title ?? '');
  const [nameFirst, setNameFirst] = useState(profile?.first ?? '');
  const [nameLast,  setNameLast]  = useState(profile?.last  ?? '');
  const [committedName, setCommittedName] = useState({
    title: profile?.title ?? '',
    first: profile?.first ?? '',
    last:  profile?.last  ?? '',
  });

  if (!profile) return null;

  const hasChanges =
    nameTitle !== committedName.title ||
    nameFirst !== committedName.first ||
    nameLast  !== committedName.last;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-900">פרופיל משתמש</h1>
          <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
            isSaved ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'
          }`}>
            {isSaved ? 'Saved' : 'Not saved'}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex justify-center">
          <img
            src={profile.picture_large}
            alt={`${profile.first} ${profile.last}`}
            className="w-28 h-28 rounded-2xl object-cover shadow-md ring-4 ring-white"
          />
        </div>

        <ProfileCard
          profile={profile}
          nameTitle={nameTitle}
          nameFirst={nameFirst}
          nameLast={nameLast}
          onTitleChange={setNameTitle}
          onFirstChange={setNameFirst}
          onLastChange={setNameLast}
        />

        <ProfileActions
          isSaved={isSaved}
          isBusy={isBusy}
          hasChanges={hasChanges}
          onSave={() => handleSave(profile)}
          onDelete={() => handleDelete(profile.id)}
          onUpdate={async () => {
            const name = { title: nameTitle, first: nameFirst, last: nameLast };
            const ok = await handleUpdate(profile.id, name);
            if (ok) setCommittedName(name);
          }}
          onBack={goBack}
        />
      </main>
    </div>
  );
}
