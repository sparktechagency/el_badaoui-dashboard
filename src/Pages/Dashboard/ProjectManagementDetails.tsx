import {
  useSingleProjectManagementQuery,
  useUpdateProjectManagementMutation,
} from "@/redux/apiSlices/projectManagementApi";
import {
  Button,
  Tag,
  Descriptions,
  Spin,
  Select,
  InputNumber,
  message,
  Modal,
} from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAllArtisanQuery } from "@/redux/apiSlices/projectManagementApi";

type Status = "NEW" | "COMPLETED" | "ACCEPTED";

const statusColor: Record<Status, string> = {
  ACCEPTED: "#14b8a6",
  COMPLETED:"#3b82f6",
  NEW:  "#f59e0b",
};

const statusOptions = [
  { label: "Estimé", value: "NEW" as const },
  { label: "Projet terminé ", value: "COMPLETED" as const },
  { label: "Projet en cours", value: "ACCEPTED" as const },
];

const currency = (n: number, c: string = "EUR") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

const ProjectManagementDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useSingleProjectManagementQuery(id || "", {
    skip: !id,
  });

  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectManagementMutation();
  const { data: artisanData, isLoading: isArtisanLoading } =
    useGetAllArtisanQuery(null);
  console.log(artisanData);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isVatModalOpen, setIsVatModalOpen] = useState(false);
  const [isArtisanModalOpen, setIsArtisanModalOpen] = useState(false); // NEW: Artisan modal state
  const [selectedStatus, setSelectedStatus] = useState<Status | undefined>();
  const [totalWithoutVat, setTotalWithoutVat] = useState<number | undefined>();
  const [totalWithVat, setTotalWithVat] = useState<number | undefined>();
  const [selectedArtisanId, setSelectedArtisanId] = useState<
    string | undefined
  >(); // NEW: Selected artisan state

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

  // NEW: Open Artisan modal with current artisan as default
  const openArtisanModal = () => {
    if (details?.artisanId) {
      setSelectedArtisanId(details.artisanId._id);
    }
    setIsArtisanModalOpen(true);
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
    if (totalWithoutVat !== undefined)
      updateData.totalWithoutVat = totalWithoutVat;
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

  // NEW: Handle artisan assignment
  const handleArtisanUpdate = async () => {
    if (!id || !selectedArtisanId) {
      message.warning("Please select an artisan");
      return;
    }

    try {
      await updateProject({
        id,
        artisanId: selectedArtisanId,
      }).unwrap();

      message.success("Artisan assigned successfully");
      setIsArtisanModalOpen(false);
      setSelectedArtisanId(undefined);
    } catch (error) {
      message.error("Failed to assign artisan");
    }
  };

  // NEW: Prepare artisan options for dropdown
  const artisanOptions =
    artisanData?.data?.map((artisan: any) => ({
      label: `${artisan.firstName} ${artisan.lastName}`,
      value: artisan._id,
    })) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-8 text-gray-500">Project not found</div>
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
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="default"
            onClick={openStatusModal}
            className="py-[22px]"
          >
            Update Status
          </Button>
          <Button type="default" onClick={openVatModal} className="py-[22px]">
            Update Values
          </Button>
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
                {details.totalWithoutVat
                  ? currency(details.totalWithoutVat)
                  : "—"}
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
                <Tag
                  color={statusColor[details.status as Status]}
                  style={{ color: "#fff" }}
                >
                  {details.status === "NEW" ? "Estimé" : details.status === "COMPLETED" ? "Projet terminé " : "Projet en cours"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        {/* UPDATED: Artisan section with assign button */}
        <div className="bg-white w-[33%] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#210630]">
              Artisan: {artisanName}
            </h3>
            <Button
              // type="primary"
              size="small"
              onClick={openArtisanModal}
              loading={isArtisanLoading}
              className="py-[16px] bg-[#3f51b5] text-white"
            >
              {details.artisanId ? "Change" : "Assign"}
            </Button>
          </div>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {details.artisanId ? (
              <>
                {/* <div>ID: {details.artisanId._id.slice(-6)}</div> */}
                {/* <p>Name: {artisanName}</p> */}
                <p>Email: {details.artisanId?.email}</p>
                <p>Phone: {details.artisanId?.phone || "N/A"}</p>
                <p>Speciality: {details.artisanId?.speciality || "N/A"}</p>
                <p>Total Projects: {details.artisanId?.totalProjects || "N/A"}</p>

              </>
            ) : (
              <div>No artisan assigned</div>
            )}
          </div>
        </div>
      </div>

      {details?.quote && (
        <div>
          <Button
            onClick={() => {
              const pdfUrl = details.quote[0]?.pdfUrl;
              const fullUrl = `${
                import.meta.env.VITE_API_BASE_URL || ""
              }${pdfUrl}`;
              window.open(fullUrl, "_blank");
            }}
            className="bg-[#3f51b5] text-white py-[22px]  rounded-md"
          >
            View Estimate PDF
          </Button>
        </div>
      )}

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
          <label className="block text-sm font-medium mb-2">
            Select Status
          </label>
          <Select
            className="w-full"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="Choose new status"
          />
          <div className="mt-2 text-xs text-gray-500">
            Current status:{" "}
            <Tag color={statusColor[(details?.status as Status) || "NEW"]}>
              {details?.status === "NEW" ? "Estimé" : details.status === "COMPLETED" ? "Projet terminé " : "Projet en cours"}
            </Tag>
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
              Current:{" "}
              {details?.totalWithoutVat
                ? currency(details.totalWithoutVat)
                : "Not set"}
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

      {/* NEW: Artisan Assignment Modal */}
      <Modal
        title="Assign Artisan to Project"
        open={isArtisanModalOpen}
        onOk={handleArtisanUpdate}
        onCancel={() => {
          setIsArtisanModalOpen(false);
          setSelectedArtisanId(undefined);
        }}
        confirmLoading={isUpdating}
        okButtonProps={{
          style: { backgroundColor: "#3f51b5", color: "#fff", height: "40px" },
        }}
        cancelButtonProps={{ style: { height: "40px" } }}
        okText="Assign"
      >
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">
            Select Artisan
          </label>
          <Select
            className="w-full h-12"
            value={selectedArtisanId}
            onChange={setSelectedArtisanId}
            options={artisanOptions}
            placeholder="Choose an artisan"
            loading={isArtisanLoading}
            showSearch
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
          <div className="mt-2 text-xs text-gray-500">
            Current artisan: <span className="font-medium">{artisanName}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectManagementDetails;
