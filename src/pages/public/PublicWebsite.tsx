import React, { useState } from 'react';
import { PublicNavbar } from '../../components/navigation/PublicNavbar';
import { PublicFooter } from '../../components/navigation/PublicFooter';
import { PublicHome } from './PublicHome';
import { PublicAbout } from './PublicAbout';
import { PublicTeams } from './PublicTeams';
import { PublicTeamDetail } from './PublicTeamDetail';
import { PublicActivities } from './PublicActivities';
import { PublicActivityDetail } from './PublicActivityDetail';
import { PublicEvents } from './PublicEvents';
import { PublicLeaderboard } from './PublicLeaderboard';
import { PublicJoin } from './PublicJoin';
import { PublicContact } from './PublicContact';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const PublicWebsite: React.FC<{ onNavigatePortal: (portal: 'member' | 'admin') => void }> = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between transition-colors">
      {/* Dedicated Public Navigation */}
      <PublicNavbar currentRoute={currentRoute} onNavigate={(route) => {
        setSelectedId(null);
        setCurrentRoute(route);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentRoute === 'home' && <PublicHome onNavigate={(r) => { setCurrentRoute(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
        {currentRoute === 'about' && <PublicAbout onNavigate={(r) => { setCurrentRoute(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
        {currentRoute === 'teams' && (
          <PublicTeams
            onSelectTeam={(id) => {
              setSelectedId(id);
              setCurrentRoute('team-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {currentRoute === 'team-detail' && (
          <PublicTeamDetail
            teamId={selectedId || 'hr'}
            onBack={() => {
              setCurrentRoute('teams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onJoin={() => {
              setCurrentRoute('join');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentRoute === 'activities' && (
          <PublicActivities
            onSelectActivity={(id) => {
              setSelectedId(id);
              setCurrentRoute('activity-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {currentRoute === 'activity-detail' && (
          <PublicActivityDetail
            activityId={selectedId || 'act_pub_1'}
            onBack={() => {
              setCurrentRoute('activities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onJoinCommunity={() => {
              setCurrentRoute('join');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentRoute === 'events' && <PublicEvents />}
        {currentRoute === 'leaderboard' && <PublicLeaderboard />}
        {currentRoute === 'join' && <PublicJoin />}
        {currentRoute === 'contact' && <PublicContact />}
      </main>

      {/* Comprehensive Public Footer */}
      <PublicFooter onNavigate={(r) => { setCurrentRoute(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
};
