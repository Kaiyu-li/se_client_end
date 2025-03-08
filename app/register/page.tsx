"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, message } from "antd";

interface RegisterFormProps {
  username: string;
  password: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();

  const handleRegister = async (values: RegisterFormProps) => {
    try {
      await apiService.post("/register", values);

      message.success("Registration successful! Redirecting to login...");

      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Registration failed: ${error.message}`);
      } else {
        console.error("An unknown error occurred during registration.");
      }
    }
  };

  return (
      <div className="login-container">
        <Form
            form={form}
            name="register"
            size="large"
            layout="vertical"
            onFinish={handleRegister}
        >
          <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-button">
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={() => router.push("/login")}>
              Back to Login
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default Register;
