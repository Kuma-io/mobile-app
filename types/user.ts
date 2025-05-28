export interface User {
  id: number;
  wallet: string;
  email: string;
  createdAt: Date;
  lastConnectedAt: Date | null;
  notifications: boolean;
}

export interface UserPosition {
  id: number;
  userId: number;
  timestamp: string;
  vaultBalance: string;
  lastRecordedBalance: string;
  pendingYield: string;
  pendingFee: string;
  userBalance: string;
  userPrincipal: string;
  totalCollectedFees: string;
}

export type Action = "DEPOSIT" | "WITHDRAW" | "REWARDS";

export interface UserAction {
  id: number;
  userId: number;
  timestamp: string;
  action: Action;
  amount: string;
  status: string;
  error: string | null;
}
