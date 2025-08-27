import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { STYLES } from "../../../constants/styles";

export const StatCard = ({ title, value, growth, icon: Icon, format = 'number' }) => {
  const isPositive = growth > 0;
  const formattedValue = format === 'currency'
    ? `R${value.toLocaleString()}`
    : format === 'percentage'
      ? `${value}%`
      : value.toLocaleString();

  return (
    <div className={`${STYLES.dark.background.secondary} backdrop-blur-sm rounded-xl shadow-lg border ${STYLES.dark.border.medium} p-6 hover:shadow-xl hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${STYLES.dark.text.secondary}`}>{title}</p>
          <p className={`text-2xl font-bold ${STYLES.dark.text.paragraph} mt-2`}>{formattedValue}</p>
        </div>
        <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icon className={`h-6 w-6 ${STYLES.dark.text.secondary}`} />
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
        <span className={`text-sm ${STYLES.dark.text.paragraph} ml-1`}>vs last month</span>
      </div>
    </div>
  );
};