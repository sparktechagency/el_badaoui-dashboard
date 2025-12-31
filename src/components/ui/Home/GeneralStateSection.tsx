import { FaUsers } from "react-icons/fa6";
import { BiBarChartAlt2 } from "react-icons/bi";
import { RiCalendarTodoFill } from "react-icons/ri";
import salongoLogo from "../../../assets/salon-go-logo.png";
import { useGeneralStatsQuery } from "@/redux/apiSlices/dashboardSlice";


const GeneralStateSection = () => {
  const { data  } = useGeneralStatsQuery(null);
  console.log("data", data)

  // const generalState = {
  //   data: {
  //     totalActiveUsers: 1500,
  //     newSignups: 120,
  //     totalActiveVendors: 45,
  //     totalCompletedOrders: 320,
  //     totalServices: 75,
  //   },
  // };

  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={salongoLogo} alt="" />
      </div>
    );
  }

  // const state = generalState?.data;

  const cards = [
    {
      title: "Projets total estimé",
      value: data?.data?.totalProjects ?? 0,
      prefix: "",
      icon: BiBarChartAlt2,
      main: "#3f51b5",
      light: "#c7d2fe",
    },
    {
      title: "Active Projects",
      value: data?.data?.activeProjects ?? 0,
      prefix: "",
      icon: RiCalendarTodoFill,
      main: "#f59e0b",
      light: "#fde68a",
    },
    {
      title: "Total Users",
      value: data?.data?.totalUsers ?? 0,
      prefix: " ",
      icon: FaUsers,
      main: "#facc15",
      light: "#fef08a",
    },
    {
      title: " Nouveaux clients (30 dernier jours)",
      value: data?.data?.clientLast30Days ?? 0,
      prefix: "",
      icon: FaUsers,
      main: "#f43f5e",
      light: "#fecdd3",
    },
  ];

  const Wave = ({ id, main, light }: { id: string; main: string; light: string }) => (
    <svg className="absolute bottom-0 left-0 w-full h-[60px]" viewBox="0 0 300 80" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={main} stopOpacity={0.25} />
          <stop offset="100%" stopColor={light} stopOpacity={0.08} />
        </linearGradient>
      </defs>
      <path d="M0 40 C 60 20, 120 60, 180 40 S 240 60, 300 40 L 300 80 L 0 80 Z" fill={`url(#${id})`} />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const number = c.prefix ? `${c.prefix}${c.value}` : `${c.value}`;
        return (
          <div
            key={c.title}
            className="relative bg-white rounded-2xl px-6 py-4 shadow-sm ring-1 ring-black/5 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-600">{c.title}</span>
              <span
                className="rounded-md p-2"
                style={{ backgroundColor: c.main, color: "#fff" }}
              >
                <Icon size={16} />
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold text-center" style={{ color: c.main }}>
                {number}
              </span>
            </div>
            <Wave id={`wave-${i}`} main={c.main} light={c.light} />
          </div>
        );
      })}
    </div>
  );
};

export default GeneralStateSection;
