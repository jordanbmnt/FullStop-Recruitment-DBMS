import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OverviewLoadingBlock } from "../overview_loading_block";
import { ChartHeader } from "../../../components/chart_header";
import { CustomTooltip } from "../../../components/custom_tooltip";
import { STYLES } from "../../../constants/styles";

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
          const monthlyStats = value.body;
          setMonthlyUsers(monthlyUserStatsGenerator(monthlyStats));
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
    <div className={`${STYLES.dark.background.secondary} backdrop-blur-sm rounded-xl shadow-lg border ${STYLES.dark.border.medium} p-6 hover:shadow-xl transition-all duration-300`}>
      <ChartHeader title={"Monthly User Activity (Last 6 Months)"} description={"Users that joined or updated their information in the last 6 months"} />

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyUsers}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="users"
            stroke={STYLES.dark.accent.color}
            strokeWidth={3}
            dot={{ fill: STYLES.dark.accent.color, strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};