import { z } from "zod";
import { billingCycle } from "~/config/billingCycle";
import { category } from "~/config/category";
import { currency } from "~/config/currency";

export const subscriptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "サービス名を入力してください").max(50),
  amount: z.preprocess((v) => Number(v), z.number()),
  currency: z.enum(currency),
  billingCycle: z.enum(billingCycle),
  category: z.enum(category),
  initialPaymentDate: z.string(),
  nextPaymentDate: z.string().optional(),

});

export type SubscriptionSchemaType = z.infer<typeof subscriptionSchema>;
