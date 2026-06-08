import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-secondary text-white hover:opacity-90",
    ghost: "border border-border bg-white hover:bg-muted",
    danger: "bg-danger text-white hover:opacity-90"
  };

  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
