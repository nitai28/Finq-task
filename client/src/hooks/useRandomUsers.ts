import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Profile, RandomApiUser, mapRandomUser } from '../types/user';

export const RANDOM_USERS_KEY = ['randomUsers'] as const;

export function useRandomUsers() {
  return useQuery({
    queryKey: RANDOM_USERS_KEY,
    queryFn: async (): Promise<Profile[]> => {
      const { data } = await axios.get<{ results: RandomApiUser[] }>(
        'https://randomuser.me/api/?results=10'
      );
      return data.results.map(mapRandomUser);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useUpdateRandomUser() {
  const queryClient = useQueryClient();
  return (id: string, updates: Pick<Profile, 'title' | 'first' | 'last'>) => {
    queryClient.setQueryData<Profile[]>(RANDOM_USERS_KEY, (old) =>
      old?.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };
}
