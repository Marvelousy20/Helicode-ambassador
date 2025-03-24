"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { useAmbassadorStore } from "@/lib/store/ambassador-store";
import { Button } from "../ui/button";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Ambassador } from "@/lib/api/ambassador-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmbassadorPaymentInfoTab } from "./ambassador-payment-info-tab";
import { AmbassadorProfileTab } from "./ambassador-profile-tab";
import { AmbassadorReferralsTab } from "./ambassador-referrals-tab";
import { DialogDescription } from "@radix-ui/react-dialog";
import { AddModalForm } from "./add-ambassador-modal-form";
// import La

export function UserManagementDashboard() {
  const {
    ambassadors,
    getAmbassadors,
    isAmbassadorLoading,
    currentPage,
    setCurrentPage,
    selectAmbassador,
    selectedAmbassador,
  } = useAmbassadorStore();

  const [filteredAmbassadors, setFilteredAmbassadors] = useState(ambassadors);
  const [searchTerm, setSearchTerm] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [selectedUser, setSelectedUser] = useState<Ambassador | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        await getAmbassadors();
      } catch (error) {
        console.error("Error fetching ambassadors:", error);
      }
    };

    fetchAmbassadors();
  }, [getAmbassadors]);

  useEffect(() => {
    if (ambassadors) {
      if (searchTerm) {
        const filtered = ambassadors.filter(
          (user) =>
            (user.firstName || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (user.lastName || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (user.email || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (user.referralCode || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
        setFilteredAmbassadors(filtered);
        setCurrentPage(1);
      } else {
        setFilteredAmbassadors(ambassadors);
      }
    }
  }, [ambassadors, searchTerm, setCurrentPage]);

  const handleEditClick = (user: Ambassador) => {
    selectAmbassador(user);
    setIsModalOpen(true);
  };

  const handleAddNewUser = () => {
    setIsAddModalOpen(true);
  };

  // Calculate pagination
  const totalPages = Math.ceil(
    (filteredAmbassadors?.length || 0) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAmbassadors =
    filteredAmbassadors?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div className="">
      {/* Header with filter and search bar */}
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

          <Button
            onClick={handleAddNewUser}
            className="bg-[#8D58FF] hover:bg-purple-700 text-white h-9 w-[129px]"
          >
            Add New User
          </Button>
        </div>
      </div>

      {/* User table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-[#080821] border-b border-gray-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Referral code
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Phone number
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Account Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Bank Account
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Total Referral
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {isAmbassadorLoading ? (
              <tr className="flex justify-center items-center">
                <td className="text-center py-6">
                  <Loader2 className="animate-spin w-6 h-6" />
                </td>
              </tr>
            ) : paginatedAmbassadors.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedAmbassadors.map((user) => (
                <tr key={user.id} className="bg-[#000013] hover:bg-gray-900">
                  <td className="px-4 py-6 text-sm">
                    {`${user.firstName || ""} ${user.lastName || ""}`}
                  </td>
                  <td className="px-4 py-6 text-sm">{user.email || ""}</td>
                  <td className="px-4 py-6 text-sm">
                    {user.referralCode || ""}
                  </td>
                  <td className="px-4 py-6 text-sm">
                    {user.phoneNumber || ""}
                  </td>
                  <td className="px-4 py-6 text-sm">
                    {user.accountNumber || "0234343532"}
                  </td>
                  <td className="px-4 py-6 text-sm">
                    {user.bankName || "GTBank"}
                  </td>
                  <td className="px-4 py-6 text-sm">
                    {user.totalUsersReferred || 0}
                  </td>
                  <td className="px-4 py-6 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-gray-800"
                    >
                      Edit
                    </Button>
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

      {/* Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#080821] text-white border lg:max-w-4xl border-none text-sm rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="sr-only">Edit User</DialogTitle>
          </DialogHeader>

          <DialogDescription className="sr-only">
            Edit user details and preferences here.
          </DialogDescription>

          <Tabs defaultValue="profile" className="w-full text-sm">
            <TabsList className="grid grid-cols-3 font-medium bg-[#080821] border border-[#454545] p-0 md:w-md">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-[#161632] data-[state=active]:text-white rounded-r-none border-r-[#454545]"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="referrals"
                className="rounded-none border-r-[#454545] data-[state=active]:bg-[#161632] data-[state=active]:text-white"
              >
                Referrals
              </TabsTrigger>
              <TabsTrigger
                value="payment-info"
                className="rounded-l-none border-none data-[state=active]:bg-[#161632] data-[state=active]:text-white"
              >
                Payment Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {selectedAmbassador && (
                <AmbassadorProfileTab
                  ambassador={selectedAmbassador}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
            </TabsContent>
            <TabsContent value="referrals">
              {selectedAmbassador && (
                <AmbassadorReferralsTab ambassador={selectedAmbassador} />
              )}
            </TabsContent>
            <TabsContent value="payment-info">
              {selectedAmbassador && (
                <AmbassadorPaymentInfoTab
                  ambassador={selectedAmbassador}
                  setIsOpenModal={setIsModalOpen}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AddModalForm
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
      />
    </div>
  );
}
