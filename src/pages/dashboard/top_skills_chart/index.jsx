import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopSkillsChart = ({ data = [] }) => {
  // Sample data for demonstration
  const sampleData = [
    { skill: "JavaScript", count: 25 },
    { skill: "React", count: 20 },
    { skill: "Node.js", count: 18 },
    { skill: "Python", count: 15 },
    { skill: "CSS", count: 14 },
    { skill: "HTML", count: 12 },
    { skill: "Git", count: 11 },
    { skill: "SQL", count: 10 },
    { skill: "Java", count: 9 },
    { skill: "TypeScript", count: 8 },
    { skill: "AWS", count: 7 },
    { skill: "Docker", count: 6 },
    { skill: "MongoDB", count: 5 },
    { skill: "Express.js", count: 4 },
    { skill: "GraphQL", count: 3 }
  ];

  const chartData = data.length > 0 ? data : sampleData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">
            {`Users: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Top Skills by Frequency
        </h3>
        <p className="text-sm text-gray-600">
          Most common skills across all users
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="skill"
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
            stroke="#666"
          />
          <YAxis
            fontSize={12}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSkillsChart;