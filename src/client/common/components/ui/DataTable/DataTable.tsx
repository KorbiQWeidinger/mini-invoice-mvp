"use client";

import React, { useState } from "react";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { DataTableCardView } from "./DataTableCardView";
import { DataTableFilters } from "./DataTableFilters";
import { DataTableControls } from "./DataTableControls";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableRow } from "./DataTableRow";
import { DataTablePagination } from "./DataTablePagination";
import type { DataTableColumn, DataTableAction } from "./types";

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  searchable?: boolean;
  filterable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  className?: string;
  title?: string;
  emptyMessage?: string;
  filters?: Array<{
    key: string;
    label: string;
    type: "select" | "date" | "text" | "number";
    options?: { value: string; label: string }[];
    placeholder?: string;
  }>;
  paginated?: boolean;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

function useDataTableState(itemsPerPage: number = 5) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  return {
    searchQuery,
    setSearchQuery,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    filters,
    setFilters,
    sortState,
    setSortState,
  };
}

function useDataTableHandlers(
  setSearchQuery: (query: string) => void,
  setPageSize: (size: number) => void,
  setCurrentPage: (page: number) => void,
  setFilters: (filters: Record<string, string>) => void,
  setSortState: React.Dispatch<React.SetStateAction<SortState>>,
  onSearch?: (query: string) => void,
  onFilter?: (filters: Record<string, string>) => void,
  onRefresh?: () => void
) {
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleSort = (columnKey: string) => {
    setSortState((prevState: SortState) => {
      if (prevState.column === columnKey) {
        // Cycle through: asc -> desc -> null
        const newDirection: SortDirection =
          prevState.direction === "asc"
            ? "desc"
            : prevState.direction === "desc"
            ? null
            : "asc";
        return {
          column: newDirection ? columnKey : null,
          direction: newDirection,
        };
      } else {
        // New column, start with asc
        return {
          column: columnKey,
          direction: "asc" as SortDirection,
        };
      }
    });
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleRefresh = () => {
    setCurrentPage(1); // Reset to first page when refreshing
    if (onRefresh) {
      onRefresh();
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
    // Total pages will be updated by useEffect
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    handleSearch,
    handleFilters,
    handleSort,
    handleRefresh,
    handlePageSizeChange,
    handlePageChange,
  };
}

function calculatePaginationInfo(
  currentPage: number,
  pageSize: number,
  dataLength: number
) {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, dataLength);
  return { startIndex, endIndex };
}

function filterData<T>(
  data: T[],
  searchQuery: string,
  filters: Record<string, string>,
  columns: DataTableColumn<T>[]
): T[] {
  let filteredData = [...data];

  // Apply search filter
  if (searchQuery.trim()) {
    const searchLower = searchQuery.toLowerCase();
    filteredData = filteredData.filter((row) => {
      return columns.some((column) => {
        if (column.searchable === false) return false;

        const value = row[column.key as keyof T];
        if (value == null) return false;

        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }

  // Apply column filters
  Object.entries(filters).forEach(([filterKey, filterValue]) => {
    if (filterValue && filterValue.trim()) {
      filteredData = filteredData.filter((row) => {
        const value = row[filterKey as keyof T];
        if (value == null) return false;

        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      });
    }
  });

  return filteredData;
}

function sortData<T>(
  data: T[],
  sortState: SortState,
  columns: DataTableColumn<T>[]
): T[] {
  if (!sortState.column || !sortState.direction) {
    return data;
  }

  const column = columns.find(
    (col) => col.key === sortState.column || col.sortKey === sortState.column
  );

  if (!column || column.sortable === false) {
    return data;
  }

  const sortKey = (column.sortKey || column.key) as keyof T;

  return [...data].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortState.direction === "asc" ? 1 : -1;
    if (bValue == null) return sortState.direction === "asc" ? -1 : 1;

    // Handle different data types
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortState.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortState.direction === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Default string comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (aStr < bStr) return sortState.direction === "asc" ? -1 : 1;
    if (aStr > bStr) return sortState.direction === "asc" ? 1 : -1;
    return 0;
  });
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions = [],
  searchable = true,
  filterable = true,
  refreshable = true,
  onRefresh,
  onSearch,
  onFilter,
  className = "",
  title,
  emptyMessage = "No data available",
  filters: filterDefinitions = [],
  paginated = true,
}: DataTableProps<T>) {
  const { isMobile } = useBreakpoint();
  const state = useDataTableState(paginated ? 5 : data.length);

  const handlers = useDataTableHandlers(
    state.setSearchQuery,
    state.setPageSize,
    state.setCurrentPage,
    state.setFilters,
    state.setSortState,
    onSearch,
    onFilter,
    onRefresh
  );

  // Process data: filter -> sort -> paginate
  const filteredData = filterData(
    data,
    state.searchQuery,
    state.filters,
    columns
  );
  const sortedData = sortData(filteredData, state.sortState, columns);

  const { startIndex, endIndex } = calculatePaginationInfo(
    state.currentPage,
    state.pageSize,
    sortedData.length
  );

  // Calculate paginated data
  const paginatedData = sortedData.slice(startIndex - 1, endIndex);

  // Update total pages when filtered data or page size changes
  React.useEffect(() => {
    const newTotalPages = Math.ceil(sortedData.length / state.pageSize);
    state.setTotalPages(newTotalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedData.length, state.pageSize, state.setTotalPages]);

  // Show mobile card view
  if (isMobile) {
    return (
      <div className={`space-y-6 ${className}`}>
        {(searchable || filterable || refreshable) && (
          <DataTableFilters
            searchable={searchable}
            filterable={filterable}
            refreshable={refreshable}
            filters={filterDefinitions}
            onSearch={handlers.handleSearch}
            onFilter={handlers.handleFilters}
            onRefresh={handlers.handleRefresh}
            title={title}
          />
        )}

        <DataTableCardView
          data={sortedData}
          columns={columns}
          actions={actions}
          emptyMessage={emptyMessage}
        />
      </div>
    );
  }

  // Desktop table view
  return (
    <div className={`space-y-6 ${className}`}>
      {(searchable || refreshable) && (
        <DataTableControls
          searchable={searchable}
          refreshable={refreshable}
          searchQuery={state.searchQuery}
          pageSize={state.pageSize}
          onSearch={handlers.handleSearch}
          onRefresh={handlers.handleRefresh}
          onPageSizeChange={handlers.handlePageSizeChange}
        />
      )}

      {/* Table Card */}
      <div className="bg-bg-primary border border-border-primary rounded-lg shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-border-primary">
                <DataTableHeader
                  columns={columns}
                  actions={actions}
                  sortState={state.sortState}
                  onSort={handlers.handleSort}
                />
                <tbody className="bg-bg-primary divide-y divide-border-primary">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                        className="px-6 py-12 text-center"
                      >
                        <div className="max-w-sm mx-auto">
                          <p className="text-sm text-text-secondary">
                            {emptyMessage}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row, rowIndex) => (
                      <DataTableRow
                        key={rowIndex}
                        row={row}
                        columns={columns}
                        actions={actions}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {paginated && (
          <DataTablePagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={sortedData.length}
            onPageChange={handlers.handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
