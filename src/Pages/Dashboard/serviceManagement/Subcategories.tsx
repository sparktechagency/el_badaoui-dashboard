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
  Select,
  InputNumber,
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
  costPerUnit: number;
  elements: string[];
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
  {
    id: "sub-ceramic",
    title: "Ceramic",
    categoryId: "cat-tiles",
    costPerUnit: 25,
    elements: ["Ceiling", "Wall"],
  },
  {
    id: "sub-porcelain",
    title: "Porcelain",
    categoryId: "cat-tiles",
    costPerUnit: 28,
    elements: ["Wall"],
  },
  {
    id: "sub-wood",
    title: "Wood",
    categoryId: "cat-flooring",
    costPerUnit: 35,
    elements: ["Floor"],
  },
  {
    id: "sub-acrylic",
    title: "Acrylic",
    categoryId: "cat-painting",
    costPerUnit: 22,
    elements: ["Wall", "Ceiling"],
  },
];

const Subcategories = () => {
  const categories: Category[] = initialCategories;
  const subcategories: SubCategory[] = initialSubCategories;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

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
              setEditingId(record.id);
              form.setFieldsValue({
                title: record.title,
                categoryId: record.categoryId,
                costPerUnit: record.costPerUnit,
                elements: record.elements,
              });
              setOpen(true);
            }}
          >
            <FiEdit />
          </Button>
          <Button danger disabled>
            <FiTrash2 />
          </Button>
        </Space>
      ),
    },
  ];

  const onAddClick = () => {
    setEditingId(null);
    form.resetFields();
    setOpen(true);
  };

  const onSubmit = () => {
    setOpen(false);
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
          <Button type="primary" onClick={onAddClick}>
            <FaPlus /> Add Sub Category
          </Button>
        </div>
        <ConfigProvider
          theme={{ components: { Table: { headerBg: "#fff4e5" } } }}
        >
          <Table<SubCategory>
            rowKey="id"
            dataSource={subcategories}
            columns={subCategoryColumns}
            pagination={{ pageSize: 6 }}
          />
        </ConfigProvider>
      </div>

      <Modal
        open={open}
        title={editingId ? "Edit Subcategory" : "Add Subcategory"}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText={editingId ? "Save" : "Create"}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="p-4 border rounded-lg space-y-4">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
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
            <Form.Item
              name="costPerUnit"
              label="Cost per unit (m2)"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter cost"
              />
            </Form.Item>
          </div>
          <div className="p-4 border rounded-lg">
            <Form.List name="elements" initialValue={["Ceiling", "Wall"]}>
              {(fields, { add, remove }) => (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Elements needing work</span>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<FaPlus />}
                    >
                      Add element
                    </Button>
                  </div>
                  {fields.map((field) => (
                    <div key={field.key} className="flex items-center gap-2">
                      <Form.Item
                        name={field.name}
                        rules={[{ required: true }]}
                        className="flex-1"
                      >
                        <Input placeholder="e.g., Ceiling, Wall" />
                      </Form.Item>
                      <Button
                        danger
                        type="text"
                        icon={<FiTrash2 />}
                        onClick={() => remove(field.name)}
                        className="mb-5"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Subcategories;
