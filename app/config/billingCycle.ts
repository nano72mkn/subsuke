export const billingCycle = ['monthly', 'yearly'] as const;
export type BillingCycleType = typeof billingCycle[number];

export const billingCycleOptions: {
  id: BillingCycleType,
  label: string
}[] = [
  { id: 'monthly', label: '月額' },
  { id: 'yearly', label: '年額' },
];
