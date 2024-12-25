import type { Subscription } from '@/types/subscription';
import { addMonths, addYears, isBefore, isSameMonth } from 'date-fns';

export const getNextPaymentDate = (subscription: Subscription, fromDate: Date = new Date()) => {
  const { startDate, paymentDate, cycle } = subscription;
  let baseDate = new Date(startDate);
  baseDate.setDate(paymentDate);

  while (isBefore(baseDate, fromDate)) {
    if (cycle === "monthly") {
      baseDate = addMonths(baseDate, 1);
    } else {
      baseDate = addYears(baseDate, 1);
    }
  }
  return baseDate;
};

export const calculateMonthlyPayments = (targetDate: Date, subscriptions: Subscription[]) => {
  return subscriptions.reduce((acc, sub) => {
    const nextPaymentDate = getNextPaymentDate(sub, targetDate);
    
    if (isSameMonth(nextPaymentDate, targetDate)) {
      return acc + (sub.cycle === "yearly" ? sub.price : sub.price);
    }
    return acc;
  }, 0);
};
