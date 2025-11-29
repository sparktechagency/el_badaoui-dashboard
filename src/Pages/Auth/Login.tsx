import {  Form, Input } from "antd";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/apiSlices/authSlice";
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// interface LoginResponse {
//   data?: {
//     accessToken: string;
//     refreshToken: string;
//   };
// }

// interface CheckboxChangeEvent {
//   target: {
//     checked: boolean;
//   };
// }

const Login = () => {
  const navigate = useNavigate();
  // const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [login] = useLoginMutation();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap();
      const { accessToken } = response.data;

    
        localStorage.setItem("authToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken);
     

      navigate("/"); 
    } catch (err) {
      console.log(err);
      toast.error((err as any) || "Login failed");
    }
  };

  // const onCheckboxChange = (e: CheckboxChangeEvent): void => {
  //   setRememberMe(e.target.checked);
  // };

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-white text-sm">
          Please enter your email and password to continue
        </p>
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
            {/* <Checkbox onChange={onCheckboxChange} className="text-sm">
              Remember Me
            </Checkbox> */}

            {/* Forgot Password Link */}
            <a
              href="/auth/forgot-password"
              className="text-sm font-bold text-blue-500 hover:text-blue-700"
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
