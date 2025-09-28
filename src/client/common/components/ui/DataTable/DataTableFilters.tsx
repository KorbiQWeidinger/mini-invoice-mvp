"use client";

import { useState } from "react";
import { Search, ChevronDown, RefreshCw } from "lucide-react";
import type { DataTableFiltersProps } from "./types";

export default function DataTableFilters({
  searchable = true,
  filterable = true,
  refreshable = true,
  filters = [],
  onSearch,
  onFilter,
  onRefresh,
  title,
  className = "",
}: DataTableFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilters({});
    onSearch?.("");
    onFilter?.({});
  };

  const hasActiveFilters =
    searchTerm ||
    Object.values(activeFilters).some(
      (value) => value !== "" && value !== null
    );

  return (
    <div
      className={`bg-bg-primary shadow-lg rounded-xl border border-border-primary p-6 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {refreshable && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors duration-200"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Input */}
        {searchable && (
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="flex-shrink-0 w-4 h-4 text-text-muted" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="py-2 px-4 ps-10 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary placeholder-text-muted"
              />
            </div>
          </div>
        )}

        {/* Dynamic Filters */}
        {filterable &&
          filters.map((filter) => (
            <div key={filter.key}>
              <label
                htmlFor={filter.key}
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                {filter.label}
              </label>

              {filter.type === "select" ? (
                <div className="hs-dropdown relative inline-flex w-full">
                  <button
                    id={`hs-dropdown-${filter.key}`}
                    type="button"
                    className="hs-dropdown-toggle py-2 px-4 pe-9 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-border-primary bg-bg-primary text-text-primary shadow-sm hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none w-full justify-between"
                  >
                    {activeFilters[filter.key]
                      ? filter.options?.find(
                          (opt) => opt.value === activeFilters[filter.key]
                        )?.label || activeFilters[filter.key]
                      : `All ${filter.label}`}
                    <ChevronDown className="hs-dropdown-open:rotate-180 w-4 h-4" />
                  </button>

                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-bg-primary shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={`hs-dropdown-${filter.key}`}
                  >
                    <button
                      onClick={() => handleFilterChange(filter.key, "")}
                      className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      All {filter.label}
                    </button>
                    {filter.options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleFilterChange(filter.key, option.value)
                        }
                        className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <input
                  type={filter.type}
                  id={filter.key}
                  placeholder={
                    filter.placeholder ||
                    `Filter by ${filter.label.toLowerCase()}...`
                  }
                  value={activeFilters[filter.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                  className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary placeholder-text-muted"
                />
              )}
            </div>
          ))}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="py-2 px-4 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg border border-border-primary transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
