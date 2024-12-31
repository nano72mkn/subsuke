export const currency = ['USD', 'JPY'] as const;
export type CurrencyType = typeof currency[number];

export const currencyOptions: {
  id: CurrencyType,
  label: string
}[] = [
  { id: 'USD', label: 'USD ($)' },
  { id: 'JPY', label: 'JPY (¥)' },
];
