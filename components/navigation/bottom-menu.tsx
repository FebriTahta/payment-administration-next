"use client";

import { Wallet, WalletMinimal, ListStart, Home, Tickets } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomMenu() {
  const pathName = usePathname();

  // Daftar halaman yang diperbolehkan untuk menampilkan BottomMenu
  const allowedPaths = [
    "/home-page",
    "/payment-component-list",
    "/payment-list",
    "/insufficient-payment",
    "/new-payment",
    "/payment-option",
    "/active-payment",
    "/payment-detail",
    "/search-transaction",
  ];

  // Jangan render BottomMenu jika halaman saat ini tidak ada di daftar allowedPaths atau jika path adalah /status-payment
  if (!allowedPaths.includes(pathName) && !pathName.startsWith("/status-payment")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-full max-w-[250px] shadow-md rounded-xl">
      <nav className="flex flex-row items-center gap-2 rounded-xl border bg-background/80 px-3 py-3 shadow-lg backdrop-blur-lg">
        <div
          className={`col-span-2 flex h-8 w-full items-center justify-center rounded-md transition-transform duration-200 
            ${pathName === "/home-page" ? "bg-gradient-to-br from-black to-purple-500 text-white scale-110" : "bg-gray-200 dark:bg-gray-800 hover:scale-125"}`}
        >
          <Link href={"/home-page"}>
            <Home className="h-5 w-5" />
          </Link>
        </div>

        <div
          className={`col-span-2 flex h-8 w-full items-center justify-center rounded-md transition-transform duration-200 
            ${pathName === "/payment-list" ? "bg-gradient-to-br from-black to-purple-500 text-white scale-110" : "bg-gray-200 dark:bg-gray-800 hover:scale-125"}`}
        >
          <Link href={"/payment-list"} className="p-2">
            <ListStart className="h-5 w-5" />
          </Link>
        </div>

        <div
          className={`col-span-2 flex h-8 w-full items-center justify-center rounded-md transition-transform duration-200 
            ${pathName === "/active-payment" ? "bg-gradient-to-br from-black to-purple-500 text-white scale-110" : "bg-gray-200 dark:bg-gray-800 hover:scale-125"}`}
        >
          <Link href={"/active-payment"} className="p-2">
            <Tickets className="h-5 w-5" />
          </Link>
        </div>

        <div
          className={`col-span-2 flex h-8 w-full items-center justify-center rounded-md transition-transform duration-200 
            ${pathName === "/insufficient-payment" ? "bg-gradient-to-br from-black to-purple-500 text-white scale-110" : "bg-gray-200 dark:bg-gray-800 hover:scale-125"}`}
        >
          <Link href={"/insufficient-payment"} className="p-2">
            <WalletMinimal className="h-5 w-5" />
          </Link>
        </div>

        <div
          className={`col-span-2 flex h-8 w-full items-center justify-center rounded-md transition-transform duration-200 
            ${pathName === "/new-payment" ? "bg-gradient-to-br from-black to-purple-500 text-white scale-110" : "bg-gray-200 dark:bg-gray-800 hover:scale-125"}`}
        >
          <Link href={"/new-payment"} className="p-2">
            <Wallet className="h-5 w-5" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
