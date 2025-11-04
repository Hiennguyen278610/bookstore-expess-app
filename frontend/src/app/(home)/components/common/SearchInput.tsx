import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import React from 'react'

const SearchInput = () => {
  return (
     <div className="relative w-full max-w-[220px] lg:max-w-2/5">
      <Input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus-visible:ring-1 focus-visible:ring-gray-400"
      />
      <SearchIcon
        size={20}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
      />
    </div>
  )
}

export default SearchInput
