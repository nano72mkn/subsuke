import type { BillingCycleType } from "./config/billingCycle";
import type { CurrencyType } from "./config/currency";

export type Subscription = {
  id: string;
  name: string;
  nextPaymentDate: string;
  amount: number;
  currency: CurrencyType;
  billingCycle: BillingCycleType;
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
