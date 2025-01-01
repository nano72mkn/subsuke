import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { toast } from "~/hooks/use-toast";
import { SubscriptionForm } from "./SubscriptionForm";
import { useSubscriptions } from "./hooks/useSubscriptions";
import { subscriptionSchema, type SubscriptionSchemaType } from "./schema/subscriptionSchema";


type Props = {
  subscription: SubscriptionSchemaType;
  onSubmitSuccess: () => void;
};

export const EditForm: FC<Props> = ({ subscription, onSubmitSuccess }) => {
  const { updateSubscription } = useSubscriptions();
  const form = useForm<SubscriptionSchemaType>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: subscription?.name ?? "",
      amount: subscription?.amount ?? 0,
      currency: subscription?.currency ?? "JPY",
      billingCycle: subscription?.billingCycle ?? "monthly",
      category: subscription?.category ?? "life",
      initialPaymentDate: subscription?.initialPaymentDate ?? format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = (values: SubscriptionSchemaType) => {
    if (!subscription?.id) {
      toast({
        description: "エラーが発生しました",
        variant: "destructive",
      });
      return;
    };
    updateSubscription(subscription.id, {
      name: values.name,
      amount: values.amount,
      currency: values.currency,
      billingCycle: values.billingCycle,
      category: values.category,
      initialPaymentDate: values.initialPaymentDate,
    });
    onSubmitSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SubscriptionForm control={form.control} />
        <Button type="submit" className="w-full mt-6">
          更新する
        </Button>
      </form>
    </Form>
  );
};
