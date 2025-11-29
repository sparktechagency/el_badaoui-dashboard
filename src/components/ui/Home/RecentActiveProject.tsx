import {  ConfigProvider, Table } from "antd";

import { useRecentProjectQuery } from "@/redux/apiSlices/dashboardSlice";

// interface Order {
//   projectId: string;
//   clientName: string;
//   artisan: string;
//   status: string;
//   estimatedAmount: number;
//   createdAt: string;
//   key?: string;
// }

const RecentActiveProject = () => {
const {data:recentProject}=useRecentProjectQuery(null)
console.log("Recent Project", recentProject);

 

  const formattedData =
    recentProject?.data?.map((item: any) => ({
      key: item._id,
      projectId: item.projectCode,
      clientName: `${item?.firstName || ""} ${
        item?.lastName || ""
      }`,
      artisan: item?.artisanId ?` ${item?.artisanId?.firstName || ""} ${
        item?.artisanId?.lastName || ""
      }  `:  "Not Assign yet", // Backend doesn't provide artisan
      estimatedAmount: item.totalWithVat,
      status: item.status?.toLowerCase(),
      createdAt: item.createdAt || null, // API doesn't include createdAt
    })) || [];

 const columns = [
    {
      title: "Project Number",
      dataIndex: "projectId",
      key: "projectId",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Artisan",
      dataIndex: "artisan",
      render: (text: string) => text || "Not Assign yet",
      key: "artisan",
    },
    {
      title: "Estimated Amount",
      dataIndex: "estimatedAmount",
      key: "estimatedAmount",
      render: (text: number) => `$${text}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: { [key: string]: { label: string; color: string } } = {
          accepted: { label: "Accepted", color: "green" },
          pending: { label: "Pending", color: "orange" },
          completed: { label: "Completed", color: "blue" },
          new: { label: "New", color: "#f59e0b" },
        };

        const current = statusMap[status] || {
          label: status,
          color: "gray",
        };

        return (
          <span
            className="px-2 py-1 rounded-full text-white font-bold"
            style={{ backgroundColor: current.color }}
          >
            {current.label}
          </span>
        );
      },
    }
    // {
    //   title: "Order Date",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (date: string) =>
    //     date ? moment(date).format("Do MMM, YYYY") : "N/A",
    // },
  ];

  return (
    <div className="border bg-white  p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h4 className="mb-2 text-xl font-semibold">Recent Active Projects</h4>
        {/* <Link to={"/analytics"}>
          <Button className="bg-secondary border-secondary">View All</Button>
        </Link> */}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#fff4e5",
            },
          },
        }}
      >
        <Table columns={columns} pagination={false} dataSource={formattedData || []} />
      </ConfigProvider>
    </div>
  );
};

export default RecentActiveProject;
