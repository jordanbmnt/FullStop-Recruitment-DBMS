import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const StatCard = ({ title, value, growth, icon: Icon, format = 'number' }) => {
  const isPositive = growth > 0;
  const formattedValue = format === 'currency'
    ? `R${value.toLocaleString()}`
    : format === 'percentage'
      ? `${value}%`
      : value.toLocaleString();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formattedValue}</p>
        </div>
        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ml-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(growth)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
};