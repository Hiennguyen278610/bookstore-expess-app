import React from "react";
import ProductCard, { ProductCardProps } from "../common/ProductCard";


interface ProductGridProps {
  products: ProductCardProps[];
  totalCount: number;
}

const ProductGrid = ({ products, totalCount }: ProductGridProps) => {
  
  return (
    <section className="w-full">
      {/* Enhanced Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
            Sách Văn Học
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {totalCount} sản phẩm 
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all">
            <option>Sắp xếp theo</option>
            <option>Giá thấp đến cao</option>
            <option>Giá cao đến thấp</option>
            <option>Bán chạy nhất</option>
            <option>Mới nhất</option>
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
              name={product.name}
              price={product.price}
              imgSrc={product.imgSrc}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
    </section>
  );
};

export default ProductGrid;
