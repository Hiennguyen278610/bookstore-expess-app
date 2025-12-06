"use client";

import React from "react";
import { Book } from "@/types/book.type";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { sortBookOptions } from "@/constants";

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

  return (
    <section className="w-full">
      {/* Enhanced Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
            {categoryName}
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {totalCount} sản phẩm
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <select
            value={currentSortBy}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
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
