import React from "react";
import type { PaginationProps } from "../types";

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showPrevNext = true,
      className,
      ...props
    },
    ref,
  ) => {
    // Generate page numbers with ellipsis
    const generatePagination = () => {
      const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [];

      const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
      const totalBlocks = totalNumbers + 2;

      if (totalPages <= totalBlocks) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, "ellipsis-right", totalPages];
      }

      if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1,
        );
        return [1, "ellipsis-left", ...rightRange];
      }

      if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i,
        );
        return [1, "ellipsis-left", ...middleRange, "ellipsis-right", totalPages];
      }

      return pages;
    };

    const pages = generatePagination();
    const classes = ["fc-pagination", className].filter(Boolean).join(" ");

    return (
      <nav ref={ref} className={classes} role="navigation" aria-label="Pagination Navigation" {...props}>
        {showPrevNext && (
          <button
            type="button"
            className="fc-pagination__btn fc-pagination__btn--prev"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            &larr; Prev
          </button>
        )}

        {pages.map((p, idx) => {
          if (p === "ellipsis-left" || p === "ellipsis-right") {
            return (
              <span key={`ellipsis-${idx}`} className="fc-pagination__ellipsis" aria-hidden="true">
                &hellip;
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              className={`fc-pagination__btn ${isActive ? "fc-pagination__btn--active" : ""}`}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        {showPrevNext && (
          <button
            type="button"
            className="fc-pagination__btn fc-pagination__btn--next"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            Next &rarr;
          </button>
        )}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;

