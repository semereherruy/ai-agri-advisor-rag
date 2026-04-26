import React, { HTMLAttributes, useRef, useEffect, useState } from "react";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
      const scrollElement = scrollRef.current;
      if (scrollElement) {
        setIsScrollable(scrollElement.scrollHeight > scrollElement.clientHeight);
      }
    }, [children]);

    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden
          ${className}
        `}
        {...props}
      >
        <div
          ref={scrollRef}
          className={`
            h-full w-full overflow-y-auto
            ${isScrollable ? "pr-2" : ""}
          `}
        >
          {children}
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";