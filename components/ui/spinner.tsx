import React from "react";
import { cn } from "@/lib/utils";

type SpinnerProps = React.SVGProps<SVGSVGElement> & {
  variant?: "default" | "secondary";
};

export function Spinner({
  variant = "default",
  className,
  ...props
}: SpinnerProps) {
  const gradientId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      style={{
        animation: "spin 0.75s linear infinite",
        transformOrigin: "center",
        willChange: "transform",
      }}
      {...props}
    >
      <defs>
        {variant === "default" ? (
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(255,167,86,1)" />
            <stop offset="100%" stopColor="rgba(238,96,44,1)" />
          </linearGradient>
        ) : (
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(94,94,94,1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,1)" />
          </linearGradient>
        )}
      </defs>

      <path
        d="M21 12a9 9 0 1 1-6.219-8.56"
        stroke={`url(#${gradientId})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          vectorEffect: "non-scaling-stroke",
        }}
      />

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </svg>
  );
}