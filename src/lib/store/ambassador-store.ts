import { create } from "zustand";
import {
  type Ambassador,
  type Referral,
  type Bank,
} from "../api/ambassador-api";
import { createJSONStorage, persist } from "zustand/middleware";
import { ambassadorApi } from "../api/ambassador-api";
import type { AxiosError } from "axios";
import { ApiError } from "../api/auth-api";

interface AmbassadorState {
  ambassadors: Ambassador[];
  referrals: Referral[];
  banks: Bank[];
  selectedBank: Bank | null;
  accountName: string;
  isLoading: boolean;
  isAmbassadorLoading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  selectedAmbassador: Ambassador | null;

  // Actions
  getAmbassadors: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  selectAmbassador: (ambassador: Ambassador | null) => void;
  getAmbassadorReferrals: (id: string) => Promise<void>;
  selectBank: (bank: Bank | null) => void;
  getBanks: () => Promise<void>;
  verifyAccount: (bankCode: string, accountNumber: string) => Promise<void>;
  updateAmbassador: (id: string, data: Partial<Ambassador>) => Promise<void>;
  inviteUser: (
    phoneNumber: string,
    email: string,
    firstName: string,
    lastName: string,
    accountNumber: string,
    accountName: string,
    bankCode: string
  ) => Promise<void>;
}

export const useAmbassadorStore = create<AmbassadorState>()(
  persist(
    (set) => ({
      ambassadors: [],
      referrals: [],
      banks: [],
      selectedBank: null,
      accountName: "",
      isLoading: false,
      isAmbassadorLoading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
      selectedAmbassador: null,
      getAmbassadors: async () => {
        try {
          set({ isAmbassadorLoading: true, error: null });
          const response = await ambassadorApi.getAmbassadors();

          const { userData } = response.data;

          set({
            ambassadors: userData,
            isAmbassadorLoading: false,
          });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isAmbassadorLoading: false, error: errorMessage });
        }
      },

      setCurrentPage: (page) => set({ currentPage: page }),

      setItemsPerPage: (count) => set({ itemsPerPage: count }),

      selectAmbassador: (ambassador) => set({ selectedAmbassador: ambassador }),

      getAmbassadorReferrals: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await ambassadorApi.getAmbassadorReferrals(id);

          set({
            referrals: response.data,
            isLoading: false,
          });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isLoading: false, error: errorMessage });
        }
      },
      getBanks: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await ambassadorApi.getBanks();

          set({
            banks: response.data.list,
            isLoading: false,
          });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isLoading: false, error: errorMessage });
        }
      },

      selectBank: (bank) => set({ selectedBank: bank }),

      verifyAccount: async (bankCode, accountNumber) => {
        try {
          set({ isLoading: true, error: null });
          const response = await ambassadorApi.verifyAccount(
            bankCode,
            accountNumber
          );

          set({
            accountName: response.data.account_name,
            isLoading: false,
          });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isLoading: false, error: errorMessage });
        }
      },

      inviteUser: async (
        phoneNumber,
        email,
        firstName,
        lastName,
        accountNumber,
        accountName,
        bankCode
      ) => {
        set({ isLoading: true, error: null });
        try {
          await ambassadorApi.inviteUser(
            phoneNumber,
            email,
            firstName,
            lastName,
            accountNumber,
            accountName,
            bankCode
          );
          set({ isLoading: false, error: null });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isLoading: false, error: errorMessage });
        }
      },

      updateAmbassador: async (id: string, data: Partial<Ambassador>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await ambassadorApi.updateAmbassador(id, data);
          const updatedAmbassador = response.data;
          set((state) => ({
            ambassadors: state.ambassadors.map((ambassador) =>
              ambassador.id === id
                ? { ...ambassador, ...updatedAmbassador }
                : ambassador
            ),
            selectedAmbassador: {
              ...state.selectedAmbassador,
              ...updatedAmbassador,
            },
            isLoading: false,
          }));
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isLoading: false, error: errorMessage });
        }
      },
    }),

    {
      name: "ambassador-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ambassadors: state.ambassadors,
      }),
    }
  )
);
