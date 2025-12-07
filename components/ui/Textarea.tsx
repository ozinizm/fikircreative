"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 bg-[#0d0d0d] border rounded-lg text-white 
            placeholder-gray-500 transition-all resize-none
            focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-[#252525]"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        {helpText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
