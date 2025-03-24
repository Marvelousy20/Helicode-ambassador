import apiClient from "./client";
import type { ApiResponse } from "./auth-api";

export interface Referral {
  id: string;
  course: string;
  amount: number;
  status: string;
  recipient: string;
  date: string;
}

export const ambassadorReferralApi = {
  getReferralMetrics: async (): Promise<
    ApiResponse<{ totalAmount: number; totalUsersReferred: number }>
  > => {
    return await apiClient.get("/user/metrics");
  },

  getReferrals: async (): Promise<ApiResponse<Referral[]>> => {
    return await apiClient.get("/user/referrals");
  },
};
