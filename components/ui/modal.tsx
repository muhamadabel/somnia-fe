"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // move focus into the dialog for keyboard users
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-night-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        className={cn(
          "relative card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-up rounded-b-none sm:rounded-b-xl2",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-body">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup dialog"
            className="rounded-lg p-1.5 text-muted hover:text-body hover:bg-(--surface-2) cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
