
import React, { useState, useRef, useEffect } from 'react';
import { THAI_NAMES } from '../constants';

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ label, value, onChange, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (val.length > 0) {
      const filtered = THAI_NAMES.filter(name => 
        name.toLowerCase().includes(val.toLowerCase()) || 
        name.replace(/นพ\.|พญ\./g, '').trim().includes(val)
      ).slice(0, 10);
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value.length > 0) {
            const filtered = THAI_NAMES.filter(name => name.toLowerCase().includes(value.toLowerCase())).slice(0, 10);
            setSuggestions(filtered);
            setIsOpen(filtered.length > 0);
          }
        }}
        placeholder="Enter name (e.g. ภ)"
        autoComplete="off"
      />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-hidden animate-slideDown">
          {suggestions.length > 0 ? (
            suggestions.map((name, idx) => (
              <button
                key={idx}
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm border-b border-slate-50 last:border-0 transition-colors"
                onClick={() => handleSelect(name)}
              >
                {name}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-400">ไม่พบชื่อที่ตรงกัน</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
