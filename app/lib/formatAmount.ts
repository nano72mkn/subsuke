import type { Currency } from "~/types";

export const formatAmount = (amount: number, currency: Currency) => {
  if (currency === 'JPY') {
    return `¥${Math.round(amount).toLocaleString()}`;
  } else {
    return `$${amount.toFixed(2)}`;
  }
};
