import apiClient from "./client";

export interface Ambassador {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
  totalUsersReferred: number;
  totalAmount: number;
  role: string;
  bankName?: string;
  accountNumber?: string;
  bankCode?: string;
  accountName?: string;
}

export interface Referral {
  id: string;
  amount: number;
  status: string;
  recipient: string;
  date: string;
  course?: string;
  name?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface AmbassadorData {
  userData: Ambassador[];
}

export interface Bank {
  code: string;
  name: string;
}

export interface VerifyAccoountData {
  account_number: string;
  account_name: string;
  bank_id: number;
}

export const ambassadorApi = {
  getAmbassadors: async (): Promise<ApiResponse<AmbassadorData>> => {
    return await apiClient.get("/admin/ambassadors");
  },

  getAmbassadorReferrals: async (
    id: string
  ): Promise<ApiResponse<Referral[]>> => {
    return await apiClient.get(`/admin/ambassador/${id}/referrals`);
  },

  getBanks: async (): Promise<ApiResponse<{ list: Bank[] }>> => {
    return await apiClient.get(`/admin/list-banks`);
  },

  verifyAccount: async (
    bank_code: string,
    account_number: string
  ): Promise<ApiResponse<VerifyAccoountData>> => {
    return await apiClient.post(`/admin/verify-account`, {
      bank_code,
      account_number,
    });
  },

  updateAmbassador: async (id: string, data: Partial<Ambassador>) => {
    return await apiClient.patch(`/admin/ambassador/${id}`, data);
  },

  inviteUser: async (
    phoneNumber: string,
    email: string,
    firstName: string,
    lastName: string,
    accountNumber: string,
    accountName: string,
    bankCode: string
  ): Promise<ApiResponse<unknown>> => {
    return await apiClient.post(`/admin/invite-user`, {
      phoneNumber,
      email,
      firstName,
      lastName,
      accountNumber,
      accountName,
      bankCode,
    });
  },
};
