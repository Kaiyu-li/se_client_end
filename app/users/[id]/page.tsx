"use client";

import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation"; // ✅ 使用 useParams
import {useApi} from "@/hooks/useApi";
import {User} from "@/types/user";
import {Card, Descriptions, Spin} from "antd";

const UserProfile: React.FC = () => {
    const {id} = useParams(); //
    const apiService = useApi();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                const userData: User = await apiService.get<User>(`/users/${id}`);
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, apiService]);

    if (loading) return <Spin size="large"/>;

    return (
        <div className="login-container">
            <Card title="User Profile" className="profile-container">
                {user ? (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Username"
                                           labelStyle={{color: '#fff'}}>{user.username}</Descriptions.Item>
                        <Descriptions.Item label="Online Status" labelStyle={{color: '#fff'}}>
                            {user.status}
                        </Descriptions.Item>
                        <Descriptions.Item label="Created At" labelStyle={{color: '#fff'}}>
                            {new Date(user.creation_Date).toLocaleDateString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date of Birth" labelStyle={{color: '#fff'}}>
                            {new Date(user.birthday).toLocaleDateString()}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <p>User not found.</p>
                )}
            </Card>
        </div>
    );
};

export default UserProfile;
