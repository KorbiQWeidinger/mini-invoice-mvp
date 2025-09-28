"use client";

import { ChevronUp } from "lucide-react";
import type { DataTableColumn, DataTableAction } from "./types";

interface DataTableHeaderProps<T> {
  columns: DataTableColumn<T>[];
  actions: DataTableAction<T>[];
}

export function DataTableHeader<T>({
  columns,
  actions,
}: DataTableHeaderProps<T>) {
  return (
    <thead className="bg-bg-secondary">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            scope="col"
            className="px-6 py-3 text-start text-xs font-medium text-text-secondary uppercase tracking-wider border-r border-border-primary last:border-r-0"
          >
            <div className="flex items-center space-x-1">
              <span>{column.header}</span>
              <ChevronUp className="size-3.5 text-text-secondary" />
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
