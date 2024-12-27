import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Subsuke" },
    { name: "description", content: "サブスク管理サイト - Subsuke（サブスケ）" },
  ];
};

export default function Index() {
  return (
    <div></div>
  );
}
