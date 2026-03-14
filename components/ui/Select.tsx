'use client';

import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  'aria-label'?: string;
  className?: string;
}

export function Select({
  label,
  placeholder = 'Select…',
  options,
  value,
  onChange,
  id: idProp,
  'aria-label': ariaLabel,
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = idProp ?? label?.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const display = selectedOption ? selectedOption.label : placeholder;

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      {label && (
        <label
          id={id ? `${id}-label` : undefined}
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? label ?? 'Select option'}
        aria-labelledby={label && id ? `${id}-label` : undefined}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-input px-3 py-2 text-left text-foreground transition-colors hover:border-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {display}
        </span>
        <span
          className={`pointer-events-none shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-activedescendant={value ? `${id}-opt-${value}` : undefined}
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-card py-1 shadow-lg focus:outline-none"
          style={{ minWidth: 'var(--button-width, 100%)' }}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              id={`${id}-opt-${opt.value}`}
              role="option"
              aria-selected={value === opt.value}
              className="cursor-pointer px-3 py-2 text-sm text-foreground hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
