import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import './NotificationPage.css';
import "../../../Darkuser.css";

const notifications = [
  { id: 1, text: 'You have 5 save on your listings', time: '2m ago', isRead: false },
  { id: 2, text: 'Mike Chen started following you', time: '10m ago', isRead: true },
  { id: 3, text: 'Your service received 10 new likes', time: '1d ago', isRead: false },
  { id: 4, text: 'Your profile was viewed 50 times today', time: '1d ago', isRead: true },
  { id: 5, text: 'You made a sale: Web Design Package', time: '2d ago', isRead: true },
];

export default function NotificationPage({ theme, setTheme }) {
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

  return (
    <div className={`notification-layout-wrapper user-page ${theme}`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className="notification-layout-body">
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
        
        <div className="notification-main-content">
          <div className="notification-scroll-area">
            <div className="notification-page-container">
              <div className="notification-content-centered">
                <Link to="/friend-requests" className="follow-request-banner">
                  <div className="frb-left">
                    <div className="frb-avatars">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="" className="frb-avatar-bg" />
                      <div className="frb-avatar-fg">
                        {/* Fallback to text initials if logo isn't available, but we assume /logo.png exists */}
                        <span style={{color: '#e51e25', fontWeight: 900, fontSize: '11px', lineHeight: 1}}>UH</span>
                      </div>
                    </div>
                    <div className="frb-info">
                      <div className="frb-title">Follow requests</div>
                      <div className="frb-subtitle">digitalservices + 24 others</div>
                    </div>
                  </div>
                  <div className="frb-right">
                    <span className="frb-unread-dot"></span>
                    <ChevronRight className="frb-chevron" size={20} />
                  </div>
                </Link>

                <h2 className="notification-page-title">Notifications</h2>
                
                <div className="notification-list-wrapper">
                  <div className="notification-list-header">
                    <button className="mark-all-btn">Mark all as read</button>
                  </div>
                  
                  <div className="notification-items-container">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${notif.isRead ? 'read-item' : 'unread-item'}`}
                      >
                        <div className="notification-avatar-placeholder"></div>
                        <div className="notification-details">
                          <span className="notification-message">{notif.text}</span>
                        </div>
                        <div className="notification-timestamp">{notif.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
