import React, { useEffect, useState } from 'react';
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

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

function AppContent() {
  const [currentView, setCurrentView] = useState('aiAssistant');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const {
    isAuthenticated,
    loading
  } = useAuth();
  // Reset to login view if not authenticated
  useEffect(() => {
    // const location = useLocation();
    if (!loading && !isAuthenticated) {
      setCurrentView('login');
    }
  }, [isAuthenticated, loading]);

  const handleNavigate = (view: string,) => {
    setCurrentView(view);
  };

  const navigateToSignUp = () => {
    setCurrentView('signup');
  };
  const navigateToLogin = () => {
    setCurrentView('login');
  }

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
  }
  const navigateToRecipeManager = () => {
    setCurrentView('recipeManager');
  };
  const navigateToSettings = () => {
    setCurrentView('settings');
  };
  const navigateToAiAssistant = () => {
    setCurrentView('aiAssistant');
  }

  // Show loading screen while checking authentication
  if (loading) {
    return <Loading fullScreen />;
  }
  return <div className="w-full min-h-screen bg-linen">
    {/* Desktop Sidebar — hidden on mobile */}
    {currentView !== 'login' && currentView !== 'signup' && (
      <Sidebar activeView={currentView} onNavigate={handleNavigate} />
    )}

    {/* Main content area — offset for sidebar on desktop */}
    <div className={currentView !== 'login' && currentView !== 'signup' ? 'lg:pl-60' : ''}>
      {currentView === 'login' && <Login onLoginSuccess={navigateToHome} onSignUp={navigateToSignUp} />}
      {currentView === 'home' && isAuthenticated && <Home onLogin={navigateToLogin} onCookWithWhatIHave={navigateToAiAssistant} onViewCalendar={navigateToCalendar} onPantryInventory={navigateToPantryInventory} onShoppingList={navigateToShoppingList} onRecipeManager={navigateToRecipeManager} onSettings={navigateToSettings} />}
      {/* Keep chat mounted so streaming continues in the background when switching tabs */}
      {isAuthenticated && (
        <div
          className={currentView === 'aiAssistant' ? undefined : 'hidden'}
          aria-hidden={currentView !== 'aiAssistant'}
        >
          <AICookingAssistant
            isActive={currentView === 'aiAssistant'}
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
      {currentView === 'calendar' && isAuthenticated && <Calendar onBack={navigateToHome} />}
      {currentView === 'recipeManager' && isAuthenticated && (
        <RecipeManager
          onBack={navigateToHome}
          selectedRecipeId={selectedRecipeId}
          onSelectedRecipeHandled={() => setSelectedRecipeId(null)}
        />
      )}
      {currentView === 'settings' && isAuthenticated && <Settings onBack={navigateToHome} />}
      {currentView === 'pantryInventory' && isAuthenticated && <PantryInventory onBack={navigateToHome} />}
      {currentView === 'shoppingList' && isAuthenticated && <ShoppingList onBack={navigateToHome} />}
      {currentView === 'signup' && <SignUp onSignUpSuccess={navigateToHome} onLogin={navigateToLogin} />}
    </div>

    {/* Mobile BottomNav — hidden on desktop */}
    {currentView !== 'login' && currentView !== 'signup' && (
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