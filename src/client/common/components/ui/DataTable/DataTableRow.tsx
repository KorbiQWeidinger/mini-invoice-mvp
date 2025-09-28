"use client";

import { PrelineIconButton } from "../PrelineIconButton";
import type { DataTableColumn, DataTableAction } from "./types";

interface DataTableRowProps<T> {
  row: T;
  columns: DataTableColumn<T>[];
  actions: DataTableAction<T>[];
}

export function DataTableRow<T extends Record<string, unknown>>({
  row,
  columns,
  actions,
}: DataTableRowProps<T>) {
  return (
    <tr className="hover:bg-bg-hover transition-colors duration-150">
      {columns.map((column, colIndex) => (
        <td
          key={colIndex}
          className="px-6 py-4 whitespace-nowrap text-sm text-text-primary border-r border-border-primary last:border-r-0"
        >
          {column.render
            ? column.render(row)
            : String(row[column.key as keyof T] || "")}
        </td>
      ))}
      {actions.length > 0 && (
        <td className="px-6 py-4 whitespace-nowrap text-end text-sm">
          <div className="flex items-center justify-end space-x-2">
            {actions.map((action, actionIndex) => (
              <PrelineIconButton
                key={actionIndex}
                icon={action.icon}
                onClick={() => action.onClick(row)}
                disabled={action.disabled?.(row)}
                variant={action.variant || "primary"}
                title={action.label}
                size="md"
              />
            ))}
          </div>
        </td>
      )}
    </tr>
  );
}
