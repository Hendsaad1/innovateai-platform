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
  getLeaderboard: () => request<any[]>('/leaderboard'),

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
};
