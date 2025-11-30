import { useProjectManagementQuery, useUpdateProjectManagementMutation } from "@/redux/apiSlices/projectManagementApi";
import { Table, Button, Input, Select, ConfigProvider, Spin, message } from "antd";
import type { TableProps } from "antd";
import moment from "moment";
import { FaEye } from "react-icons/fa6";
import { Link, useSearchParams } from "react-router-dom";
// import { useProjectManagementQuery, useUpdateProjectManagementMutation } from "../api/projectManagementApi";

type Project = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalWithVat: number;
  status: "NEW" | "COMPLETED" | "ACCEPTED";
  createdAt: string;
  projectCode: string;
  artisanId?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};

const statusColor: Record<Project["status"], string> = {
  ACCEPTED: "#14b8a6",
  COMPLETED:"#3b82f6",
  NEW:  "#f59e0b",
};

const statusOptions = [
  { label: "New", value: "NEW" as const },
  { label: "Accepted", value: "ACCEPTED" as const },
  { label: "Completed", value: "COMPLETED" as const },
];

// Status Update Cell Component
const StatusUpdateCell = ({ 
  projectId, 
  currentStatus 
}: { 
  projectId: string; 
  currentStatus: "NEW" | "COMPLETED" | "ACCEPTED" 
}) => {
  const [updateProject, { isLoading }] = useUpdateProjectManagementMutation();
  const bgColor = statusColor[currentStatus];

  const handleStatusChange = async (newStatus: "NEW" | "COMPLETED" | "ACCEPTED") => {
    try {
      await updateProject({
        id: projectId,
        status: newStatus,
      }).unwrap();
      
      message.success("Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  return (
    <>
      <style>{`
        .status-select-${projectId} .ant-select-selector {
          background-color: ${bgColor} !important;
          color: #fff !important;
          border: none !important;
          box-shadow: none !important;
          font-weight: 500;
          padding: 4px 11px !important;
        }
        .status-select-${projectId} .ant-select-arrow {
          color: #fff !important;
        }
        .status-select-${projectId}:hover .ant-select-selector,
        .status-select-${projectId}.ant-select-focused .ant-select-selector,
        .status-select-${projectId}.ant-select-open .ant-select-selector {
          background-color: ${bgColor} !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
      <Select
        className={`w-full status-select-${projectId}`}
        value={currentStatus}
        onChange={handleStatusChange}
        loading={isLoading}
        options={statusOptions}
        popupMatchSelectWidth={false}
      />
    </>
  );
};

const ProjectManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get values from URL
  const searchTerm = searchParams.get("searchTerm") || "";
  const statusFilter = (searchParams.get("status") as Project["status"] | "All") || "All";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  // Update URL params helper
  const updateParams = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "All") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    
    setSearchParams(newParams);
  };

  // Build query args for API
  const queryArgs: any = {
    page,
    limit,
  };
  
  if (statusFilter !== "All") {
    queryArgs.status = statusFilter;
  }
  
  if (searchTerm.trim()) {
    queryArgs.searchTerm = searchTerm.trim();
  }

  const { data, isLoading, isFetching } = useProjectManagementQuery(queryArgs);

  const columns: TableProps<Project>["columns"] = [
    {
      title: "Project Code",
      dataIndex: "projectCode",
      key: "projectCode",
    },
    {
      title: "Client Name",
      key: "clientName",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Artisan",
      key: "artisan",
      render: (_, record) =>
        record.artisanId
          ? `${record.artisanId.firstName} ${record.artisanId.lastName}`
          : "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (value: Project["status"], record) => (
        <StatusUpdateCell 
          projectId={record._id} 
          currentStatus={value} 
        />
      ),
    },
    {
      title: "Total with VAT",
      dataIndex: "totalWithVat",
      key: "totalWithVat",
      render: (value: number) => `€${value.toLocaleString()}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
          <Link to={`/project-management/${record._id}`}>
            <FaEye size={20} />
          </Link>
        </Button>
      ),
    },
  ];

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
            onChange={(e) => {
              updateParams({
                searchTerm: e.target.value,
                page: 1, // Reset to first page on search
              });
            }}
          />
          <Select
            className="w-56 h-12"
            value={statusFilter}
            onChange={(v) => {
              updateParams({
                status: v as string,
                page: 1, // Reset to first page on filter
              });
            }}
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
        <Spin spinning={isLoading || isFetching}>
          <Table<Project>
            rowKey="_id"
            dataSource={data?.data || []}
            columns={columns}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.pagination?.total || 0,
              onChange: (newPage) => {
                updateParams({ page: newPage });
              },
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </Spin>
      </ConfigProvider>
    </div>
  );
};

export default ProjectManagement;