/**
 * Frontend API Client Service for INnovateAI REST API
 * Enforces frontend/backend separation.
 */

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message || `API error: ${res.status}`);
  }

  const data = await res.json();
  return data as T;
}

export const apiService = {
  getHealth: () => request<{ status: string; database: string; timestamp: string }>('/health'),
  
  // Auth
  login: (email: string, password?: string) => request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  forgotPassword: (email: string) => request<any>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  logout: () => request<any>('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request<any>('/auth/me'),

  // Teams
  getTeams: () => request<any[]>('/teams'),
  getTeamById: (id: string) => request<any>(`/teams/${id}`),

  // Activities
  getActivities: () => request<any[]>('/activities'),
  getActivityById: (id: string) => request<any>(`/activities/${id}`),

  // Events
  getEvents: () => request<any[]>('/events'),
  getEventById: (id: string) => request<any>(`/events/${id}`),
  registerEvent: (eventId: string, email: string) => request<any>(`/events/${eventId}/register`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Leaderboard
  getLeaderboard: () => request<any>('/leaderboard'),
  getLeaderboardConfig: (role?: string) => request<any>('/admin/settings/leaderboard', { headers: role ? { 'x-user-role': role } : undefined }),
  updateLeaderboardConfig: (topN: number, role?: string) => request<any>('/admin/settings/leaderboard', { method: 'PATCH', body: JSON.stringify({ top_n: topN }), headers: role ? { 'x-user-role': role } : undefined }),

  // Recruitment
  submitApplication: (payload: any) => request<any>('/recruitment/apply', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getApplications: () => request<any[]>('/admin/applications'),
  updateApplicationStatus: (id: string, status: string, notes?: string) => request<any>(`/admin/applications/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status, notes }),
  }),

  // Admin / Staff Modules
  getAdminStats: () => request<any>('/admin/stats'),
  getAdminUsers: () => request<any[]>('/admin/users'),
  assignRole: (userId: string, role: string, scope?: string) => request<any>(`/admin/users/${userId}/assign-role`, {
    method: 'POST',
    body: JSON.stringify({ role, scope }),
  }),
  endRole: (userId: string, role: string) => request<any>(`/admin/users/${userId}/end-role`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  }),
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'DISABLED') => request<any>(`/admin/users/${userId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  }),
  getAuditLogs: () => request<any[]>('/admin/audit-logs'),

  // Point Rules & Calculation Flow
  getPointRules: () => request<any[]>('/admin/point-rules'),
  createPointRule: (payload: any) => request<any>('/admin/point-rules', { method: 'POST', body: JSON.stringify(payload) }),
  updatePointRule: (ruleId: string, payload: any) => request<any>(`/admin/point-rules/${ruleId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  togglePointRule: (ruleId: string) => request<any>(`/admin/point-rules/${ruleId}/toggle`, { method: 'POST' }),

  // Tasks & Submissions
  getTasks: () => request<any[]>('/tasks'),
  createTask: (payload: any) => request<any>('/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  submitTask: (taskId: string, payload: any) => request<any>(`/tasks/${taskId}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  getSubmissions: () => request<any[]>('/admin/submissions'),
  approveSubmission: (subId: string, role?: string) => request<any>(`/admin/submissions/${subId}/approve`, { method: 'POST', headers: role ? { 'x-user-role': role } : undefined }),
  rejectSubmission: (subId: string, notes?: string) => request<any>(`/admin/submissions/${subId}/reject`, { method: 'POST', body: JSON.stringify({ notes }) }),

  // Point Ledger & Adjustments
  getMemberPointTransactions: (memberId: string) => request<any[]>(`/members/${memberId}/point-transactions`),
  adjustPoints: (memberId: string, points: number, reason: string) => request<any>(`/admin/members/${memberId}/adjust-points`, { method: 'POST', body: JSON.stringify({ points, reason }) }),

  // Supplementary API Contract Methods
  resetPassword: (payload: any) => request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  getApplicationStatus: (referenceCode: string) => request<any>(`/recruitment/status/${referenceCode}`),
  issueTicket: (payload: any) => request<any>('/tickets/issue', { method: 'POST', body: JSON.stringify(payload) }),
  getTicket: (code: string) => request<any>(`/tickets/${code}`),
  checkInAttendance: (payload: any, role?: string) => request<any>('/attendance/check-in', { method: 'POST', body: JSON.stringify(payload), headers: role ? { 'x-user-role': role } : undefined }),
  getAttendance: (role?: string) => request<any[]>('/attendance', { headers: role ? { 'x-user-role': role } : undefined }),
  getNotifications: () => request<any[]>('/notifications'),
  markNotificationRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => request<any>('/notifications/read-all', { method: 'POST' }),
  getAdminReport: (type: string, role?: string) => request<any>(`/admin/reports/${type}`, { headers: role ? { 'x-user-role': role } : undefined }),

  // Interview Scheduling & Google Calendar Integration
  scheduleInterview: (applicationId: string, payload: any) => request<any>(`/applications/${applicationId}/interview`, { method: 'POST', body: JSON.stringify(payload) }),
  getInterview: (applicationId: string) => request<any>(`/applications/${applicationId}/interview`),
  updateInterview: (applicationId: string, payload: any) => request<any>(`/applications/${applicationId}/interview`, { method: 'PATCH', body: JSON.stringify(payload) }),
  cancelInterview: (applicationId: string) => request<any>(`/applications/${applicationId}/interview/cancel`, { method: 'POST' }),

  // Public Event Registration & Ticket/QR Lifecycle (GAP-06)
  registerActivity: (activityId: string, payload: any) => request<any>(`/public/activities/${activityId}/registrations`, { method: 'POST', body: JSON.stringify(payload) }),
  getRegistration: (registrationId: string) => request<any>(`/public/registrations/${registrationId}`),
  checkInActivity: (activityId: string, payload: any, role?: string) => request<any>(`/activities/${activityId}/check-in`, { method: 'POST', body: JSON.stringify(payload), headers: role ? { 'x-user-role': role } : undefined }),
  getActivityRegistrations: (activityId: string, role?: string) => request<any>(`/admin/activities/${activityId}/registrations`, { headers: role ? { 'x-user-role': role } : undefined }),
};
