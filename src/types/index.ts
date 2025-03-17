
// User types
export type User = {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: Date;
  isEmailVerified: boolean;
};

// Group types
export type GroupMember = {
  id: string;
  userId: string;
  name: string;
  profilePicture?: string;
  selectedNumber: number | null;
  hasReceivedPot: boolean;
  joinedAt: Date;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  createdAt: Date;
  memberCount: number;
  maxMembers: number;
  contributionAmount: number;
  currency: string;
  cycleType: 'monthly' | 'weekly' | 'bi-weekly';
  nextDistributionDate: Date;
  numberPool: number[];
  members: GroupMember[];
  status: 'active' | 'completed' | 'paused';
  currentCycle: number;
};

// Distribution types
export type Distribution = {
  id: string;
  groupId: string;
  recipientId: string;
  amount: number;
  distributionDate: Date;
  cycle: number;
  status: 'pending' | 'completed';
};

// Notification types
export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
};
