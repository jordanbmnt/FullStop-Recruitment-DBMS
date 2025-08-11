import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OverviewLoadingBlock } from '../overview_loading_block';
import { ChartHeader } from '../../../components/chart_header';
import { CustomTooltip } from '../../../components/custom_tooltip';

export const TopSkillsChart = () => {

  const [topSkills, setTopSkills] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    try {
      setIsSearching(true);
      fetch(`/.netlify/functions/get_top_skills`).then(res => res.json()).then(value => {
        if (value && value.body.length > 0) {
          const skillsStats = value.body;
          setTopSkills(skillsStats);
          setIsSearching(false);
        }
      });
      return;
    } catch (e) {
      setTopSkills([]);
      setIsSearching(false);
      console.warn("Error:", e)
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isSearching ? (<OverviewLoadingBlock />) : (
    //TODO: the padding bottom is not dynamic
    <div className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl h-[460px] pb-20">
      <ChartHeader title={"Top Skills by Frequency"} description={"Most common skills across all users"} />

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topSkills}
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
            fill="#a10808"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};