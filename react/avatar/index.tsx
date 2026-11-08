import React, { useState } from "react";
import type { AvatarProps } from "../types";

function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      status,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [imageError, setImageError] = useState(false);
    const initials = name ? getInitials(name) : "";

    const classes = [
      "fc-avatar",
      `fc-avatar--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const hasImage = Boolean(src && !imageError);

    return (
      <span ref={ref} className={classes} aria-label={alt || name || "Avatar"} {...props}>
        {hasImage ? (
          <img
            src={src}
            alt={alt || name || ""}
            className="fc-avatar__image"
            onError={() => setImageError(true)}
          />
        ) : initials ? (
          <span className="fc-avatar__fallback" aria-hidden="true">
            {initials}
          </span>
        ) : (
          <span className="fc-avatar__fallback" aria-hidden="true">
            {children || (
              <svg
                width="60%"
                height="60%"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </span>
        )}

        {status && (
          <span
            className={`fc-avatar__status fc-avatar__status--${status}`}
            role="status"
            aria-label={`Status: ${status}`}
          />
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
export default Avatar;

