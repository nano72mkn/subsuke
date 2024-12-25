export type Subscription = {
  id: number;
  name: string;
  price: number;
  cycle: "monthly" | "yearly";
  category: string;
  paymentDate: number;
  startDate: Date;
};
