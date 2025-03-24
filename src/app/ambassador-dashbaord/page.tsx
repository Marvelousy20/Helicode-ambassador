"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAmbassadorReferralStore } from "@/lib/store/ambassador-referral-store";
import { ReferralsTable } from "@/components/ambassador/referrals-table";

export default function AmbassadorDashboard() {
  const { user } = useAuthStore();
  const { getMetrics, metrics } = useAmbassadorReferralStore();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        await getMetrics();
      } catch (error) {
        console.error(error);
      }
    };

    fetchMetrics();
  }, [getMetrics]);

  console.log(metrics);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-2xl lg:text-3xl">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-[#CAC8D4]">
          Track, manage and forecast your customers and orders.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-12">
        <div className="bg-[#080821] p-3 lg:p-6 rounded-[8px] space-y-6">
          <h4 className="font-medium text-sm sm:text-base">Total Amount</h4>

          <h1 className="font-semibold text-3xl">
            &#8358;{metrics?.totalAmount}
          </h1>
        </div>

        <div className="bg-[#080821] p-3 lg:p-6 rounded-[8px] space-y-6">
          <h4 className="font-medium text-sm sm:text-base">
            Total User Referred
          </h4>

          <h1 className="font-semibold text-3xl">
            {metrics?.totalUsersReferred}
          </h1>
        </div>
      </div>

      <div className="mt-12">
        <ReferralsTable />
      </div>
    </div>
  );
}
