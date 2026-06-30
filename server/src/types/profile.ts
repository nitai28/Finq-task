export interface Profile {
  id: string;
  title: string;
  first: string;
  last: string;
  gender: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  street_number: number;
  street_name: string;
  age: number;
  dob_date: string;
  picture_large: string;
  picture_thumbnail: string;
  created_at: string;
}

export interface CreateProfileBody {
  id: string;
  title: string;
  first: string;
  last: string;
  gender: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  street_number: number;
  street_name: string;
  age: number;
  dob_date: string;
  picture_large: string;
  picture_thumbnail: string;
}

export interface UpdateProfileBody {
  title?: string;
  first?: string;
  last?: string;
}
