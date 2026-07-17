import React, { useState } from 'react';
import {
  BotMessageSquare,
  HomeIcon,
  CalendarIcon,
  PackageIcon,
  UtensilsIcon,
  SettingsIcon,
  ShoppingCart,
  MoreHorizontal
} from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string, activeTabParam?: string) => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const [showMore, setShowMore] = useState(false);

  const primaryNav = [
    { pageId: 'home', icon: HomeIcon, label: 'Home' },
    { pageId: 'aiAssistant', icon: BotMessageSquare, label: 'AI Chat' },
    { pageId: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { pageId: 'pantryInventory', icon: PackageIcon, label: 'Pantry' }
  ];

  const secondaryNav = [
    { pageId: 'shoppingList', icon: ShoppingCart, label: 'Shopping' },
    { pageId: 'recipeManager', icon: UtensilsIcon, label: 'Recipes' },
    { pageId: 'settings', icon: SettingsIcon, label: 'Settings' }
  ];

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 bg-ink/20 lg:hidden" onClick={() => setShowMore(false)}>
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-56 bg-surface rounded-xl shadow-lg border border-line p-2"
            onClick={e => e.stopPropagation()}
          >
            {secondaryNav.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.pageId}
                  onClick={() => {
                    onNavigate(item.pageId);
                    setShowMore(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-sage/50 text-ink"
                >
                  <Icon size={18} className="mr-3 text-muted" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-linen border-t border-line z-50 lg:hidden">
        <div className="grid grid-cols-5 h-16 max-w-screen-lg mx-auto">
          {primaryNav.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.pageId;

            return (
              <button
                key={item.pageId}
                onClick={() => {
                  setShowMore(false);
                  onNavigate(item.pageId);
                }}
                className={`flex flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-herb' : 'text-muted hover:text-ink'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : ''} />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setShowMore(prev => !prev)}
            className={`flex flex-col items-center justify-center transition-colors ${
              showMore ? 'text-herb' : 'text-muted hover:text-ink'
            }`}
          >
            <MoreHorizontal size={20} />
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
