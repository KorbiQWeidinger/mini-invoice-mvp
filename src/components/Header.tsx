"use client";

import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { FileText, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-bg-primary shadow-sm border-b border-border-primary transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-semibold text-text-primary hover:text-brand-primary transition-colors duration-200"
            >
              <span className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-primary-hover rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-text-on-primary" />
                </div>
                <span>Mini-Invoice MVP</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-text-secondary hover:text-brand-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className="text-text-secondary hover:text-brand-primary px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Invoices
              </Link>
            </div>

            {/* Mobile Navigation Dropdown */}
            <div className="md:hidden">
              <div className="hs-dropdown relative inline-flex">
                <button
                  id="hs-dropdown-basic"
                  type="button"
                  className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-border-primary bg-bg-primary text-text-primary shadow-sm hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none"
                >
                  Menu
                  <ChevronDown className="hs-dropdown-open:rotate-180 w-4 h-4" />
                </button>

                <div
                  className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-bg-primary shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="hs-dropdown-basic"
                >
                  <Link
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                  <Link
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    href="/invoices"
                  >
                    Invoices
                  </Link>
                </div>
              </div>
            </div>

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
