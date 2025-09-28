"use client";

import { FileX } from "lucide-react";
import { PrelineIconButton } from "../PrelineIconButton";
import { PrelineCard } from "../PrelineCard";
import type { DataTableCardViewProps } from "./types";

export function DataTableCardView<T extends Record<string, unknown>>({
  data,
  columns,
  actions = [],
  emptyMessage = "No data available",
  className = "",
}: DataTableCardViewProps<T>) {
  if (data.length === 0) {
    return (
      <PrelineCard
        variant="elevated"
        className={`text-center ${className}`}
        padding="lg"
      >
        <div className="text-text-muted">
          <FileX className="mx-auto h-12 w-12 text-text-muted mb-4" />
          <p className="text-lg font-medium text-text-secondary mb-2">
            No Data Found
          </p>
          <p className="text-sm text-text-muted">{emptyMessage}</p>
        </div>
      </PrelineCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {data.map((row, index) => (
        <PrelineCard key={index} variant="elevated" hover>
          <div className="space-y-4">
            {/* Main content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="space-y-1">
                  <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {column.header}
                  </div>
                  <div className="text-sm text-text-primary">
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] || "")}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-border-primary">
                {actions.map((action, actionIndex) => (
                  <PrelineIconButton
                    key={actionIndex}
                    icon={action.icon}
                    onClick={() => action.onClick(row)}
                    disabled={action.disabled?.(row)}
                    variant={action.variant || "primary"}
                    title={action.label}
                  />
                ))}
              </div>
            )}
          </div>
        </PrelineCard>
      ))}
    </div>
  );
}
