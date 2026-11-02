import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Figma component "YS/Field" (2:99): Default / Empty / Focus / Error / Disabled.
 * 78px box, padding 14/16, label 12/18 medium (muted), value 16/26 semibold.
 */
const shell =
  "flex min-h-[78px] w-full flex-col justify-center gap-1 rounded-sm border bg-white px-4 py-3.5 text-left transition-[border-color,box-shadow] focus-within:ring-2 focus-within:ring-primary/30";

function shellState(error?: boolean, disabled?: boolean) {
  if (disabled) return "border-line bg-mint";
  if (error) return "border-danger";
  return "border-line hover:border-primary/60 focus-within:border-primary";
}

const labelClass = "text-xs font-medium uppercase text-muted";
const valueClass = "text-body font-semibold text-navy";

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-danger">
      {children}
    </p>
  );
}

type FieldButtonProps = Omit<ComponentProps<"button">, "children" | "value"> & {
  label: string;
  value?: ReactNode;
  placeholder?: string;
  error?: string;
};

/** A field that opens a picker (location, calendar…). */
export function FieldButton({ label, value, placeholder, error, className, id, disabled, ...props }: FieldButtonProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-describedby={errorId}
        className={cn(shell, shellState(Boolean(error), disabled), "focus-visible:border-primary")}
        {...props}
      >
        <span className={labelClass}>{label}</span>
        <span className={cn(valueClass, !value && "text-muted")}>{value || placeholder}</span>
      </button>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
};

/** Text input styled as a Figma field. */
export function TextField({ id, label, error, hint, className, containerClassName, disabled, ...props }: TextFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint && !error ? `${id}-hint` : undefined;
  return (
    <div className={cn("w-full", containerClassName)}>
      <label htmlFor={id} className={cn(shell, shellState(Boolean(error), disabled), "cursor-text")}>
        <span className={labelClass}>{label}</span>
        <input
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          className={cn(
            valueClass,
            "w-full bg-transparent outline-hidden placeholder:font-semibold placeholder:text-muted disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
      </label>
      {hint && !error ? (
        <p id={hintId} className="mt-1.5 text-xs font-medium text-muted">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

type TextAreaFieldProps = Omit<ComponentProps<"textarea">, "id"> & {
  id: string;
  label: string;
  error?: string;
  containerClassName?: string;
};

export function TextAreaField({ id, label, error, className, containerClassName, ...props }: TextAreaFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("w-full", containerClassName)}>
      <label htmlFor={id} className={cn(shell, shellState(Boolean(error)), "cursor-text")}>
        <span className={labelClass}>{label}</span>
        <textarea
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            valueClass,
            "min-h-[78px] w-full resize-y bg-transparent outline-hidden placeholder:font-semibold placeholder:text-muted",
            className,
          )}
          {...props}
        />
      </label>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
