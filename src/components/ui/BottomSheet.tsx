'use client';

import { useEffect, useCallback, HTMLAttributes } from 'react';

interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: BottomSheetProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="bottom-sheet-overlay animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`bottom-sheet animate-slide-up ${className}`}>
        {/* Handle */}
        <div className="bottom-sheet-handle" />

        {/* Title */}
        {title && (
          <h2 className="text-title text-aura-text mb-4">{title}</h2>
        )}

        {/* Content */}
        {children}
      </div>
    </>
  );
}
