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
  { name: "Jan", price: 4000 },
  { name: "Feb", price: 3000 },
  { name: "Mar", price: 2000 },
  { name: "Apr", price: 2780 },
  { name: "May", price: 1890 },
  { name: "Jun", price: 2390 },
  { name: "Jul", price: 3490 },
  { name: "Aug", price: 2490 },
  { name: "Sep", price: 1490 },
  { name: "Oct", price: 4490 },
  { name: "Nov", price: 3490 },
  { name: "Dec", price: 1490 },
];

const EstimateAnalytics = () => {
  return (
    <div
      style={{ width: "100%", height: 350 }}
      className="px-5 py-3 bg-white rounded-2xl"
    >
      <h4 className="mb-5 mt-4 text-xl font-semibold">Estimate Statistics</h4>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
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
