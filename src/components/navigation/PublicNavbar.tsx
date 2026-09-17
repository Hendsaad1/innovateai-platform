import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogIn, Menu, X, Sparkles, Shield, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { apiService } from '../../services/api';

interface PublicNavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ currentRoute, onNavigate }) => {
  const { user, portal, setPortal, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'about', label: 'About' },
    { id: 'teams', label: 'Teams' },
    { id: 'activities', label: 'Activities' },
    { id: 'events', label: 'Events' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0A0610]/80 backdrop-blur-md border-b border-gray-200 dark:border-purple-950/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#5C0F82] to-[#8B2FC9] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              IN
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tighter text-gray-900 dark:text-white flex items-center gap-1.5">
                INnovateAI
              </span>
              <span className="text-[10px] tracking-widest text-purple-600 dark:text-purple-400 font-bold uppercase">
                Community Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors relative py-1 ${
                  currentRoute === link.id
                    ? 'text-[#8B2FC9] font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {currentRoute === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B2FC9] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-[#150A21] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-purple-900/30 transition-colors border border-gray-200 dark:border-purple-950"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#5C0F82]" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPortal(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? 'admin' : 'member')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs font-bold text-gray-900 dark:text-white hover:bg-purple-500/20 transition-all"
                >
                  {user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' ? <Shield className="w-3.5 h-3.5 text-purple-400" /> : <User className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{portal === 'public' ? 'Open Portal' : 'Public View'}</span>
                </button>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-[#8B2FC9] transition-colors flex items-center gap-1.5 px-3 py-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                Member Login
              </button>
            )}

            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('join')}
            >
              Join Us
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#150A21] text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#5C0F82]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#150A21] text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#0D0715] border-b border-gray-200 dark:border-purple-950 px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-semibold py-2 ${currentRoute === link.id ? 'text-[#8B2FC9]' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-purple-950 flex flex-col gap-3">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    setLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-300 dark:border-purple-950 text-xs font-bold"
                >
                  <LogIn className="w-4 h-4" /> Member Login
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPortal(user?.role === 'SUPER_ADMIN' ? 'admin' : 'member');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-bold"
                >
                  Open Portal
                </button>
              )}
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  onNavigate('join');
                  setMobileMenuOpen(false);
                }}
              >
                Join Us
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal for Member / Staff entry */}
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} />
      )}
    </>
  );
};

function LoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.forgotPassword(email);
    } catch {}
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#150A21] border border-gray-200 dark:border-purple-900/50 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Authentication</span>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">
            {forgotMode ? 'Reset Password' : 'INnovateAI Login'}
          </h3>
          <p className="text-xs text-gray-500">
            {forgotMode
              ? 'Enter your email to receive a secure password reset link.'
              : 'Enter your credentials to access your member or staff dashboard.'}
          </p>
        </div>

        {forgotMode ? (
          forgotSuccess ? (
            <div className="space-y-4 py-4 text-center">
              <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-medium">
                If an account matches this email address, a secure password reset link has been dispatched.
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setForgotMode(false)}>
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button variant="outline" size="sm" type="button" onClick={() => setForgotMode(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Send Reset Link
                </Button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                required
                placeholder="member@innovate.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
                Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
