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
  image: string;
}

const OurProjectsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
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
          uid: project._id,
          name: project.title,
          status: "done",
          url: `${import.meta.env.VITE_API_BASE_URL}${project.image}`, // full URL
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

      // Check if new file is uploaded
      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingProject) {
        // For update, spread the id with formData
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
      title: "Serial",
      dataIndex: "",
      key: "serial",
      width: 80,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (image: string) => (
        <Image
          src={`${import.meta.env.VITE_API_BASE_URL || ""}${image}`}
          alt="Project"
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
      //   ellipsis: true,
      render: (text: string) => (
        <span>{text.length > 50 ? `${text.slice(0, 50)}...` : text}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      //   width: 200,
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

  const uploadProps = {
    fileList,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      setFileList([
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
      setFileList([]);
    },
    maxCount: 1,
    listType: "picture",
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
     marginBottom: "24px"
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
            name="image"
            rules={[
              {
                validator: () =>
                  fileList || editingProject
                    ? Promise.resolve()
                    : Promise.reject(new Error("Please upload an image!")),
              },
            ]}
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
            {/* <div style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>
              Photos, Jpg, Png... Drag and drop or click to upload
            </div> */}
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={handleCloseModal}
                className="py-[20px]  text-black"
              >
                Cancel
              </Button>
              <Button
                // type="primary"
                htmlType="submit"
                loading={isCreating || isUpdating}
                className="py-[20px] bg-[#3f51b5] text-white"
              >
                {editingProject ? "Update" : "Save Category"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="View Project"
        open={isViewModalVisible}
        onCancel={handleCloseViewModal}
        // footer={[
        //   <Button key="close" onClick={handleCloseViewModal}>
        //     Close
        //   </Button>,
        //   <Button
        //     key="edit"
        //     type="primary"
        //     icon={<EditOutlined />}
        //     onClick={handleEditFromView}
        //   >
        //     Edit Project
        //   </Button>,
        // ]}
        footer={null}
        width={700}
      >
        {viewingProject && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Image
                src={`${import.meta.env.VITE_API_BASE_URL || ""}${
                  viewingProject.image
                }`}
                alt={viewingProject.title}
                style={{
                  width: "650px",
                  maxHeight: "370px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  //   margin: "0 auto",
                }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              Project Name:
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {viewingProject.title}
              </span>
            </div>
            <div>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {" "}
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OurProjectsManagement;
