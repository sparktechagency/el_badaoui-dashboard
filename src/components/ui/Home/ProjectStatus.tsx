import { useProjectStatusFunnelQuery } from "@/redux/apiSlices/dashboardSlice";
import { Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-3">
    <span
      className="inline-block w-9 h-2 rounded"
      style={{ backgroundColor: color }}
    />
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

const ProjectStatus = () => {
  const { data } = useProjectStatusFunnelQuery(null);
  console.log("Project Status Funnel", data);

  // Protect against null/undefined
  const status = data?.data || {};

  // Convert API data to chart format
  const chartData = [
    { name: "Projet en cours", value: status.accepted || 0, fill: "#14b8a6" },
    { name: "Projet terminé ", value: status.completed || 0, fill: "#3b82f6" },
    { name: "Estimé", value: status.new || 0, fill: "#f59e0b" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm h-full">
      <div className="text-center md:text-left">
        <h4 className="mb-5 mt-4 text-xl font-semibold">
        Répartitions des Estimations
        </h4>
      </div>

      <div className="mt-2">
        <ResponsiveContainer width="100%" height={185}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              isAnimationActive
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-10">
        <div className="space-y-3">
          <LegendItem color="#14b8a6" label="Projet en cours" />
          <LegendItem color="#3b82f6" label="Projet terminé " />
        </div>
        <div className="space-y-3">
          <LegendItem color="#f59e0b" label="Estimé" />
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
