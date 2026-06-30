import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Profile, ProfileLocationState } from '../types/user';
import { useProfiles, useSaveProfile, useUpdateProfile, useDeleteProfile } from './useProfiles';
import { useUpdateRandomUser } from './useRandomUsers';

interface NameValues {
  title: string;
  first: string;
  last: string;
}

export function useProfileDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ProfileLocationState | null;

  const { data: savedProfiles = [] } = useProfiles();
  const saveMutation     = useSaveProfile();
  const updateMutation   = useUpdateProfile();
  const deleteMutation   = useDeleteProfile();
  const updateRandomUser = useUpdateRandomUser();

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  const profile = state?.profile ?? null;
  const isSaved = profile ? savedProfiles.some((p) => p.id === profile.id) : false;
  const isBusy  = saveMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSave = async (p: Profile) => {
    await saveMutation.mutateAsync(p);
    navigate(-1);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    navigate(-1);
  };

  const handleUpdate = async (id: string, name: NameValues): Promise<boolean> => {
    try {
      if (isSaved) {
        await updateMutation.mutateAsync({ id, data: name });
        updateRandomUser(id, name);
      } else {
        updateRandomUser(id, name);
        toast.success('השם עודכן בהצלחה');
      }
      return true;
    } catch {
      return false;
    }
  };

  return {
    profile,
    isSaved,
    isBusy,
    handleSave,
    handleDelete,
    handleUpdate,
    goBack: () => navigate(-1),
  };
}

export type ProfileDetail = ReturnType<typeof useProfileDetail>;
