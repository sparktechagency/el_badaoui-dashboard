import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 8 },
  { name: "Mar", value: 16 },
  { name: "Apr", value: 25 },
  { name: "May", value: 25 },
  { name: "Jun", value: 10 },
  { name: "Jul", value: 18 },
  { name: "Aug", value: 27 },
  { name: "Sep", value: 32 },
  { name: "Oct", value: 20 },
  { name: "Nov", value: 10 },
  { name: "Dec", value: 5 },
];

const ActivityChart = () => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#007BA5" fill="#99cadb" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;