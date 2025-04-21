"use client";

interface MetricCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
}

export default function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
