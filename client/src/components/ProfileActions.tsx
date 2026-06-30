const btn = 'px-4 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

interface ProfileActionsProps {
  isSaved: boolean;
  isBusy: boolean;
  hasChanges: boolean;
  onSave: () => void;
  onDelete: () => void;
  onUpdate: () => void;
  onBack: () => void;
}

export function ProfileActions({ isSaved, isBusy, hasChanges, onSave, onDelete, onUpdate, onBack }: ProfileActionsProps) {
  return (
    <div dir="ltr" className="flex gap-2 pt-1">
      {!isSaved && (
        <button onClick={onSave} disabled={isBusy}
          className={`flex-1 bg-indigo-600 text-white enabled:hover:bg-indigo-700 ${btn}`}>
          Save
        </button>
      )}
      {isSaved && (
        <button onClick={onDelete} disabled={isBusy}
          className={`flex-1 bg-red-600 text-white enabled:hover:bg-red-700 ${btn}`}>
          Delete
        </button>
      )}
      <button onClick={onUpdate} disabled={isBusy || !hasChanges}
        className={`flex-1 bg-white text-gray-700 border border-gray-200 enabled:hover:bg-gray-50 ${btn}`}>
        Update
      </button>
      <button onClick={onBack} disabled={isBusy}
        className={`bg-white text-gray-500 border border-gray-200 enabled:hover:bg-gray-50 ${btn}`}>
        Back
      </button>
    </div>
  );
}
