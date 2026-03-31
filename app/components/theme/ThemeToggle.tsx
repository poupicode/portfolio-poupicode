'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        color: 'var(--foreground)',
        backdropFilter: 'blur(12px)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '16px',
      }}
    >
      {theme === 'dark' ? '○' : '●'}
    </button>
  );
}
