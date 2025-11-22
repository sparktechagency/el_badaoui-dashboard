import { useMemo, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Upload,
  ConfigProvider,
} from "antd";
import type { TableProps } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

type Category = {
  id: string;
  title: string;
  image: string;
};

type SubCategory = {
  id: string;
  title: string;
  categoryId: string;
};

const initialCategories: Category[] = [
  {
    id: "cat-tiles",
    title: "Tiles",
    image: "https://picsum.photos/seed/tiles/80/80",
  },
  {
    id: "cat-flooring",
    title: "Flooring",
    image: "https://picsum.photos/seed/flooring/80/80",
  },
  {
    id: "cat-painting",
    title: "Painting",
    image: "https://picsum.photos/seed/painting/80/80",
  },
];

const initialSubCategories: SubCategory[] = [
  { id: "sub-ceramic", title: "Ceramic", categoryId: "cat-tiles" },
  { id: "sub-porcelain", title: "Porcelain", categoryId: "cat-tiles" },
  { id: "sub-wood", title: "Wood", categoryId: "cat-flooring" },
  { id: "sub-acrylic", title: "Acrylic", categoryId: "cat-painting" },
];

const ServiceManagement = () => {
  const [activeKey, setActiveKey] = useState<"category" | "subcategory">(
    "category"
  );
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [subcategories, setSubcategories] =
    useState<SubCategory[]>(initialSubCategories);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState<{
    type: "category" | "subcategory";
    id?: string;
  } | null>(null);

  const categoryColumns: TableProps<Category>["columns"] = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src: string) => (
        <img
          src={src}
          alt="thumb"
          className="w-12 h-12 rounded object-cover border"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditing({ type: "category", id: record.id });
              form.setFieldsValue({
                title: record.title,
                image: [{ uid: record.id, url: record.image, name: "image" }],
              });
              setOpen(true);
            }}
          >
            <FiEdit />
          </Button>
          <Button
            danger
            onClick={() =>
              setCategories((prev) => prev.filter((c) => c.id !== record.id))
            }
          >
            <FiTrash2 />
          </Button>
        </Space>
      ),
    },
  ];

  const subCategoryColumns: TableProps<SubCategory>["columns"] = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (id: string) => categories.find((c) => c.id === id)?.title ?? id,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditing({ type: "subcategory", id: record.id });
              form.setFieldsValue({
                title: record.title,
                categoryId: record.categoryId,
              });
              setOpen(true);
            }}
          >
            <FiEdit />
          </Button>
          <Button
            danger
            onClick={() =>
              setSubcategories((prev) => prev.filter((s) => s.id !== record.id))
            }
          >
            <FiTrash2 />
          </Button>
        </Space>
      ),
    },
  ];

  const onAddClick = (type: "category" | "subcategory") => {
    setEditing({ type });
    form.resetFields();
    setOpen(true);
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing?.type === "category") {
      if (editing.id) {
        const fileObj = values.image?.[0]?.originFileObj as File | undefined;
        const url = values.image?.[0]?.url as string | undefined;
        const image = fileObj ? await toBase64(fileObj) : url;
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? { ...c, title: values.title, image: image ?? c.image }
              : c
          )
        );
      } else {
        const id = `cat-${values.title
          .toLowerCase()
          .replace(/\s+/g, "-")}-${Date.now()}`;
        const fileObj = values.image?.[0]?.originFileObj as File | undefined;
        const image = fileObj
          ? await toBase64(fileObj)
          : values.image?.[0]?.url;
        setCategories((prev) => [
          ...prev,
          { id, title: values.title, image: image ?? "" },
        ]);
      }
    } else if (editing?.type === "subcategory") {
      if (editing.id) {
        setSubcategories((prev) =>
          prev.map((s) => (s.id === editing.id ? { ...s, ...values } : s))
        );
      } else {
        const id = `sub-${values.title
          .toLowerCase()
          .replace(/\s+/g, "-")}-${Date.now()}`;
        setSubcategories((prev) => [
          ...prev,
          { id, title: values.title, categoryId: values.categoryId },
        ]);
      }
    }
    setOpen(false);
  };

  const items = useMemo(
    () => [
      {
        key: "category",
        label: (
          <span className="flex items-center gap-2">
            Category{" "}
            <Tag color="#3f51b5" style={{ color: "#fff" }}>
              {categories.length}
            </Tag>
          </span>
        ),
        children: (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#210630]">
                Categories
              </h3>
              <Button type="primary" onClick={() => onAddClick("category")}>
                <FaPlus /> Add Category
              </Button>
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
              <Table<Category>
                rowKey="id"
                dataSource={categories}
                columns={categoryColumns}
                pagination={{ pageSize: 6 }}
              />
            </ConfigProvider>
          </div>
        ),
      },
      {
        key: "subcategory",
        label: (
          <span className="flex items-center gap-2">
            Subcategory{" "}
            <Tag color="#3f51b5" style={{ color: "#fff" }}>
              {subcategories.length}
            </Tag>
          </span>
        ),
        children: (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#210630]">
                Subcategories
              </h3>
              <Button type="primary" onClick={() => onAddClick("subcategory")}>
                <FaPlus /> Add Sub Category
              </Button>
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
              <Table<SubCategory>
                rowKey="id"
                dataSource={subcategories}
                columns={subCategoryColumns}
                pagination={{ pageSize: 6 }}
              />
            </ConfigProvider>
          </div>
        ),
      },
    ],
    [categories, subcategories]
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl my-7 font-bold text-[#210630]">
          Service Management
        </h2>
      </div>
      <Tabs
        items={items}
        activeKey={activeKey}
        onChange={(k) => setActiveKey(k as any)}
      />

      <Modal
        open={open}
        title={
          editing?.type === "category"
            ? editing?.id
              ? "Edit Category"
              : "Add Category"
            : editing?.id
            ? "Edit Subcategory"
            : "Add Subcategory"
        }
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText={editing?.id ? "Save" : "Create"}
      >
        <Form form={form} layout="vertical">
          {editing?.type === "category" ? (
            <>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                rules={[{ required: true }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  accept="image/*"
                >
                  Upload
                </Upload>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select category"
                  options={categories.map((c) => ({
                    label: c.title,
                    value: c.id,
                  }))}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
