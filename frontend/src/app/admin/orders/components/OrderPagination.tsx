// components/OrderPagination.tsx
"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}) => {
  // Tạo mảng các trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Hiển thị tất cả các trang nếu tổng số trang ít
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic hiển thị trang với ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
        if (totalPages > 5) pages.push("ellipsis");
      } else if (currentPage >= totalPages - 2) {
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("ellipsis");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("ellipsis");
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="my-6">
      <PaginationContent>
        {/* Nút Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevPage) onPageChange(currentPage - 1);
            }}
            className={
              !hasPrevPage
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* Các số trang */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage) onPageChange(currentPage + 1);
            }}
            className={
              !hasNextPage
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};