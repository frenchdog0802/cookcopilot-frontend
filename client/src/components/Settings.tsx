import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { ArrowLeftIcon, UserIcon, PaletteIcon, SaveIcon } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('light');
  const [units, setUnits] = useState('imperial');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleSave = () => {
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const tabClass = (tab: string) =>
    activeTab === tab
      ? 'border-b-2 border-herb text-herb'
      : 'text-muted hover:text-ink';

  return (
    <div className="flex flex-col w-full min-h-screen bg-linen">
      <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-sage/50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon size={22} />
          </button>
          <h1 className="page-title animate-fade-in">Settings</h1>
        </div>

        <main className="flex-1 max-w-3xl mx-auto w-full px-6 lg:px-8 pb-6">
          <div className="border-b border-line">
            <div className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium flex items-center ${tabClass('profile')}`}
                onClick={() => setActiveTab('profile')}
              >
                <UserIcon size={18} className="mr-2" />
                Profile
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium flex items-center ${tabClass('preferences')}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferences
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium flex items-center ${tabClass('appearance')}`}
                onClick={() => setActiveTab('appearance')}
              >
                <PaletteIcon size={18} className="mr-2" />
                Appearance
              </button>
            </div>
          </div>

          <div className="py-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold text-ink mb-4">Profile Information</h2>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center">
                  <SaveIcon size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold text-ink mb-4">Measurement Units</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input id="imperial" name="units" type="radio" checked={units === 'imperial'} onChange={() => setUnits('imperial')} className="h-4 w-4 text-herb border-line" />
                    <label htmlFor="imperial" className="ml-3 block text-sm font-medium text-ink">Imperial (oz, lb, cups)</label>
                  </div>
                  <div className="flex items-center">
                    <input id="metric" name="units" type="radio" checked={units === 'metric'} onChange={() => setUnits('metric')} className="h-4 w-4 text-herb border-line" />
                    <label htmlFor="metric" className="ml-3 block text-sm font-medium text-ink">Metric (g, kg, ml)</label>
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center">
                  <SaveIcon size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-semibold text-ink mb-4">Theme Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input id="light" name="theme" type="radio" checked={theme === 'light'} onChange={() => setTheme('light')} className="h-4 w-4 text-herb border-line" />
                    <label htmlFor="light" className="ml-3 block text-sm font-medium text-ink">Light Mode</label>
                  </div>
                  <div className="flex items-center">
                    <input id="dark" name="theme" type="radio" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="h-4 w-4 text-herb border-line" />
                    <label htmlFor="dark" className="ml-3 block text-sm font-medium text-ink">Dark Mode</label>
                  </div>
                  <div className="flex items-center">
                    <input id="system" name="theme" type="radio" checked={theme === 'system'} onChange={() => setTheme('system')} className="h-4 w-4 text-herb border-line" />
                    <label htmlFor="system" className="ml-3 block text-sm font-medium text-ink">System Default</label>
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center">
                  <SaveIcon size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-line text-center">
            <button onClick={logout} className="btn-secondary px-6 py-3">
              Sign Out
            </button>
          </div>

          {showSaveMessage && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-sage text-herb-deep px-6 py-3 rounded-lg shadow-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Changes saved successfully!
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
