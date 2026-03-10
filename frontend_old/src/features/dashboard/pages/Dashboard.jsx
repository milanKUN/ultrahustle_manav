import React, { useState, useEffect } from 'react';
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./Dashboard.css";
import "../../../Darkuser.css";

const Dashboard = ({ theme, setTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        setShowSettings(false);
    }, []);

    const handleSectionChange = (id) => {
        setActiveSetting(id);
    };

    return (
        <div className={`dashboard-page user-page ${theme} min-h-screen relative overflow-hidden`}>
            {/* NAVBAR */}
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((p) => !p)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="pt-[85px] flex relative z-10">
                {/* SIDEBAR */}
                <Sidebar
                    expanded={sidebarOpen}
                    setExpanded={setSidebarOpen}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    activeSetting={activeSetting}
                    onSectionChange={handleSectionChange}
                    theme={theme}
                    setTheme={setTheme}
                />

                {/* MAIN CONTENT WRAPPER */}
                <div className="relative flex-1 min-w-5 overflow-hidden">
                    {/* Scrollable Area */}
                    <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
                        <div className="dashboard-container p-8">
                            <h1 className="text-2xl font-bold dark:text-white">this is dashboard</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
