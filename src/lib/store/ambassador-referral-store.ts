import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AxiosError } from "axios";
import { ApiError } from "../api/auth-api";
import { type Referral } from "../api/ambassador-referral-api";
import { ambassadorReferralApi } from "../api/ambassador-referral-api";

type Metrics = {
  totalAmount: number;
  totalUsersReferred: number;
};

interface AmbassadorReferralState {
  metrics: Metrics | null;
  referrals: Referral[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  getReferrals: () => Promise<void>;
  getMetrics: () => Promise<void>;
}

export const useAmbassadorReferralStore = create<AmbassadorReferralState>()(
  persist(
    (set) => ({
      referrals: [],
      metrics: null,
      isLoading: false,
      currentPage: 1,
      itemsPerPage: 10,
      error: null,
      getReferrals: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await ambassadorReferralApi.getReferrals();
          set({ referrals: response.data });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      getMetrics: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await ambassadorReferralApi.getReferralMetrics();
          set({ metrics: response.data, isLoading: false });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      setCurrentPage: (page) => set({ currentPage: page }),

      setItemsPerPage: (count) => set({ itemsPerPage: count }),
    }),
    {
      name: "ambassador-referral-store",
    }
  )
);
