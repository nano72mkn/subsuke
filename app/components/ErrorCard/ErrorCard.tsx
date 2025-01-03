import type { FC } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type Props = {
  title: string;
  description: string;
}

export const ErrorCard: FC<Props> = ({ title, description }) => {
  return (
    <Card className="bg-red-50 border-red-600 text-red-600">
      <CardHeader>
        <CardTitle>{ title }</CardTitle>
        <CardDescription>
          { description }
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
