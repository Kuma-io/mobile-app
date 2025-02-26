export interface UserPosition {
  timestamp: string;
  userBalance: string;
  userPrincipal: string;
}

export interface Action {
  timestamp: string;
  action: string;
  amount: string;
}

export interface ChartData {
  timestamp: number;
  value: number;
}
