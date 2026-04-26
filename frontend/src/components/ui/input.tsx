import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`
          flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2
          text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";