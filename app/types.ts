export type CalculateMonthlyTotal = {
  month: string;
  total: number;
  subscriptions: Array<{
    name: string;
    amount: number;
    isYearly: boolean;
  }>;
};
