import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartHeader } from "../../../components/chart_header";
import { STYLES } from "../../../constants/styles";

export const CategoryChart = ({ data }) => (
  <div className={`${STYLES.dark.background.secondary} backdrop-blur-sm rounded-xl shadow-lg border ${STYLES.dark.border.medium} p-6 hover:shadow-xl transition-all duration-300`}>
    <ChartHeader title={`Career Type Overview`} description={"Most common careers across all users"} badge={`Total: ${data.length}`} />

    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={0}
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex space-x-4 mt-4 m-w-max overflow-x-scroll scroll-px-50">
      {data.map((entry, index) => (
        <div key={index} className={`flex items-center justify-center min-w-max ${STYLES.dark.background.secondary} rounded-lg border border-gray-200 px-3 py-1 mb-4`}>
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm text-gray-400">{entry.name} ({entry.value.toFixed(2)}%)</span>
        </div>
      ))}
    </div>
  </div>
);