"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-black text-white pt-5 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <Image src="/logo.svg" alt="logo" width={130} height={32} />
            </Link>
          </div>
        </div>

        {user && (
          <div>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
