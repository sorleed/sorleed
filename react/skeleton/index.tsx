import React from "react";
import type { SkeletonProps } from "../types";

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      animate = true,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const classes = [
      "fc-skeleton",
      `fc-skeleton--${variant}`,
      animate ? "fc-skeleton--animate" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inlineStyles: React.CSSProperties = {
      width,
      height,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={classes}
        style={inlineStyles}
        role="status"
        aria-busy="true"
        aria-label="Loading content..."
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
export default Skeleton;

