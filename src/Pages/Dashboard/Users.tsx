import { Tabs, Table, ConfigProvider, Button, Tag, Modal, Descriptions } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";

type ClientRow = {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  totalProject: number;
};

type ArtisanRow = {
  id: string;
  name: string;
  speciality: string;
  status: "Active" | "Inactive";
  projectDone: number;
};

const clients: ClientRow[] = [
  { id: "CLT001", name: "John Doe", email: "john.doe@example.com", status: "Active", totalProject: 3 },
  { id: "CLT002", name: "Jane Smith", email: "jane.smith@example.com", status: "Inactive", totalProject: 1 },
  { id: "CLT003", name: "Ibrahim Kholil", email: "ibrahim@example.com", status: "Active", totalProject: 5 },
];

const artisans: ArtisanRow[] = [
  { id: "ART001", name: "Benjamin", speciality: "Floor Covering", status: "Active", projectDone: 12 },
  { id: "ART002", name: "Alicia", speciality: "Painting", status: "Inactive", projectDone: 7 },
  { id: "ART003", name: "Omar", speciality: "Tiles", status: "Active", projectDone: 20 },
];

const statusTag = (s: "Active" | "Inactive") => (
  <Tag color={s === "Active" ? "#14b8a6" : "#f43f5e"} style={{ color: "#fff" }}>
    {s}
  </Tag>
);


const Users = () => {
  const [clientData, setClientData] = useState<ClientRow[]>(clients);
  const [artisanData, setArtisanData] = useState<ArtisanRow[]>(artisans);
  const [viewOpen, setViewOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [selected, setSelected] = useState<ClientRow | ArtisanRow | null>(null);

  const handleView = (record: ClientRow | ArtisanRow) => {
    setSelected(record);
    setViewOpen(true);
  };

  const handleBlock = (record: ClientRow | ArtisanRow) => {
    setSelected(record);
    setBlockOpen(true);
  };

  const confirmBlock = () => {
    if (!selected) return;
    if ("email" in selected) {
      setClientData((prev: ClientRow[]) => prev.map((c: ClientRow) => (c.id === selected.id ? { ...c, status: "Inactive" } : c)));
    } else {
      setArtisanData((prev: ArtisanRow[]) => prev.map((a: ArtisanRow) => (a.id === selected.id ? { ...a, status: "Inactive" } : a)));
    }
    setBlockOpen(false);
  };

  const clientColumns: ColumnsType<ClientRow> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Client Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Status", dataIndex: "status", key: "status", render: statusTag },
    { title: "Total Project", dataIndex: "totalProject", key: "totalProject" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="link" icon={<LockOutlined />} onClick={() => handleBlock(record)} />
        </div>
      ),
    },
  ];

  const artisanColumns: ColumnsType<ArtisanRow> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Speciality", dataIndex: "speciality", key: "speciality" },
    { title: "Status", dataIndex: "status", key: "status", render: statusTag },
    { title: "Project Done", dataIndex: "projectDone", key: "projectDone" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="link" icon={<LockOutlined />} onClick={() => handleBlock(record)} />
        </div>
      ),
    },
  ];
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
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
        <Tabs
          items={[
            {
              key: "clients",
              label: "Clients",
              children: (
                <Table<ClientRow> rowKey="id" columns={clientColumns} dataSource={clientData} pagination={{ pageSize: 8 }} />
              ),
            },
            {
              key: "artisans",
              label: "Artisans",
              children: (
                <Table<ArtisanRow> rowKey="id" columns={artisanColumns} dataSource={artisanData} pagination={{ pageSize: 8 }} />
              ),
            },
          ]}
        />
      </ConfigProvider>

      <Modal
        title={selected && "email" in selected ? "Client Details" : "Artisan Details"}
        open={viewOpen}
        onCancel={() => {
          setViewOpen(false);
          setSelected(null);
        }}
        footer={null}
      >
        {selected && "email" in selected ? (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID">{selected.id}</Descriptions.Item>
            <Descriptions.Item label="Client Name">{selected.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
            <Descriptions.Item label="Status">{statusTag(selected.status)}</Descriptions.Item>
            <Descriptions.Item label="Total Project">{selected.totalProject}</Descriptions.Item>
          </Descriptions>
        ) : selected ? (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID">{selected.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{selected.name}</Descriptions.Item>
            <Descriptions.Item label="Speciality">{(selected as ArtisanRow).speciality}</Descriptions.Item>
            <Descriptions.Item label="Status">{statusTag(selected.status)}</Descriptions.Item>
            <Descriptions.Item label="Project Done">{(selected as ArtisanRow).projectDone}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      <Modal
        title="Block User"
        open={blockOpen}
        onOk={confirmBlock}
        okText="Yes, Block"
        onCancel={() => setBlockOpen(false)}
      >
        Are you sure you want to block this user?
      </Modal>
    </div>
  );
};

export default Users;
