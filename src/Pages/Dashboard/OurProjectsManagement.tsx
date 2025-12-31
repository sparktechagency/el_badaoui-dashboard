import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Space,
  Popconfirm,
  message,
  Image,
  ConfigProvider,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useGetAllOurProjectsQuery,
  useCreatePreviousProjectMutation,
  useUpdatePreviousProjectMutation,
  useDeletePreviousProjectMutation,
} from "@/redux/apiSlices/ourProjectsApi";

interface Project {
  _id: string;
  title: string;
  description: string;
  afterImage: string;
  beforeImage: string;
  videoLink?: string;
}

const OurProjectsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const [afterImageFileList, setAfterImageFileList] = useState<any[]>([]);
  const [beforeImageFileList, setBeforeImageFileList] = useState<any[]>([]);

  const queryParams = [
    { name: "page", value: currentPage.toString() },
    { name: "limit", value: perPage.toString() },
  ];

  const { data: previousProjects, isLoading } =
    useGetAllOurProjectsQuery(queryParams);

  const [createProject, { isLoading: isCreating }] =
    useCreatePreviousProjectMutation();
  const [updateProject, { isLoading: isUpdating }] =
    useUpdatePreviousProjectMutation();
  const [deleteProject] = useDeletePreviousProjectMutation();

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      form.setFieldsValue({
        title: project.title,
        description: project.description,
        videoLink: project.videoLink || "",
      });

      // Set after image
      setAfterImageFileList([
        {
          uid: project._id + "-after",
          name: "After Image",
          status: "done",
          url: `${import.meta.env.VITE_API_BASE_URL}${project.afterImage}`,
        },
      ]);

      // Set before image
      setBeforeImageFileList([
        {
          uid: project._id + "-before",
          name: "Before Image",
          status: "done",
          url: `${import.meta.env.VITE_API_BASE_URL}${project.beforeImage}`,
        },
      ]);
    } else {
      setEditingProject(null);
      form.resetFields();
      setAfterImageFileList([]);
      setBeforeImageFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingProject(null);
    form.resetFields();
    setAfterImageFileList([]);
    setBeforeImageFileList([]);
  };

  const handleOpenViewModal = (project: Project) => {
    setViewingProject(project);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setViewingProject(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      // Add video link if provided
      if (values.videoLink) {
        formData.append("video", values.videoLink);
      }

      // Add after image
      if (
        afterImageFileList.length > 0 &&
        afterImageFileList[0].originFileObj
      ) {
        formData.append("afterImage", afterImageFileList[0].originFileObj);
      }

      // Add before image
      if (
        beforeImageFileList.length > 0 &&
        beforeImageFileList[0].originFileObj
      ) {
        formData.append("beforeImage", beforeImageFileList[0].originFileObj);
      }
      console.log(formData);
      if (editingProject) {
        await updateProject({
          id: editingProject._id,
          formData: formData,
        }).unwrap();
        message.success("Project updated successfully!");
      } else {
        await createProject(formData).unwrap();
        message.success("Project created successfully!");
      }

      handleCloseModal();
    } catch (error: any) {
      message.error(error?.data?.message || "Operation failed!");
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id).unwrap();
      message.success("Project deleted successfully!");
    } catch (error: any) {
      message.error(error?.data?.message || "Delete failed!");
    }
  };

  const columns: ColumnsType<Project> = [
    {
      title: "Project Number",
      dataIndex: "",
      key: "serial",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Après Image",
      dataIndex: "afterImage",
      key: "afterImage",
      width: 150,
      render: (image: string) => (
        <Image
          src={`${import.meta.env.VITE_API_BASE_URL || ""}${image}`}
          alt="After"
          width={120}
          height={60}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Before Image",
      dataIndex: "beforeImage",
      key: "beforeImage",
      width: 150,
      render: (image: string) => (
        <Image
          src={`${import.meta.env.VITE_API_BASE_URL || ""}${image}`}
          alt="Before"
          width={120}
          height={60}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Projects Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <span>{text.length > 50 ? `${text.slice(0, 50)}...` : text}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleOpenViewModal(record)}
            style={{ color: "#52c41a" }}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            style={{ color: "#1890ff" }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Project"
            description="Are you sure you want to delete this project?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const afterImageUploadProps = {
    fileList: afterImageFileList,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      setAfterImageFileList([
        {
          uid: file.name,
          name: file.name,
          status: "done",
          originFileObj: file,
          url: URL.createObjectURL(file),
        },
      ]);

      return false;
    },
    onRemove: () => {
      setAfterImageFileList([]);
    },
    maxCount: 1,
    listType: "picture" as const,
  };

  const beforeImageUploadProps = {
    fileList: beforeImageFileList,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      setBeforeImageFileList([
        {
          uid: file.name,
          name: file.name,
          status: "done",
          originFileObj: file,
          url: URL.createObjectURL(file),
        },
      ]);

      return false;
    },
    onRemove: () => {
      setBeforeImageFileList([]);
    },
    maxCount: 1,
    listType: "picture" as const,
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
          Our Projects
        </h1>
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
          className="py-[22px] bg-[#3f51b5] text-white"
        >
          New Projects
        </Button>
      </div>

      <ConfigProvider
        theme={{ components: { Table: { headerBg: "#fff4e5" } } }}
      >
        <Table
          columns={columns}
          dataSource={previousProjects?.data || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: perPage,
            total: previousProjects?.pagination?.total || 0,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} items`,
          }}
          size="small"
        />
      </ConfigProvider>

      <Modal
        title={editingProject ? "Edit Project" : "Add New Projects"}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Projects Name"
            name="title"
            rules={[
              { required: true, message: "Please input the project name!" },
            ]}
          >
            <Input placeholder="Interior painting" className="h-[44px]" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input.TextArea
              rows={6}
              placeholder="Monsieur Peinture is, above all, a painting company..."
            />
          </Form.Item>

          <div className="flex justify-between items-center">
            {" "}
            <Form.Item
              label="Après Image"
              name="afterImage"
              rules={[
                {
                  validator: () =>
                    afterImageFileList.length > 0 || editingProject
                      ? Promise.resolve()
                      : Promise.reject(new Error("Please upload after image!")),
                      
                },
              ]}
              className="w-[300px]"
            >
              <Upload {...afterImageUploadProps}   accept="image/*"   maxCount={1}>
                <Button icon={<UploadOutlined />} className="h-[44px]">
                  Select Après Image
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Before Image"
              name="beforeImage"
              rules={[
                {
                  validator: () =>
                    beforeImageFileList.length > 0 || editingProject
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Please upload before image!")
                        ),
                },
              ]}
              className="w-[300px]"
            >
              <Upload {...beforeImageUploadProps} accept="image/*"   maxCount={1}>
                <Button icon={<UploadOutlined />} className="h-[44px]">
                  Select Before Image
                </Button>
              </Upload>
            </Form.Item>
          </div>

          <Form.Item label="Video Link (Optional)" name="videoLink">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              className="h-[44px]"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={handleCloseModal}
                className="py-[20px] text-black"
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                loading={isCreating || isUpdating}
                className="py-[20px] bg-[#3f51b5] text-white"
              >
                {editingProject ? "Update" : "Save Project"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="View Project"
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        footer={null}
        width={870}
      >
        {viewingProject && (
          <div>
            <div className="flex justify-between items-center">
              <div style={{ marginBottom: "16px" }}>
                <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                Après Image:
                </div>
                <Image
                  src={`${import.meta.env.VITE_API_BASE_URL || ""}${
                    viewingProject.afterImage
                  }`}
                  alt="Après"
                  style={{
                    width: "400px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                  Before Image:
                </div>
                <Image
                  src={`${import.meta.env.VITE_API_BASE_URL || ""}${
                    viewingProject.beforeImage
                  }`}
                  alt="Before"
                  style={{
                    width: "400px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontWeight: "bold" }}>Project Name: </span>
              <span style={{ fontSize: "16px" }}>{viewingProject.title}</span>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                Description:{" "}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {viewingProject.description}
              </span>
            </div>

            {viewingProject.videoLink && (
              <div>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Video Link:{" "}
                </span>
                <a
                  href={viewingProject.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1890ff" }}
                >
                  {viewingProject.videoLink}
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OurProjectsManagement;
