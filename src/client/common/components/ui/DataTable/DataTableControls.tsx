"use client";

import { RefreshCw, Search } from "lucide-react";
import { PrelineInput } from "../PrelineInput";
import { PrelineButton } from "../PrelineButton";
import { PrelineDropdown } from "../PrelineDropdown";

interface DataTableControlsProps {
  searchable: boolean;
  refreshable: boolean;
  searchQuery: string;
  pageSize: number;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  onPageSizeChange: (size: number) => void;
}

export function DataTableControls({
  searchable,
  refreshable,
  searchQuery,
  pageSize,
  onSearch,
  onRefresh,
  onPageSizeChange,
}: DataTableControlsProps) {
  return (
    <div className="bg-bg-primary border border-border-primary rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        {searchable && (
          <div className="grow">
            <PrelineInput
              placeholder="Search for items"
              value={searchQuery}
              onChange={onSearch}
              className="max-w-xs"
              icon={<Search className="size-4" />}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <PrelineDropdown
              value={pageSize.toString()}
              onChange={(value) => onPageSizeChange(Number(value))}
              options={[
                { value: "5", label: "5" },
                { value: "10", label: "10" },
                { value: "25", label: "25" },
                { value: "50", label: "50" },
                { value: "100", label: "100" },
              ]}
              className="min-w-20"
            />
          </div>

          {/* Refresh Button */}
          {refreshable && (
            <PrelineButton
              variant="secondary"
              size="md"
              onClick={onRefresh}
              icon={<RefreshCw className="size-4" />}
            >
              Refresh
            </PrelineButton>
          )}
        </div>
      </div>
    </div>
  );
}
