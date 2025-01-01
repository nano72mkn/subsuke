import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { SubscriptionForm } from "./SubscriptionForm";
import { useSubscriptions } from "./hooks/useSubscriptions";
import { subscriptionSchema, type SubscriptionSchemaType } from "./schema/subscriptionSchema";


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
      initialPaymentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = (values: SubscriptionSchemaType) => {
    console.log("on submit", values);
    addSubscription({
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
          登録する
        </Button>
      </form>
    </Form>
  );
};
