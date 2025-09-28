"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import DataTableCardView from "./DataTableCardView";
import DataTableFilters from "./DataTableFilters";
import { PrelineInput } from "../PrelineInput";
import { PrelineButton } from "../PrelineButton";
import { PrelineIconButton } from "../PrelineIconButton";
import { PrelineDropdown } from "../PrelineDropdown";
import { PrelineCard } from "../PrelineCard";
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

export default function DataTable<T extends Record<string, unknown>>({
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
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<DataTableInstance | null>(null);
  const { isMobile } = useBreakpoint();
  const tableId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize DataTable when component mounts
  useEffect(() => {
    const currentTableRef = tableRef.current;

    if (!isMobile && currentTableRef && !dataTableRef.current) {
      // Import jQuery and DataTables dynamically
      import("jquery").then((jQuery) => {
        import("datatables.net-dt").then(() => {
          const $ = jQuery.default;

          // Check if DataTable is already initialized
          if (currentTableRef && !$.fn.DataTable.isDataTable(currentTableRef)) {
            // Initialize with Preline UI DataTable structure
            dataTableRef.current = (
              $(currentTableRef) as JQueryDataTable
            ).DataTable({
              responsive: true,
              pageLength: pageSize,
              lengthMenu: [10, 25, 50, 100],
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
              // Hide all default DataTables controls
              dom: "rt",
              columnDefs: [
                {
                  targets: -1, // Last column (actions)
                  orderable: false,
                  searchable: false,
                },
              ],
            });

            // Update pagination info when DataTable draws
            dataTableRef.current.on("draw", () => {
              const info = dataTableRef.current?.page.info();
              if (info) {
                setCurrentPage(info.page + 1);
                setTotalPages(info.pages);
              }
            });
          }
        });
      });
    }

    return () => {
      if (dataTableRef.current && currentTableRef) {
        try {
          dataTableRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying DataTable:", error);
        }
        dataTableRef.current = null;
      }
    };
  }, [isMobile, pageSize]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    } else if (dataTableRef.current) {
      dataTableRef.current.search(query).draw();
    }
  };

  // Handle filters
  const handleFilters = (newFilters: Record<string, string>) => {
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else if (dataTableRef.current) {
      dataTableRef.current.ajax.reload();
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    if (dataTableRef.current) {
      dataTableRef.current.page.len(newSize).draw();
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (dataTableRef.current) {
      // DataTables page method is both an object and a function
      const dataTable = dataTableRef.current as DataTableInstance & {
        page: ((page: number) => DataTableInstance) & {
          len(length: number): DataTableInstance;
          info(): {
            page: number;
            pages: number;
            start: number;
            end: number;
            length: number;
          };
        };
      };
      dataTable.page(page - 1).draw();
    }
  };

  // Calculate pagination info
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, data.length);

  // Show mobile card view
  if (isMobile) {
    return (
      <div className={`space-y-6 ${className}`}>
        {(searchable || filterable || refreshable) && (
          <DataTableFilters
            searchable={searchable}
            filterable={filterable}
            refreshable={refreshable}
            onSearch={handleSearch}
            onFilter={handleFilters}
            onRefresh={handleRefresh}
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
      {/* Custom Preline UI Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        {searchable && (
          <div className="grow">
            <PrelineInput
              placeholder="Search for items"
              value={searchQuery}
              onChange={handleSearch}
              className="max-w-xs"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex-1 flex items-center justify-end space-x-2">
          {/* Page Size Selector */}
          <PrelineDropdown
            value={pageSize.toString()}
            onChange={(value) => handlePageSizeChange(Number(value))}
            options={[
              { value: "10", label: "10" },
              { value: "25", label: "25" },
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ]}
            className="min-w-20"
          />

          {/* Refresh Button */}
          {refreshable && (
            <PrelineButton
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              icon={
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              }
            >
              Refresh
            </PrelineButton>
          )}
        </div>
      </div>

      {/* Table Card */}
      <PrelineCard variant="elevated" className="overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto min-h-130">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table ref={tableRef} className="min-w-full" id={tableId}>
                <thead className="border-y border-border-primary">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="py-1 group text-start font-normal focus:outline-hidden"
                      >
                        <div className="py-1 px-2.5 inline-flex items-center border border-transparent text-sm text-text-secondary rounded-md hover:border-border-primary">
                          {column.header}
                          <svg
                            className="size-3.5 ms-1 -me-0.5 text-text-secondary"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                          </svg>
                        </div>
                      </th>
                    ))}
                    {actions.length > 0 && (
                      <th
                        scope="col"
                        className="py-2 px-3 text-end font-normal text-sm text-text-secondary"
                      >
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                        className="p-5 h-full flex flex-col justify-center items-center text-center"
                      >
                        <div className="max-w-sm mx-auto">
                          <p className="mt-2 text-sm text-text-secondary">
                            {emptyMessage}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                          <td
                            key={colIndex}
                            className="p-3 whitespace-nowrap text-sm font-medium text-text-primary"
                          >
                            {column.render
                              ? column.render(row)
                              : String(row[column.key as keyof T] || "")}
                          </td>
                        ))}
                        {actions.length > 0 && (
                          <td className="p-3 whitespace-nowrap text-end text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {actions.map((action, actionIndex) => (
                                <PrelineIconButton
                                  key={actionIndex}
                                  icon={action.icon}
                                  onClick={() => action.onClick(row)}
                                  variant={action.variant || "primary"}
                                  title={action.label}
                                />
                              ))}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination and Info */}
        <div className="flex flex-wrap justify-between items-center gap-2 px-6 py-4 border-t border-border-primary bg-bg-tertiary">
          {/* Pagination */}
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-text-primary hover:bg-bg-hover focus:outline-hidden focus:bg-bg-hover disabled:opacity-50 disabled:pointer-events-none"
            >
              <span aria-hidden="true">«</span>
              <span className="sr-only">Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`p-2.5 min-w-10 flex justify-center items-center text-sm rounded-full transition-colors ${
                      pageNum === currentPage
                        ? "bg-brand-primary text-white"
                        : "text-text-primary hover:bg-bg-hover focus:outline-hidden focus:bg-bg-hover"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-text-primary hover:bg-bg-hover focus:outline-hidden focus:bg-bg-hover disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="sr-only">Next</span>
              <span aria-hidden="true">»</span>
            </button>
          </div>

          {/* Info */}
          <div className="whitespace-nowrap text-sm text-text-secondary">
            Showing {startIndex} to {endIndex} of {data.length} entries
          </div>
        </div>
      </PrelineCard>
    </div>
  );
}
