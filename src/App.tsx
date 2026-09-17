/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalSwitcher } from './components/navigation/PortalSwitcher';
import { PublicWebsite } from './pages/public/PublicWebsite';
import { MemberPortal } from './pages/member/MemberPortal';
import { AdminPortal } from './pages/admin/AdminPortal';

function MainContent() {
  const { portal, setPortal } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0A0610] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {portal !== 'public' && <PortalSwitcher />}
      <div className="flex-1">
        {portal === 'public' && <PublicWebsite onNavigatePortal={setPortal} />}
        {portal === 'member' && <MemberPortal />}
        {portal === 'admin' && <AdminPortal />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
