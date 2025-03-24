"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import AdminDashboard from "../admin-dashboard/page";
import AmbassadorDashboard from "../ambassador-dashbaord/page";

export default function Dashboard() {
  const router = useRouter();

  const { role, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "user") {
    return <AmbassadorDashboard />;
  } else {
    return <div className="text-white text-2xl">Unauthorized</div>;
  }
}
