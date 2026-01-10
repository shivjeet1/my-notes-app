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
        className="w-full bg-blue-500 text-white placeholder-white placeholder-opacity-50 rounded-full py-3 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-blue-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:opacity-70 transition-opacity"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}
