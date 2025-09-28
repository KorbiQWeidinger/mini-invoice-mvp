"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { PrelineButton } from "../PrelineButton";
import { PrelineCard } from "../PrelineCard";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

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
  const { isMobile } = useBreakpoint();

  const renderPageNumbers = () => {
    const maxVisiblePages = isMobile ? 3 : 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and pages on each side (fewer on mobile)
      const sidePages = isMobile ? 1 : 2;
      const startPage = Math.max(1, currentPage - sidePages);
      const endPage = Math.min(totalPages, currentPage + sidePages);

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

  const paginationContent = (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Info */}
      <div className="text-sm text-text-secondary">
        Showing {startIndex} to {endIndex} of {totalItems} entries
      </div>

      {/* Pagination */}
      <div className="flex items-center space-x-2">
        <PrelineButton
          variant="secondary"
          size={isMobile ? "md" : "sm"}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeft />}
        >
          {isMobile ? "" : "Previous"}
        </PrelineButton>

        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

        <PrelineButton
          variant="secondary"
          size={isMobile ? "md" : "sm"}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRight />}
        >
          {isMobile ? "" : "Next"}
        </PrelineButton>
      </div>
    </div>
  );

  if (isMobile) {
    return <PrelineCard variant="elevated">{paginationContent}</PrelineCard>;
  }

  return (
    <div className="bg-bg-secondary border-t border-border-primary px-6 py-4">
      {paginationContent}
    </div>
  );
}
