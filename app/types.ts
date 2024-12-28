export type Currency = 'JPY' | 'USD';
export type BillingCycle = 'monthly' | 'yearly';

export type Subscription = {
  id: string;
  name: string;
  nextPaymentDate: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
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
