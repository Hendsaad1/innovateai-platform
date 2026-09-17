export type Role =
  | 'VISITOR'
  | 'APPLICANT'
  | 'MEMBER'
  | 'HR_MEMBER'
  | 'HR_HEAD'
  | 'HR_VICE_HEAD'
  | 'TEAM_HEAD'
  | 'TEAM_VICE_HEAD'
  | 'ACTIVITY_MANAGER'
  | 'CHECK_IN_STAFF'
  | 'COMMUNITY_MANAGER'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'STAFF'
  | 'GUEST';

export interface User {
  id: string;
  email: string;
  role: Role;
  accountStatus: 'ACTIVE' | 'DISABLED' | 'PENDING';
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  title?: string;
  points: number;
  rank: number;
  teamId?: string;
  roles?: { role: Role; status: 'ACTIVE' | 'ENDED'; assignedAt: string; endedAt?: string }[];
  currentAssignments?: { teamId?: string; activityId?: string; scope: string }[];
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description: string;
  leadId: string;
  leadName?: string;
  memberCount: number;
  category: 'AI_RESEARCH' | 'ENGINEERING' | 'PRODUCT' | 'COMMUNITY' | 'DESIGN';
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  enrolledCount: number;
  status: 'DRAFT' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  speaker: string;
  capacity: number;
  registeredCount: number;
  category: string;
}

export interface Applicant {
  applicantId: string;
  email: string;
  arabicFirstName: string;
  arabicLastName: string;
  englishFirstName: string;
  englishLastName: string;
  phone: string;
  whatsappPhone: string;
  nationalId: string;
  university: string;
  academicYear: string;
  address: string;
  arabicAddress: string;
  linkedin?: string;
  motivation: string;
  status: 'SUBMITTED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedToId?: string;
  assignedToName?: string;
  pointsValue: number;
  pointRuleType: 'FIXED' | 'PERCENTAGE';
  dueDate: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface SubmissionItem {
  id: string;
  taskId: string;
  taskTitle?: string;
  memberId: string;
  memberName?: string;
  contentUrl: string;
  notes: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  awardedPoints?: number;
  submittedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  memberId: string;
  memberName: string;
  avatarUrl?: string;
  teamName?: string;
  points: number;
  achievementsCount: number;
}

export interface PointRuleItem {
  ruleId: string;
  ruleName: string;
  ruleType: 'NORMAL_COMPLETION' | 'LATE_COMPLETION' | 'MISSED_TASK_PENALTY' | 'ADJUSTMENT';
  scope: string;
  calculationMethod: 'FIXED' | 'PERCENTAGE';
  configuredValue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PointTransactionItem {
  id: string;
  memberId: string;
  taskId?: string;
  submissionId?: string;
  transactionType: 'EARNED' | 'PENALTY' | 'ADJUSTMENT';
  points: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface NotificationItem {

  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'REWARD';
  read: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
