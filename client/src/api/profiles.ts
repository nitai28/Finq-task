import axios from 'axios';
import { Profile } from '../types/user';

const BASE = '/api/profiles';

export const getProfiles = async (): Promise<Profile[]> => {
  const { data } = await axios.get<Profile[]>(BASE);
  return data;
};

export const saveProfile = async (profile: Profile): Promise<Profile> => {
  const { data } = await axios.post<Profile>(BASE, profile);
  return data;
};

export const updateProfile = async (
  id: string,
  updates: Pick<Profile, 'title' | 'first' | 'last'>
): Promise<Profile> => {
  const { data } = await axios.put<Profile>(`${BASE}/${id}`, updates);
  return data;
};

export const deleteProfile = async (id: string): Promise<void> => {
  await axios.delete(`${BASE}/${id}`);
};
