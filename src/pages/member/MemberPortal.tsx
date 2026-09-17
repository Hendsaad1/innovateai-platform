import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Trophy, CheckSquare, Activity, Award, User, Bell, Users, FileText } from 'lucide-react';

export const MemberPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'tasks' | 'points' | 'achievements' | 'notifications'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0610] text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
      {/* Member Sidebar */}
      <aside className="w-full md:w-64 border-r border-gray-200 dark:border-purple-950 bg-white dark:bg-[#0D0715] p-6 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Community Space</span>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">Member Portal</h2>
        </div>

        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-[#5C0F82] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-purple-500/10'}`}
          >
            <Activity className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'profile' ? 'bg-[#5C0F82] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-purple-500/10'}`}
          >
            <User className="w-4 h-4" /> My Profile
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'tasks' ? 'bg-[#5C0F82] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-purple-500/10'}`}
          >
            <CheckSquare className="w-4 h-4" /> My Tasks
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'points' ? 'bg-[#5C0F82] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-purple-500/10'}`}
          >
            <Trophy className="w-4 h-4" /> Points & History
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'achievements' ? 'bg-[#5C0F82] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-purple-500/10'}`}
          >
            <Award className="w-4 h-4" /> Achievements
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'notifications' ? 'bg-[#5C0F82] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-purple-500/10'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </nav>
      </aside>

      {/* Main Member Content */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Welcome Back</span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <Card glass className="px-4 py-2 flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Points</div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">{user?.points || 740} pts</div>
                  </div>
                </Card>
                <Card glass className="px-4 py-2 flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Community Rank</div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">#{user?.rank || 14}</div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card glass className="space-y-3">
                <Badge variant="purple">Task Progress</Badge>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">3 Active Tasks</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Next milestone due in 48 hours for Generative AI Research.</p>
              </Card>

              <Card glass className="space-y-3">
                <Badge variant="success">Event Participation</Badge>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">2 Seminars Enrolled</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Next session: Next-Gen LLM Agents on March 25.</p>
              </Card>

              <Card glass className="space-y-3">
                <Badge variant="warning">Community Goal</Badge>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">84% Cohort Milestone</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Overall research lab progress toward Q2 deliverables.</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Member Profile</h2>
            <Card glass className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block">Full Name</span>
                  <span className="font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Email Address</span>
                  <span className="font-bold text-gray-900 dark:text-white">{user?.email}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Assigned Role</span>
                  <Badge variant="purple">{user?.role}</Badge>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Title</span>
                  <span className="font-bold text-gray-900 dark:text-white">{user?.title || 'Research Associate'}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
            <EmptyState
              title="No Pending Task Assignments"
              description="You have successfully cleared all current tasks. New assignments will appear here when issued by your team lead."
              actionLabel="Explore Community Board"
              onAction={() => {}}
            />
          </div>
        )}

        {activeTab === 'points' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Points & Transaction History</h2>
            <Card glass className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-purple-950 pb-3 text-sm">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">LLM Fine-Tuning Deliverable</div>
                  <div className="text-xs text-gray-500">Fixed Point Rule Awarded</div>
                </div>
                <span className="font-black text-emerald-500">+150 pts</span>
              </div>
              <div className="flex items-center justify-between pb-1 text-sm">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Weekly Research Seminar Attendance</div>
                  <div className="text-xs text-gray-500">Attendance Verification</div>
                </div>
                <span className="font-black text-emerald-500">+50 pts</span>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements & Badges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card glass className="text-center space-y-3 p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">First SOTA Commit</h3>
                <p className="text-xs text-gray-500">Awarded for merging the initial transformer attention optimization module.</p>
              </Card>
              <Card glass className="text-center space-y-3 p-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Top 10 Leaderboard</h3>
                <p className="text-xs text-gray-500">Achieved rank #3 during the Q1 evaluation cycle.</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            <Card glass className="p-6 space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-purple-950">
                <Bell className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Recruitment Interview Scheduled</div>
                  <p className="text-xs text-gray-500 mt-1">Your interview has been synchronized with Google Calendar by Admin staff.</p>
                  <span className="text-[10px] text-purple-400 mt-2 block">2 hours ago</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
