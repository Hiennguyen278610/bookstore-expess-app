import Link from "next/link";
import React from "react";
import { ChevronRight, Home, Filter, X } from "lucide-react";
import { categoryServices } from "@/services/categoryServices";
import { ProductsPageProps } from "@/types/page.type";
import { bookServices } from "@/services/bookServices";

import { parseSearchParams } from "@/lib/utils";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import ProductPagination from "./components/ProductPagination";


const Page = async ({ params, searchParams }: ProductsPageProps) => {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const parser = parseSearchParams(resolvedSearchParams);
  const currentPage = parser.getNumber("page", 1);
  const search = parser.getString("search");
  const minPrice = parser.getNumber("minPrice");
  const maxPrice = parser.getNumber("maxPrice");
  const sortBy = parser.getString("sortBy") || "newest";
  const publishers = parser.getStringArray("publishers");

  const data = await bookServices.getBooks(
    currentPage,
    12,
    "",
    publishers,
    search,
    minPrice,
    maxPrice,
    sortBy
  );

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 mt-4 max-w-7xl mx-auto">
        <nav className="flex justify-start my-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1"
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <span
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Danh mục
              </span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tất cả sách
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Khám phá bộ sưu tập sách đa dạng từ các tác giả
            trong nước và quốc tế. Từ những tác phẩm kinh điển đến các tác phẩm
            đương đại nổi bật.
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6 mb-8">
          {/* Filter Sidebar */}
          <FilterSidebar />

          {/* Product Grids */}
          <div className="flex-1">
            <ProductGrid
              products={data.data}
              totalCount={data.pagination?.totalItems || 0}
            />

            <ProductPagination
              currentPage={data.pagination?.currentPage || 1}
              totalPages={data.pagination?.totalPages || 1}
              hasNext={data.pagination?.hasNext || false}
              hasPrev={data.pagination?.hasPrev || false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
