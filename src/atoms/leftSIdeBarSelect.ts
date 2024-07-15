import { atom } from 'recoil';

// Define an atom
export const leftSideBarSelect = atom({
  key: 'leftSideBarSelect', // Unique ID (with respect to other atoms/selectors)
  default: "Dashboard", // Default value (if none is provided)
});