import React from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode; // Optional icon
  color?: string; // Tailwind color e.g., "bg-blue-500", "bg-green-500"
  bgColor?: string; // Card background
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = "bg-blue-500",
  bgColor = "bg-white",
}) => {
  return (
    <div
      className={`${bgColor} p-4 sm:p-6 rounded-xl shadow-md flex items-center justify-between transition-transform transform hover:-translate-y-1 hover:shadow-xl`}
    >
      {/* Left: Icon */}
      {icon && (
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>
      )}

      {/* Right: Metric Info */}
      <div className={`ml-3 flex-1`}>
        <h3 className="text-xs sm:text-sm text-gray-500 font-medium uppercase">
          {title}
        </h3>
        <p className="mt-1 text-lg sm:text-2xl font-bold text-gray-800 truncate">
          {value}
        </p>
      </div>
    </div>
  );
};

export default MetricCard;
