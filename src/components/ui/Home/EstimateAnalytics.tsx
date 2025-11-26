import { useState, useMemo } from "react";
import { useTotalEstimatesQuery } from "@/redux/apiSlices/dashboardSlice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EstimateAnalytics = () => {
  const currentYear = new Date().getFullYear();

  // default: current year
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // dynamic year list: previous 4 years + current + next 1 year
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear - 4; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  }, [currentYear]);

  const { data: totalEstimates } = useTotalEstimatesQuery({ year: selectedYear });
  console.log("Total Estimates", totalEstimates);

  const chartData =
    totalEstimates?.data?.data?.map((item: { label: string; total: number }) => ({
      name: item.label,
      price: item.total,
    })) || [];

  return (
    <div
      style={{ width: "100%", height: 350 }}
      className="px-5 py-3 bg-white rounded-2xl"
    >
      <div className="flex justify-between items-center">
        <h4 className="mb-5 mt-4 text-xl font-semibold">Estimate Analytics</h4>

        <select
          className="w-32 p-2 border border-gray-300 rounded-md"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9800" stopOpacity={1} />
              <stop offset="100%" stopColor="#FF9800" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#FF9800"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EstimateAnalytics;
