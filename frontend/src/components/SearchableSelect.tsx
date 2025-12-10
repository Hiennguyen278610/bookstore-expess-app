"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface Option {
  _id: string;
  name: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn..."
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option
  const selectedOption = options.find(opt => opt._id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 bg-white px-3 py-2 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-between"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={selectedOption ? selectedOption.name : placeholder}
          value={isOpen ? searchTerm : ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onFocus={() => setIsOpen(true)}
          className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400"
        />
        <div className="flex items-center gap-1">
          {value && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Không tìm thấy kết quả
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredOptions.map((option) => (
                <li key={option._id}>
                  <button
                    onClick={() => handleSelect(option._id)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors ${
                      value === option._id
                        ? "bg-emerald-100 text-emerald-900 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {value === option._id && (
                        <span className="text-emerald-600">✓</span>
                      )}
                      {option.name}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
