import { useState } from "react";
import { Modal, Table, Button, Space, Tag, Tooltip, message, Spin } from "antd";
import type { TableProps } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useGetExtraServicesQuery, useDeleteExtraServiceMutation } from "@/redux/apiSlices/categoryApi";
import AddExtraServiceModal from "./ExtraService";
// import EditExtraServiceModal from "./EditExtraServiceModal";

type Option = {
  _id: string;
  optionText: string;
  optionImage?: string;
  priceModifierValue: number;
  priceModifierType: string;
};

type ExtraService = {
  _id: string;
  categoryId: string;
  questionText: string;
  questionType: string;
  options: Option[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
};

const ViewExtraServices = ({ open, onClose, categoryId }: Props) => {
  const [editingService, setEditingService] = useState<ExtraService | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: servicesData, isLoading } = useGetExtraServicesQuery(categoryId, {
    skip: !categoryId
  });
  const [deleteService, { isLoading: isDeleting }] = useDeleteExtraServiceMutation();

  const services = servicesData?.data || [];

  const handleEdit = (record: ExtraService) => {
    setEditingService(record);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Extra Service",
      content: "Are you sure you want to delete this extra service?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteService(id).unwrap();
          message.success("Extra service deleted successfully!");
        } catch (error) {
          message.error("Failed to delete extra service");
        }
      },
    });
  };

  const columns: TableProps<ExtraService>["columns"] = [
    {
      title: "Question",
      dataIndex: "questionText",
      key: "questionText",
      width: "30%",
    },
    {
      title: "Type",
      dataIndex: "questionType",
      key: "questionType",
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          SINGLE_CHOICE: "blue",
          MULTIPLE_CHOICE: "green",
          IMAGE_NAME: "purple"
        };
        return (
          <Tag color={colorMap[type] || "default"}>
            {type.replace(/_/g, " ")}
          </Tag>
        );
      },
    },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      render: (options: Option[]) => (
        <Tag color="cyan">{options.length} options</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Service">
            <Button
              size="small"
              icon={<FiEdit />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Service">
            <Button
              danger
              size="small"
              icon={<FiTrash2 />}
              onClick={() => handleDelete(record._id)}
              loading={isDeleting}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: ExtraService) => {
    const optionColumns: TableProps<Option>["columns"] = [
      {
        title: "Option Text",
        dataIndex: "optionText",
        key: "optionText",
      },
      ...(record.questionType === "IMAGE_NAME"
        ? [
            {
              title: "Image",
              dataIndex: "optionImage",
              key: "optionImage",
              render: (src: string) => (
                <img
                   src={`${import.meta.env.VITE_API_BASE_URL || ""}${src}`} 
                  alt="option"
                  className="w-12 h-12 rounded object-cover border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/80";
                  }}
                />
              ),
            },
          ]
        : []),
      {
        title: "Price Modifier",
        dataIndex: "priceModifierValue",
        key: "priceModifierValue",
        render: (value: number, opt: Option) => (
          <span>
            {value} {opt.priceModifierType === "PERCENTAGE" ? "%" : "$"}
          </span>
        ),
      },
      {
        title: "Type",
        dataIndex: "priceModifierType",
        key: "priceModifierType",
        render: (type: string) => (
          <Tag color={type === "FIXED" ? "blue" : "orange"}>{type}</Tag>
        ),
      },
    ];

    return (
      <Table
        columns={optionColumns}
        dataSource={record.options}
        pagination={false}
        rowKey="_id"
        size="small"
      />
    );
  };

  return (
    <>
      <Modal
        open={open}
        title="Extra Services"
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
        ]}
        width={850}
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No extra services found for this category
          </div>
        ) : (
          <Table<ExtraService>
            columns={columns}
            dataSource={services}
            rowKey="_id"
            expandable={{
              expandedRowRender,
              defaultExpandedRowKeys: services.length > 0 ? [services[0]._id] : [],
            }}
            pagination={{ pageSize: 5 }}
          />
        )}
      </Modal>

      <AddExtraServiceModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingService(null);
        }}
        service={editingService}
      />
    </>
  );
};

export default ViewExtraServices;
