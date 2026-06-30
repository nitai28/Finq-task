import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '../api/profiles';
import { Profile } from '../types/user';

export const PROFILES_KEY = ['profiles'] as const;

export function useProfiles() {
  return useQuery({
    queryKey: PROFILES_KEY,
    queryFn: api.getProfiles,
    staleTime: Infinity,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveProfile,
    onMutate: async (profile) => {
      await queryClient.cancelQueries({ queryKey: PROFILES_KEY });
      const previous = queryClient.getQueryData<Profile[]>(PROFILES_KEY);
      queryClient.setQueryData<Profile[]>(PROFILES_KEY, (old) => [profile, ...(old ?? [])]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(PROFILES_KEY, context.previous);
      toast.error('שמירה נכשלה — נסה שנית');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: PROFILES_KEY }),
    onSuccess: () => toast.success('הפרופיל נשמר בהצלחה'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Pick<Profile, 'title' | 'first' | 'last'> }) =>
      api.updateProfile(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: PROFILES_KEY });
      const previous = queryClient.getQueryData<Profile[]>(PROFILES_KEY);
      queryClient.setQueryData<Profile[]>(PROFILES_KEY, (old) =>
        old?.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(PROFILES_KEY, context.previous);
      toast.error('עדכון נכשל — נסה שנית');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: PROFILES_KEY }),
    onSuccess: () => toast.success('הפרופיל עודכן בהצלחה'),
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProfile,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PROFILES_KEY });
      const previous = queryClient.getQueryData<Profile[]>(PROFILES_KEY);
      queryClient.setQueryData<Profile[]>(PROFILES_KEY, (old) => old?.filter((p) => p.id !== id));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(PROFILES_KEY, context.previous);
      toast.error('מחיקה נכשלה — נסה שנית');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: PROFILES_KEY }),
    onSuccess: () => toast.success('הפרופיל נמחק'),
  });
}
