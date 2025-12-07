"use client";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  imgSrc: string;
}

const ProductCard = ({ _id, name, price, imgSrc }: ProductCardProps) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(_id, 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Link href={`/product/${_id}`} className="no-underline hover:no-underline">
      <div className="border border-green-200 relative bg-white p-3 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col">
        <div className="px-3 py-2">
          <Image
            src={imgSrc}
            alt={name}
            width={200}
            height={300}
            className="w-full h-auto max-h-[290px] object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="mt-4 flex flex-col flex-grow min-h-[95px]">
          <h1 className="text-base text-gray-800 line-clamp-2 flex-grow group-hover:text-green-700 transition-colors duration-300">
            {name}
          </h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-green-600 text-md font-bold">
              {formatPrice(price)}
            </p>
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg font-bold text-white flex-center transition-all duration-300 group-hover:scale-110 cursor-pointer shadow-lg">
              <ShoppingCart
                className="size-4 md:size-5"
                onClick={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
