import { useSingleProjectManagementQuery, useUpdateProjectManagementMutation } from "@/redux/apiSlices/projectManagementApi";
import { Button, Tag, Descriptions, Spin, Select, InputNumber, message, Modal } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
// import {
//   useSingleProjectManagementQuery,
//   useUpdateProjectManagementMutation,
// } from "../api/projectManagementApi";

type Status = "NEW" | "COMPLETED" | "ACCEPTED";

const statusColor: Record<Status, string> = {
  ACCEPTED: "#14b8a6",
  COMPLETED: "#f59e0b",
  NEW: "#3b82f6",
};

const statusOptions = [
  { label: "New", value: "NEW" as const },
  { label: "Accepted", value: "ACCEPTED" as const },
  { label: "Completed", value: "COMPLETED" as const },
];

const currency = (n: number, c: string = "EUR") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

const ProjectManagementDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useSingleProjectManagementQuery(id || "", {
    skip: !id,
  });
  
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectManagementMutation();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isVatModalOpen, setIsVatModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | undefined>();
  const [totalWithoutVat, setTotalWithoutVat] = useState<number | undefined>();
  const [totalWithVat, setTotalWithVat] = useState<number | undefined>();

  const details = data?.data;

  // Open status modal with current status as default
  const openStatusModal = () => {
    if (details) {
      setSelectedStatus(details.status);
    }
    setIsStatusModalOpen(true);
  };

  // Open VAT modal with current values as default
  const openVatModal = () => {
    if (details) {
      setTotalWithoutVat(details.totalWithoutVat);
      setTotalWithVat(details.totalWithVat);
    }
    setIsVatModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!id || !selectedStatus) return;
    
    try {
      await updateProject({
        id,
        status: selectedStatus,
      }).unwrap();
      
      message.success("Status updated successfully");
      setIsStatusModalOpen(false);
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleVatUpdate = async () => {
    if (!id) return;
    
    const updateData: any = {};
    if (totalWithoutVat !== undefined) updateData.totalWithoutVat = totalWithoutVat;
    if (totalWithVat !== undefined) updateData.totalWithVat = totalWithVat;
    
    if (Object.keys(updateData).length === 0) {
      message.warning("Please enter at least one value");
      return;
    }
    
    try {
      await updateProject({
        id,
        ...updateData,
      }).unwrap();
      
      message.success("Values updated successfully");
      setIsVatModalOpen(false);
      setTotalWithoutVat(undefined);
      setTotalWithVat(undefined);
    } catch (error) {
      message.error("Failed to update values");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-8 text-gray-500">
        Project not found
      </div>
    );
  }

  const clientName = `${details.firstName} ${details.lastName}`;
  const artisanName = details.artisanId
    ? `${details.artisanId.firstName} ${details.artisanId.lastName}`
    : "Not assigned";

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#210630]">
            {details.projectCode}
          </h1>
          {/* <div className="mt-2">
            <Tag color={statusColor[details.status as Status]} style={{ color: "#fff" }}>
              {details.status}
            </Tag>
          </div> */}
        </div>
        <div className="flex items-center gap-3">
          <Button  type="default" onClick={openStatusModal} className="py-[22px]">
            Update Status
          </Button>
          <Button type="default" onClick={openVatModal} className="py-[22px]">
            Update Values
          </Button>


          {/* <Button type="primary">Send Message</Button> */}

            <Button 
            type="default"
            onClick={() => {
              if (details?.email) {
                window.location.href = `mailto:${details.email}?subject=Regarding Project ${details.projectCode}`;
              }
            }}
            className="py-[22px]"
          >
            Send Message
          </Button>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="bg-white w-[67%] rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#210630]">
            Financial Summary
          </h3>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Without VAT</div>
              <div className="text-base font-semibold">
                {details.totalWithoutVat ? currency(details.totalWithoutVat) : "—"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total With VAT</div>
              <div className="text-base font-semibold">
                {currency(details.totalWithVat)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Created At</div>
              <div className="text-base font-semibold">
                {new Date(details.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white w-[33%] rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#210630]">
            Client: {clientName}
          </h3>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div>Email: {details.email}</div>
            <div>Status: {details.status}</div>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="bg-white w-[67%] rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#210630]">
            Project Details
          </h3>
          <div className="mt-4">
            <Descriptions column={1} labelStyle={{ width: 180 }}>
              <Descriptions.Item label="Project Code">
                {details.projectCode}
              </Descriptions.Item>
              <Descriptions.Item label="Client Name">
                {clientName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {details.email}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColor[details.status as Status]} style={{ color: "#fff" }}>
                  {details.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <div className="bg-white w-[33%] rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#210630]">
            Artisan: {artisanName}
          </h3>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {details.artisanId ? (
              <>
                <div>ID: {details.artisanId._id}</div>
                <div>Name: {artisanName}</div>
              </>
            ) : (
              <div>No artisan assigned</div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        title="Update Project Status"
        open={isStatusModalOpen}
        onOk={handleStatusUpdate}
        onCancel={() => {
          setIsStatusModalOpen(false);
          setSelectedStatus(undefined);
        }}
        confirmLoading={isUpdating}
      >
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">Select Status</label>
          <Select
            className="w-full"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="Choose new status"
          />
          <div className="mt-2 text-xs text-gray-500">
            Current status: <Tag color={statusColor[(details?.status as Status) || "NEW"]}>{details?.status}</Tag>
          </div>
        </div>
      </Modal>

      {/* VAT Update Modal */}
      <Modal
        title="Update Project Values"
        open={isVatModalOpen}
        onOk={handleVatUpdate}
        onCancel={() => {
          setIsVatModalOpen(false);
          setTotalWithoutVat(undefined);
          setTotalWithVat(undefined);
        }}
        confirmLoading={isUpdating}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Total Without VAT
            </label>
            <InputNumber
              className="w-full"
              value={totalWithoutVat}
              onChange={(val) => setTotalWithoutVat(val || undefined)}
              placeholder="Enter amount"
              min={0}
              prefix="€"
            />
            <div className="mt-1 text-xs text-gray-500">
              Current: {details?.totalWithoutVat ? currency(details.totalWithoutVat) : "Not set"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Total With VAT
            </label>
            <InputNumber
              className="w-full"
              value={totalWithVat}
              onChange={(val) => setTotalWithVat(val || undefined)}
              placeholder="Enter amount"
              min={0}
              prefix="€"
            />
            <div className="mt-1 text-xs text-gray-500">
              Current: {currency(details?.totalWithVat || 0)}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectManagementDetails;