import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: ToggleProps) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 cursor-pointer">
      <span>
        <span className="block text-sm font-medium text-body">{label}</span>
        <span className="block text-xs text-muted mt-0.5 leading-relaxed">{description}</span>
      </span>
      <span className="relative inline-flex shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="w-10 h-6 rounded-full surface-2 border border-base peer-checked:bg-night-600 peer-checked:border-night-600 transition-colors" />
        <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}
