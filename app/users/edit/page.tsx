"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { Form, Input, Button, Card, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { User } from "@/types/user";
import useLocalStorage from "@/hooks/useLocalStorage";

const EditProfile: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const apiService = useApi();
    const [user, setUser] = useState<User | null>(null);

    // Correct type for `useLocalStorage`, assuming the `user` is stored as an object in localStorage.
    const { value: userData } = useLocalStorage<User | null>("user", null);
    const { set: setLocalUser } = useLocalStorage<User | null>("user", null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!userData) {
                    return;
                }
                setUser(userData);
                form.setFieldsValue({
                    username: userData.username,
                    birthday: userData.birthday ? dayjs(userData.birthday) : null,
                });
            } catch (error) {
                console.error("Failed to load user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [form, userData]);

    const handleSave = async (values: { username: string; birthday: dayjs.Dayjs }) => {
        if (!user) {
            message.error("User data is missing. Please log in again.");
            return;
        }

        try {
            const formattedValues = {
                ...values,
                birthday: values.birthday.format("YYYY-MM-DD"),
            };
            const updatedUser = await apiService.put<User>(`/users/update/${user.id}`, formattedValues);
            message.success("Profile updated successfully!");
            setLocalUser(updatedUser);
            router.push(`/users`);
        } catch (error) {
            message.error("Update failed!");
            console.error(error);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="login-container">
            <Card title="Edit Profile" className="edit-profile-container">
                {user && (
                    <Form form={form} onFinish={handleSave}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: "Please enter your username" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Birth Date"
                            name="birthday"
                            rules={[{ required: true, message: "Please select your birth date" }]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default EditProfile;
