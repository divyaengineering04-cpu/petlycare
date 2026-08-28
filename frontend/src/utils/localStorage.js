import { INITIAL_USER, INITIAL_PETS, INITIAL_BOOKINGS, INITIAL_REMINDERS, INITIAL_MARKETPLACE_PETS } from '../data/mockData';

const KEYS = {
  USER: 'petly_user',
  AUTH: 'petly_is_authenticated',
  PETS: 'petly_pets',
  BOOKINGS: 'petly_bookings',
  REMINDERS: 'petly_reminders',
  MARKETPLACE: 'petly_marketplace_pets',
  CURRENCY_VERSION: 'petly_currency_v3'
};

export const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.CURRENCY_VERSION)) {
    localStorage.clear();
    setItem(KEYS.CURRENCY_VERSION, 'INR_V3');
  }

  if (!localStorage.getItem(KEYS.USER)) {
    setItem(KEYS.USER, INITIAL_USER);
    setItem(KEYS.AUTH, true);
  }

  if (!localStorage.getItem(KEYS.PETS)) {
    setItem(KEYS.PETS, INITIAL_PETS);
  }

  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    setItem(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  if (!localStorage.getItem(KEYS.REMINDERS)) {
    setItem(KEYS.REMINDERS, INITIAL_REMINDERS);
  }

  if (!localStorage.getItem(KEYS.MARKETPLACE)) {
    setItem(KEYS.MARKETPLACE, INITIAL_MARKETPLACE_PETS);
  }
};

export const resetStorageToDemo = () => {
  setItem(KEYS.CURRENCY_VERSION, 'INR_V3');
  setItem(KEYS.USER, INITIAL_USER);
  setItem(KEYS.AUTH, true);
  setItem(KEYS.PETS, INITIAL_PETS);
  setItem(KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setItem(KEYS.REMINDERS, INITIAL_REMINDERS);
  setItem(KEYS.MARKETPLACE, INITIAL_MARKETPLACE_PETS);
};

export { KEYS };
