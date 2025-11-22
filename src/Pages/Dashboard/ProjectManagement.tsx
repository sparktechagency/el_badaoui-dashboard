import { Table, Tag, Button, Input, Select, ConfigProvider } from "antd";
import type { TableProps } from "antd";
import moment from "moment";
import { FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

type Project = {
  projectId: string;
  clientName: string;
  artisan: string;
  status: "Accepted" | "Pending Signature" | "Drafting" | "New Inquiry";
  estimateValue: number;
  createdAt: string;
};

const dataSource: Project[] = [
  {
    projectId: "1",
    clientName: "Acme Corp",
    artisan: "John Doe",
    status: "Accepted",
    estimateValue: 120000,
    createdAt: "2025-11-01T10:30:00Z",
  },
  {
    projectId: "2",
    clientName: "Bright Homes",
    artisan: "Sarah Lee",
    status: "Pending Signature",
    estimateValue: 45000,
    createdAt: "2025-10-22T08:15:00Z",
  },
  {
    projectId: "3",
    clientName: "Global Tech",
    artisan: "Ahmed B.",
    status: "Drafting",
    estimateValue: 78000,
    createdAt: "2025-10-10T14:05:00Z",
  },
  {
    projectId: "4",
    clientName: "Urban Studio",
    artisan: "Nadia K.",
    status: "New Inquiry",
    estimateValue: 15000,
    createdAt: "2025-11-18T12:00:00Z",
  },
  {
    projectId: "5",
    clientName: "Zen Living",
    artisan: "Omar S.",
    status: "Accepted",
    estimateValue: 92000,
    createdAt: "2025-09-28T09:40:00Z",
  },
  {
    projectId: "6",
    clientName: "Eco Builders",
    artisan: "Marta R.",
    status: "Pending Signature",
    estimateValue: 32000,
    createdAt: "2025-11-12T16:25:00Z",
  },
  {
    projectId: "7",
    clientName: "Sunset Ltd",
    artisan: "Luis F.",
    status: "Drafting",
    estimateValue: 51000,
    createdAt: "2025-10-02T11:10:00Z",
  },
  {
    projectId: "8",
    clientName: "Harmony Designs",
    artisan: "Aisha T.",
    status: "New Inquiry",
    estimateValue: 12000,
    createdAt: "2025-11-20T07:55:00Z",
  },
];

const statusColor: Record<Project["status"], string> = {
  Accepted: "#14b8a6",
  "Pending Signature": "#f59e0b",
  Drafting: "#a78bfa",
  "New Inquiry": "#3b82f6",
};

const statusOptions = [
  { label: "Accepted", value: "Accepted" as const },
  { label: "Pending Signature", value: "Pending Signature" as const },
  { label: "Drafting", value: "Drafting" as const },
  { label: "New Inquiry", value: "New Inquiry" as const },
];

const columns: TableProps<Project>["columns"] = [
  {
    title: "Project ID",
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
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value: Project["status"]) => (
      <Tag color={statusColor[value]} style={{ color: "#fff" }}>
        {value}
      </Tag>
    ),
  },
  {
    title: "Estimate Value",
    dataIndex: "estimateValue",
    key: "estimateValue",
    render: (value: number) => `$${value.toLocaleString()}`,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value: string) => moment(value).format("DD MMM YYYY, HH:mm"),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button type="link">
        <Link to={`/project-management/${record.projectId}`}>
          <FaEye size={20} />
        </Link>
      </Button>
    ),
  },
];

const ProjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Project["status"] | "All">(
    "All"
  );

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return dataSource.filter((item) => {
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const haystack =
        `${item.projectId} ${item.clientName} ${item.artisan}`.toLowerCase();
      const matchesSearch = term === "" || haystack.includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl my-7 font-bold text-[#210630]">
          Project Management
        </h2>
        <div className="flex items-center gap-3">
          <Input
            allowClear
            placeholder="Search projects"
            className="w-[500px] py-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            className="w-56 h-12"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as Project["status"] | "All")}
            options={[
              { label: "All Statuses", value: "All" },
              ...statusOptions,
            ]}
          />
        </div>
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
        <Table<Project>
          rowKey="projectId"
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </ConfigProvider>
    </div>
  );
};

export default ProjectManagement;
