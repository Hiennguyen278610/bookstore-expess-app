"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter

interface SearchInputProps {
  className?: string;
  initialValue?: string;
  debounceDelay?: number;
}

const SearchInput = ({ 
  className, 
  initialValue = "",
  debounceDelay = 500 
}: SearchInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (trimmedTerm) {
      params.set("search", trimmedTerm);
      params.set("page", "1"); 
    } else {
      params.delete("search");
    }
    
    // Navigate với router
    router.push(`/collections?${params.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounce
    debounceRef.current = setTimeout(() => {
      const trimmedValue = value.trim();
      const params = new URLSearchParams(searchParams.toString());
      
      if (trimmedValue) {
        params.set("search", trimmedValue);
        params.set("page", "1"); 
      } else {
        params.delete("search");
      }
      
      // Navigate với debounce
      router.push(`/collections?${params.toString()}`);
    }, debounceDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Clear debounce khi nhấn Enter
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      handleSearch();
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full h-11 pl-5 pr-14 rounded-full border-2 border-gray-100 bg-gray-50 text-base focus-visible:ring-primary focus-visible:border-primary/50 focus:bg-white transition-all shadow-sm"
      />

      <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
        <button
          className="p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors shadow-sm"
          onClick={handleSearch}
          type="button"
          aria-label="Tìm kiếm"
        >
          <SearchIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;