import {
  BotMessageSquare,
  HomeIcon,
  CalendarIcon,
  PackageIcon,
  UtensilsIcon,
  SettingsIcon,
  ShoppingCart,
  ChefHatIcon,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { pageId: 'home', icon: HomeIcon, label: 'Home' },
  { pageId: 'aiAssistant', icon: BotMessageSquare, label: 'AI Chat' },
  { pageId: 'calendar', icon: CalendarIcon, label: 'Calendar' },
  { pageId: 'pantryInventory', icon: PackageIcon, label: 'Pantry' },
  { pageId: 'shoppingList', icon: ShoppingCart, label: 'Shopping List' },
  { pageId: 'recipeManager', icon: UtensilsIcon, label: 'Recipes' },
  { pageId: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <ChefHatIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">ManageEat</h1>
            <p className="text-[11px] text-gray-400 leading-tight">Kitchen Planner</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.pageId;

          return (
            <button
              key={item.pageId}
              onClick={() => onNavigate(item.pageId)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 text-center">© 2026 ManageEat</p>
      </div>
    </aside>
  );
}
