import { create } from 'zustand';

const STORAGE_KEY = 'versedrop_user_token';

function generateToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface AuthStore {
  userToken: string;
  isPlusSubscriber: boolean;
}

export const useAuthStore = create<AuthStore>(() => {
  let token = localStorage.getItem(STORAGE_KEY);
  if (!token) {
    token = generateToken();
    localStorage.setItem(STORAGE_KEY, token);
  }
  return {
    userToken: token,
    isPlusSubscriber: false,
  };
});
