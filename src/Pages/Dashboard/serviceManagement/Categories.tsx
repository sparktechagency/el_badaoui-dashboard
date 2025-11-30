import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Space,
  Tag,
  Upload,
  ConfigProvider,
  Spin,
  message,
  Tooltip,
} from "antd";
import type { TableProps, UploadFile } from "antd";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/apiSlices/categoryApi";
import ViewExtraServices from "./ViewExtraService";
import AddExtraServiceModal from "./ExtraService";

type Category = {
  _id: string;
  name: string;
  image: string;
};

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Extra Services (SubCategory) Modal States
  const [viewServicesModalOpen, setViewServicesModalOpen] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // ✅ API Queries & Mutations
  const { data: categoryData, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery(null);
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  console.log(categoryData);

  const categories = categoryData?.data || [];

  useEffect(() => {
    if (editingId) {
      const cat = categories.find((c) => c._id === editingId);
      if (cat) {
        setFileList([
          {
            uid: cat._id,
            name: "image",
            status: "done",
            url: `${import.meta.env.VITE_API_BASE_URL}${cat.image}`,
          },
        ]);
      }
    } else {
      setFileList([]);
    }
  }, [editingId, categories]);

  const categoryColumns: TableProps<Category>["columns"] = [
    {
      title: "Serial",
      dataIndex: "",
      key: "serial",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src: string) => (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL || ""}${src}`}
          alt="category"
          className="w-28 h-16 rounded object-cover border"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/80";
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Category">
            <Button onClick={() => handleEdit(record)} size="small">
              <FiEdit />
            </Button>
          </Tooltip>

          <Tooltip title="Delete Category">
            <Button
              danger
              size="small"
              onClick={() => handleDelete(record._id)}
              loading={isDeleting}
            >
              <FiTrash2 />
            </Button>
          </Tooltip>

          <Tooltip title="View Extra Services">
            <Button
              type="default"
              size="small"
              onClick={() => handleViewServices(record._id)}
            >
              <FiEye />
            </Button>
          </Tooltip>

          <Tooltip title="Add Extra Service">
            <Button
              // type="primary"
              size="small"
              onClick={() => handleAddService(record._id)}
            >
              <FiPlus />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Category) => {
    setEditingId(record._id);
    setName(record.name);
    setImageFile(null);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Category",
      content: "Are you sure you want to delete this category?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
          message.success("Category deleted successfully!");
        } catch (error) {
          message.error("Failed to delete category");
        }
      },
    });
  };

  const handleViewServices = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setViewServicesModalOpen(true);
  };

  const handleAddService = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setAddServiceModalOpen(true);
  };

  const onAddClick = () => {
    setEditingId(null);
    setName("");
    setImageFile(null);
    setOpen(true);
  };

  const onSubmit = async () => {
    if (!name.trim()) {
      message.error("Please enter category name");
      return;
    }

    if (!editingId && !imageFile) {
      message.error("Please upload an image");
      return;
    }

    try {
      if (editingId) {
        await updateCategory({
          id: editingId,
          name,
          image: imageFile?.originFileObj,
        }).unwrap();
        message.success("Category updated successfully!");
      } else {
        await createCategory({
          name,
          image: imageFile?.originFileObj,
        }).unwrap();
        message.success("Category created successfully!");
      }

      setOpen(false);
      setName("");
      setImageFile(null);
    } catch (error: any) {
      message.error(error?.data?.message || "Operation failed");
    }
  };

  const header = useMemo(
    () => (
      <span className="flex items-center gap-2">
        Categories
        <Tag color="#3f51b5" style={{ color: "#fff" }}>
          {categories.length}
        </Tag>
      </span>
    ),
    [categories.length]
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl my-7 font-bold text-[#210630]">
          Category Management
        </h2>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#210630]">{header}</h3>
          <Button
            // type="primary"
            onClick={onAddClick}
            disabled={isLoadingCategories}
            className="py-[22px] bg-[#3f51b5] text-white"
          >
            <FaPlus /> Add Category
          </Button>
        </div>

        {isLoadingCategories ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <ConfigProvider
            theme={{ components: { Table: { headerBg: "#fff4e5" } } }}
          >
            <Table<Category>
              rowKey="_id"
              dataSource={categories}
              columns={categoryColumns}
              pagination={{ pageSize: 6 }}
              size="small"
            />
          </ConfigProvider>
        )}
      </div>

      {/* Category Modal */}
      <Modal
        open={open}
        title={editingId ? "Edit Category" : "Add Category"}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText={editingId ? "Save" : "Create"}
        okButtonProps={{
          style: { backgroundColor: "#3f51b5", color: "#fff", height: "40px" },
        }}
        confirmLoading={isCreating || isUpdating}
        cancelButtonProps={{ style: { height: "40px" } }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Category Name
            </label>
            <Input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[50px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={(info) => {
                setFileList(info.fileList);

                const file = info.fileList[0];
                if (file && file.originFileObj) {
                  setImageFile(file);
                } else {
                  setImageFile(null);
                }
              }}
            >
              Upload
            </Upload>
          </div>
        </div>
      </Modal>

      {/* View Extra Services (SubCategory) Modal */}
      <ViewExtraServices
        open={viewServicesModalOpen}
        onClose={() => {
          setViewServicesModalOpen(false);
          setSelectedCategoryId(null);
        }}
        categoryId={selectedCategoryId}
      />

      {/* Add Extra Service (SubCategory) Modal */}
      <AddExtraServiceModal
        open={addServiceModalOpen}
        onClose={() => {
          setAddServiceModalOpen(false);
          setSelectedCategoryId(null);
        }}
        categoryId={selectedCategoryId}
      />
    </div>
  );
};

export default Categories;
