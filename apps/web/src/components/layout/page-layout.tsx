import { type ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  /** Optional: use "narrow" for reading-focused content (e.g. articles), "wide" for dashboards */
  variant?: "default" | "narrow" | "wide";
}

const maxWidthByVariant = {
  default: "max-w-7xl", // 1280px – general purpose
  narrow: "max-w-3xl", // 768px – articles, forms, focused content
  wide: "max-w-[1600px]", // custom – dense dashboards
} as const;

export function PageLayout({ children, variant = "default" }: PageLayoutProps) {
  return (
    <div
      className={[
        "mx-auto w-full min-w-0",
        "px-4 sm:px-6 lg:px-8", // responsive horizontal padding
        maxWidthByVariant[variant],
      ].join(" ")}
    >
      {children}
    </div>
  );
}
