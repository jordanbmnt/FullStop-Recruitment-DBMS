import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OverviewLoadingBlock } from "../overview_loading_block";

const monthlyUserStatsGenerator = (data) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const cleanedUpData = data.map(val => {
    return {
      ind: val.x.month - 1,
      month: monthNames[val.x.month - 1],
      users: val.y
    }
  }).filter(val => val.month);

  return cleanedUpData;
}

export const MonthlyChart = () => {
  const [monthlyUsers, setMonthlyUsers] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    try {
      setIsSearching(true);
      fetch(`/.netlify/functions/get_monthly_users_stats`).then(res => res.json()).then(value => {
        if (value && value.body.length > 0) {
          const fieldStats = value.body;
          setMonthlyUsers(monthlyUserStatsGenerator(fieldStats));
          setIsSearching(false);
        }
      });
      return;
    } catch (e) {
      setMonthlyUsers([]);
      setIsSearching(false);
      console.warn("Error:", e)
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isSearching ? (<OverviewLoadingBlock />) : (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-8">Monthly User Activity (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyUsers}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};