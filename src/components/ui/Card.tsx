'use client';

import { HTMLAttributes, forwardRef } from 'react';

type CardVariant = 'default' | 'soft' | 'glass' | 'accent';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'card',
  soft: 'card-soft',
  glass: 'glass rounded-2xl',
  accent: 'bg-aura-sand rounded-2xl',
};

const paddingClasses: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      clickable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${clickable ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for Card
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between mb-3 ${className}`}
        {...props}
      >
        <div>
          <h3 className="text-title text-aura-text">{title}</h3>
          {subtitle && (
            <p className="text-small text-aura-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => {
  return (
    <div ref={ref} className={`mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';
