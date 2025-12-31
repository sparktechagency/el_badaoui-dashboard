import { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import "react-phone-input-2/lib/style.css";
import logo from "../../../assets/randomProfile2.jpg";
import rentMeLogo from "../../../assets/navLogo.png";
import { useFetchAdminProfileQuery, useUpdateAdminProfileMutation } from "@/redux/apiSlices/authSlice";
import toast from "react-hot-toast";
import { imageUrl } from "@/redux/api/baseApi";

const baseUrl = imageUrl;

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
}

// interface AdminData {
//   firstName: string;
//   lastName: string;   
//   email: string;
//   address: string;
//   contact: string;
//   profileImg: string;
// }

const PersonalInfo = () => {

  const [imgURL, setImgURL] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  // const isLoading = false;

  const { data: fetchAdminProfile, isLoading } = useFetchAdminProfileQuery();
  const [updateAdminProfile] = useUpdateAdminProfileMutation();

  // const fetchAdminProfile: { data?: AdminData } = {};

  const adminData = fetchAdminProfile?.data;
  // console.log("adminData", adminData);

  useEffect(() => {
    if (adminData) {
      form.setFieldsValue({
        firstName: adminData?.firstName,
        lastName: adminData?.lastName,
        email: adminData?.email,
        address: adminData?.address,
        phone: adminData?.phone,
      });
      setImgURL(`${baseUrl}${adminData?.image}`);
      // setContact(adminData?.phone);
    }
  }, [form, adminData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={rentMeLogo} alt="" />
      </div>
    );
  }

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const imgUrl = URL.createObjectURL(selectedFile);
      setImgURL(imgUrl);
      setFile(selectedFile);
    }
  };

  const onFinish = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      // formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("phone", values.phone);

      if (file) {
        formData.append("image", file);
      } else {
        // formData.append("imageUrl", imgURL || "");
      }

      const response = await updateAdminProfile(formData);

      if (response.data) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      // }
      }
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Link to="/" className="flex items-center gap-[2px] text-base rounded-lg">
        <span>
          <BiLeftArrowAlt size={22} />
        </span>
        <span>Back</span>
      </Link>
      <div className="flex bg-white p-10 mt-10 rounded-2xl border gap-10 w-full">
        <div className="w-8/12">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter your first name" }]}
            >
              <Input className="py-3 bg-gray-100 rounded-xl" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter your last name" }]}
            >
              <Input className="py-3 bg-gray-100 rounded-xl" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: "email", message: "Please enter a valid email" },
                { required: true, message: "Please enter your email" },
              ]}
            >
              <Input readOnly className="py-3 bg-gray-100 rounded-xl" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please enter your Address" }]}
            >
              <Input className="py-3 bg-gray-100 rounded-xl" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Contact"
              rules={[{ required: true, message: "Please enter your Contact" }]}
            >
              <Input className="py-3 bg-gray-100 rounded-xl" />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                block
                style={{
                  width: 178,
                  height: 48,
                  fontWeight: "400px",
                  background: "#3F51B5",
                  color: "white",
                }}
                className="roboto-medium mt-10 text-sm leading-4"
              >
                Save and Change
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div>
          <div className="flex flex-col items-center gap-10 bg-slate-100 px-20 py-12 rounded-xl justify-center">
            <input
              onChange={onChangeImage}
              type="file"
              id="img"
              className="hidden"
            />
            <label
              htmlFor="img"
              className="relative w-48 h-48 cursor-pointer rounded-full border border-primary bg-white bg-cover bg-center"
              style={{ backgroundImage: `url(${imgURL ? imgURL : logo})` }}
            >
              <div className="absolute bottom-1 right-1 w-12 h-12 rounded-full border-2 border-primary bg-gray-100 flex items-center justify-center">
                <MdOutlineAddPhotoAlternate
                  size={22}
                  className="text-primary"
                />
              </div>
            </label>
            <div className="text-center">
              <h1>Profile</h1>
              <h1 className="text-xl">Admin</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
