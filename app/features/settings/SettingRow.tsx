import type { FC, ReactNode } from "react";

type Props = {
  label?: string;
  icon: any;
  children: ReactNode;
};

export const SettingRow: FC<Props> = ({ children, icon: Icon, label }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="flex items-center justify-center p-2 bg-gray-100 rounded-lg">
          <Icon size={16} />
        </span>
        {label && (<span className="text-sm">{label}</span>)}
      </div>
      {children}
    </div>
  );
};
