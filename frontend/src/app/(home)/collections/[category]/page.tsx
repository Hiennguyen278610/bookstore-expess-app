'use client'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FilterSidebar from "../../components/Collections/FilterSidebar";
import ProductGrid from "../../components/Collections/ProductGrid";
import { ChevronRight, Home, Filter, X } from "lucide-react";
import ProductPagination from "../../components/Collections/ProductPagination";
import { products } from "@/constants/user.index";

const Page = () => {
  const [page, setPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const totalPages = Math.ceil(products.length / 12)

  useEffect(() => {
    window.scrollTo({
      top: 180,
      behavior: "smooth",
    })
  }, [page])

  // Ngăn scroll body khi mobile filter mở
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isFilterOpen])

  const handleNext = () => {
    if (page < totalPages) setPage(prev => prev + 1)
  }

  const handlePrev = () => {
    if (page > 1) setPage(prev => prev - 1)
  }

  const handlePageChange = (newPage: number | string) => {
    if (typeof newPage === "number") setPage(newPage)
  }

  const startIndex = (page - 1) * 12
  const endIndex = startIndex + 12
  const displayedProducts = products.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 mt-4 max-w-7xl mx-auto">
        {/* Enhanced Breadcrumb */}
        <nav className="flex justify-start my-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Trang chủ
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li>
              <Link href="/collections" className="text-gray-600 hover:text-green-600 transition-colors">
                Danh mục
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </li>
            <li className="text-green-600 font-medium">Văn học</li>
          </ol>
        </nav>
      
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sách Văn Học</h1>
          <p className="text-gray-600 max-w-3xl">
            Khám phá bộ sưu tập sách văn học đa dạng từ các tác giả trong nước và quốc tế. 
            Từ những tác phẩm kinh điển đến các tác phẩm đương đại nổi bật.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden w-full mb-4 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Filter className="w-5 h-5" />
          Bộ lọc
        </button>

        {/**Filter & Products */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-6 mb-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block h-fit">
            <FilterSidebar />
          </div>
          
          {/* Mobile Filter  */}
          <div className="lg:hidden">
            {/* Overlay */}
            <div 
              className={`
                fixed inset-0 bg-black z-[9998] transition-all duration-300 ease-in-out
                ${isFilterOpen ? 'opacity-50 visible' : 'opacity-0 invisible'}
              `}
              onClick={() => setIsFilterOpen(false)}
            />
            
            {/* Filter Sidebar - Full Height */}
            <div className={`
              fixed top-0 left-0 w-[85vw] max-w-sm h-screen bg-white z-[9999] 
              transform transition-all duration-300 ease-in-out shadow-2xl flex flex-col
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              
              <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Filter className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Bộ lọc</h2>
                  </div>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              
              <div className="flex-1 overflow-hidden">
                <FilterSidebar />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ProductGrid 
              products={displayedProducts}
              totalCount={products.length}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-2 p-6">
                <ProductPagination
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  handlePageChange={handlePageChange}
                  page={page}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;