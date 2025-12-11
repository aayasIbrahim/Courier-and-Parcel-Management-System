import React from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode; // Optional icon
  color?: string; // Tailwind color class e.g., "bg-blue-500"
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`p-4 rounded shadow flex items-center ${color || "bg-white"}`}>
      {icon && <div className="mr-3">{icon}</div>}
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
