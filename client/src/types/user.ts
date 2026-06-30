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
  created_at?: string;
}

export interface RandomApiUser {
  login: { uuid: string };
  name: { title: string; first: string; last: string };
  gender: string;
  email: string;
  phone: string;
  location: {
    country: string;
    city: string;
    state: string;
    street: { number: number; name: string };
  };
  dob: { date: string; age: number };
  picture: { large: string; thumbnail: string };
}

export type Source = 'list' | 'history';

export interface ProfileLocationState {
  profile: Profile;
  source: Source;
}

export function mapRandomUser(u: RandomApiUser): Profile {
  return {
    id: u.login.uuid,
    title: u.name.title,
    first: u.name.first,
    last: u.name.last,
    gender: u.gender,
    email: u.email,
    phone: u.phone,
    country: u.location.country,
    city: u.location.city,
    state: u.location.state,
    street_number: u.location.street.number,
    street_name: u.location.street.name,
    age: u.dob.age,
    dob_date: u.dob.date,
    picture_large: u.picture.large,
    picture_thumbnail: u.picture.thumbnail,
  };
}
