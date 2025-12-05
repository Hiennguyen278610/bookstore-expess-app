import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  className?: string
}

const SearchInput = ({ className }: SearchInputProps) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full h-11 pl-5 pr-14 rounded-full border-2 border-gray-100 bg-gray-50 text-base focus-visible:ring-primary focus-visible:border-primary/50 focus:bg-white transition-all shadow-sm"
      />

      {/* Nút tìm kiếm nằm bên trong input */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
        <button className="p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors shadow-sm">
          <SearchIcon size={18} />
        </button>
      </div>
    </div>
  )
}

export default SearchInput