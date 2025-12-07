"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 bg-[#0d0d0d] border rounded-lg text-white
            transition-all cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-[#252525]"}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
