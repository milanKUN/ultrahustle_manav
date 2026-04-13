import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import './FriendRequestPage.css';
import "../../../Darkuser.css";

export default function FriendRequestPage({ theme, setTheme, onClose }) {
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

  const [activeTab, setActiveTab] = useState('followers');
  
  // Dummy data
  const followersList = [
    { id: 1, name: 'User Name', status: 'Follow Back' },
    { id: 2, name: 'User Name', status: 'Follow Back' },
    { id: 3, name: 'User Name', status: 'Follow Back' },
    { id: 4, name: 'User Name', status: 'Follow Back' },
    { id: 5, name: 'User Name', status: 'Follow Back' },
    { id: 6, name: 'User Name', status: 'Follow Back' },
    { id: 7, name: 'User Name', status: 'Follow Back' },
    { id: 8, name: 'User Name', status: 'Follow Back' },
  ];

  const followingList = [
    { id: 1, name: 'User Name', status: 'Following' },
    { id: 2, name: 'User Name', status: 'Following' },
  ];

  const displayList = activeTab === 'followers' ? followersList : followingList;

  return (
    <div className={`fr-layout-wrapper user-page ${theme}`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className="fr-layout-body">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={setActiveSetting}
          theme={theme}
          setTheme={setTheme}
        />
        
        <div className="fr-main-content">
          <div className="fr-scroll-area">
            <div className="fr-page-container">
              <div className="fr-modal">
                <div className="fr-search-container">
                  <input 
                    type="text" 
                    placeholder="Search here" 
                    className="fr-search-input"
                  />
                  <Search size={18} className="fr-search-icon" color="#8c8c8c" />
                </div>

                <div className="fr-users-list">
                  {displayList.map(user => (
                    <div key={user.id} className="fr-user-item">
                      <div className="fr-user-info">
                        <div className="fr-avatar"></div>
                        <span className="fr-username">{user.name}</span>
                      </div>
                      <div className="fr-user-actions">
                        <button className={`fr-btn-primary ${user.status === 'Following' ? 'following-state' : ''}`}>
                          {user.status}
                        </button>
                        <button className="fr-btn-secondary">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
