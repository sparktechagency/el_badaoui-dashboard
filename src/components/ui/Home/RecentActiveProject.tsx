import { Button, ConfigProvider, Table } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";

interface Order {
  projectId: string;
  clientName: string;
  artisan: string;
  status: string;
  estimatedAmount: number;
  createdAt: string;
  key?: string;
}

const RecentActiveProject = () => {
  // Dummy data for salon orders
  const dummyOrders: Order[] = [
    {
      projectId: "ORD001",
      clientName: "John Doe",
      artisan: "Nolan Noa",
      status: "accepted",
      estimatedAmount: 56550,
      createdAt: "2024-12-01T10:00:00Z",
    },
    {
      projectId: "ORD002",
      clientName: "Jane Smith",
      artisan: "Nolan Noa",
      status: "pending",
      estimatedAmount: 80000,
      createdAt: "2024-12-03T14:00:00Z",
    },
    {
      projectId: "ORD003",
      clientName: "Alice Johnson",
      artisan: "Nolan Noa",
      status: "completed",
      estimatedAmount: 40000,
      createdAt: "2024-12-05T09:30:00Z",
    },
    {
      projectId: "ORD004",
      clientName: "Bob Brown",
      artisan: "Nolan Noa",
      status: "completed",
      estimatedAmount: 120000,
      createdAt: "2024-12-06T12:15:00Z",
    },
    {
      projectId: "ORD005",
      clientName: "Charlie Davis",
      artisan: "Nolan Noa",
      status: "completed",
      estimatedAmount: 60000,
      createdAt: "2024-12-08T08:45:00Z",
    },
  ];

  const data = dummyOrders.slice(0, 4).map((order, index) => ({
    ...order,
    key: order.projectId || index.toString(),
  }));

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
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-white font-bold`}
            style={{ backgroundColor: statusMap[status].color }}
          >
            {statusMap[status].label}
          </span>
        );
      },
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("Do MMM, YYYY"),
    },
  ];

  return (
    <div className="border bg-white h-[350px] p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <h4 className="mb-2 text-xl font-semibold">Recent Active Projects</h4>
        <Link to={"/analytics"}>
          <Button className="bg-secondary border-secondary">View All</Button>
        </Link>
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
        <Table columns={columns} pagination={false} dataSource={data} />
      </ConfigProvider>
    </div>
  );
};

export default RecentActiveProject;
