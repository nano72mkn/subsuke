interface PaymentDateOptions {
  initialPaymentDate: Date;
  currentDate?: Date;
  billingCycle?: 'monthly' | 'yearly';
}

/**
 * 初回支払日から次回の支払日を計算する関数
 * @param options PaymentDateOptions - 支払い設定オプション
 * @returns Date - 次回支払日
 */
export function calculateNextPaymentDate(options: PaymentDateOptions): Date {
  const {
    initialPaymentDate,
    currentDate = new Date(),
    billingCycle = 'monthly',
  } = options;

  // 初回支払日が未来の場合は、その日が次回支払日
  if (initialPaymentDate > currentDate) {
    return initialPaymentDate;
  }

  const nextPaymentDate = new Date(initialPaymentDate);
  const paymentDayOfMonth = initialPaymentDate.getDate(); // 初回支払日から支払日を取得
  
  if (billingCycle === 'monthly') {
    // 現在の日付以降になるまで月を進める
    while (nextPaymentDate <= currentDate) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      // 月末の日付調整（例：31日が存在しない月の場合）
      const month = nextPaymentDate.getMonth();
      nextPaymentDate.setDate(paymentDayOfMonth);
      
      // 日付指定により月が変わってしまった場合（月末を超えた場合）
      if (nextPaymentDate.getMonth() !== month) {
        // その月の最終日に設定
        nextPaymentDate.setDate(0);
      }
    }
  } else {
    // 年次支払いの場合
    while (nextPaymentDate <= currentDate) {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }
  }

  return nextPaymentDate;
}
