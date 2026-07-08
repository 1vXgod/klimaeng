"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "danger" | "frost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[0_8px_20px_-6px_rgba(36,86,224,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-brand-400 hover:to-brand-600 hover:shadow-[0_12px_28px_-6px_rgba(36,86,224,0.55)]",
  secondary:
    "bg-surface text-ink border border-line-2 card-shadow hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300",
  ghost: "text-ink-2 hover:text-ink hover:bg-surface-2",
  dark: "bg-night-900 text-white border border-white/10 hover:bg-night-800",
  danger:
    "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400",
  frost:
    "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5 rounded-lg",
  md: "h-11 px-6 text-sm gap-2 rounded-full",
  lg: "h-13 px-8 text-[15px] gap-2.5 rounded-full",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = BaseProps & { href: string; target?: string; onClick?: () => void };

export const Button = forwardRef<HTMLButtonElement, ButtonProps | AnchorProps>(
  function Button({ variant = "primary", size = "md", className, children, ...rest }, ref) {
    const cls = cn(
      "inline-flex select-none items-center justify-center font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-ring cursor-pointer",
      variants[variant],
      sizes[size],
      className
    );

    if ("href" in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as AnchorProps;
      return (
        <Link href={href} className={cls} {...anchorRest}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={cls} {...(rest as ButtonProps)}>
        {children}
      </button>
    );
  }
);
