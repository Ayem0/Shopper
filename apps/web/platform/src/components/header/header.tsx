"use client"; 

import Link from "next/link";
import AuthStatusDisplay from "./auth-status-display";
import { ThemeMenu } from "./theme-menu";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Shopify Clone
      </Link>

      <nav className="flex flex-row gap-2 items-center">
        <ThemeMenu/>
        <AuthStatusDisplay/>
      </nav>
    </header>
  );
}