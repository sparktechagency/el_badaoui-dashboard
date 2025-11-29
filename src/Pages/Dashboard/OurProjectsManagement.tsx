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
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
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
  image: string;
}

const OurProjectsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

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
      });
      setFileList([
        {
          uid: "-1",
          name: "image.jpg",
          status: "done",
          url: project.image,
        },
      ]);
    } else {
      setEditingProject(null);
      form.resetFields();
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingProject(null);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingProject) {
        await updateProject({
          id: editingProject._id,
          ...Object.fromEntries(formData),
        }).unwrap();
        message.success("Project updated successfully!");
      } else {
        await createProject(formData).unwrap();
        message.success("Project created successfully!");
      }

      handleCloseModal();
    } catch (error: any) {
      message.error(error?.data?.message || "Operation failed!");
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
      title: "Image",
      dataIndex: "image",
      key: "image",
    //   width: 100,
      render: (image: string) => (
        <Image
          src={image}
          alt="Project"
          width={60}
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
      ellipsis: true,
      render: (text: string) => (
        <span>{text.length > 50 ? `${text.slice(0, 50)}...` : text}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
    //   width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleOpenModal(record)}
            style={{ color: "#52c41a" }}
          >
            View
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

  const uploadProps = {
    fileList,
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    maxCount: 1,
  };

  return (
    <div >
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
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          New Projects
        </Button>
      </div>

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
        // bordered
      />

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
            <Input placeholder="Interior painting" />
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

          <Form.Item
            label="Upload Image"
            rules={[
              {
                validator: () =>
                  fileList.length > 0 || editingProject
                    ? Promise.resolve()
                    : Promise.reject(new Error("Please upload an image!")),
              },
            ]}
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
            <div style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>
              Photos, Jpg, Png... Drag and drop or click to upload
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating || isUpdating}
              >
                {editingProject ? "Update" : "Save Category"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OurProjectsManagement;