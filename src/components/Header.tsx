"use client";

import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <span className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📄</span>
                </div>
                <span>Mini-Invoice MVP</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/invoices"
              className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Invoices
            </Link>

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
