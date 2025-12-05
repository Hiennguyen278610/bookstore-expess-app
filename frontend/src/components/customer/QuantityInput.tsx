import React from "react"

interface QuantityInputProps {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  size?: "sm" | "md" | "lg" 
}

const QuantityInput = ({
  value,
  onDecrease,
  onIncrease,
  onChange,
  onBlur,
  size = "md", 
}: QuantityInputProps) => {
  // map class theo size
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",     
    md: "w-12 h-12 text-base", 
    lg: "w-14 h-14 text-lg",   
  }

  return (
    <div className="flex border border-gray-300 w-fit rounded-sm overflow-hidden select-none">
      <button
        onClick={onDecrease}
        className={`px-2 py-1 hover:bg-gray-100 font-semibold ${sizeClasses[size]}`}
      >
        -
      </button>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`text-center outline-none border-x border-gray-300 ${sizeClasses[size]}`}
      />

      <button
        onClick={onIncrease}
        className={`px-2 py-1 hover:bg-gray-100 font-semibold ${sizeClasses[size]}`}
      >
        +
      </button>
    </div>
  )
}

export default QuantityInput
