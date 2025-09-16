'use client'

import { useState, useRef, useEffect } from 'react'

interface DynamicDropdownProps {
  label: string
  options: readonly string[]
  value: string
  onChange: (value: string, isCustom: boolean) => void
  placeholder?: string
  allowCustom?: boolean
}

export default function DynamicDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = `Select ${label.toLowerCase()}...`,
  allowCustom = true
}: DynamicDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionSelect = (option: string) => {
    onChange(option, false)
    setIsOpen(false)
    setSearchTerm('')
    setIsCustomMode(false)
  }

  const handleCustomTextChange = (text: string) => {
    onChange(text, true)
    setIsCustomMode(true)
  }

  const displayValue = value || placeholder

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[60px] px-4 py-3 bg-black border-b-2 border-orange-500 text-left text-white text-lg focus:outline-none focus:border-orange-400 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className={value ? 'text-white' : 'text-gray-400'}>
            {displayValue}
          </span>
          <svg
            className={`w-5 h-5 text-orange-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-700">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Options List */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
              >
                {option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}

            {/* No results found */}
            {filteredOptions.length === 0 && searchTerm && (
              <div className="px-4 py-3 text-gray-400 text-center">
                No options found
              </div>
            )}
          </div>

          {/* Custom Text Option */}
          {allowCustom && (
            <div className="p-3 border-t border-gray-700">
              <input
                type="text"
                placeholder={`Or type custom ${label.toLowerCase()}...`}
                value={isCustomMode ? value : ''}
                onChange={(e) => handleCustomTextChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded focus:outline-none focus:border-orange-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter your own {label.toLowerCase()} if not listed above
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}