'use client';

import { useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useLanguage } from './LanguageProvider';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 py-16 sm:px-8">
      <div className="flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg">
        <FaSearch className="h-4 w-4 text-[#9a7048]" aria-hidden="true" />
        <input
          ref={inputRef}
          placeholder={t.search.placeholder}
          className="flex-1 border-none bg-transparent text-base text-[#111] outline-none placeholder:text-[#9c9c9c]"
          aria-label={t.search.inputLabel}
        />
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-transparent p-2 text-[#7a7a7a] transition hover:border-[#d0d0d0] hover:text-[#111]"
          aria-label={t.search.closeLabel}
        >
          <FaTimes className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
