"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";

interface FormFieldProps {
  label: string;
  value: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const { set: setUser } = useLocalStorage<User | null>("user", null);
  const [isClient, setIsClient] = useState(false);

  // Ensure localStorage is only accessed client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (values: FormFieldProps) => {
    if (!isClient) return; // Only proceed if client-side

    try {
      const response = await apiService.post<User>("/login", values);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        router.push("/users");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during the login:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
    }
  };

  if (!isClient) return null; // Prevent SSR issues

  return (
      <div className="login-container">
        <Form
            form={form}
            name="login"
            size="large"
            variant="outlined"
            onFinish={handleLogin}
            layout="vertical"
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
            <Input placeholder="Enter password" type="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={() => router.push("/register")}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default Login;
