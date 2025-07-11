import React, { useEffect, useState } from 'react';
import { OverviewLoadingBlock } from './overview_loading_block';
import { MonthlyChart } from './monthly_chart';
import { CategoryChart } from './category_chart';
import { TopSkillsChart } from './top_skills_chart';
import { SearchBar } from './search_bar';

const categoryDataGenerator = (applicantData) => {
  // Object to store the counts of each field
  const fieldCounts = {};
  let countOfFields = 0;

  // Iterate through the applicant data to count occurrences of each field
  applicantData.forEach(applicant => {
    const field = applicant._id;
    if (field) { // Ensure field is not null or undefined
      fieldCounts[field] = applicant.count;
      countOfFields += applicant.count;
    }
  });

  // Generate distinct colors for each category
  // This simple color generation aims for variety but might not be perfectly distinct for many categories.
  // For more sophisticated color schemes, a dedicated color library might be used.
  const generateColor = (index) => {
    const hue = (index * 137.508) % 360; // Use golden angle approximation for even distribution
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Convert the fieldCounts object into the desired array format
  const formattedData = Object.keys(fieldCounts).map((field, index) => {
    return {
      name: field,
      value: ((fieldCounts[field] / countOfFields).toFixed(2) * 100),
      count: fieldCounts[field],
      color: generateColor(index)
    };
  }).sort((a, b) => {
    return b.value - a.value
  });

  return formattedData;
}

// Main Dashboard Component
export const Dashboard = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    try {
      fetch(`/.netlify/functions/get_fields?occurrence=true`).then(res => res.json()).then(value => {
        if (value && value.body.length > 0) {
          const fieldStats = categoryDataGenerator(value.body);
          setCategoryData(fieldStats);
        }
      });
      return;
    } catch (e) {
      console.warn("Error:", e)
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <SearchBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Charts Grid - Column on mobile, Tile view on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <MonthlyChart />
          {
            categoryData.length > 0 ?
              <CategoryChart data={categoryData} /> :
              <OverviewLoadingBlock />
          }
        </div>

        {/* Bottom Section - Column on mobile, Tile view on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-3">
            {/* Performance Metrics */}
            <TopSkillsChart />
          </div>
        </div>
      </div>
    </div>
  );
};