import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, MonitorIcon, CheckIcon } from './icons';

type ThemePreference = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme-preference') as ThemePreference) || 'system';
}

export default function ThemeSelector() {
  const [preference, setPreference] = useState<ThemePreference | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initialize from localStorage after hydration
    setPreference(getStoredPreference());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentPref = getStoredPreference();
      if (currentPref === 'system') {
        document.documentElement.setAttribute('data-theme', getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newPreference: ThemePreference) => {
    const theme = newPreference === 'system' ? getSystemTheme() : newPreference;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', newPreference);
    setPreference(newPreference);
    setIsOpen(false);
  };

  // Don't render until hydrated to avoid mismatch
  if (preference === null) {
    return (
      <div className="btn btn-ghost btn-circle">
        <MonitorIcon className="h-5 w-5" />
      </div>
    );
  }

  const CurrentIcon = preference === 'light' ? SunIcon : preference === 'dark' ? MoonIcon : MonitorIcon;

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        aria-label="Theme selector"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CurrentIcon className="h-5 w-5" />
      </div>
      {isOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-200 rounded-box z-[1] w-36 p-2 shadow-lg mt-2"
        >
          <li>
            <button onClick={() => applyTheme('light')} className="flex items-center gap-2">
              <SunIcon className="h-4 w-4" />
              Light
              {preference === 'light' && (
                <span className="ml-auto">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          </li>
          <li>
            <button onClick={() => applyTheme('dark')} className="flex items-center gap-2">
              <MoonIcon className="h-4 w-4" />
              Dark
              {preference === 'dark' && (
                <span className="ml-auto">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          </li>
          <li>
            <button onClick={() => applyTheme('system')} className="flex items-center gap-2">
              <MonitorIcon className="h-4 w-4" />
              System
              {preference === 'system' && (
                <span className="ml-auto">
                  <CheckIcon className="h-4 w-4" />
                </span>
              )}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
