"use client"

import { Search, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search Notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search Notes"
        className="w-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full py-3 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}
