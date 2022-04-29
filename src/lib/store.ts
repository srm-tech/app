import create from 'zustand';

interface AuthStore {
  status: 'active' | 'inactive';
  login: () => void;
  logout: () => void;
}
export const useAuthStore = create<AuthStore>((set) => ({
  status: 'inactive',
  login: () => set((state) => ({ status: 'active' })),
  logout: () => set({ status: 'inactive' }),
}));
