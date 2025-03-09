'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {cn} from '~/lib/utils';

interface PlaceholdersAndVanishInputProps {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

export const PlaceholdersAndVanishInput = forwardRef<
  HTMLInputElement,
  PlaceholdersAndVanishInputProps
>(
  (
    {placeholders, onChange, onFocus, placeholder = 'SearchS', type = 'search'},
    ref,
  ) => {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const [value, setValue] = useState('');
    const [animating, setAnimating] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Combine the passed ref with internal ref
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const startAnimation = () => {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' && intervalRef.current) {
        clearInterval(intervalRef.current); // Clear the interval when the tab is not visible
        intervalRef.current = null;
      } else if (document.visibilityState === 'visible') {
        startAnimation(); // Restart the interval when the tab becomes visible
      }
    };

    useEffect(() => {
      startAnimation();
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );
      };
    }, [placeholders]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !animating) {
        performSearch();
      }
    };

    const performSearch = () => {
      if (inputRef.current) {
        const query = inputRef.current.value;
        window.location.href = query ? `/search?q=${query}` : `/search`;
      }
    };

    return (
      <div
        className={cn(
          'w-full relative mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200',
          value && 'bg-gray-50',
        )}
      >
        <input
          onChange={(e) => {
            if (!animating) {
              setValue(e.target.value);
              onChange && onChange(e);
            }
          }}
          onFocus={onFocus}
          ref={inputRef}
          value={value}
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20',
            animating && 'text-transparent dark:text-transparent',
          )}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={performSearch}
          disabled={!value}
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 h-4 w-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <motion.path
              d="M5 12l14 0"
              initial={{
                strokeDasharray: '50%',
                strokeDashoffset: '50%',
              }}
              animate={{
                strokeDashoffset: value ? 0 : '50%',
              }}
              transition={{
                duration: 0.3,
                ease: 'linear',
              }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </motion.svg>
        </button>

        <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
          <AnimatePresence mode="wait">
            {!value && (
              <motion.p
                initial={{
                  y: 5,
                  opacity: 0,
                }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -15,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'linear',
                }}
                className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
              >
                {placeholders[currentPlaceholder]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);

PlaceholdersAndVanishInput.displayName = 'PlaceholdersAndVanishInput';
