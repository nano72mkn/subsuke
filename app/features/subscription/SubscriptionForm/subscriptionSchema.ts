import { z } from "zod";
import { billingCycle } from "~/config/billingCycle";
import { category } from "~/config/category";
import { currency } from "~/config/currency";

export const subscriptionSchema = z.object({
  name: z.string().min(1, "サービス名を入力してください").max(50),
  amount: z.number(),
  currency: z.enum(currency),
  billingCycle: z.enum(billingCycle),
  category: z.enum(category),
  nextPaymentDate: z.date(),
});

export type SubscriptionSchemaType = z.infer<typeof subscriptionSchema>;
