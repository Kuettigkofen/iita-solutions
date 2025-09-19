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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

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
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={value ? '' : '...'}
          className={`bg-transparent border-b-2 border-orange-500 pb-1 pr-8 outline-none w-full block ${
            value ? 'text-orange-500' : 'text-gray-400 animate-pulse'
          } placeholder-gray-400`}
          style={{ minWidth: '120px' }}
        />
        <ChevronDown
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-500 transition-transform cursor-pointer ${
            isOpen ? 'rotate-180' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
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