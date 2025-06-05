import { StateCreator, create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const authMiddleware = (f: StateCreator<AuthStore>) =>
  devtools(
    persist(f, {
      name: "drimcot-auth", // unique name for the storage
      storage: createJSONStorage(() => localStorage),
    })
  );

export const useAuth = create<AuthStore>()(
  authMiddleware((set) => ({
    user: null,
    isLoading: false,
    token: "",
    isAuthenticated: false,
    login: (token: string, user: User) => {
      set({ token, user, isAuthenticated: true });
    },
    logout: () => set({ token: "", user: null, isAuthenticated: false }),
  }))
);
