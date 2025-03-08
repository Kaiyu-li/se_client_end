"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Card, Table, message } from "antd";
import type { TableProps } from "antd";

const columns: TableProps<User>["columns"] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Username",
        dataIndex: "username",
        key: "username",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
    },
];

const Dashboard: React.FC = () => {
    const router = useRouter();
    const apiService = useApi();
    const [users, setUsers] = useState<User[] | null>(null);
    const { clear } = useLocalStorage<string>("token", ""); // 使用 `clear` 代替 `clearToken`
    const { value: userData } = useLocalStorage<User | null>("user", null);
    const [isClient, setIsClient] = useState(false);

    // This will ensure that `localStorage` is only accessed in the client-side environment
    useEffect(() => {
        setIsClient(true); // Set state to true once the component is mounted
    }, []);

    const handleLogout = async () => {
        if (!isClient) return; // Do not proceed if it's not client-side

        try {
            if (!userData) {
                return;
            }
            await apiService.post(`/users/${userData.id}/logout`, {});
            clear(); // 清除本地 token
            router.push("/login");
        } catch (error) {
            message.error("Logout failed!");
            console.error(error);
        }
    };

    useEffect(() => {
        if (!isClient) return; // Skip fetching if not client-side

        const fetchUsers = async () => {
            try {
                const fetchedUsers = await apiService.get<User[]>("/users"); //
                setUsers(fetchedUsers);
                console.log("Fetched users:", fetchedUsers);
            } catch (error) {
                if (error instanceof Error) {
                    alert(`Something went wrong while fetching users:\n${error.message}`);
                } else {
                    console.error("An unknown error occurred while fetching users.");
                }
            }
        };

        fetchUsers();
    }, [apiService, isClient]);

    return (
        <div className="card-container">
            <Card
                title="Get all users from secure endpoint:"
                loading={!users}
                className="dashboard-container"
            >
                {users && (
                    <>
                        <Table<User>
                            columns={columns}
                            dataSource={users}
                            rowKey="id"
                            onRow={(row) => ({
                                onClick: () => router.push(`/users/${row.id}`),
                                style: { cursor: "pointer" },
                            })}
                        />
                        <Button onClick={handleLogout} type="primary">
                            Logout
                        </Button>
                        <Button onClick={() => router.push("/users/edit")} type="default" style={{ marginLeft: 10 }}>
                            Edit Profile
                        </Button>
                    </>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
