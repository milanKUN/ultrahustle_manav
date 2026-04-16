import React, { useState } from "react";
import { X } from "lucide-react";
import "./FriendSuggestion.css";

const data = {
    mutual: [
        { id: 1, name: "Arun" },
        { id: 2, name: "Rohit" },
    ],
    followers: [
        { id: 3, name: "Priya" },
        { id: 4, name: "Neha" },
        { id: 5, name: "Arjun" },
    ],
    following: [
        { id: 6, name: "Rahul" },
        { id: 7, name: "Karan" },
    ],
    suggested: [
        { id: 8, name: "User One" },
        { id: 9, name: "User Two" },
        { id: 10, name: "User Three" },
        { id: 11, name: "User Four" },
        { id: 12, name: "User Three" },
        { id: 13, name: "User Four" },
        { id: 14, name: "User Three" },
        { id: 15, name: "User Four" },
    ],
};

const FriendSuggestion = ({ theme = "light" }) => {
    const [activeTab, setActiveTab] = useState("suggested");
    const [listData, setListData] = useState(data);

    const removeUser = (id) => {
        setListData((prev) => ({
            ...prev,
            [activeTab]: prev[activeTab].filter((user) => user.id !== id),
        }));
    };

    const currentList = listData[activeTab];

    return (
        <div className={`fs-box ${theme}`}>
            {/* Title */}
            <h2 className="fs-title">Ultra Hustle</h2>

            {/* Tabs */}
            <div className="fs-tabs">
                <span
                    className={activeTab === "mutual" ? "active" : ""}
                    onClick={() => setActiveTab("mutual")}
                >
                    {listData.mutual.length} mutual
                </span>

                <span
                    className={activeTab === "followers" ? "active" : ""}
                    onClick={() => setActiveTab("followers")}
                >
                    {listData.followers.length} Followers
                </span>

                <span
                    className={activeTab === "following" ? "active" : ""}
                    onClick={() => setActiveTab("following")}
                >
                    {listData.following.length} following
                </span>

                <span
                    className={activeTab === "suggested" ? "active" : ""}
                    onClick={() => setActiveTab("suggested")}
                >
                    Suggested
                </span>
            </div>

            {/* List */}
            <div className="fs-list">
                {currentList.length === 0 ? (
                    <p className="empty">No users found</p>
                ) : (
                    currentList.map((user) => (
                        <div key={user.id} className="fs-item">
                            <div className="fs-left">
                                <div className="avatar" />
                                <span>{user.name}</span>
                            </div>

                            <div className="fs-actions">
                                <button className="follow-btn">Follow</button>
                                <X
                                    size={16}
                                    onClick={() => removeUser(user.id)}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendSuggestion;
