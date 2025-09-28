"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { DataTableColumn, DataTableAction } from "./types";

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

interface DataTableHeaderProps<T> {
  columns: DataTableColumn<T>[];
  actions: DataTableAction<T>[];
  sortState?: SortState;
  onSort?: (columnKey: string) => void;
}

export function DataTableHeader<T>({
  columns,
  actions,
  sortState,
  onSort,
}: DataTableHeaderProps<T>) {
  const getSortIcon = (column: DataTableColumn<T>) => {
    if (column.sortable === false) return null;

    const columnKey = String(column.sortKey || column.key);
    const isActive = sortState?.column === columnKey;

    if (!isActive) {
      return <ChevronsUpDown className="size-3.5 text-text-tertiary" />;
    }

    return sortState?.direction === "asc" ? (
      <ChevronUp className="size-3.5 text-text-primary" />
    ) : (
      <ChevronDown className="size-3.5 text-text-primary" />
    );
  };

  const handleColumnClick = (column: DataTableColumn<T>) => {
    if (column.sortable === false || !onSort) return;

    const columnKey = String(column.sortKey || column.key);
    onSort(columnKey);
  };

  return (
    <thead className="bg-bg-secondary">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            scope="col"
            className={`px-6 py-3 text-start text-xs font-medium text-text-secondary uppercase tracking-wider border-r border-border-primary last:border-r-0 ${
              column.sortable !== false && onSort
                ? "cursor-pointer hover:bg-bg-hover transition-colors duration-150"
                : ""
            }`}
            onClick={() => handleColumnClick(column)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.header}</span>
              {getSortIcon(column)}
            </div>
          </th>
        ))}
        {actions.length > 0 && (
          <th
            scope="col"
            className="px-6 py-3 text-end text-xs font-medium text-text-secondary uppercase tracking-wider"
          >
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}
