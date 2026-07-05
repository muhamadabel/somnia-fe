import * as React from "react";
import { Search } from "lucide-react";

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={`relative flex-1 ${wrapperClassName || ""}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" aria-hidden />
        <input
          type="search"
          ref={ref}
          className={`input-base pl-9 ${className || ""}`}
          {...props}
        />
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";
