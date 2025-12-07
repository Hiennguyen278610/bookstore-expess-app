"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  categorySlug: string; // Thêm để build URL
}

const ProductPagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  categorySlug,
}: ProductPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo({
      top: 150,
      behavior: "smooth",
    });
  }, [searchParams]); 

  /** Function to generate paginations */
  const generatePages = () => {
    const pages: (number | string)[] = [];

    // Don't show '...' if total pages < 4
    if (totalPages < 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // If current page < 2, show: 1,2,3, ..., last page
      if (currentPage < 2) {
        pages.push(1, 2, 3, "...", totalPages);
      }
      // If current page is next to last page, show: 1, ..., lastpage-2, lastpage-1, lastpage
      else if (currentPage >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      }
      // If current page is in the middle, show: 1, ..., current page, ..., last page
      else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  /** Update URL with new page */
  const updatePageInURL = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    // Giữ các query params khác
    router.push(`/collections/${categorySlug}?${params.toString()}`, {
      scroll: false,
    });
  };

  /** Handle previous page */
  const handlePrev = () => {
    if (hasPrev && currentPage > 1) {
      updatePageInURL(currentPage - 1);
    }
  };

  /** Handle next page */
  const handleNext = () => {
    if (hasNext && currentPage < totalPages) {
      updatePageInURL(currentPage + 1);
    }
  };

  /** Handle page change */
  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      updatePageInURL(page);
    }
  };

  /** an array include pagination's elements */
  const pagesToShow = generatePages();

  return (
    <div className="flex justify-center my-8">
      <Pagination>
        <PaginationContent>
          {/* Previous Page */}
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrev}
              className={cn(
                "cursor-pointer",
                !hasPrev && "pointer-events-none opacity-50"
              )}
              aria-disabled={!hasPrev}
            />
          </PaginationItem>

          {pagesToShow.map((p, index) => (
            <PaginationItem key={index}>
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === currentPage}
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "cursor-pointer",
                    "min-w-[40px] justify-center"
                  )}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Page */}
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={cn(
                "cursor-pointer",
                !hasNext && "pointer-events-none opacity-50"
              )}
              aria-disabled={!hasNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductPagination;
