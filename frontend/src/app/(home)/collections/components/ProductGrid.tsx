"use client";

import React from "react";
import { Book } from "@/types/book.type";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { sortBookOptions } from "@/constants";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductGridProps {
  categoryName: string;
  products: Book[];
  totalCount: number;
}

const ProductGrid = ({
  categoryName,
  products,
  totalCount,
}: ProductGridProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (sortValue === "newest") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", sortValue);
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  if (totalCount === 0 || products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-500 text-lg">Không có sản phẩm phù hợp</p>
        </div>
      </div>
    );
  }
  return (
    <section className="w-full min-h-[120vh]">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
            {categoryName}
          </h3>
          <Badge className="px-3 py-1 bg-green-100 text-green-800 text-sm text-center font-medium rounded-full">
            {totalCount} sản phẩm
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <select
            value={currentSortBy}
            onChange={handleSortChange}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          >
            {sortBookOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enhanced Product Grid */}
      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-1
      "
      >
        {products.map((product, index) => (
          <div
            key={index}
            className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-xl overflow-hidden"
          >
            <ProductCard
              _id={product._id}
              name={product.name}
              price={product.price}
              imgSrc={product.imageUrl[0]}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
