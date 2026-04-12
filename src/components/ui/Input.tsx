'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-small font-medium text-aura-text mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-aura-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-caption text-aura-error mt-1">{error}</p>
        )}
        {hint && !error && (
          <p className="text-caption text-aura-text-secondary mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-small font-medium text-aura-text mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`textarea-field ${error ? 'border-aura-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-caption text-aura-error mt-1">{error}</p>
        )}
        {hint && !error && (
          <p className="text-caption text-aura-text-secondary mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
