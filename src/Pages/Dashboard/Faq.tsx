import { useState } from "react";
import { Button, Table } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import FaqModal from "../../components/ui/FAQ/FaqModal";

interface FaqData {
  key: string;
  question: string;
  answer: string;
}

const Faq = () => {
  const [openAddModel, setOpenAddModel] = useState(false);
  const [modalData, setModalData] = useState<FaqData | null>(null);

  // Dummy data for FAQs
  const faqData: FaqData[] = [
    {
      key: "1",
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign Up' button and fill in your details.",
    },
    {
      key: "2",
      question: "How can I reset my password?",
      answer:
        "You can reset your password by clicking 'Forgot Password' on the login page.",
    },
    {
      key: "3",
      question: "How do I contact support?",
      answer:
        "You can contact our support team through the contact form or email us directly.",
    },
  ];

  const handleEdit = (record: FaqData) => {
    setModalData(record);
    setOpenAddModel(true);
  };

  const handleDelete = (key: string) => {
    console.log("Delete FAQ with key:", key);
    // Add delete logic here
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      width: "40%",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      width: "50%",
      render: (text: string) => <div className="max-w-md truncate">{text}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      width: "10%",
      render: (_: any, record: FaqData) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">FAQ Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setModalData(null);
            setOpenAddModel(true);
          }}
        >
          Add FAQ
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={faqData}
          pagination={{
            pageSize: 10,
          }}
        />
      </div>

      <FaqModal
        openAddModel={openAddModel}
        setOpenAddModel={setOpenAddModel}
        modalData={modalData}
        setModalData={setModalData}
      />
    </div>
  );
};

export default Faq;
