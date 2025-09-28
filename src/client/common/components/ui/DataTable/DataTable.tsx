"use client";

import React, { useEffect, useId, useRef, useState } from "react";
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
}

function useDataTableState() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return {
    searchQuery,
    setSearchQuery,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
  };
}

function useDataTableEffects(
  isMobile: boolean,
  pageSize: number,
  setCurrentPage: (page: number) => void,
  setTotalPages: (pages: number) => void
) {
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<DataTableInstance | null>(null);
  const tableId = useId();

  useEffect(() => {
    const currentTableRef = tableRef.current;

    if (!isMobile && currentTableRef && !dataTableRef.current) {
      initializeDataTable(currentTableRef, pageSize, dataTableRef);
    }

    return () => {
      cleanupDataTable(dataTableRef, currentTableRef);
    };
  }, [isMobile, pageSize, setCurrentPage, setTotalPages]);

  return { tableRef, dataTableRef, tableId };
}

function initializeDataTable(
  currentTableRef: HTMLTableElement,
  pageSize: number,
  dataTableRef: React.MutableRefObject<DataTableInstance | null>
) {
  import("jquery").then((jQuery) => {
    import("datatables.net-dt").then(() => {
      const $ = jQuery.default;

      if (currentTableRef && !$.fn.DataTable.isDataTable(currentTableRef)) {
        try {
          dataTableRef.current = (
            $(currentTableRef) as JQueryDataTable
          ).DataTable({
            responsive: true,
            pageLength: pageSize,
            lengthMenu: [5, 10, 25, 50, 100],
            language: {
              search: "",
              searchPlaceholder: "Search...",
              lengthMenu: "Show _MENU_ entries",
              info: "Showing _START_ to _END_ of _TOTAL_ entries",
              paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous",
              },
            },
            dom: "rt",
            columnDefs: [
              {
                targets: -1,
                orderable: false,
                searchable: false,
              },
            ],
          });
        } catch (error) {
          console.warn("Error initializing DataTable:", error);
        }
      }
    });
  });
}

function cleanupDataTable(
  dataTableRef: React.MutableRefObject<DataTableInstance | null>,
  currentTableRef: HTMLTableElement | null
) {
  if (dataTableRef.current && currentTableRef) {
    try {
      // Destroy the DataTable instance
      dataTableRef.current.destroy();
    } catch (error) {
      console.warn("Error destroying DataTable:", error);
    } finally {
      dataTableRef.current = null;
    }
  }
}

function useDataTableHandlers(
  setSearchQuery: (query: string) => void,
  setPageSize: (size: number) => void,
  setCurrentPage: (page: number) => void,
  setTotalPages: (pages: number) => void,
  dataLength: number,
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
    setCurrentPage(1); // Reset to first page when filtering
    if (onFilter) {
      onFilter(newFilters);
    }
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
  filters: _filters = [], // eslint-disable-line @typescript-eslint/no-unused-vars
}: DataTableProps<T>) {
  const { isMobile } = useBreakpoint();
  const state = useDataTableState();
  const { tableRef, tableId } = useDataTableEffects(
    isMobile,
    state.pageSize,
    state.setCurrentPage,
    state.setTotalPages
  );

  const handlers = useDataTableHandlers(
    state.setSearchQuery,
    state.setPageSize,
    state.setCurrentPage,
    state.setTotalPages,
    data.length,
    onSearch,
    onFilter,
    onRefresh
  );

  const { startIndex, endIndex } = calculatePaginationInfo(
    state.currentPage,
    state.pageSize,
    data.length
  );

  // Calculate paginated data
  const paginatedData = data.slice(startIndex - 1, endIndex);

  // Update total pages when data or page size changes
  React.useEffect(() => {
    const newTotalPages = Math.ceil(data.length / state.pageSize);
    console.log(
      `Updating total pages: data.length=${data.length}, pageSize=${state.pageSize}, totalPages=${newTotalPages}`
    );
    state.setTotalPages(newTotalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length, state.pageSize, state.setTotalPages]);

  // Show mobile card view
  if (isMobile) {
    return (
      <div className={`space-y-6 ${className}`}>
        {(searchable || filterable || refreshable) && (
          <DataTableFilters
            searchable={searchable}
            filterable={filterable}
            refreshable={refreshable}
            onSearch={handlers.handleSearch}
            onFilter={handlers.handleFilters}
            onRefresh={handlers.handleRefresh}
            title={title}
          />
        )}

        <DataTableCardView
          data={data}
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
      <DataTableControls
        searchable={searchable}
        refreshable={refreshable}
        searchQuery={state.searchQuery}
        pageSize={state.pageSize}
        onSearch={handlers.handleSearch}
        onRefresh={handlers.handleRefresh}
        onPageSizeChange={handlers.handlePageSizeChange}
      />

      {/* Table Card */}
      <div className="bg-bg-primary border border-border-primary rounded-lg shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table
                key={`datatable-${tableId}`}
                ref={tableRef}
                className="min-w-full divide-y divide-border-primary"
                id={tableId}
              >
                <DataTableHeader columns={columns} actions={actions} />
                <tbody className="bg-bg-primary divide-y divide-border-primary">
                  {data.length === 0 ? (
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

        <DataTablePagination
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={data.length}
          onPageChange={handlers.handlePageChange}
        />
      </div>
    </div>
  );
}
