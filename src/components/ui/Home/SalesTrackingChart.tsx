import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    month: "Jan",
    earnings: 4000,
    profit: 2400,
  },
  {
    month: "Feb",
    earnings: 3000,
    profit: 1398,
  },
  {
    month: "Mar",
    earnings: 2000,
    profit: 9800,
  },
  {
    month: "Apr",
    earnings: 2780,
    profit: 3908,
  },
  {
    month: "May",
    earnings: 1890,
    profit: 4800,
  },
  {
    month: "Jun",
    earnings: 2390,
    profit: 3800,
  },
  {
    month: "Jul",
    earnings: 3490,
    profit: 4300,
  },
  {
    month: "Aug",
    earnings: 4500,
    profit: 5500,
  },
  {
    month: "Sep",
    earnings: 4300,
    profit: 6200,
  },
  {
    month: "Oct",
    earnings: 5100,
    profit: 7000,
  },
  {
    month: "Nov",
    earnings: 5900,
    profit: 7800,
  },
  {
    month: "Dec",
    earnings: 6700,
    profit: 8600,
  },
];

const SalesTrackingChart = () => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="earnings"
          fill="#6DBD44"
          barSize={20}
          radius={[20, 20, 0, 0]}
        />
        <Bar
          dataKey="profit"
          fill="#6CA0DC"
          barSize={20}
          radius={[20, 20, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesTrackingChart;
