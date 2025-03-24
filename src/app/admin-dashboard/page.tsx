"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { UserManagementDashboard } from "@/components/admin/ambassador-user-management";

export default function AdminDashboard() {
  const { user } = useAuthStore();
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

      <div className="mt-28">
        <UserManagementDashboard />
      </div>
    </div>
  );
}
