import { Checkbox, Form, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useLoginMutation } from "@/redux/apiSlices/authSlice";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

interface CheckboxChangeEvent {
  target: {
    checked: boolean;
  };
}

const Login = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [login] = useLoginMutation();

  const onFinish = async (values: LoginFormValues): Promise<void> => {
    try {
      console.log(values);
      const response = (await login(values).unwrap()) as LoginResponse;
      const { accessToken } = response?.data || {};
      const { refreshToken } = response?.data || {};

      if (rememberMe) {
        localStorage.setItem("authToken", accessToken || "");
        localStorage.setItem("refreshToken", refreshToken || "");
        Cookies.set("refreshToken", refreshToken || "");
      } else {
        sessionStorage.setItem("authToken", accessToken || "");
        localStorage.setItem("refreshToken", refreshToken || "");
        Cookies.set("refreshToken", refreshToken || "");
      }

      navigate("/");
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred", {
        style: {
          fontSize: "18px",
          padding: "20px",
          maxWidth: "600px",
        },
      });
    }
  };

  const onCheckboxChange = (e: CheckboxChangeEvent): void => {
    setRememberMe(e.target.checked);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-6">Login</h1>
        <p>Please enter your email and password to continue</p>
      </div>
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          remember: false, // Default state for the checkbox
        }}
      >
        {/* Email Field */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            placeholder="Enter your email address"
            style={{
              height: 40,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          label={<p>Password</p>}
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            style={{
              height: 40,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Form.Item>

        {/* Remember Me and Forgot Password */}
        <Form.Item style={{ marginBottom: 0 }}>
          <div className="flex justify-between items-center">
            {/* Remember Me Checkbox */}
            <Checkbox onChange={onCheckboxChange} className="text-sm">
              Remember Me
            </Checkbox>

            {/* Forgot Password Link */}
            <a
              href="/auth/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Forgot Password?
            </a>
          </div>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBottom: 0 }}>
          <button
            type="submit"
            style={{
              width: "100%",
              height: 45,
              fontWeight: 400,
              fontSize: 18,
              marginTop: 20,
            }}
            className={`flex items-center justify-center bg-primary text-white rounded-lg`}
          >
            Sign in
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
