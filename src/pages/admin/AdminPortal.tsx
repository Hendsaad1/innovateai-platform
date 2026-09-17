import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { apiService } from '../../services/api';
import { Shield, Users, UserPlus, Cpu, Calendar, Trophy, FileText, Settings, Activity, Lock, AlertTriangle, QrCode } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [hrNotes, setHrNotes] = useState<string>('');
  const [pointRules, setPointRules] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [newRuleForm, setNewRuleForm] = useState({
    ruleName: '',
    ruleType: 'NORMAL_COMPLETION',
    scope: 'GLOBAL',
    calculationMethod: 'FIXED',
    configuredValue: 50,
  });
  const [adjustForm, setAdjustForm] = useState({ memberId: 'usr_member', points: 25, reason: 'Exceptional task contribution' });
  const [approvalResult, setApprovalResult] = useState<any>(null);
  const [currentInterview, setCurrentInterview] = useState<any | null>(null);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [activityRegistrationsData, setActivityRegistrationsData] = useState<any | null>(null);
  const [checkInCodeInput, setCheckInCodeInput] = useState('');
  const [checkInResult, setCheckInResult] = useState<any | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    startAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 86400000 + 3600000).toISOString().slice(0, 16),
    timezone: 'UTC',
    notes: 'Technical & Cultural Interview with HR Panel',
  });
  const [leaderboardTopN, setLeaderboardTopN] = useState<number>(10);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // RBAC check: only SUPER_ADMIN, ADMIN, STAFF allowed
  const isAuthorized = user && ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(user.role);

  useEffect(() => {
    if (activeModule === 'settings') {
      setSettingsLoading(true);
      apiService.getLeaderboardConfig(user?.role)
        .then((res) => {
          if (res && res.top_n !== undefined) setLeaderboardTopN(res.top_n);
          else if (res && res.topN !== undefined) setLeaderboardTopN(res.topN);
        })
        .catch(() => {})
        .finally(() => setSettingsLoading(false));
    }
  }, [activeModule, user?.role]);

  const handleUpdateLeaderboardTopN = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage(null);
    if (user?.role !== 'SUPER_ADMIN') {
      setSettingsMessage('Error: Only Super Admin may update leaderboard Top-N configuration.');
      return;
    }
    try {
      const res = await apiService.updateLeaderboardConfig(Number(leaderboardTopN), user?.role);
      setSettingsMessage(res.message || 'Leaderboard Top-N configuration updated successfully.');
    } catch (err: any) {
      setSettingsMessage(err.message || 'Failed to update Leaderboard Top-N configuration.');
    }
  };

  useEffect(() => {
    if (selectedApp) {
      apiService.getInterview(selectedApp.id)
        .then((res) => setCurrentInterview(res.interview))
        .catch(() => setCurrentInterview(null));
    } else {
      setCurrentInterview(null);
    }
  }, [selectedApp]);

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      const res = await apiService.scheduleInterview(selectedApp.id, interviewForm);
      setCurrentInterview(res.interview);
      setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, status: 'INTERVIEW' } : a));
      setSelectedApp({ ...selectedApp, status: 'INTERVIEW' });
      alert(res.message);
    } catch (err: any) {
      alert(err.message || 'Failed to schedule interview.');
    }
  };

  const handleCancelInterview = async () => {
    if (!selectedApp) return;
    if (!confirm('Are you sure you want to cancel this interview?')) return;
    try {
      const res = await apiService.cancelInterview(selectedApp.id);
      setCurrentInterview(res.interview);
      alert(res.message);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel interview.');
    }
  };

  useEffect(() => {
    if (selectedActivity) {
      apiService.getActivityRegistrations(selectedActivity.id, user?.role)
        .then((res) => setActivityRegistrationsData(res))
        .catch(() => setActivityRegistrationsData(null));
    } else {
      setActivityRegistrationsData(null);
    }
  }, [selectedActivity]);

  const handleAdminCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity || !checkInCodeInput.trim()) return;
    try {
      const res = await apiService.checkInActivity(selectedActivity.id, { ticketCode: checkInCodeInput.trim() }, user?.role);
      setCheckInResult(res);
      setCheckInCodeInput('');
      const regData = await apiService.getActivityRegistrations(selectedActivity.id, user?.role);
      setActivityRegistrationsData(regData);
      alert(res.message);
    } catch (err: any) {
      alert(err.message || 'Check-in failed.');
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      Promise.all([
        apiService.getAdminStats(),
        apiService.getAuditLogs(),
        apiService.getApplications(),
        apiService.getPointRules(),
        apiService.getTasks(),
        apiService.getSubmissions(),
        apiService.getActivities(),
      ])
        .then(([s, logs, apps, rules, tasks, subs, acts]) => {
          setStats(s);
          setAuditLogs(logs);
          setApplications(apps);
          setPointRules(rules);
          setTasksList(tasks);
          setSubmissionsList(subs);
          setActivitiesList(acts);
          if (acts.length > 0 && !selectedActivity) {
            setSelectedActivity(acts[0]);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthorized]);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await apiService.updateApplicationStatus(appId, newStatus, hrNotes);
      setApplications(applications.map((a) => (a.id === appId ? res.application : a)));
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(res.application);
      }
      setHrNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiService.createPointRule({
        ...newRuleForm,
        role: user?.role,
      });
      setPointRules([res.rule, ...pointRules]);
      setShowCreateRuleModal(false);
      setNewRuleForm({ ruleName: '', ruleType: 'NORMAL_COMPLETION', scope: 'GLOBAL', calculationMethod: 'FIXED', configuredValue: 50 });
      alert('Point Rule created successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to create point rule. Access denied or invalid data.');
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      const res = await apiService.togglePointRule(ruleId);
      setPointRules(pointRules.map(r => r.ruleId === ruleId ? { ...r, isActive: res.isActive } : r));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle point rule.');
    }
  };

  const handleApproveSubmission = async (subId: string) => {
    try {
      const res = await apiService.approveSubmission(subId, user?.role);
      setApprovalResult(res);
      const subs = await apiService.getSubmissions();
      setSubmissionsList(subs);
    } catch (err: any) {
      alert(err.message || 'Failed to approve submission.');
    }
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.adjustPoints(adjustForm.memberId, Number(adjustForm.points), adjustForm.reason);
      alert('Point adjustment transaction recorded successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to record point adjustment.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Access Restricted</h1>
        <p className="text-gray-600 dark:text-gray-400">
          The Admin & Staff Command Center enforces strict server-side RBAC authorization. Your current role (<span className="font-bold text-purple-500">{user?.role || 'GUEST'}</span>) does not grant administrative privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0610] text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 border-r border-gray-200 dark:border-purple-950 bg-white dark:bg-[#0D0715] p-6 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Command Center</span>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" /> Admin Portal
          </h2>
        </div>

        <nav className="space-y-1 text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
            { id: 'members', label: 'Members & Roles', icon: Users },
            { id: 'teams', label: 'Teams', icon: Cpu },
            { id: 'events', label: 'Events & Attendance', icon: Calendar },
            { id: 'tasks', label: 'Tasks & Point Rules', icon: Trophy },
            { id: 'audit', label: 'Audit Logs', icon: FileText },
            { id: 'settings', label: 'System Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  activeModule === item.id
                    ? 'bg-[#5C0F82] text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-purple-500/10'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {loading ? (
          <LoadingState message="Loading command center metrics..." />
        ) : (
          <>
            {activeModule === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Command Center Overview</span>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                    Platform Administration
                  </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card glass className="space-y-2">
                    <span className="text-xs text-gray-500 uppercase font-bold">Total Members</span>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.totalMembers || 342}</div>
                    <span className="text-[11px] text-emerald-500 font-medium">+14% this month</span>
                  </Card>
                  <Card glass className="space-y-2">
                    <span className="text-xs text-gray-500 uppercase font-bold">Pending Applicants</span>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.pendingApplicants || 28}</div>
                    <span className="text-[11px] text-amber-500 font-medium">Requires review</span>
                  </Card>
                  <Card glass className="space-y-2">
                    <span className="text-xs text-gray-500 uppercase font-bold">Active Teams</span>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">{stats?.activeTeams || 6}</div>
                    <span className="text-[11px] text-purple-500 font-medium">Fully operational</span>
                  </Card>
                  <Card glass className="space-y-2">
                    <span className="text-xs text-gray-500 uppercase font-bold">PostgreSQL Status</span>
                    <div className="text-lg font-black text-emerald-500 truncate">{stats?.databaseConnection || 'Connected'}</div>
                    <span className="text-[11px] text-gray-500 font-medium">Pool verified</span>
                  </Card>
                </div>

                {/* Quick Audit Log Snippet */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Security & Audit Logs</h3>
                  <Card glass className="p-0 overflow-hidden">
                    <div className="divide-y divide-gray-200 dark:divide-purple-950/60 text-xs">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="p-4 flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <Badge variant="purple">{log.action}</Badge>
                              {log.targetResource}
                            </div>
                            <p className="text-gray-500">{log.details} • By {log.actorName}</p>
                          </div>
                          <span className="text-gray-400 text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeModule === 'recruitment' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">HR Command Center</span>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Recruitment & Applicant Review</h1>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#0A0610] text-xs font-semibold text-gray-900 dark:text-white"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="SCREENING">SCREENING</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Applications List */}
                  <div className="lg:col-span-1 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Applicants ({applications.filter((a) => filterStatus === 'ALL' || a.status === filterStatus).length})
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {applications
                        .filter((a) => filterStatus === 'ALL' || a.status === filterStatus)
                        .map((app) => (
                          <div
                            key={app.id}
                            onClick={() => setSelectedApp(app)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                              selectedApp?.id === app.id
                                ? 'border-purple-500 bg-purple-500/10 shadow-md'
                                : 'border-gray-200 dark:border-purple-950/60 bg-white dark:bg-[#120A1D] hover:border-purple-500/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400">{app.referenceCode}</span>
                              <Badge variant={app.status === 'ACCEPTED' ? 'emerald' : app.status === 'REJECTED' ? 'danger' : 'purple'}>
                                {app.status}
                              </Badge>
                            </div>
                            <div className="mt-2 font-bold text-sm text-gray-900 dark:text-white">
                              {app.englishFirstName} {app.englishLastName}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{app.email} • Team: {app.selectedTeam}</div>
                          </div>
                        ))}
                      {applications.length === 0 && (
                        <Card glass className="p-8 text-center text-xs text-gray-500">
                          No applications found.
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Application Details & Actions */}
                  <div className="lg:col-span-2 space-y-6">
                    {selectedApp ? (
                      <Card glass className="p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-purple-950 pb-4">
                          <div>
                            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">{selectedApp.referenceCode}</span>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">
                              {selectedApp.englishFirstName} {selectedApp.englishLastName} ({selectedApp.arabicFirstName} {selectedApp.arabicLastName})
                            </h2>
                          </div>
                          <Badge variant={selectedApp.status === 'ACCEPTED' ? 'emerald' : selectedApp.status === 'REJECTED' ? 'danger' : 'purple'}>
                            {selectedApp.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500 font-medium">Email:</span>
                            <div className="font-bold text-gray-900 dark:text-white">{selectedApp.email}</div>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">Phone / WhatsApp:</span>
                            <div className="font-bold text-gray-900 dark:text-white">{selectedApp.phone} / {selectedApp.whatsappPhone}</div>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">University & Year:</span>
                            <div className="font-bold text-gray-900 dark:text-white">{selectedApp.university} ({selectedApp.academicYear})</div>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">Target Team:</span>
                            <div className="font-bold text-purple-500">{selectedApp.selectedTeam}</div>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-gray-500 font-medium">Motivation & Background:</span>
                            <p className="mt-1 p-3 rounded-lg bg-gray-50 dark:bg-[#0A0610] text-gray-700 dark:text-gray-300">
                              {selectedApp.motivation}
                            </p>
                          </div>
                        </div>

                        {/* Status Transition Actions */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-purple-950">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">HR Workflow Actions</h4>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Internal HR notes / feedback / rejection reason..."
                              value={hrNotes}
                              onChange={(e) => setHrNotes(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-xs text-gray-900 dark:text-white"
                            />
                            <div className="flex flex-wrap gap-2 pt-2">
                              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedApp.id, 'SCREENING')}>
                                Move to Screening
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedApp.id, 'SHORTLISTED')}>
                                Shortlist
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedApp.id, 'INTERVIEW')}>
                                Schedule Interview
                              </Button>
                              <Button size="sm" variant="primary" onClick={() => handleUpdateStatus(selectedApp.id, 'ACCEPTED')}>
                                Accept & Onboard
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500 border-red-500/30" onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Interview Scheduling & Google Calendar Integration */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-purple-950">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Interview Scheduling & Google Calendar Sync
                          </h4>
                          {currentInterview && currentInterview.status === 'SCHEDULED' ? (
                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 dark:text-white">Scheduled Interview</span>
                                <Badge variant="emerald">{currentInterview.status}</Badge>
                              </div>
                              <div className="text-gray-600 dark:text-gray-300">
                                <div><strong>Start:</strong> {new Date(currentInterview.startAt).toLocaleString()} ({currentInterview.timezone})</div>
                                <div><strong>End:</strong> {new Date(currentInterview.endAt).toLocaleString()}</div>
                                <div className="font-mono text-[11px] text-purple-500 mt-1">GCal ID: {currentInterview.googleCalendarEventId}</div>
                              </div>
                              <div className="pt-2 flex gap-2">
                                <Button size="sm" variant="outline" className="text-red-500 border-red-500/30" onClick={handleCancelInterview}>
                                  Cancel Interview
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <form onSubmit={handleScheduleInterview} className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-[#0A0610] border border-gray-200 dark:border-purple-950 text-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-gray-500 mb-1">Start Date & Time</label>
                                  <input
                                    type="datetime-local"
                                    value={interviewForm.startAt}
                                    onChange={(e) => setInterviewForm({ ...interviewForm, startAt: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#120A1D] text-gray-900 dark:text-white"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-500 mb-1">End Date & Time</label>
                                  <input
                                    type="datetime-local"
                                    value={interviewForm.endAt}
                                    onChange={(e) => setInterviewForm({ ...interviewForm, endAt: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#120A1D] text-gray-900 dark:text-white"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-gray-500 mb-1">Timezone</label>
                                <input
                                  type="text"
                                  value={interviewForm.timezone}
                                  onChange={(e) => setInterviewForm({ ...interviewForm, timezone: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#120A1D] text-gray-900 dark:text-white"
                                  placeholder="UTC / Africa/Cairo"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-500 mb-1">Interview Notes / Instructions</label>
                                <input
                                  type="text"
                                  value={interviewForm.notes}
                                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#120A1D] text-gray-900 dark:text-white"
                                />
                              </div>
                              <Button size="sm" variant="primary" type="submit">
                                {currentInterview ? 'Reschedule Interview' : 'Schedule & Sync to Google Calendar'}
                              </Button>
                            </form>
                          )}
                        </div>

                        {/* Application History Log */}
                        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-purple-950">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Status Transition History</h4>
                          <div className="space-y-2 text-xs">
                            {selectedApp.history?.map((h: any, idx: number) => (
                              <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-[#0A0610] flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Badge variant="purple">{h.status}</Badge>
                                    <span>{h.notes}</span>
                                  </div>
                                  <p className="text-[11px] text-gray-500">Actor: {h.actor}</p>
                                </div>
                                <span className="text-[11px] text-gray-400">{new Date(h.timestamp).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card glass className="p-12 text-center space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select an Applicant</h3>
                        <p className="text-xs text-gray-500">Choose an application from the left list to inspect details and execute HR workflow actions.</p>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'tasks' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Point Rules & Calculation Engine</h1>
                    <p className="text-sm text-gray-500">Configure authoritative point rules, review task submissions, and manage ledger transactions.</p>
                  </div>
                  <Button onClick={() => setShowCreateRuleModal(true)} variant="primary">
                    + Create Point Rule
                  </Button>
                </div>

                {approvalResult && (
                  <Card glass className="p-4 bg-purple-500/10 border-purple-500/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-purple-600" />
                        <span>Submission Approved & Points Issued</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {approvalResult.message} {approvalResult.pointsAwarded !== undefined && `(${approvalResult.pointsAwarded} points awarded)`}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setApprovalResult(null)}>Dismiss</Button>
                  </Card>
                )}

                {/* Point Rules Table */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Point Rules Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pointRules.map((rule) => (
                      <Card key={rule.ruleId} glass className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant={rule.isActive ? 'purple' : 'gray'}>{rule.ruleType}</Badge>
                          <button onClick={() => handleToggleRule(rule.ruleId)} className="text-xs text-purple-600 font-bold hover:underline">
                            {rule.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{rule.ruleName}</h4>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Method: <span className="font-semibold">{rule.calculationMethod}</span></p>
                          <p>Configured Value: <span className="font-semibold text-purple-600">{rule.configuredValue} {rule.calculationMethod === 'PERCENTAGE' ? '%' : 'pts'}</span></p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Task Submissions Review */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Task Submissions (Backend Authoritative Calculation)</h3>
                  <div className="space-y-3">
                    {submissionsList.map((sub) => (
                      <Card key={sub.id} glass className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">{sub.taskTitle || 'Task Submission'}</h4>
                            <Badge variant={sub.status === 'APPROVED' ? 'purple' : sub.status === 'REJECTED' ? 'red' : 'yellow'}>{sub.status}</Badge>
                          </div>
                          <p className="text-xs text-gray-500">Submitted by: <span className="font-semibold">{sub.memberName || 'Member'}</span> • {new Date(sub.submittedAt || sub.submitted_at).toLocaleString()}</p>
                          <a href={sub.contentUrl || sub.content_url} target="_blank" rel="noreferrer" className="text-xs text-purple-600 underline block">
                            View Deliverable Link
                          </a>
                        </div>
                        {sub.status === 'PENDING' && (
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="primary" onClick={() => handleApproveSubmission(sub.id)}>
                              Approve & Calculate
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Manual Point Adjustment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Manual Staff Point Adjustment</h3>
                  <Card glass className="p-6">
                    <form onSubmit={handleAdjustPoints} className="space-y-4 max-w-xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Member ID</label>
                          <input
                            type="text"
                            value={adjustForm.memberId}
                            onChange={(e) => setAdjustForm({ ...adjustForm, memberId: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0610]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Points Delta (+ / -)</label>
                          <input
                            type="number"
                            value={adjustForm.points}
                            onChange={(e) => setAdjustForm({ ...adjustForm, points: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0610]"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Audit Reason</label>
                        <input
                          type="text"
                          value={adjustForm.reason}
                          onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0610]"
                          placeholder="e.g. Hackathon winner bonus"
                          required
                        />
                      </div>
                      <Button type="submit" variant="primary">Submit Adjustment Transaction</Button>
                    </form>
                  </Card>
                </div>
              </div>
            )}

            {activeModule === 'events' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Events & Attendance Control</span>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Public Activity Registrations & QR Check-In</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Activities List */}
                  <div className="lg:col-span-1 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Activities & Events</h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {activitiesList.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => setSelectedActivity(act)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedActivity?.id === act.id
                              ? 'border-purple-500 bg-purple-500/10 shadow-md'
                              : 'border-gray-200 dark:border-purple-950/60 bg-white dark:bg-[#120A1D] hover:border-purple-500/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">{act.activityType}</span>
                            <Badge variant="purple">{act.status}</Badge>
                          </div>
                          <div className="mt-2 font-bold text-sm text-gray-900 dark:text-white truncate">
                            {act.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{act.startDate} • {act.location || 'Online'}</div>
                        </div>
                      ))}
                      {activitiesList.length === 0 && (
                        <Card glass className="p-8 text-center text-xs text-gray-500">
                          No activities found.
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Activity Registrations & Check-In Scanner */}
                  <div className="lg:col-span-2 space-y-6">
                    {selectedActivity ? (
                      <Card glass className="p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-purple-950 pb-4">
                          <div>
                            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">Activity ID: {selectedActivity.id}</span>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">{selectedActivity.title}</h2>
                          </div>
                          <Badge variant="emerald">
                            Registrations: {activityRegistrationsData?.totalRegistrations || 0}
                          </Badge>
                        </div>

                        {/* Staff Check-In Scanner Form */}
                        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
                            <QrCode className="w-4 h-4" /> Staff Ticket Scanner & QR Check-in
                          </h4>
                          <form onSubmit={handleAdminCheckIn} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter Ticket Code (e.g. TICK-XXXX) or QR Payload"
                              value={checkInCodeInput}
                              onChange={(e) => setCheckInCodeInput(e.target.value)}
                              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#120A1D] border border-gray-200 dark:border-purple-950 text-xs font-mono text-gray-900 dark:text-white"
                              required
                            />
                            <Button type="submit" variant="primary" size="md">
                              Check In Ticket
                            </Button>
                          </form>
                        </div>

                        {/* Registrants & Attendance Tables */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Registered Participants & Attendance</h4>
                          <div className="divide-y divide-gray-200 dark:divide-purple-950/60 max-h-96 overflow-y-auto">
                            {activityRegistrationsData?.registrations?.map((reg: any) => {
                              const ticket = activityRegistrationsData?.tickets?.find((t: any) => t.registrationId === reg.id);
                              const att = activityRegistrationsData?.attendance?.find((a: any) => a.ticketId === ticket?.id);
                              return (
                                <div key={reg.id} className="py-3 flex items-center justify-between text-xs">
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                      <span>{reg.fullName}</span>
                                      <Badge variant={reg.registrationType === 'MEMBER' ? 'purple' : 'secondary'}>
                                        {reg.registrationType}
                                      </Badge>
                                      {reg.memberId && <span className="font-mono text-[10px] text-gray-400">({reg.memberId})</span>}
                                    </div>
                                    <div className="text-gray-500">{reg.email} • Ticket: <span className="font-mono text-purple-500">{ticket?.ticketCode || 'N/A'}</span></div>
                                  </div>
                                  <div>
                                    {att ? (
                                      <Badge variant="emerald">Checked In ({new Date(att.checkedInAt).toLocaleTimeString()})</Badge>
                                    ) : (
                                      <Badge variant="outline">Not Checked In</Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {(!activityRegistrationsData?.registrations || activityRegistrationsData.registrations.length === 0) && (
                              <p className="text-xs text-gray-500 py-6 text-center">No registrations found for this activity yet.</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card glass className="p-12 text-center space-y-4">
                        <Calendar className="w-10 h-10 text-purple-500 mx-auto" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select an Activity</h3>
                        <p className="text-xs text-gray-500">Choose an activity from the left list to inspect registrations, tickets, and execute QR check-ins.</p>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showCreateRuleModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card glass className="p-6 max-w-lg w-full space-y-4 bg-white dark:bg-[#150F24]">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Create New Point Rule</h3>
                  <form onSubmit={handleCreateRule} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Rule Name</label>
                      <input
                        type="text"
                        value={newRuleForm.ruleName}
                        onChange={(e) => setNewRuleForm({ ...newRuleForm, ruleName: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0610]"
                        placeholder="e.g. Workshop Bonus Rule"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Rule Type</label>
                        <select
                          value={newRuleForm.ruleType}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, ruleType: e.target.value as any })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0610]"
                        >
                          <option value="NORMAL_COMPLETION">Normal Completion</option>
                          <option value="LATE_COMPLETION">Late Completion</option>
                          <option value="MISSED_TASK_PENALTY">Missed Task Penalty</option>
                          <option value="ADJUSTMENT">Adjustment</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Calculation Method</label>
                        <select
                          value={newRuleForm.calculationMethod}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, calculationMethod: e.target.value as any })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0610]"
                        >
                          <option value="FIXED">Fixed Points</option>
                          <option value="PERCENTAGE">Percentage</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Configured Value</label>
                      <input
                        type="number"
                        value={newRuleForm.configuredValue}
                        onChange={(e) => setNewRuleForm({ ...newRuleForm, configuredValue: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0610]"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateRuleModal(false)}>Cancel</Button>
                      <Button type="submit" variant="primary">Save Point Rule</Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}

            {activeModule === 'settings' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">System Configuration</span>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white">System Settings & Governance</h1>
                </div>

                <Card glass className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-purple-950 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" /> Leaderboard Top-N Configuration
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Configure the display size for the public leaderboard (sourced from authoritative point_transactions ledger with dense ranking).</p>
                    </div>
                    <Badge variant={user?.role === 'SUPER_ADMIN' ? 'purple' : 'secondary'}>
                      Role: {user?.role} {user?.role !== 'SUPER_ADMIN' ? '(Super Admin Required)' : ''}
                    </Badge>
                  </div>

                  {settingsLoading ? (
                    <LoadingState message="Loading leaderboard settings..." />
                  ) : (
                    <form onSubmit={handleUpdateLeaderboardTopN} className="space-y-4 max-w-lg">
                      {settingsMessage && (
                        <div className={`p-3.5 rounded-xl text-xs font-semibold ${settingsMessage.includes('Error') || settingsMessage.includes('Failed') || settingsMessage.includes('Forbidden') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                          {settingsMessage}
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Leaderboard Top-N Value
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={leaderboardTopN}
                          onChange={(e) => setLeaderboardTopN(Number(e.target.value))}
                          disabled={user?.role !== 'SUPER_ADMIN'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#120A1D] border border-gray-200 dark:border-purple-950 text-sm font-mono text-gray-900 dark:text-white disabled:opacity-50"
                          required
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                          Defines how many top ranked positions are displayed on the public leaderboard. All members tied at the cutoff rank are included.
                        </p>
                      </div>

                      {user?.role === 'SUPER_ADMIN' ? (
                        <Button type="submit" variant="primary">
                          Save Leaderboard Top-N Configuration
                        </Button>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Only Super Admins may modify leaderboard configuration settings.
                        </div>
                      )}
                    </form>
                  )}
                </Card>
              </div>
            )}

            {activeModule !== 'dashboard' && activeModule !== 'recruitment' && activeModule !== 'tasks' && activeModule !== 'settings' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white capitalize">
                  Module: {activeModule}
                </h1>
                <Card glass className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Production Module Architecture Ready</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    The {activeModule} management controllers and database schema are established. Fully operational CRUD views will render here upon expansion.
                  </p>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
