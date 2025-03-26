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
import { toast } from "react-toastify";

interface AmbassadorState {
  ambassadors: Ambassador[];
  referrals: Referral[];
  banks: Bank[];
  selectedBank: Bank | null;
  accountName: string;
  isLoading: boolean;
  isBankLoading: boolean;
  isAccountVerificationLoading: boolean;
  isAmbassadorLoading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  selectedAmbassador: Ambassador | null;
  set: (state: Partial<AmbassadorState>) => void;

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
  ) => Promise<unknown>;
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
      isBankLoading: false,
      isAccountVerificationLoading: false,
      isAmbassadorLoading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
      selectedAmbassador: null,
      set,

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
          set({ isBankLoading: true, error: null });
          const response = await ambassadorApi.getBanks();

          set({
            banks: response.data.list,
            isBankLoading: false,
          });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isBankLoading: false, error: errorMessage });
        }
      },

      selectBank: (bank) => set({ selectedBank: bank }),

      verifyAccount: async (bankCode, accountNumber) => {
        try {
          set({ isAccountVerificationLoading: true, error: null });
          const response = await ambassadorApi.verifyAccount(
            bankCode,
            accountNumber
          );

          set({
            accountName: response.data.account_name,
            isAccountVerificationLoading: false,
          });
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage = axiosError.response?.data?.message;
          set({ isAccountVerificationLoading: false, error: errorMessage });
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
          const response = await ambassadorApi.inviteUser(
            phoneNumber,
            email,
            firstName,
            lastName,
            accountNumber,
            accountName,
            bankCode
          );

          set({ isLoading: false, error: null });
          toast.success("User added successfully!");
          return response;
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>;
          if (axiosError.response?.data) {
            const responseData = axiosError.response.data;
            const message =
              typeof responseData === "object" &&
              responseData.message !== null &&
              "message" in responseData
                ? responseData.message
                : "An unexpected error occured";

            set({ isLoading: false, error: message });
            toast.error(message);
            throw error;
          } else {
            set({ isLoading: false, error: "Network error occurred" });
            toast.error("Network error occurred");

            throw error;
          }
        } finally {
          set({ isLoading: false });
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
