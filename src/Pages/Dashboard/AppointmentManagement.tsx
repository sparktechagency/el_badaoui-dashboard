import { useGetAllAppointmentsQuery, useAppointmentStatusUpdateMutation } from "@/redux/apiSlices/appointmentApi";
import { useState } from "react";
import { Table, Tag, Select, Spin, ConfigProvider, message } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";

const AppointmentManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [dateFilter, setDateFilter] = useState("all");

  const queryParams = [
    { name: "page", value: currentPage.toString() },
    { name: "limit", value: perPage.toString() },
    { name: "dateFilter", value: dateFilter }
  ];

  const { data, isLoading } = useGetAllAppointmentsQuery(queryParams);
  const [updateStatus, { isLoading: isUpdating }] = useAppointmentStatusUpdateMutation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateStatus({
        id: appointmentId,
        status: newStatus,
      }).unwrap();
      message.success("Appointment status updated successfully!");
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update appointment status");
    }
  };

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: any) => (
        <div>
          <UserOutlined style={{ marginRight: 8 }} />
          {record?.firstName || "N/A"}
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_: any, record: any) => (
        <div>
          <div>
            <MailOutlined style={{ marginRight: 8 }} />
            {record?.email || "N/A"}
          </div>
          <div style={{  marginTop: 4 }}>
            <PhoneOutlined style={{ marginRight: 8 }} />
            {record?.phone || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {formatDate(date)}
        </div>
      ),
    },
    {
      title: "Time",
      key: "time",
      render: (_: any, record: any) => (
        <div>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          {formatTime(record.startTime)} - {formatTime(record.endTime)}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => {
        return (
          <Select
            value={status}
            onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
            loading={isUpdating}
            style={{ width: 140 }}
            disabled={isUpdating}
          >
            <Select.Option value="scheduled">
              <Tag color="blue">Scheduled</Tag>
            </Select.Option>
            <Select.Option value="completed">
              <Tag color="green">Completed</Tag>
            </Select.Option>
          </Select>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div >
       

        <div >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
               marginBottom: 24
            }}
          >
            <div >
              <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
                Appointment Management
              </h1>
              <p style={{ color: "#8c8c8c" }}>
                Manage and track all appointments
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span>Filter by date:</span>
              <Select
                value={dateFilter}
                onChange={setDateFilter}
                style={{ width: 180 , height: 45 }}
              >
                <Select.Option value="all">All Dates</Select.Option>
                <Select.Option value="today">Today</Select.Option>
                <Select.Option value="tomorrow">Tomorrow</Select.Option>
                <Select.Option value="next_7_days">Next 7 Days</Select.Option>
              </Select>
            </div>
          </div>
        </div>

         <ConfigProvider
          theme={{ components: { Table: { headerBg: "#fff4e5" } } }}
        >
          <Table
            columns={columns}
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: perPage,
              total: data?.pagination?.total || 0,
              onChange: setCurrentPage,
            //   showTotal: (total, range) =>
            //     `${range[0]}-${range[1]} of ${total} items`,
              position: ["bottomRight"],
            }}
          />
        </ConfigProvider>
      
      </div>
    </div>
  );
};

export default AppointmentManagement;
