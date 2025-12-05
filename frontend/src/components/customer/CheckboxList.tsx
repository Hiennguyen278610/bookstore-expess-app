"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"
import { useState } from "react"

interface FilterCheckboxListProps {
  options: string[]
  selected: string[] 
  onChange: (selected: string[]) => void
  maxHeight?: string
  searchable?: boolean
}

const CheckboxList = ({
  options,
  selected,
  onChange,
  maxHeight = "200px",
  searchable = true,
}: FilterCheckboxListProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggle = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option]

    onChange(newSelected)
  }

  const selectedCount = selected.length
  const totalCount = options.length

  return (
    <div className="space-y-3">
      {/* Header with counts */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Đã chọn: {selectedCount}/{totalCount}
        </span>
        {selectedCount > 0 && (
          <button 
            onClick={() => onChange([])}
            className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Bỏ chọn
          </button>
        )}
      </div>

      {/* Search Input */}
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
          />
        </div>
      )}

      {/* Checkbox List - FIXED: Added height constraint to ScrollArea */}
      <div style={{ maxHeight, minHeight: "100px" }}>
        <ScrollArea className="h-full pr-2">
          <div className="space-y-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer select-none p-1 py-2 rounded-lg hover:bg-green-50 transition-all duration-200 group"
                >
                  <Checkbox
                    checked={selected.includes(option)}
                    onCheckedChange={() => handleToggle(option)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 transition-colors"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                    {option}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${selected.includes(option) ? 'bg-green-500' : 'bg-gray-300'} transition-colors`} />
                </label>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default CheckboxList