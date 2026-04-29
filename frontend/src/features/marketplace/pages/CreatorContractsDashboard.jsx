import React, { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, FileText, CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import "./CreatorContractsDashboard.css";
import { getContracts } from "../api/contractApi";

const CREATOR_TABS = ["Total", "Draft", "Active", "Review", "Completed"];
const CLIENT_TABS = ["Total", "In Review", "Active", "Completed", "Cancellation"];

export default function CreatorContractsDashboard({ theme = "light", setTheme }) {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(() => localStorage.getItem("userType") || "creator");

  useEffect(() => {
    const handleStorage = () => {
      setUserType(localStorage.getItem("userType") || "creator");
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("userTypeChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userTypeChange", handleStorage);
    };
  }, []);
  const [activeTab, setActiveTab] = useState("Total");
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = userType === "creator" ? CREATOR_TABS : CLIENT_TABS;

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const handleStorage = () => {
      setUserType(localStorage.getItem("userType") || "creator");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [activeTab, userType]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await getContracts(activeTab === "Total" ? null : activeTab, userType);
      if (res.success) {
        setContracts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch contracts", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (userType === 'creator' ? c.client_full_name : c.provider_full_name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contract_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircle2 className="ccd-status-icon active" size={16} />;
      case "Review": return <Clock className="ccd-status-icon review" size={16} />;
      case "Draft": return <FileText className="ccd-status-icon draft" size={16} />;
      case "Completed": return <CheckCircle2 className="ccd-status-icon completed" size={16} />;
      default: return <AlertCircle className="ccd-status-icon default" size={16} />;
    }
  };

  return (
    <div className={`user-page ${theme} min-h-screen relative overflow-hidden`}>
      <UserNavbar toggleSidebar={() => setSidebarOpen(p => !p)} theme={theme} />

      <div className="pt-[72px] flex relative z-10 w-full h-full">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="flex-1 overflow-y-auto h-[calc(100vh-72px)] p-6 ccd-main">
          <div className="ccd-header mb-8">
            <div className="ccd-heading-wrap">
              <span className="ccd-role-tag">{userType.charAt(0).toUpperCase() + userType.slice(1)}</span>
              <h1 className="ccd-title">Contracts Dashboard</h1>
            </div>
          </div>

          <div className="ccd-controls mb-6">
            <div className="ccd-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`ccd-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span className="ccd-tab-count">
                    {tab === "Total" ? contracts.length : contracts.filter(c => c.status === (tab === 'In Review' ? 'Review' : tab)).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="ccd-search-wrap">
              <Search className="ccd-search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search contracts..." 
                className="ccd-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="ccd-grid">
            {loading ? (
              <div className="ccd-loading">Loading contracts...</div>
            ) : filteredContracts.length === 0 ? (
              <div className="ccd-empty">No contracts found in this category.</div>
            ) : (
              filteredContracts.map(contract => (
                <div 
                  key={contract.id} 
                  className="ccd-card"
                  onClick={() => navigate(`/milestones/${contract.contract_id}`)}
                >
                  <div className="ccd-card-head">
                    <div className="ccd-card-info">
                      <h3 className="ccd-card-title">{contract.title}</h3>
                      <span className="ccd-card-id">{contract.contract_id}</span>
                    </div>
                    <div className={`ccd-status-badge ${contract.status?.toLowerCase()}`}>
                      {getStatusIcon(contract.status)}
                      {contract.status}
                    </div>
                  </div>

                  <div className="ccd-card-body">
                    <div className="ccd-meta-item">
                      <span className="ccd-meta-label">{userType === 'creator' ? 'Client' : 'Provider'}</span>
                      <span className="ccd-meta-val">
                        {userType === 'creator' ? contract.client_full_name : contract.provider_full_name || "Not assigned"}
                      </span>
                    </div>
                    <div className="ccd-meta-item">
                      <span className="ccd-meta-label">Total Value</span>
                      <span className="ccd-meta-val">${parseFloat(contract.project_cost).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="ccd-card-foot">
                    <div className="ccd-progress">
                      <div className="ccd-progress-bar">
                        <div className="ccd-progress-fill" style={{ width: '0%' }}></div>
                      </div>
                      <span className="ccd-progress-text">0% Complete</span>
                    </div>
                    <button className="ccd-card-action">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
