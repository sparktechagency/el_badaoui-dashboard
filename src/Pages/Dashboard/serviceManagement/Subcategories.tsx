import { useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Space,
  Tag,
  ConfigProvider,
  Input,
  Upload,
  InputNumber,
  message,
} from "antd";
import type { TableProps, UploadFile } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { UploadOutlined } from "@ant-design/icons";
import {
  
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "@/redux/apiSlices/subCategoryApi";
import { useGetAllSubCategoriesQuery } from "@/redux/apiSlices/subCategoryApi";

type SubCategory = {
  _id: string;
  name: string;
  image: string;
  basePrice: number;
  baseArea: number;
};

const Subcategories = () => {
  const { data: subCategoriesData, isLoading } = useGetAllSubCategoriesQuery(null);
  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const subcategories = subCategoriesData?.data || [];

  const subCategoryColumns: TableProps<SubCategory>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image: string) => (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL || ""}${image}`}
          alt="subcategory"
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name" 
    },
    {
      title: "Base Area (m²)",
      dataIndex: "baseArea",
      key: "baseArea",
      render: (area: number) => `${area} m²`,
    },
    {
      title: "Base Price",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingId(record._id);
              form.setFieldsValue({
                name: record.name,
                baseArea: record.baseArea,
                basePrice: record.basePrice,
              });
              // Set existing image for preview
              setFileList([
                {
                  uid: "-1",
                  name: "current-image",
                  status: "done",
                  url: `${import.meta.env.VITE_API_BASE_URL || ""}${record.image}`,
                },
              ]);
              setOpen(true);
            }}
          >
            <FiEdit />
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record._id)}
          >
            <FiTrash2 />
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this subcategory?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteSubCategory(id).unwrap();
          message.success("Subcategory deleted successfully");
        } catch (error) {
          message.error("Failed to delete subcategory");
        }
      },
    });
  };

  const onAddClick = () => {
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate image for create operation
      if (!editingId && fileList.length === 0) {
        message.error("Please upload an image");
        return;
      }

      // Check if new file is uploaded
      const hasNewFile = fileList[0]?.originFileObj instanceof File;
      
      const formData = {
        name: values.name,
        baseArea: values.baseArea,
        basePrice: values.basePrice,
        image: hasNewFile ? fileList[0].originFileObj : null,
      };

      if (editingId) {
        // For update, only send image if a new one is selected
        await updateSubCategory({ id: editingId, ...formData }).unwrap();
        message.success("Subcategory updated successfully");
      } else {
        // For create, image is required
        if (!formData.image) {
          message.error("Please upload an image");
          return;
        }
        await createSubCategory(formData).unwrap();
        message.success("Subcategory created successfully");
      }
      
      setOpen(false);
      form.resetFields();
      setFileList([]);
      setEditingId(null);
    } catch (error: any) {
      if (error.errorFields) {
        message.error("Please fill in all required fields");
      } else {
        message.error(error?.data?.message || "Operation failed");
      }
    }
  };

  const uploadProps = {
    fileList,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      // Create a proper UploadFile object
      const uploadFile: UploadFile = {
        uid: file.name,
        name: file.name,
        status: "done",
        originFileObj: file as any,
      };
      setFileList([uploadFile]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    maxCount: 1,
  };

  const header = useMemo(
    () => (
      <span className="flex items-center gap-2">
        Subcategories{" "}
        <Tag color="#3f51b5" style={{ color: "#fff" }}>
          {subcategories.length}
        </Tag>
      </span>
    ),
    [subcategories]
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl my-7 font-bold text-[#210630]">
          Subcategory Management
        </h2>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#210630]">{header}</h3>
          <Button type="primary" onClick={onAddClick} className="bg-[#3f51b5] text-white h-[45px]">
            <FaPlus /> Add Sub Category
          </Button>
        </div>
        <ConfigProvider
          theme={{ components: { Table: { headerBg: "#fff4e5" } } }}
        >
          <Table<SubCategory>
            rowKey="_id"
            dataSource={subcategories}
            columns={subCategoryColumns}
            pagination={{ pageSize: 10 }}
            loading={isLoading}
            size="small"
          />
        </ConfigProvider>
      </div>

      <Modal
        open={open}
        title={editingId ? "Edit Subcategory" : "Add Subcategory"}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setFileList([]);
          setEditingId(null);
        }}
        onOk={onSubmit}
        okText={editingId ? "Save" : "Create"}
        okButtonProps={{
          type: "primary",
          className: "bg-[#3f51b5] text-white h-[40px] mt-4",
        }}
        confirmLoading={isCreating || isUpdating}
        width={600}
        cancelButtonProps={{
          className: " text-white h-[40px] text-black",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter subcategory name" className="h-[45px]"/>
          </Form.Item>

          <Form.Item
            label={`Image ${!editingId ? "*" : "(optional)"}`}
            help={!editingId ? "Image is required for new subcategory" : "Upload new image to replace existing one"}
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />} className="bg-[#3f51b5] text-white h-[40px]">
                {fileList.length > 0 ? "Change Image" : "Select Image"}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="baseArea"
            label="Base Area (m²)"
            rules={[{ required: true, message: "Please enter base area" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter base area"
              className="h-[45px]"
            />
          </Form.Item>

          <Form.Item
            name="basePrice"
            label="Base Price"
            rules={[{ required: true, message: "Please enter base price" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter base price"
              className="h-[45px]"
              prefix="$"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Subcategories;