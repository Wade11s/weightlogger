import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-dark-card border-2 border-pink-200 dark:border-dark-border hover:bg-pink-100 dark:hover:bg-dark-bg transition-all duration-200 shadow-soft dark:shadow-dark"
      aria-label="切换主题"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-deep-rose dark:text-dark-rose" />
      ) : (
        <Sun className="w-5 h-5 text-deep-rose dark:text-dark-rose" />
      )}
    </button>
  );
}
