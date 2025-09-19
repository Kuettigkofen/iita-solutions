import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SearchableDropdownProps {
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchableDropdown({ options, placeholder, value, onChange, className = "" }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [dynamicWidth, setDynamicWidth] = useState(120);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Measure actual text width using hidden span and implement line-breaking
  useEffect(() => {
    if (measurementRef.current) {
      // Measure the real width of the rendered text
      const textWidth = measurementRef.current.offsetWidth;

      // Add a consistent buffer for padding and the dropdown chevron
      const totalWidth = textWidth + 60; // 60px for padding and chevron

      // Set max width constraint (don't make dropdowns too wide)
      const maxAllowedWidth = 400;

      if (totalWidth > maxAllowedWidth) {
        // Text is too long, use the max width (line-breaking will handle the overflow)
        setDynamicWidth(maxAllowedWidth);
      } else {
        // Text fits, use calculated width with minimum
        const newWidth = Math.max(120, totalWidth);
        setDynamicWidth(newWidth);
      }
    }
  }, [value, placeholder]); // Re-run when text changes

  // Function to break long text into word spans for inline wrapping
  const formatDisplayText = (text: string) => {
    if (!text) return '';

    // Split into words for individual span wrapping
    const words = text.split(' ');
    return words;
  };

  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onChange(value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    setSearchTerm(option);
    onChange(option);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div ref={dropdownRef} className={`relative ${className}`} style={{ width: `${dynamicWidth}px` }}>
      {/* Hidden measurement span with exact same CSS classes as displayed text */}
      <span
        ref={measurementRef}
        className="absolute invisible whitespace-nowrap -top-96 text-3xl md:text-5xl lg:text-6xl font-bold"
      >
        {value || placeholder}
      </span>

      <div className="relative">
        {!isOpen && value ? (
          // Display formatted text when not editing (closed state) - inline word wrapping
          <div
            onClick={() => setIsOpen(true)}
            className={`bg-transparent border-b-2 border-orange-500 pb-1 pr-8 outline-none w-full transition-all duration-300 ease-in-out cursor-pointer text-orange-500 flex flex-wrap items-baseline gap-x-1`}
            style={{ width: '100%', minHeight: '1.5em' }}
          >
            {formatDisplayText(value).map((word, index) => (
              <span key={index} className="whitespace-nowrap">
                {word}
              </span>
            ))}
          </div>
        ) : (
          // Show input when editing (open state or no value)
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={value ? '' : '...'}
            className={`bg-transparent border-b-2 border-orange-500 pb-1 pr-8 outline-none w-full block transition-all duration-300 ease-in-out ${
              value ? 'text-orange-500' : 'text-gray-400 animate-pulse'
            } placeholder-gray-400`}
            style={{ width: '100%' }}
          />
        )}
        <ChevronDown
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500 transition-transform cursor-pointer ${
            isOpen ? 'rotate-180' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto" style={{ minWidth: Math.max(dynamicWidth, 150) + 'px' }}>
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-800 text-white first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </div>
          ))}
          {filteredOptions.length === 0 && searchTerm && (
            <div
              onClick={() => handleOptionClick(searchTerm)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-800 text-orange-500 italic rounded-lg"
            >
              Use "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}