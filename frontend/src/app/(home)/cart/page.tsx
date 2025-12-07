"use client";
import React, { useEffect } from "react";
import CartDetail from "./components/CartDetail";
import CartSummary from "./components/CartSummary";
import useSWR from "swr";
import { cartServices } from "@/services/cartServices";
import { useCartStore } from "@/stores/useCartStore";

const CartPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <CartDetail />
        <CartSummary />
      </div>
    </div>
  );
};

export default CartPage;
