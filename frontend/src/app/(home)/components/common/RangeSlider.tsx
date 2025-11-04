"use client"

import { Range } from "react-range"

interface RangeSliderProps {
  min?: number
  max?: number
  step?: number
  values: number[]           
  label?: string
  unit?: string
  onChange: (values: number[]) => void 
  color?: string
}

const RangeSlider = ({
  min = 0,
  max = 10000000, // 10 million for "10.0tr"
  step = 100000,
  values,
  label = "Khoảng giá",
  unit = "đ",
  onChange,
  color = "#3b82f6",
}: RangeSliderProps) => {
  
  const formatDisplayValue = (value: number) => {
    if (value >= 1000000) {
      const millions = value / 1000000
      return `${millions % 1 === 0 ? millions : millions.toFixed(1)}tr`
    }
    return value.toString()
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Giá sản phẩm</h2>
        <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
      </div>

      {/* Price display boxes */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 max-w-[140px]">
          <div className="border-2 border-gray-300 rounded-lg px-4 py-3 text-center">
            <span className="text-lg font-semibold text-gray-900">
              {formatDisplayValue(values[0])}
            </span>
            <span className="text-sm text-gray-600 ml-1">{unit}</span>
          </div>
        </div>
        
        <span className="text-gray-500 mx-4">-</span>
        
        <div className="flex-1 max-w-[140px]">
          <div className="border-2 border-gray-300 rounded-lg px-4 py-3 text-center">
            <span className="text-lg font-semibold text-gray-900">
              {formatDisplayValue(values[1])}
            </span>
            <span className="text-sm text-gray-600 ml-1">{unit}</span>
          </div>
        </div>
      </div>

      {/* Range Slider Container */}
      <div className="relative px-2">
        <Range
          step={step}
          min={min}
          max={max}
          values={values}
          onChange={onChange}
          renderTrack={({ props, children }) => {
            const left = ((values[0] - min) / (max - min)) * 100
            const right = 100 - ((values[1] - min) / (max - min)) * 100
            
            return (
              <div
                {...props}
                className="h-1 bg-gray-300 rounded-full relative cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    ${color} 0%, ${color} ${left}%, 
                    #e5e7eb ${left}%, #e5e7eb ${100 - right}%, 
                    ${color} ${100 - right}%, ${color} 100%)`
                }}
              >
                {children}
              </div>
            )
          }}
          renderThumb={({ props, isDragged }) => {
            return (
              <div
                {...props}
                className={`h-6 w-6 rounded-full border-4 border-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-transform ${
                  isDragged ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
              />
            )
          }}
        />

        {/* Min and Max labels positioned below the track */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500 font-medium">0</span>
          <span className="text-sm text-gray-500 font-medium">10.0tr</span>
        </div>
      </div>
    </div>
  )
}

export default RangeSlider