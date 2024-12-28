import type { BillingCycle } from "~/types";

export const billingCycleOptions: {
  id: BillingCycle,
  label: string
}[] = [
  { id: 'monthly', label: '月額' },
  { id: 'yearly', label: '年額' },
];
