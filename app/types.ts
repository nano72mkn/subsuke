export type Currency = 'JPY' | 'USD';

export type Subscription = {
  id: string;
  name: string;
  nextPaymentDate: string;
  amount: number;
  currency: Currency;
  billingCycle: 'monthly' | 'yearly';
  category: string;
};

export type CalculateMonthlyTotal = {
  month: string;
  total: number;
  subscriptions: Array<{
    name: string;
    amount: number;
    isYearly: boolean;
  }>;
};
