"use client";

import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { PrelineInput } from "../PrelineInput";
import { PrelineDropdown } from "../PrelineDropdown";
import type { DataTableFiltersProps } from "./types";

export function DataTableFilters({
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
      className={`bg-bg-primary border border-border-primary rounded-lg shadow-sm p-6 ${className}`}
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
          <PrelineInput
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            icon={<Search className="flex-shrink-0 w-4 h-4" />}
          />
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
                <PrelineDropdown
                  value={activeFilters[filter.key] || ""}
                  onChange={(value) => handleFilterChange(filter.key, value)}
                  options={filter.options || []}
                  placeholder={`All ${filter.label}`}
                />
              ) : (
                <PrelineInput
                  type={filter.type}
                  placeholder={
                    filter.placeholder ||
                    `Filter by ${filter.label.toLowerCase()}...`
                  }
                  value={activeFilters[filter.key] || ""}
                  onChange={(value) => handleFilterChange(filter.key, value)}
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
