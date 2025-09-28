"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PrelineButton } from "../PrelineButton";

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: DataTablePaginationProps) {
  const renderPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and 2 pages on each side
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      // Always show first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Always show last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="px-2 py-1 text-text-secondary"
          >
            ...
          </span>
        );
      }

      return (
        <PrelineButton
          key={page}
          variant={page === currentPage ? "primary" : "secondary"}
          size="sm"
          onClick={() => onPageChange(page as number)}
        >
          {page}
        </PrelineButton>
      );
    });
  };

  return (
    <div className="bg-bg-secondary border-t border-border-primary px-6 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Info */}
        <div className="text-sm text-text-secondary">
          Showing {startIndex} to {endIndex} of {totalItems} entries
        </div>

        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <PrelineButton
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon={<ChevronLeft className="size-4" />}
          >
            Previous
          </PrelineButton>

          <div className="flex items-center space-x-1">
            {renderPageNumbers()}
          </div>

          <PrelineButton
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={<ChevronRight className="size-4" />}
          >
            Next
          </PrelineButton>
        </div>
      </div>
    </div>
  );
}
