import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { apiService } from '../services/api';

type PortalType = 'public' | 'member' | 'admin';

interface AuthContextType {
  user: User | null;
  portal: PortalType;
  setPortal: (portal: PortalType) => void;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  portal: 'public',
  setPortal: () => {},
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('innovate_ai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [portal, setPortal] = useState<PortalType>(() => {
    const saved = localStorage.getItem('innovate_ai_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'COMMUNITY_MANAGER', 'HR_HEAD', 'TEAM_HEAD', 'ACTIVITY_MANAGER'].includes(u.role)) {
          return 'admin';
        }
        if (u) return 'member';
      } catch {}
    }
    return 'public';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('innovate_ai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('innovate_ai_user');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    try {
      const res = await apiService.login(email, password);
      const authUser: User = res.user;
      
      if (authUser.accountStatus === 'DISABLED') {
        throw new Error('Account disabled. Access denied.');
      }

      setUser(authUser);
      if (['SUPER_ADMIN', 'ADMIN', 'STAFF', 'COMMUNITY_MANAGER', 'HR_HEAD', 'HR_VICE_HEAD', 'TEAM_HEAD', 'TEAM_VICE_HEAD', 'ACTIVITY_MANAGER', 'CHECK_IN_STAFF'].includes(authUser.role)) {
        setPortal('admin');
      } else {
        setPortal('member');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setPortal('public');
    localStorage.removeItem('innovate_ai_user');
    apiService.logout().catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        portal,
        setPortal,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
