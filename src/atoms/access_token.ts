import { atom } from 'recoil';

// Define an atom
export const access_token = atom({
  key: 'access_token', // Unique ID (with respect to other atoms/selectors)
  default: "", // Default value (if none is provided)
});