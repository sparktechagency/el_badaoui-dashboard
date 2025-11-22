
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", uv: 4000 },
  { name: "Feb", uv: 3000 },
  { name: "Mar", uv: 4000 },
  { name: "Apr", uv: 2780 },
  { name: "May", uv: 1890 },
  { name: "Jun", uv: 2390 },
  { name: "Jul", uv: 3490 },
  { name: "Aug", uv: 1490 },
  { name: "Sep", uv: 3490 },
  { name: "Oct", uv: 3490 },
  { name: "Nov", uv: 3490 },
  { name: "Dec", uv: 3490 },
];

const SoldFertilizerStatistics = () => {
  return (
    <div
      style={{ width: "100%", height: 300 }}
      className="px-5 bg-white rounded-2xl py-3"
    >
      <h4 className="mb-5 text-xl font-semibold mt-4">
        Sold Fertilizer Statistics
      </h4>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} syncId="anyId">
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="uv" stroke="#00D307" fill="#C4A862" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SoldFertilizerStatistics;
