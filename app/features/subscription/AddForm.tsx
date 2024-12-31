import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { useSubscriptions } from "~/hooks/useSubscriptions";
import { SubscriptionForm } from "./SubscriptionForm";
import { subscriptionSchema, type SubscriptionSchemaType } from "./SubscriptionForm/subscriptionSchema";


type Props = {
  onSubmitSuccess: () => void;
};

export const AddForm: FC<Props> = ({ onSubmitSuccess }) => {
  const { addSubscription } = useSubscriptions();
  const form = useForm<SubscriptionSchemaType>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      currency: "JPY",
      billingCycle: "monthly",
      category: "life",
      nextPaymentDate: new Date(),
    },
  });

  const onSubmit = (values: SubscriptionSchemaType) => {
    addSubscription({
      name: values.name,
      amount: values.amount,
      currency: values.currency,
      billingCycle: values.billingCycle,
      category: values.category,
      nextPaymentDate: format(values.nextPaymentDate, "yyyy-MM-dd"),
    });
    onSubmitSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SubscriptionForm control={form.control} />
      </form>
    </Form>
  );
};
