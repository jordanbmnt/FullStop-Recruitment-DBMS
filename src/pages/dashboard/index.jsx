import React, { useEffect, useState } from 'react';
import { OverviewLoadingBlock } from './overview_loading_block';
import { MonthlyChart } from './monthly_chart';
import { CategoryChart } from './category_chart';
import { TopSkillsChart } from './top_skills_chart';
import { SearchBar } from './search_bar';

const categoryDataGenerator = (applicantData) => {
  const fieldCounts = {};
  const baseColor = { r: 237, g: 11, b: 11 }; // TODO: Create Variable in STYLES
  let countOfFields = 0;

  applicantData.forEach(applicant => {
    const field = applicant._id;
    if (field) { 
      fieldCounts[field] = applicant.count;
      countOfFields += applicant.count;
    }
  });

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;

      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      // eslint-disable-next-line default-case
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const rgbToCss = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`;

  const generateColor = (index) => {
    const [h, s, l] = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
    const lightnessChange = 10 * index; // change lightness by 8% per step
    let newL = l - lightnessChange;
    if (newL > 70) newL = 70;
    if (newL < 10) newL = 10;
    const rgb = hslToRgb(h, s, newL);
    return rgbToCss(rgb);
  };

  const formattedData = Object.keys(fieldCounts).sort((a, b) => {
    return fieldCounts[b] - fieldCounts[a]
  }).map((field) => {
    return {
      name: field,
      value: ((fieldCounts[field] / countOfFields).toFixed(2) * 100),
      count: fieldCounts[field],
      color: generateColor(fieldCounts[field])
    };
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