import { cn } from "@/lib/utils";
import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";

interface FieldWrapProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
  children: React.ReactNode;
}

function FieldWrap({ label, error, hint, required, id, children }: FieldWrapProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-body">
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, required, className, id: idProp, ...props }: InputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap label={label} error={error} hint={hint} required={required} id={id}>
      <input
        id={id}
        required={required}
        aria-invalid={!!error}
        className={cn("input-base", error && "border-red-400", className)}
        {...props}
      />
    </FieldWrap>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, required, className, id: idProp, ...props }: TextareaProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap label={label} error={error} hint={hint} required={required} id={id}>
      <textarea
        id={id}
        required={required}
        aria-invalid={!!error}
        className={cn("input-base min-h-28 resize-y", error && "border-red-400", className)}
        {...props}
      />
    </FieldWrap>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Select({ label, error, hint, required, className, id: idProp, children, ...props }: SelectProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldWrap label={label} error={error} hint={hint} required={required} id={id}>
      <select id={id} required={required} className={cn("input-base", className)} {...props}>
        {children}
      </select>
    </FieldWrap>
  );
}
