import { create } from "zustand";
import {
  type UserData,
  type LoginParams,
  type ApiResponse,
  type ApiError,
  type APiData,
} from "../api/auth-api";
import { createJSONStorage, persist } from "zustand/middleware";
import { authApi } from "../api/auth-api";
import type { AxiosError } from "axios";

interface AuthState {
  user: UserData | null;
  email: string;
  role: string;
  password: string;
  accessToken: string;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  login: (params: LoginParams) => Promise<ApiResponse<APiData>>;
  logout: () => void;
  getUser: () => UserData | null;
  getRole: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      email: "",
      password: "",
      role: "",
      accessToken: "",
      isLoading: false,
      error: null,
      isAuthenticated: false,
      setEmail: (email: string) => set({ email }),
      setPassword: (password: string) => set({ password }),
      login: async (params: LoginParams): Promise<ApiResponse<APiData>> => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.login(params);

          const { token, user } = response.data;

          set({
            user: user,
            role: user.role,
            isLoading: false,
            isAuthenticated: true,
            accessToken: token,
          });
          return response;
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });

          console.error("Error logging in:", error);

          return Promise.reject(error);
        }
      },
      logout: () =>
        set({
          user: null,
          accessToken: "",
          email: "",
          isLoading: false,
          isAuthenticated: false,
          error: null,
          role: "",
        }),

      getUser: () => {
        return get().user;
      },

      getRole: () => {
        return get().role;
      },
    }),

    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);
