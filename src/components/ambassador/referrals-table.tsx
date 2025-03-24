"use client";

import { useEffect, useState } from "react";
import { useAmbassadorReferralStore } from "@/lib/store/ambassador-referral-store";
import { Input } from "../ui/input";
import { Loader2, Search } from "lucide-react";
import { Button } from "../ui/button";

export function ReferralsTable() {
  const { referrals, getReferrals, isLoading, currentPage, setCurrentPage } =
    useAmbassadorReferralStore();

  const [filteredReferrals, setFilteredReferrals] = useState(referrals);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        await getReferrals();
      } catch (error) {
        console.error("Error fetching ambassadors:", error);
      }
    };

    fetchReferrals();
  }, [getReferrals]);

  useEffect(() => {
    if (referrals) {
      const filtered = referrals.filter((referral) => {
        return (
          referral.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          referral.recipient
            .toLocaleLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          referral.date.toLocaleLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      setFilteredReferrals(filtered);
      setCurrentPage(1);
    } else {
      setFilteredReferrals(referrals);
    }
  }, [referrals, searchTerm, setCurrentPage]);

  // Calculate pagination
  const totalPages = Math.ceil((filteredReferrals?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReferrals =
    filteredReferrals?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <Button className="border-gray-700 text-white bg-gray-900 hover:bg-gray-800 flex items-center gap-2">
          <span className="text-sm">Filter by course</span>
        </Button>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 h-11 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* User table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-[#080821] border-b border-gray-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Recipient
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Course
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Amount Earned
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Payment Status
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isLoading ? (
              <tr className="flex justify-center items-center">
                <td className="text-center py-6">
                  <Loader2 className="animate-spin w-6 h-6" />
                </td>
              </tr>
            ) : paginatedReferrals.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  No referrals found
                </td>
              </tr>
            ) : (
              paginatedReferrals.map((referral) => (
                <tr
                  key={referral.id}
                  className="bg-[#000013] hover:bg-gray-900"
                >
                  <td className="px-4 py-6 text-sm">
                    {referral.recipient || ""}
                  </td>
                  <td className="px-4 py-6 text-sm">{referral.course}</td>

                  <td className="px-4 py-6 text-sm">{referral.amount || ""}</td>

                  <td className={`px-4 py-6 text-xs`}>
                    <span
                      className={`${
                        referral.status === "successfull"
                          ? "text-[#027A48] bg-[#ECFDF3] rounded-[16px] p-2"
                          : referral.status === "failed"
                          ? "text-[#D45750] bg-[#FFF0EF] rounded-[16px] p-2"
                          : "text-yellow-500 bg-yellow-50 rounded-[16px] p-2"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </td>
                  <td className="px-4 py-6 text-sm">
                    {new Date(referral.date).toLocaleDateString() || ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
        <div className="text-gray-400">
          Page {currentPage} of {Math.max(1, totalPages)}
        </div>
      </div>
    </div>
  );
}
