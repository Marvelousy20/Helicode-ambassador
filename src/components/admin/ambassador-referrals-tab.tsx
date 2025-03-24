"use client";

import { useEffect } from "react";
import { Ambassador } from "@/lib/api/ambassador-api";
import { useAmbassadorStore } from "@/lib/store/ambassador-store";
import { Loader2 } from "lucide-react";

export function AmbassadorReferralsTab({
  ambassador,
}: {
  ambassador: Ambassador;
}) {
  const { referrals, getAmbassadorReferrals, isLoading } = useAmbassadorStore();

  useEffect(() => {
    if (ambassador) {
      getAmbassadorReferrals(ambassador.id);
    }
  }, [ambassador, getAmbassadorReferrals]);

  return (
    <div className="mt-10 lg:mt-20 relative">
      {isLoading ? (
        <Loader2 className="animate-spin w-6 h-6 flex justify-center" />
      ) : referrals?.length === 0 ? (
        <p>No referrals found.</p>
      ) : (
        <div className="rounded-[8px] border border-[#232323]">
          <div className="overflow-x-auto w-full">
            <table className="w-full rounded-[8px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-6 text-left text-sm font-medium text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-6 text-left text-sm font-medium text-gray-300">
                    Course
                  </th>
                  <th className="px-4 py-6 text-left text-sm font-medium text-gray-300">
                    Amount Earned
                  </th>
                  <th className="px-4 py-6 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-6 text-left text-sm font-medium text-gray-300">
                    Recipient
                  </th>
                  <th className="px-4 py-6 text-left text-sm font-medium text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {referrals?.map((ref) => (
                  <tr key={ref.id} className="bg-[#000013] hover:bg-gray-900">
                    <td className="px-4 py-6 text-sm">{ref.name}</td>
                    <td className="px-4 py-6 text-sm">{ref.course}</td>
                    <td className="px-4 py-6 text-sm">₦{ref.amount}</td>
                    <td className={`px-4 py-6 text-xs`}>
                      <span
                        className={`${
                          ref.status === "successfull"
                            ? "text-[#027A48] bg-[#ECFDF3] rounded-[16px] p-2"
                            : ref.status === "failed"
                            ? "text-[#D45750] bg-[#FFF0EF] rounded-[16px] p-2"
                            : "text-yellow-500 bg-yellow-50 rounded-[16px] p-2"
                        }`}
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-sm">{ref.recipient}</td>
                    <td className="px-4 py-6 text-sm">
                      {new Date(ref.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
