"use client";

import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  // Display the value as is, even if it's 0
  const displayValue = value.toString();
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-blue-600">{displayValue}</p>
    </div>
  );
};

export default MetricCard;
