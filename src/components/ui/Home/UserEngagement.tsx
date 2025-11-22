import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserEngagement = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 10 + i);

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Dummy data for User Engagement
  const dummyChartData = [
    { month: "January", orderCount: 120, userCount: 200 },
    { month: "February", orderCount: 150, userCount: 220 },
    { month: "March", orderCount: 180, userCount: 250 },
    { month: "April", orderCount: 200, userCount: 300 },
    { month: "May", orderCount: 230, userCount: 320 },
    { month: "June", orderCount: 190, userCount: 280 },
    { month: "July", orderCount: 250, userCount: 340 },
    { month: "August", orderCount: 270, userCount: 360 },
    { month: "September", orderCount: 210, userCount: 310 },
    { month: "October", orderCount: 300, userCount: 400 },
    { month: "November", orderCount: 260, userCount: 350 },
    { month: "December", orderCount: 310, userCount: 420 },
  ];

  const chartData = dummyChartData;

  return (
    <div className="bg-white p-5 w-[100%] h-[300px] rounded-2xl border">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold">User Engagement</h2>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded-md px-3 py-2 w-32 cursor-pointer"
            style={{
              maxHeight: "150px",
              overflowY: "scroll",
            }}
          >
            {years
              .slice()
              .reverse()
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={(month) => month.slice(0, 3)} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />
          <Line
            type="monotone"
            dataKey="orderCount"
            stroke="#8b0000"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="userCount" stroke="#5c2579cc" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserEngagement;