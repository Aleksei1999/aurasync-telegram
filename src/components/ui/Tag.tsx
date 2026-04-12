'use client';

import { HTMLAttributes, forwardRef } from 'react';

type TagVariant = 'default' | 'accent' | 'premium' | 'morning' | 'evening';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const variantClasses: Record<TagVariant, string> = {
  default: 'tag',
  accent: 'tag-accent',
  premium: 'tag-premium',
  morning: 'bg-aura-peach-light text-aura-peach-dark',
  evening: 'bg-aura-lavender-light text-aura-lavender-dark',
};

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = 'default',
      icon,
      removable = false,
      onRemove,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      inline-flex items-center gap-1 px-3 py-1 rounded-full text-caption font-medium
      ${variantClasses[variant]}
      ${className}
    `.trim();

    return (
      <span ref={ref} className={baseClasses} {...props}>
        {icon && <span className="text-sm">{icon}</span>}
        {children}
        {removable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 hover:opacity-70"
          >
            ×
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';
