import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Home } from './components/Home';
import { Calendar } from './components/Calendar';
import { PantryInventory } from './components/PantryInventory';
import { ShoppingList } from './components/ShoppingList';
import { RecipeManager } from './components/RecipeManager';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Settings } from './components/Settings';
import { Loading } from './components/Loading';
import { PantryProvider } from './contexts/pantryContext';
import { AuthProvider, useAuth } from './contexts/authContext';
import { AICookingAssistant } from './components/AICookingAssistant';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { MarketingLanding } from './components/MarketingLanding';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const GUEST_VIEWS = new Set(['landing', 'login', 'signup']);
const KEEP_ALIVE_VIEWS = [
  'home',
  'aiAssistant',
  'calendar',
  'recipeManager',
  'pantryInventory',
  'shoppingList',
  'settings',
] as const;

function AppContent() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('aiAssistant');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [pendingAiPrompt, setPendingAiPrompt] = useState<string | null>(null);
  const [visitedViews, setVisitedViews] = useState<Set<string>>(() => new Set(['aiAssistant']));
  const [subscriptionNotice, setSubscriptionNotice] = useState<'success' | 'cancelled' | null>(null);
  const {
    isAuthenticated,
    initializing,
    redirectError,
  } = useAuth();

  useEffect(() => {
    if (initializing) return;

    const params = new URLSearchParams(window.location.search);
    const subscriptionParam = params.get('subscription');
    if (subscriptionParam === 'success' || subscriptionParam === 'cancelled') {
      setSubscriptionNotice(subscriptionParam);
      if (isAuthenticated) {
        setCurrentView('settings');
      }
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (redirectError) {
      setCurrentView('login');
      return;
    }

    if (!isAuthenticated) {
      setCurrentView((prev) => (GUEST_VIEWS.has(prev) ? prev : 'landing'));
      return;
    }

    setCurrentView((prev) =>
      prev === 'landing' || prev === 'login' || prev === 'signup' ? 'aiAssistant' : prev,
    );
  }, [isAuthenticated, initializing, redirectError]);

  useEffect(() => {
    if (!isAuthenticated || GUEST_VIEWS.has(currentView)) return;
    setVisitedViews((prev) => {
      if (prev.has(currentView)) return prev;
      const next = new Set(prev);
      next.add(currentView);
      return next;
    });
  }, [currentView, isAuthenticated]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const navigateToSignUp = () => {
    setCurrentView('signup');
  };
  const navigateToLogin = () => {
    setCurrentView('login');
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };
  const navigateToCalendar = () => {
    setCurrentView('calendar');
  };

  const navigateToPantryInventory = () => {
    setCurrentView('pantryInventory');
  };

  const navigateToShoppingList = () => {
    setCurrentView('shoppingList');
  };
  const navigateToRecipeManager = () => {
    setCurrentView('recipeManager');
  };
  const navigateToSettings = () => {
    setCurrentView('settings');
  };
  const navigateToAiAssistant = (prompt?: string) => {
    if (typeof prompt === 'string' && prompt.trim()) {
      setPendingAiPrompt(prompt);
    }
    setCurrentView('aiAssistant');
  };
  const askAiFromHome = () => {
    navigateToAiAssistant(t('ai.emptyPrompts.cook'));
  };

  // Show loading screen while checking authentication
  if (initializing) {
    return <Loading fullScreen />;
  }
  const isGuestView = GUEST_VIEWS.has(currentView);

  const showKeepAlive = (view: (typeof KEEP_ALIVE_VIEWS)[number]) =>
    isAuthenticated && visitedViews.has(view);

  return <div className="w-full min-h-screen bg-linen">
    {/* Desktop Sidebar — hidden on mobile */}
    {!isGuestView && (
      <Sidebar activeView={currentView} onNavigate={handleNavigate} />
    )}

    {/* Main content area — offset for sidebar on desktop */}
    <div className={!isGuestView ? 'lg:pl-60' : ''}>
      {currentView === 'landing' && (
        <MarketingLanding onGetStarted={navigateToSignUp} onLogin={navigateToLogin} />
      )}
      {currentView === 'login' && (
        <Login
          onLoginSuccess={navigateToAiAssistant}
          onSignUp={navigateToSignUp}
        />
      )}
      {/* Keep visited tabs mounted so switching back is instant (no remount/refetch flash). */}
      {showKeepAlive('home') && (
        <div className={currentView === 'home' ? undefined : 'hidden'} aria-hidden={currentView !== 'home'}>
          <Home
            onLogin={navigateToLogin}
            onCookWithWhatIHave={askAiFromHome}
            onViewCalendar={navigateToCalendar}
            onPantryInventory={navigateToPantryInventory}
            onShoppingList={navigateToShoppingList}
            onRecipeManager={navigateToRecipeManager}
            onSettings={navigateToSettings}
          />
        </div>
      )}
      {showKeepAlive('aiAssistant') && (
        <div
          className={currentView === 'aiAssistant' ? undefined : 'hidden'}
          aria-hidden={currentView !== 'aiAssistant'}
        >
          <AICookingAssistant
            isActive={currentView === 'aiAssistant'}
            pendingPrompt={pendingAiPrompt}
            onPendingPromptConsumed={() => setPendingAiPrompt(null)}
            onBack={navigateToHome}
            onViewRecipe={(recipeId) => {
              setSelectedRecipeId(recipeId);
              setCurrentView('recipeManager');
            }}
            onViewShoppingList={navigateToShoppingList}
            onViewCalendar={navigateToCalendar}
            onViewPantry={navigateToPantryInventory}
          />
        </div>
      )}
      {showKeepAlive('calendar') && (
        <div className={currentView === 'calendar' ? undefined : 'hidden'} aria-hidden={currentView !== 'calendar'}>
          <Calendar onBack={navigateToHome} onAskAi={navigateToAiAssistant} />
        </div>
      )}
      {showKeepAlive('recipeManager') && (
        <div
          className={currentView === 'recipeManager' ? undefined : 'hidden'}
          aria-hidden={currentView !== 'recipeManager'}
        >
          <RecipeManager
            onBack={navigateToHome}
            onAskAi={navigateToAiAssistant}
            selectedRecipeId={selectedRecipeId}
            onSelectedRecipeHandled={() => setSelectedRecipeId(null)}
          />
        </div>
      )}
      {showKeepAlive('settings') && (
        <div className={currentView === 'settings' ? undefined : 'hidden'} aria-hidden={currentView !== 'settings'}>
          <Settings
            onBack={navigateToHome}
            checkoutSuccess={subscriptionNotice === 'success'}
            checkoutCancelled={subscriptionNotice === 'cancelled'}
          />
        </div>
      )}
      {showKeepAlive('pantryInventory') && (
        <div
          className={currentView === 'pantryInventory' ? undefined : 'hidden'}
          aria-hidden={currentView !== 'pantryInventory'}
        >
          <PantryInventory onBack={navigateToHome} onAskAi={navigateToAiAssistant} />
        </div>
      )}
      {showKeepAlive('shoppingList') && (
        <div
          className={currentView === 'shoppingList' ? undefined : 'hidden'}
          aria-hidden={currentView !== 'shoppingList'}
        >
          <ShoppingList onBack={navigateToHome} onAskAi={navigateToAiAssistant} />
        </div>
      )}
      {currentView === 'signup' && (
        <SignUp onSignUpSuccess={navigateToAiAssistant} onLogin={navigateToLogin} />
      )}
    </div>

    {/* Mobile BottomNav — hidden on desktop */}
    {!isGuestView && (
      <BottomNav activeView={currentView} onNavigate={handleNavigate} />
    )}
  </div>;
}
export function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <PantryProvider>
          <AppContent />
        </PantryProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
