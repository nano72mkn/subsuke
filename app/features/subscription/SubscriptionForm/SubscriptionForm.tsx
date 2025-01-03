import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { categoryOptions } from "~/config/category";
import { cn } from "~/lib/utils";
import type { SubscriptionSchemaType } from "../schema/subscriptionSchema";

type Props = {
  control: Control<SubscriptionSchemaType>;
};

export const SubscriptionForm: FC<Props> = ({ control }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>サービス名</FormLabel>
            <FormControl>
              <Input placeholder="例）Netflix" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>金額</FormLabel>
            <FormControl>
              <Input placeholder="1000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>通貨</FormLabel>
            <FormControl>
              <RadioGroup
                name="currency"
                className="flex gap-4"
                onValueChange={field.onChange}
                defaultValue={field.value}>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="JPY" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    JPY (¥)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="USD" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    USD ($)
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="billingCycle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>支払いサイクル</FormLabel>
            <FormControl>
              <RadioGroup
                name="billingCycle"
                className="flex gap-4"
                onValueChange={field.onChange}
                defaultValue={field.value}>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="monthly" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    月払い
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="yearly" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    年払い
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>カテゴリー</FormLabel>
            <FormControl>
              <Select
                name="category"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="initialPaymentDate"
        render={({ field }) => (
          <FormItem className="grid">
            <FormLabel>初回支払日</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "yyyy-MM-dd")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={(selectDate) => selectDate && field.onChange({
                      target: {
                        value: format(selectDate, "yyyy-MM-dd"),
                        name: field.name,
                      },
                    })}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
