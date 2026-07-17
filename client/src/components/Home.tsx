import React, { useEffect } from 'react';
import {
  ChefHatIcon,
  CalendarIcon,
  ClipboardListIcon,
  PackageIcon,
  ShoppingCartIcon,
  UtensilsIcon,
  SettingsIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { usePantry } from '../contexts/pantryContext';
import { useAuth } from '../contexts/authContext';

interface HomeProps {
  onCookWithWhatIHave: () => void;
  onViewCalendar: () => void;
  onPantryInventory: () => void;
  onShoppingList: () => void;
  onRecipeManager: () => void;
  onSettings: () => void;
  onLogin: () => void;
}

export function Home({
  onCookWithWhatIHave,
  onViewCalendar,
  onPantryInventory,
  onShoppingList,
  onRecipeManager,
  onSettings,
  onLogin,
}: HomeProps) {
  const {
    shoppingList,
    pantryItems,
    fetchAllPantryItems,
    fetchAllShoppingListItems
  } = usePantry();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) {
      onLogin();
    }
    fetchAllPantryItems();
    fetchAllShoppingListItems();
  }, [user]);

  const itemsToBuy = shoppingList.filter(item => !item.checked).length;

  if (loading) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-linen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-line border-t-herb"></div>
        <p className="mt-4 text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-linen pb-20 lg:pb-0">
      {/* Mobile top bar ??settings only; brand lives in hero */}
      <div className="lg:hidden flex justify-end px-6 py-3">
        <button
          onClick={onSettings}
          className="p-2 rounded-lg text-muted hover:text-ink hover:bg-sage/50 transition-colors"
          aria-label="Settings"
        >
          <SettingsIcon size={22} />
        </button>
      </div>

      {/* Hero composition */}
      <section className="relative w-full min-h-[52vh] lg:min-h-[58vh] flex flex-col">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80"
            alt="Fresh ingredients on a kitchen counter"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-linen via-linen/80 to-linen/30" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 max-w-6xl mx-auto w-full px-6 lg:px-8 pt-8 lg:pt-16 pb-8 justify-end">
          <div className="animate-fade-up">
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-ink tracking-tight">
              CookPlanner
            </h1>
            <p className="mt-3 text-lg lg:text-xl text-ink/80 max-w-md">
              Plan dinner from what&apos;s already in your kitchen
            </p>
            {user && (
              <p className="mt-1 text-sm text-muted">
                Welcome back, {user.name}
              </p>
            )}
          </div>

          <div className="mt-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <button
              onClick={onCookWithWhatIHave}
              className="btn-primary flex items-center gap-2 text-base px-8 py-4"
            >
              <ChefHatIcon size={22} />
              Cook with what I have
            </button>
          </div>
        </div>
      </section>

      {/* Below the fold ??quiet links, no card grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted mb-8">
          <span>{pantryItems.length} items in pantry</span>
          <span className="text-line">|</span>
          <span>{itemsToBuy} items to buy</span>
        </div>

        <nav className="divide-y divide-line">
          <button
            onClick={onViewCalendar}
            className="w-full flex items-center justify-between py-4 text-left group"
          >
            <div className="flex items-center gap-3">
              <CalendarIcon size={20} className="text-herb" />
              <div>
                <span className="font-medium text-ink group-hover:text-herb transition-colors">Plan your meals</span>
                <p className="text-sm text-muted">Schedule dishes on your calendar</p>
              </div>
            </div>
            <ArrowRightIcon size={18} className="text-muted group-hover:text-herb transition-colors" />
          </button>

          <button
            onClick={onPantryInventory}
            className="w-full flex items-center justify-between py-4 text-left group"
          >
            <div className="flex items-center gap-3">
              <PackageIcon size={20} className="text-herb" />
              <div>
                <span className="font-medium text-ink group-hover:text-herb transition-colors">Pantry</span>
                <p className="text-sm text-muted">{pantryItems.length} ingredients tracked</p>
              </div>
            </div>
            <ArrowRightIcon size={18} className="text-muted group-hover:text-herb transition-colors" />
          </button>

          <button
            onClick={onShoppingList}
            className="w-full flex items-center justify-between py-4 text-left group"
          >
            <div className="flex items-center gap-3">
              <ShoppingCartIcon size={20} className="text-herb" />
              <div>
                <span className="font-medium text-ink group-hover:text-herb transition-colors">Shopping list</span>
                <p className="text-sm text-muted">{itemsToBuy} items to buy</p>
              </div>
            </div>
            <ArrowRightIcon size={18} className="text-muted group-hover:text-herb transition-colors" />
          </button>

          <button
            onClick={onRecipeManager}
            className="w-full flex items-center justify-between py-4 text-left group"
          >
            <div className="flex items-center gap-3">
              <UtensilsIcon size={20} className="text-herb" />
              <div>
                <span className="font-medium text-ink group-hover:text-herb transition-colors">Recipes</span>
                <p className="text-sm text-muted">Manage your recipe collection</p>
              </div>
            </div>
            <ArrowRightIcon size={18} className="text-muted group-hover:text-herb transition-colors" />
          </button>
        </nav>
      </main>
    </div>
  );
}
