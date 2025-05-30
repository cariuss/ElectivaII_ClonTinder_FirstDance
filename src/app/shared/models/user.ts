export interface UserPreferences {
  minAge: number;
  maxAge: number;
  interestedInGender: 'Male' | 'Female' | 'other';
  maxDistance: number;
}

export interface UserLocation {
  city: string;
  country: string;
}

export interface User {
  id?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'other';
  bio: string;
  preferences: UserPreferences;
  location: UserLocation;
  profilePhoto: string;
  additionalPhotos?: string[];
}
