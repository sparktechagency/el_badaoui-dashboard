import { Button, Tag, Descriptions } from "antd";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

type Status = "Accepted" | "Pending Signature" | "Drafting" | "New Inquiry";

type Details = {
  id: string;
  clientName: string;
  status: Status;
  financial: {
    quoteValue: number;
    platformFeePercent: number;
    invoicesIssued: string;
  };
  project: {
    serviceType: string;
    projectAddress: string;
    startDate: string;
    lastActivity: string;
    internalNotes: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalProjects: number;
  };
  artisan: {
    id: string;
    name: string;
    focus: string;
    email: string;
    phone: string;
    totalProjects: number;
  };
};

const statusColor: Record<Status, string> = {
  Accepted: "#14b8a6",
  "Pending Signature": "#f59e0b",
  Drafting: "#a78bfa",
  "New Inquiry": "#3b82f6",
};

const fake: Record<string, Details> = {
  "PRJ-1200": {
    id: "PRJ-1200",
    clientName: "Md Ibrahim Kholil",
    status: "Accepted",
    financial: {
      quoteValue: 5510.04,
      platformFeePercent: 15,
      invoicesIssued: "1/2",
    },
    project: {
      serviceType: "Laying Floor Covering",
      projectAddress: "48/1 Mohakhali Dhaka 1212, Bangladesh",
      startDate: "2025-10-21",
      lastActivity: "Quote Signed By Client",
      internalNotes:
        "Client is very specific about tile pattern. Confirm supply order is correct.",
    },
    client: {
      id: "#4285",
      name: "Md Ibrahim Kholil",
      email: "mdibukholl123@gmail.com",
      phone: "+33 12 34 56 78",
      totalProjects: 3,
    },
    artisan: {
      id: "#A402",
      name: "Benjamin",
      focus: "Laying Floor Covering",
      email: "Benjamin123@gmail.com",
      phone: "+33 12 34 56 78",
      totalProjects: 3,
    },
  },
};

const currency = (n: number, c: string = "EUR") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

const ProjectManagementDetails = () => {
  const { id } = useParams();

  const details = useMemo<Details>(() => {
    const base = fake[id ?? "PRJ-1200"] ?? fake["PRJ-1200"];
    return base;
  }, [id]);

  const fee =
    (details.financial.quoteValue * details.financial.platformFeePercent) / 100;
  const net = details.financial.quoteValue - fee;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#210630]">
            {details.clientName}
          </h1>
          <div className="mt-2">
            <Tag color={statusColor[details.status]} style={{ color: "#fff" }}>
              {details.status}
            </Tag>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="primary">Send Message</Button>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="bg-white w-[67%] rounded-2xl p-4 shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold text-[#210630]">
            Financial Summary
          </h3>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Quote Value</div>
              <div className="text-base font-semibold">
                {currency(details.financial.quoteValue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">
                Platform Fee ({details.financial.platformFeePercent}%)
              </div>
              <div className="text-base font-semibold">{currency(fee)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Net To Artisan</div>
              <div className="text-base font-semibold">{currency(net)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Invoices Issued</div>
              <div className="text-base font-semibold">
                {details.financial.invoicesIssued}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white w-[33%] rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#210630]">
            Client : {details.client.name}
          </h3>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div>ID : {details.client.id}</div>
            <div>Email : {details.client.email}</div>
            <div>Phone : {details.client.phone}</div>
            <div>
              Total Projects :{" "}
              {String(details.client.totalProjects).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="grid w-[67%] gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm md:col-span-2">
            <h3 className="text-lg font-semibold text-[#210630]">
              Project Details
            </h3>
            <div className="mt-4">
              <Descriptions column={1} labelStyle={{ width: 180 }}>
                <Descriptions.Item label="Service Type">
                  {details.project.serviceType}
                </Descriptions.Item>
                <Descriptions.Item label="Project Address">
                  {details.project.projectAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {details.project.startDate}
                </Descriptions.Item>
                <Descriptions.Item label="Last Activity">
                  {details.project.lastActivity}
                </Descriptions.Item>
              </Descriptions>
              <div className="mt-4">
                <div className="text-sm text-gray-600">Internal Notes</div>
                <div className="mt-2 bg-gray-100 border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                  {details.project.internalNotes}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white w-[33%] rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#210630]">
            Artisan: {details.artisan.name}
          </h3>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div>ID : {details.artisan.id}</div>
            <div>Service Focus : {details.artisan.focus}</div>
            <div>Email : {details.artisan.email}</div>
            <div>Phone : {details.artisan.phone}</div>
            <div>
              Total Projects :{" "}
              {String(details.artisan.totalProjects).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementDetails;
