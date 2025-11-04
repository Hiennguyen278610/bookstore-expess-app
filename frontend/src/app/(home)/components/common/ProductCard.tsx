import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import React from "react";

export interface ProductCardProps {
  name: string;
  price: number;
  imgSrc: string;
}

const ProductCard = ({ name, price, imgSrc }: ProductCardProps) => {
  return (
    <div className="border border-green-200 relative bg-gradient-to-br from-green-50 to-white p-3 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col">
      <div className="px-3 py-2">
        <Image
          src={imgSrc}
          alt={name}
          width={200}
          height={300}
          className="w-full h-auto max-h-[290px] object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4 flex flex-col flex-grow min-h-[60px]">
        <h1 className="text-base text-gray-800 line-clamp-2 flex-grow group-hover:text-green-700 transition-colors duration-300">
          {name}
        </h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-green-600 text-md font-bold">
            {formatPrice(price)}
          </p>
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg font-bold text-white flex-center transition-all duration-300 group-hover:scale-110 cursor-pointer shadow-lg">
            <ShoppingCart className="size-4 md:size-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
