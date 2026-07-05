"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  href?: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps) {
  const id = React.useId();
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const widthPercent = 100 / options.length;

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      focusAndSelect(nextIndex);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIndex = (index - 1 + options.length) % options.length;
      focusAndSelect(nextIndex);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusAndSelect(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusAndSelect(options.length - 1);
    }
  }

  function focusAndSelect(index: number) {
    const el = document.getElementById(`seg-${id}-${index}`);
    el?.focus();
    if (!options[index].href && onChange) {
      onChange(options[index].value);
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "relative flex rounded-full bg-transparent border border-sea-fog/60 dark:border-night-800/60 p-1",
        className
      )}
    >
      <div
        className="absolute top-1 bottom-1 bg-white dark:bg-white/15 rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          width: `calc(${widthPercent}% - 6px)`,
          left: `calc(${selectedIndex * widthPercent}% + 3px)`,
        }}
      />
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const baseClasses = cn(
          "relative z-10 flex-1 flex items-center justify-center py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-signal-blue",
          isSelected ? "text-signal-blue dark:text-white" : "text-muted hover:text-body"
        );

        if (option.href) {
          return (
            <Link
              key={option.value}
              id={`seg-${id}-${index}`}
              href={option.href}
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={baseClasses}
            >
              {option.label}
            </Link>
          );
        }

        return (
          <button
            key={option.value}
            id={`seg-${id}-${index}`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange?.(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={baseClasses}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
