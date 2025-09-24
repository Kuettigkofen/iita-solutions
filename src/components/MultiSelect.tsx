'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Plus } from 'lucide-react'

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  allowCustom?: boolean
  customLabel?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className = "",
  allowCustom = false,
  customLabel = "Add custom option"
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
        setShowCustomInput(false)
        setCustomValue('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allOptions = [...options, ...selected.filter(item => !options.includes(item))]
  const filteredOptions = allOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selected.includes(option)
  )

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  const removeOption = (option: string) => {
    onChange(selected.filter(item => item !== option))
  }

  const addCustomOption = () => {
    if (customValue.trim() && !selected.includes(customValue.trim())) {
      onChange([...selected, customValue.trim()])
      setCustomValue('')
      setShowCustomInput(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected items display */}
      <div
        className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selected.map(item => (
              <span
                key={item}
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  options.includes(item)
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {item}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(item)
                  }}
                  className="ml-1 hover:bg-opacity-50 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-black"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Custom input */}
          {allowCustom && showCustomInput && (
            <div className="p-2 border-b bg-green-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Enter custom option..."
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-green-500 text-black"
                  onClick={(e) => e.stopPropagation()}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomOption()}
                />
                <button
                  onClick={addCustomOption}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Add custom button */}
          {allowCustom && !showCustomInput && (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 focus:outline-none focus:bg-green-50 border-b"
            >
              <Plus size={14} className="inline mr-2" />
              {customLabel}
            </button>
          )}

          {/* Options list */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm ? 'No matching options' : 'All options selected'}
              </div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-black"
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}