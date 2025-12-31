import {
  Tabs,
  Table,
  ConfigProvider,
  Button,
  Tag,
  Modal,
  Descriptions,
  Input,
  Form,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  useGetAllUsersQuery,
  useUserStatusUpdateMutation,
  useCreateArtisansMutation,
  useUpdateArtisanInfoMutation,
  useDeleteUserMutation,
} from "@/redux/apiSlices/userSlice";
import { useSearchParams } from "react-router-dom";

type UserRow = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
  speciality?: string;
  phone?: string;
};

const statusTag = (s: "ACTIVE" | "INACTIVE") => (
  <Tag
    color={s === "ACTIVE" ? "#14b8a6" : "#f43f5e"}
    style={{ color: "#fff" }}
    className="w-20 text-center py-1 rounded-md"
  >
    {s}
  </Tag>
);

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewOpen, setViewOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [artisanModalOpen, setArtisanModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  // Get URL params
  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("limit") || "10");
  const activeTab = searchParams.get("role") || "USER";
  const search = searchParams.get("searchTerm") || "";

  // Build query params
  const queryParams = [
    { name: "page", value: currentPage.toString() },
    { name: "limit", value: perPage.toString() },
    { name: "role", value: activeTab },
  ];

  if (search) {
    queryParams.push({ name: "searchTerm", value: search });
  }

  const { data: users, isLoading, refetch } = useGetAllUsersQuery(queryParams);
  const [userStatusUpdate] = useUserStatusUpdateMutation();
  const [createArtisan] = useCreateArtisansMutation();
  const [updateArtisanInfo] = useUpdateArtisanInfoMutation();
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    if (searchTerm !== search) {
      const timer = setTimeout(() => {
        handleSearch(searchTerm);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const handleTabChange = (key: string) => {
    setSearchParams({
      role: key,
      page: "1",
      limit: perPage.toString(),
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    const params: any = {
      role: activeTab,
      page: page.toString(),
      limit: pageSize.toString(),
    };
    if (search) {
      params.searchTerm = search;
    }
    setSearchParams(params);
  };

  const handleSearch = (value: string) => {
    const params: any = {
      role: activeTab,
      page: "1",
      limit: perPage.toString(),
    };
    if (value.trim()) {
      params.searchTerm = value.trim();
    }
    setSearchParams(params);
  };

  const handleView = (record: UserRow) => {
    setSelected(record);
    setViewOpen(true);
  };

  const handleBlock = (record: UserRow) => {
    setSelected(record);
    setBlockOpen(true);
  };

  const confirmBlock = async () => {
    if (!selected) return;
    try {
      const newStatus = selected.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await userStatusUpdate({ id: selected._id, status: newStatus }).unwrap();
      message.success(
        `User ${
          newStatus === "INACTIVE" ? "blocked" : "activated"
        } successfully`
      );
      refetch();
      setBlockOpen(false);
      setSelected(null);
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update user status");
    }
  };

  const handleDelete = (record: UserRow) => {
    setSelected(record);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteUser(selected._id).unwrap();
      message.success("User deleted successfully");
      refetch();
      setDeleteOpen(false);
      setSelected(null);
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleAddArtisan = () => {
    setEditMode(false);
    form.resetFields();
    setArtisanModalOpen(true);
  };

  const handleEditArtisan = (record: UserRow) => {
    setEditMode(true);
    setSelected(record);
    form.setFieldsValue({
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      speciality: record.speciality,
      phone: record.phone,
    });
    setArtisanModalOpen(true);
  };

  const handleArtisanSubmit = async (values: any) => {
    try {
      if (editMode && selected) {
        await updateArtisanInfo({
          id: selected._id,
          ...values,
        }).unwrap();
        message.success("Artisan updated successfully");
      } else {
        await createArtisan(values).unwrap();
        message.success("Artisan created successfully");
      }
      setArtisanModalOpen(false);
      form.resetFields();
      setSelected(null);
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to save artisan");
    }
  };

  const userColumns: ColumnsType<UserRow> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Status", dataIndex: "status", key: "status", render: statusTag },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="link"
            icon={<LockOutlined />}
            onClick={() => handleBlock(record)}
            style={{
              color: record.status === "ACTIVE" ? "#f43f5e" : "#14b8a6",
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  const artisanColumns: ColumnsType<UserRow> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Speciality", dataIndex: "speciality", key: "speciality" },
    { title: "Status", dataIndex: "status", key: "status", render: statusTag },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            type="link"
            size="middle"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="link"
            size="middle"
            icon={<EditOutlined />}
            onClick={() => handleEditArtisan(record)}
          />
          <Button
            type="link"
            size="middle"
            icon={<LockOutlined />}
            onClick={() => handleBlock(record)}
            style={{
              color: record.status === "ACTIVE" ? "#f43f5e" : "#14b8a6",
            }}
          />
          <Button
            type="link"
            size="middle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                inkBarColor: "#ff6b35",
                itemSelectedColor: "#ff6b35",
                itemHoverColor: "#ff6b35",
              },
            },
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={[
              {
                key: "USER",
                label: "Clients",
              },
              {
                key: "ARTISAN",
                label: "Artisans",
              },
            ]}
          />
        </ConfigProvider>

        <div className="flex items-center gap-3">
          {activeTab === "ARTISAN" && (
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={handleAddArtisan}
              className="bg-[#3f51b5] text-white px-4 py-[22px] rounded-md transparent"
            >
              Add New Artisan
            </Button>
          )}
          <Input
            placeholder={
              activeTab === "USER" ? "Search clients..." : "Search artisans..."
            }
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300, height: 44 }}
            prefix={<SearchOutlined />}
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
        <Table<UserRow>
          rowKey="_id"
          columns={activeTab === "USER" ? userColumns : artisanColumns}
          dataSource={users?.data || []}
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: perPage,
            total: users?.pagination?.total || 0,
            onChange: handlePageChange,
            // showSizeChanger: true,
            showTotal: (total) =>
              `Total ${total} ${activeTab === "USER" ? "clients" : "artisans"}`,
          }}
        />
      </ConfigProvider>

      {/* View User Modal */}
      <Modal
        title={selected?.role === "USER" ? "Client Details" : "Artisan Details"}
        open={viewOpen}
        onCancel={() => {
          setViewOpen(false);
          setSelected(null);
        }}
        footer={null}
      >
        {selected && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Name">
              {selected.firstName} {selected.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selected.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selected.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Role">{selected.role}</Descriptions.Item>
            {selected.speciality && (
              <Descriptions.Item label="Speciality">
                {selected.speciality}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Status">
              {statusTag(selected.status)}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Block/Activate User Modal */}
      <Modal
        title={selected?.status === "ACTIVE" ? "Block User" : "Activate User"}
        open={blockOpen}
        onOk={confirmBlock}
        okText={selected?.status === "ACTIVE" ? "Yes, Block" : "Yes, Activate"}
        onCancel={() => {
          setBlockOpen(false);
          setSelected(null);
        }}
        okButtonProps={{
          type: "primary",
          className: "bg-[#3f51b5] text-white px-4 py-[15px] rounded-md",
        }}
      >
        Are you sure you want to{" "}
        {selected?.status === "ACTIVE" ? "block" : "activate"} this user?
      </Modal>

      {/* Delete User Modal */}
      <Modal
        title="Delete User"
        open={deleteOpen}
        onOk={confirmDelete}
        okText="Yes, Delete"
        okButtonProps={{ danger: true }}
        onCancel={() => {
          setDeleteOpen(false);
          setSelected(null);
        }}
      >
        Are you sure you want to delete this user? This action cannot be undone.
      </Modal>

      {/* Add/Edit Artisan Modal */}
      <Modal
        title={editMode ? "Edit Artisan" : "Add New Artisan"}
        open={artisanModalOpen}
        onCancel={() => {
          setArtisanModalOpen(false);
          form.resetFields();
          setSelected(null);
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleArtisanSubmit}>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input
                placeholder="Enter first name"
                className="h-[45px] rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input
                placeholder="Enter last name"
                className="h-[45px] rounded-md"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input
                placeholder="Enter email"
                disabled={editMode}
                className="h-[45px] rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input
                placeholder="Enter phone number"
                className="h-[45px] rounded-md"
              />
            </Form.Item>

            {!editMode && (
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter password" },
                  { min: 8, message: "Password must be at least 8 characters" },
                ]}
              >
                <Input.Password
                  placeholder="Enter password"
                  className="h-[45px] rounded-md"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Speciality"
              name="speciality"
              rules={[{ required: true, message: "Please enter speciality" }]}
            >
              <Input
                placeholder="e.g., Painting, Floor Covering, Tiles"
                className="h-[45px] rounded-md"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setArtisanModalOpen(false);
                  form.resetFields();
                }}
                className=" text-black h-[40px] rounded-md"
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                className="bg-[#3f51b5] text-white h-[40px] rounded-md"
              >
                {editMode ? "Update" : "Create"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
