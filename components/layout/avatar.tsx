"use client";

import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  avatarPath,
  className,
}: {
  name: string;
  avatarPath?: string | null;
  className?: string;
}) {
  if (avatarPath) {
    return (
      <img
        src={avatarPath}
        alt={`Avatar ${name}`}
        className={cn("rounded-full object-cover bg-(--surface-2)", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "rounded-full bg-gradient-to-br from-night-400 to-night-700 text-white grid place-items-center font-semibold",
        className
      )}
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
