"use client";
import { Accordion } from "@radix-ui/react-accordion";
import React, { useReducer } from "react";
import MyAccordion from "./MyAccordion";
import CheckboxList from "../common/CheckboxList";
import { Filter, RotateCcw, Sparkles } from "lucide-react";

interface FilterState {
  publishers: Array<string>;
  selectedPriceRanges: string[];
}

const initialFilterState: FilterState = {
  publishers: [],
  selectedPriceRanges: [],
};

type FilterAction =
  | { type: "SET_PUBLISHERS"; payload: string[] }
  | { type: "SET_PRICE_RANGE"; payload: string[] }
  | { type: "RESET" };

const filterReducer = (state = initialFilterState, action: FilterAction) => {
  switch (action.type) {
    case "SET_PUBLISHERS":
      return { ...state, publishers: action.payload };
    case "SET_PRICE_RANGE":
      return { ...state, selectedPriceRanges: action.payload };
    case "RESET":
      return initialFilterState;
    default:
      return state;
  }
};

const priceRanges = [
  {
    id: "under-50k",
    label: "Giá dưới 50.000đ",
    min: 0,
    max: 50000,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "50k-100k",
    label: "50.000đ - 100.000đ",
    min: 50000,
    max: 100000,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "100k-150k",
    label: "100.000đ - 150.000đ",
    min: 100000,
    max: 150000,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "150k-200k",
    label: "150.000đ - 200.000đ",
    min: 150000,
    max: 200000,
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "over-200k",
    label: "Giá trên 200.000đ",
    min: 200000,
    max: 10000000,
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

const publishers = [
  "NXB Kim Đồng",
  "NXB Trẻ",
  "NXB Văn Học",
  "NXB Phụ Nữ",
  "NXB Hội Nhà Văn",
  "NXB Tổng Hợp",
  "NXB Thanh Niên",
  "NXB Giáo Dục",
  "NXB Chính Trị",
  "NXB Lao Động",
];

const FilterSidebar = () => {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);

  const hasActiveFilters =
    state.publishers.length > 0 || state.selectedPriceRanges.length > 0;

  return (
    <div className="h-full flex flex-col overflow-y-auto lg:max-h-[1200px]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 flex-1 flex flex-col">
        {/* Header - Chỉ hiển thị trên desktop */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-xl flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Bộ lọc</h2>
          </div>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">Reset</span>
          </button>
        </div>

        {/* Scrollable Content - Chiếm toàn bộ không gian còn lại */}
        <div className="flex-1 overflow-y-auto p-6">
          <Accordion type="multiple" className="w-full space-y-4">
            <MyAccordion value="item-1" title="💰 Giá sản phẩm">
              <div className="pt-3 pb-2">
                <CheckboxList
                  options={priceRanges.map((range) => range.label)}
                  selected={state.selectedPriceRanges}
                  onChange={(selectedRanges) =>
                    dispatch({
                      type: "SET_PRICE_RANGE",
                      payload: selectedRanges,
                    })
                  }
                  searchable={false}
                />
              </div>
            </MyAccordion>

            <MyAccordion value="item-2" title="🏢 Nhà xuất bản">
              <div className="pt-3 pb-2">
                <CheckboxList
                  options={publishers}
                  selected={state.publishers}
                  onChange={(selectedBrands) =>
                    dispatch({
                      type: "SET_PUBLISHERS",
                      payload: selectedBrands,
                    })
                  }
                  searchable={true}
                  maxHeight="none"
                />
              </div>
            </MyAccordion>
          </Accordion>

          {/* Enhanced Selected Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-800">
                    Bộ lọc đang áp dụng
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium shadow-sm">
                  {state.publishers.length + state.selectedPriceRanges.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.publishers.map((publisher) => (
                  <span
                    key={publisher}
                    className="px-3 py-1.5 bg-white text-green-700 text-xs rounded-full border border-green-300 shadow-sm flex items-center gap-1 font-medium transition-all hover:scale-105"
                  >
                    🏢 {publisher}
                  </span>
                ))}
                {state.selectedPriceRanges.map((priceRange) => {
                  const range = priceRanges.find((r) => r.label === priceRange);
                  return (
                    <span
                      key={priceRange}
                      className={`px-3 py-1.5 text-xs rounded-full border shadow-sm flex items-center gap-1 font-medium transition-all hover:scale-105 ${
                        range?.color ||
                        "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                    >
                      💰 {priceRange}
                    </span>
                  );
                })}
              </div>

              {/* Quick Clear Button */}
              <div className="mt-3 pt-3 border-t border-green-200">
                <button
                  onClick={() => dispatch({ type: "RESET" })}
                  className="w-full py-2 text-xs text-green-600 hover:text-green-700 hover:bg-white rounded-lg transition-all duration-200 font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;