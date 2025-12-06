import Link from "next/link";
import React from "react";
import { ChevronRight, Home, Filter, X } from "lucide-react";
import { categoryServices } from "@/services/categoryServices";
import { ProductsPageProps } from "@/types/page.type";
import { bookServices } from "@/services/bookServices";
import ProductGrid from "../components/ProductGrid";

const Page = async ({ params, searchParams }: ProductsPageProps) => {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const { categorySlug } = resolvedParams;
  const category = await categoryServices.getCategoryBySlug(categorySlug);
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const data = await bookServices.getBooks(currentPage, 12, category._id);

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 mt-4 max-w-7xl mx-auto">
        {/* Enhanced Breadcrumb */}
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
              <Link
                href="/collections"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Danh mục
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-green-600 font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sách {category.name}
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Khám phá bộ sưu tập sách {category.name} đa dạng từ các tác giả
            trong nước và quốc tế. Từ những tác phẩm kinh điển đến các tác phẩm
            đương đại nổi bật.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <ProductGrid
            categoryName={category.name}
            products={data.data}
            totalCount={data.pagination?.totalItems || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
