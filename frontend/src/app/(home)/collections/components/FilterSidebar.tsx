"use client";
import { Filter, RotateCcw } from "lucide-react";
import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import { Slider } from "@/components/ui/slider";
import useSWR from "swr";
import { bookServices } from "@/services/bookServices";
import { useRouter, useSearchParams } from "next/navigation";
import { roundPrice } from "@/lib/utils";
import { publisherServices } from "@/services/publisherServices";
import CheckboxList from "./CheckboxList";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterState {
  publishers: string[];
  minPrice: number;
  maxPrice: number;
}

const initialFilterState: FilterState = {
  publishers: [],
  minPrice: 0,
  maxPrice: 0,
};

type FilterAction =
  | { type: "SET_PUBLISHERS"; payload: string[] }
  | { type: "SET_PRICE_RANGE"; payload: { min: number; max: number } }
  | { type: "RESET"; payload: { maxPrice?: number } };

const filterReducer = (
  state = initialFilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case "SET_PUBLISHERS":
      return { ...state, publishers: action.payload };
    case "SET_PRICE_RANGE":
      return {
        ...state,
        minPrice: action.payload.min,
        maxPrice: action.payload.max,
      };
    case "RESET":
      return {
        ...initialFilterState,
        maxPrice: action.payload?.maxPrice ?? 99999999,
      };
    default:
      return state;
  }
};

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceSliderRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const [priceRange, setPriceRange] = useState([0, 0]);

  //Get maxPrice
  const { data: maxPriceData, isLoading: isLoadingPrice } = useSWR(
    "/max-price",
    bookServices.getMaxPrice,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  //Get publishers
  const { data: publishersData, isLoading: isLoadingPublishers } = useSWR(
    "/publishers",
    publisherServices.getAllPublishers,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  useEffect(() => {
    if (maxPriceData && maxPriceData > 0 && priceRange[1] === 0) {
      const roundedMax = roundPrice(maxPriceData);
      const newPriceRange = [0, roundedMax];
      setPriceRange(newPriceRange);
      dispatch({
        type: "SET_PRICE_RANGE",
        payload: { min: 0, max: roundedMax },
      });
    }
  }, [maxPriceData, priceRange]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      // Cập nhật params
      if (state.minPrice > 0) params.set("minPrice", state.minPrice.toString());
      else params.delete("minPrice");

      if (state.maxPrice > 0) params.set("maxPrice", state.maxPrice.toString());
      else params.delete("maxPrice");

      if (state.publishers.length > 0) {
        params.set("publishers", state.publishers.join(","));
      } else {
        params.delete("publishers");
      }

      // Reset về page 1
      params.set("page", "1");

      router.replace(`?${params.toString()}`, { scroll: false });
    }, 100);

    return () => clearTimeout(debounceRef.current!);
  }, [state]);

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);

    if (debounceSliderRef.current) clearTimeout(debounceSliderRef.current);
    debounceSliderRef.current = setTimeout(() => {
      dispatch({
        type: "SET_PRICE_RANGE",
        payload: { min: value[0], max: value[1] },
      });
    }, 300);
  };

  const handlePublisherChange = (selected: string[]) => {
    dispatch({ type: "SET_PUBLISHERS", payload: selected });
  };

  const handleReset = () => {
    const roundedMax = roundPrice(maxPriceData || 1000000);
    dispatch({
      type: "RESET",
      payload: {
        maxPrice: roundedMax,
      },
    });
    setPriceRange([0, roundedMax]);
  };

  // Loading state
  if (isLoadingPrice || isLoadingPublishers) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxPrice = roundPrice(maxPriceData || 1000000);
  const hasActiveFilters =
    state.minPrice > 0 ||
    state.maxPrice < maxPrice ||
    state.publishers.length > 0;

  return (
    <div className="h-full flex flex-col max-h-[200px] lg:max-h-[400px] mb-50">
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 flex-1 flex flex-col">
    {/* Header */}
    <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-xl">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Bộ lọc</h2>
      </div>
      <button
        onClick={handleReset}
        disabled={!hasActiveFilters}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          hasActiveFilters
            ? "bg-white/20 hover:bg-white/30 text-white"
            : "bg-white/10 text-white/50 cursor-not-allowed"
        }`}
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-sm font-medium">Reset</span>
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Price Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Giá sản phẩm</h3>
          {priceRange[0] > 0 || priceRange[1] < maxPrice ? (
            <button
              onClick={() => handlePriceRangeChange([0, maxPrice])}
              className="text-xs text-green-600 hover:text-green-700"
            >
              Đặt lại
            </button>
          ) : null}
        </div>
        
        {maxPrice > 0 ? (
          <>
            <Slider
              min={0}
              max={maxPrice}
              step={Math.floor(maxPrice / 20)}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0đ</span>
              <span className="font-medium text-green-600">
                {priceRange[0].toLocaleString("vi-VN")}đ - {priceRange[1].toLocaleString("vi-VN")}đ
              </span>
              <span>{maxPrice.toLocaleString("vi-VN")}đ</span>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Đang tải dữ liệu giá...</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Publisher Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Nhà xuất bản</h3>
         
        </div>
        
        {publishersData && publishersData.length > 0 ? (
          <>
            <div className="mb-3 text-sm text-gray-600">
              Đã chọn: <span className="font-medium">{state.publishers.length}/{publishersData.length}</span>
            </div>
            <ScrollArea className="h-[180px] lg:h-[280px] border rounded-md">
              <div className="p-3">
                <CheckboxList
                  options={publishersData}
                  selected={state.publishers}
                  onChange={handlePublisherChange}
                  searchable={true}
                  maxHeight="none"
                />
              </div>
            </ScrollArea>
          </>
        ) : !isLoadingPublishers ? (
          <p className="text-gray-500 text-sm">Không có nhà xuất bản</p>
        ) : (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default FilterSidebar;
