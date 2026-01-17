import {
  BarChart3,
  FileText,
  TrendingUp,
  Target,
  Settings,
} from 'lucide-react';

type Page = 'dashboard' | 'records' | 'statistics' | 'goals' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard' as Page, label: '概览', icon: BarChart3 },
  { id: 'records' as Page, label: '记录', icon: FileText },
  { id: 'statistics' as Page, label: '统计', icon: TrendingUp },
  { id: 'goals' as Page, label: '目标', icon: Target },
  { id: 'settings' as Page, label: '设置', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-rose-white dark:bg-dark-card border-r-2 border-pink-200 dark:border-dark-border p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-heading text-deep-rose dark:text-dark-rose flex items-center gap-2">
          <span className="text-3xl">🌸</span>
          Weight Logger
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? 'bg-pink-300 dark:bg-dark-pink text-rose-900 dark:text-dark-bg font-medium shadow-soft dark:shadow-dark'
                    : 'text-muted-plum dark:text-dark-textMuted hover:bg-pink-100 dark:hover:bg-dark-input hover:text-deep-rose dark:hover:text-dark-rose'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t-2 border-pink-200 dark:border-dark-border">
        <p className="text-xs text-muted-plum dark:text-dark-textMuted">
          唯美简约少女风
        </p>
      </div>
    </aside>
  );
}
