import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Globe, Users, Shield, Sun, Moon, LogIn, LogOut, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const PortalSwitcher: React.FC = () => {
  const { user, portal, setPortal, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0A0610]/90 backdrop-blur-md border-b border-gray-200 dark:border-purple-950/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C0F82] to-[#8B2FC9] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20">
            IN
          </div>
          <div>
            <span className="font-black text-lg tracking-tighter text-gray-900 dark:text-white flex items-center gap-1.5">
              INnovateAI <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-[#8B2FC9] border border-purple-500/20 font-semibold">Platform</span>
            </span>
          </div>
        </div>

        {/* Portal Switching Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-[#150A21] p-1 rounded-xl border border-gray-200 dark:border-purple-950">
          <button
            onClick={() => setPortal('public')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              portal === 'public'
                ? 'bg-[#5C0F82] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Public Website
          </button>
          <button
            onClick={async () => {
              if (!isAuthenticated) await login('member@innovate.ai');
              setPortal('member');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              portal === 'member'
                ? 'bg-[#5C0F82] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Member Portal
          </button>
          <button
            onClick={async () => {
              if (!isAuthenticated || user?.role === 'MEMBER') await login('superadmin@innovate.ai');
              setPortal('admin');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              portal === 'admin'
                ? 'bg-[#5C0F82] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Command Center
          </button>
        </div>

        {/* Theme Toggle & Auth / User Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-[#150A21] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-purple-900/30 transition-colors border border-gray-200 dark:border-purple-950"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#5C0F82]" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                  {user?.role} • {user?.points} pts
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} title="Sign Out">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => login('member@innovate.ai')}
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => login('superadmin@innovate.ai')}
                className="hidden sm:inline-flex"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Staff Access
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Portal Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-gray-50 dark:bg-[#0E0617] border-t border-gray-200 dark:border-purple-950 py-2 px-4">
        <button
          onClick={() => setPortal('public')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${portal === 'public' ? 'text-[#8B2FC9]' : 'text-gray-500'}`}
        >
          <Globe className="w-4 h-4" />
          Public
        </button>
        <button
          onClick={async () => {
            if (!isAuthenticated) await login('member@innovate.ai');
            setPortal('member');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${portal === 'member' ? 'text-[#8B2FC9]' : 'text-gray-500'}`}
        >
          <Users className="w-4 h-4" />
          Member
        </button>
        <button
          onClick={async () => {
            if (!isAuthenticated) await login('superadmin@innovate.ai');
            setPortal('admin');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${portal === 'admin' ? 'text-[#8B2FC9]' : 'text-gray-500'}`}
        >
          <Shield className="w-4 h-4" />
          Admin
        </button>
      </div>
    </header>
  );
};
