import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-lg border border-gray-200 bg-white shadow-sm
          ${className}
        `}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          flex flex-col space-y-1.5 p-6
          ${className}
        `}
        {...props}
      />
    );
  }
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      /* eslint-disable-next-line jsx-a11y/heading-has-content */
      <h3
        ref={ref}
        className={`
          text-lg font-semibold leading-none tracking-tight
          ${className}
        `}
        {...props}
      >
        {props.children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          p-6 pt-0
          ${className}
        `}
        {...props}
      />
    );
  }
);

CardContent.displayName = "CardContent";