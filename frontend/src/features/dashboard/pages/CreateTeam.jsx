import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';
import "./CreateTeam.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MyPortfolio from "../components/UserProfile/MyPortfolio";
import "../../../Darkuser.css";

const CreateTeam = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // ... (rest of the state remains the same, will use replace_file_content specifically for targeted areas)

    teamName: '',
    teamUsername: '',
    title: '',
    bio: '',
    about: '',
    whatWeDo: '',
    hashtags: ['Agile/Scrum', 'Accessibility', 'Front-end Development', 'Product Design', 'Design Systems'],
    skills: ['Agile/Scrum', 'Accessibility', 'Front-end Development', 'Product Design', 'Design Systems'],
    tools: ['Figma', 'Illustrator', 'Photoshop', 'Tailwind CSS'],
    availability: '',
    languages: ['Hindi', 'Tamil', 'English'],
    rules: ['Professional Conduct', '24hr Response', 'Secure File Handling'],
    category: ''
  });

  // Inputs state for adding new tags
  const [inputStates, setInputStates] = useState({
    hashtag: '',
    skill: '',
    tool: '',
    language: '',
    rule: ''
  });

  // Dropdown states
  const [openAvailability, setOpenAvailability] = useState(false);
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const availabilityRef = React.useRef(null);
  const languagesRef = React.useRef(null);
  const categoryRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (availabilityRef.current && !availabilityRef.current.contains(event.target)) setOpenAvailability(false);
      if (languagesRef.current && !languagesRef.current.contains(event.target)) setOpenLanguages(false);
      if (categoryRef.current && !categoryRef.current.contains(event.target)) setOpenCategory(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LIMITS = {
    teamName: 50,
    teamUsername: 30,
    title: 40,
    bio: 160,
    about: 700,
    whatWeDo: 700
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (LIMITS[name] && value.length > LIMITS[name]) {
      value = value.slice(0, LIMITS[name]);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e, field) => {
    setInputStates(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addTag = (e, field, listName, limit) => {
    if (e.key === 'Enter' && inputStates[field].trim()) {
      e.preventDefault();
      if (formData[listName].length < limit) {
        setFormData(prev => ({
          ...prev,
          [listName]: [...prev[listName], inputStates[field].trim()]
        }));
        setInputStates(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const removeTag = (tagToRemove, listName) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(tag => tag !== tagToRemove)
    }));
  };

  const renderCharCounter = (fieldName) => {
    const currentLength = formData[fieldName]?.length || 0;
    const limit = LIMITS[fieldName];

    return (
      <div className="char-counter text-red-500 text-[0.75rem] mt-1 mb-2">
        You have used {currentLength} Characters out of {limit} Characters
      </div>
    );
  };

  // Mock users for search
  const mockUsers = [
    { id: 1, name: 'Ava Patel', email: 'ava@ultra.dev', avatar: 'AV', color: '#ccff00' },
    { id: 2, name: 'Leo Wang', email: 'leo@ultra.dev', avatar: 'LW', color: '#eee' },
    { id: 3, name: 'Maya Singh', email: 'maya@ultra.dev', avatar: 'MS', color: '#ccff00' },
    { id: 4, name: 'Noah Kim', email: 'Noah@ultra.dev', avatar: 'NO', color: '#ccff00' },
    { id: 5, name: 'Zara Ali', email: 'zara@ultra.dev', avatar: 'ZA', color: '#ccff00' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [invitedUsers, setInvitedUsers] = useState([4, 5]); // Noah and Zara invited based on image

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'You (Owner)', email: 'you@owner.com', title: 'Title', role: 'Owner', status: 'Joined', avatar: 'YO', isMe: true },
    { id: 2, name: 'Ava Patel', email: 'ava@ultra.dev', title: 'Title', role: 'Contributor', status: 'Pending Invite', avatar: 'A' },
    { id: 3, name: 'Leo wang', email: 'leo@ultra.dev', title: 'Title', role: 'Lead', status: 'Joined', avatar: 'L' },
    { id: 4, name: 'Maya Singh', email: 'maya@ultra.dev', title: 'Title', role: 'Assistant', status: 'Declined', avatar: 'AV' },
    { id: 5, name: 'Alex (External)', email: 'alex@ultra.dev', title: 'Title', role: 'Manager', status: 'Pending Invite', avatar: 'AV' }
  ]);


  // ✅ Sidebar state (matching User.jsx)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  React.useEffect(() => {
    setSidebarOpen(false);
    setShowSettings(false);
  }, []);

  // State for avatar upload modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarZoom, setAvatarZoom] = useState(50);
  const [selectedAvatarImage, setSelectedAvatarImage] = useState(null);
  const avatarInputRef = React.useRef(null);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
    setSelectedAvatarImage(null);
    setAvatarZoom(50);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectImageClick = () => {
    avatarInputRef.current?.click();
  };

  // Portfolios state is now handled within MyPortfolio component

  // Portfolio functions are now handled within MyPortfolio component

  const toggleInvite = (id) => {
    if (invitedUsers.includes(id)) {
      setInvitedUsers(invitedUsers.filter(u => u !== id));
    } else {
      setInvitedUsers([...invitedUsers, id]);
    }
  };

  function RoleDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef(null);

    const roles = ["Contributor", "Lead", "Assistant", "Manager"];

    React.useEffect(() => {
      const close = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", close);
      return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
      <div ref={ref} className={`role-dd ${open ? "open" : ""}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`role-dd-trigger ${value ? "selected" : ""}`}
        >
          <span className="role-dd-chip">{value}</span>
          <img
            src="/Polygon.svg"
            className={`role-dd-arrow ${open ? "rot" : ""}`}
          />
        </button>


        {open && (
          <div className="role-dd-menu">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={`role-dd-item ${value === r ? "active" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }


  return (
    <div
      className={`create-team-page user-page ${theme} min-h-screen relative overflow-hidden`}
    >
      {/* ✅ NAVBAR */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className={`pt-[85px] flex relative z-10 transition-all duration-300 ${isAvatarModalOpen ? "blur-sm pointer-events-none select-none" : ""}`}>
        {/* ✅ SIDEBAR */}
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

        {/* ✅ MAIN CONTENT WRAPPER */}
        <div className="relative flex-1 min-w-5 overflow-hidden">
          {/* Scrollable Area */}
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-85px)]">
            <div className="create-team-container">
              <header className="header-section">
                <h1>Create Your Team</h1>
                <p className=""
                >Build a team of creators and collaborate on services, products, or projects</p>
              </header>

              {/* Avatar Section */}
              <div className="team-avatar-card">
                <div
                  className="relative w-20 h-20 rounded-full bg-[#D9D9D9] cursor-pointer flex items-center justify-center avatar-container"
                  onClick={openAvatarModal}
                >
                  {selectedAvatarImage ? (
                    <img src={selectedAvatarImage} alt="Team Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="avatar-placeholder"></div>
                  )}
                  <span
                    className="
                      absolute
                      bottom-0 right-0
                      w-7 h-7
                      rounded-full
                      flex items-center justify-center
                      shadow-lg
                      bg-white
                      profile-avatar-badge
                    "
                  >
                    <img
                      src="/edit.svg"
                      alt="Edit"
                      className="w-4 h-4"
                    />
                  </span>
                </div>
                <div className="team-display-name">
                  {formData.teamName || "Abigail"}
                </div>
              </div>

              {/* Main Form Section */}
              <div className="team-info-section">
                <div className="section-header">
                  <h2>Team Basic Information</h2>
                  <div className="header-line"></div>
                </div>
                <p className="section-subtext">Visible on your team profile</p>

                <div className="form-grid">
                  {/* Team Name */}
                  <div className="form-group">
                    <label className="form-label">
                      Team Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      className="form-input"
                      placeholder="Team name"
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Team Username */}
                  <div className="form-group">
                    <label className="form-label">
                      Team Username <span className="required-star">*</span>
                    </label>
                    <div className="input-with-prefix">
                      <span className="input-prefix"></span>
                      <input
                        type="text"
                        name="teamUsername"
                        className="form-input"
                        placeholder="teamusername"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="form-group">
                    <label className="form-label">
                      Title <span className="required-star">*</span>
                    </label>
                    <textarea
                      name="title"
                      className="form-textarea"
                      placeholder="Product Designer & Full-Stack Developer"
                      value={formData.title}
                      onChange={handleInputChange}
                      style={{ minHeight: '80px', resize: 'none' }}
                    />
                    {renderCharCounter('title')}
                  </div>

                  {/* Bio */}
                  <div className="form-group">
                    <label className="form-label">
                      Bio <span className="required-star">*</span>
                    </label>
                    <div className="textarea-wrapper">
                      <textarea
                        name="bio"
                        className="form-textarea scrollable-textarea custom-scroll"
                        placeholder="Multi-disciplinary team helping brands ship elegant, accessible design systems and modern front-ends."
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                    {renderCharCounter('bio')}
                  </div>
                </div>

                {/* About - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    About <span className="required-star">*</span>
                  </label>
                  <div className="textarea-wrapper">
                    <textarea
                      name="about"
                      className="form-textarea scrollable-textarea custom-scroll"
                      placeholder="We are a multi-disciplinary product design and front-end team with 6+ years of experience shipping accessible, modern experiences. We specialize in design systems, tokens, and high-quality component libraries."
                      value={formData.about}
                      onChange={handleInputChange}
                    />
                  </div>
                  {renderCharCounter('about')}
                </div>

                {/* What We Do - Full Width */}
                <div className="form-group full-width">
                  <label className="form-label">
                    What We Do <span className="required-star">*</span>
                  </label>
                  <div className="textarea-wrapper">
                    <textarea
                      name="whatWeDo"
                      className="form-textarea scrollable-textarea custom-scroll"
                      placeholder="Describe your team, specialties, workflow, and impact."
                      value={formData.whatWeDo}
                      onChange={handleInputChange}
                    />
                  </div>
                  {renderCharCounter('whatWeDo')}
                </div>

                {/* Hashtag Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Hashtag <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Hashtag"
                    value={inputStates.hashtag}
                    onChange={(e) => handleTagInput(e, 'hashtag')}
                    onKeyDown={(e) => addTag(e, 'hashtag', 'hashtags', 15)}
                  />
                  <div className="tags-limit-text">You can add {15 - formData.hashtags.length} hashtag</div>
                  {formData.hashtags.length > 0 && (
                    <div className="tags-container">
                      <div className="flex flex-wrap gap-2 flex-1">
                        {formData.hashtags.map((tag, index) => (
                          <span key={index} className="tag-pill">
                            {tag}
                            <button type="button" className="tag-remove" onClick={() => removeTag(tag, 'hashtags')}>✕</button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, hashtags: [] }))}
                        className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
                        title="Clear all"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Skills & Expertise Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Skills & Expertise <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search Skills & Expertise"
                    value={inputStates.skill}
                    onChange={(e) => handleTagInput(e, 'skill')}
                    onKeyDown={(e) => addTag(e, 'skill', 'skills', 16)}
                  />
                  <div className="tags-limit-text">You can add {16 - formData.skills.length} more skills & expertise</div>
                  {formData.skills.length > 0 && (
                    <div className="tags-container">
                      <div className="flex flex-wrap gap-2 flex-1">
                        {formData.skills.map((tag, index) => (
                          <span key={index} className="tag-pill">
                            {tag}
                            <button type="button" className="tag-remove" onClick={() => removeTag(tag, 'skills')}>✕</button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, skills: [] }))}
                        className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
                        title="Clear all"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Tools & Technologies Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Tools & Technologies <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search Tools & Technologies"
                    value={inputStates.tool}
                    onChange={(e) => handleTagInput(e, 'tool')}
                    onKeyDown={(e) => addTag(e, 'tool', 'tools', 10)}
                  />
                  <div className="tags-limit-text">You can add {10 - formData.tools.length} more tools & technologies</div>
                  {formData.tools.length > 0 && (
                    <div className="tags-container">
                      <div className="flex flex-wrap gap-2 flex-1">
                        {formData.tools.map((tag, index) => (
                          <span key={index} className="tag-pill">
                            {tag}
                            <button type="button" className="tag-remove" onClick={() => removeTag(tag, 'tools')}>✕</button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tools: [] }))}
                        className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
                        title="Clear all"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Availability Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Availability
                  </label>
                  <div className={`onboarding-custom-select ${openAvailability ? "active" : ""}`} ref={availabilityRef}>
                    <div
                      className={`onboarding-selected-option ${openAvailability ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAvailability(!openAvailability);
                      }}
                    >
                      <span className={!formData.availability ? "opacity-70" : ""}>{formData.availability || "Select Availability"}</span>
                      <span className="onboarding-arrow">▼</span>
                    </div>

                    {openAvailability && (
                      <ul className="onboarding-options-list">
                        {["Full-time", "Part-time", "Contract"].map((item) => (
                          <li
                            key={item}
                            className={formData.availability === item ? "active" : ""}
                            onClick={() => {
                              handleInputChange({ target: { name: 'availability', value: item } });
                              setOpenAvailability(false);
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Languages Section */}
                <div className="form-group full-width">
                  <label className="form-label">
                    Languages
                  </label>
                  <div className={`onboarding-custom-select ${openLanguages ? "active" : ""}`} ref={languagesRef}>
                    <div
                      className={`onboarding-selected-option ${openLanguages ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenLanguages(!openLanguages);
                      }}
                    >
                      <span className="opacity-70">Select Languages</span>
                      <span className="onboarding-arrow">▼</span>
                    </div>

                    {openLanguages && (
                      <ul className="onboarding-options-list">
                        {["English", "Hindi", "Tamil", "Spanish", "French", "German", "Chinese", "Japanese"].map((lang) => (
                          <li
                            key={lang}
                            className={formData.languages.includes(lang) ? "active cursor-not-allowed opacity-50" : ""}
                            onClick={() => {
                              if (!formData.languages.includes(lang) && formData.languages.length < 10) {
                                setFormData(prev => ({ ...prev, languages: [...prev.languages, lang] }));
                              }
                              setOpenLanguages(false);
                            }}
                          >
                            {lang}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="tags-limit-text">You can add upto {10 - formData.languages.length} Languages</div>
                  {formData.languages.length > 0 && (
                    <div className="tags-container">
                      <div className="flex flex-wrap gap-2 flex-1">
                        {formData.languages.map((tag, index) => (
                          <span key={index} className="tag-pill">
                            {tag}
                            <button type="button" className="tag-remove" onClick={() => removeTag(tag, 'languages')}>✕</button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, languages: [] }))}
                        className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
                        title="Clear all"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Team Category <span className="required-star">*</span>
                  </label>
                  <div className={`onboarding-custom-select ${openCategory ? "active" : ""}`} ref={categoryRef}>
                    <div
                      className={`onboarding-selected-option ${openCategory ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCategory(!openCategory);
                      }}
                    >
                      <span className={!formData.category ? "opacity-70" : ""}>{formData.category || "Select category"}</span>
                      <span className="onboarding-arrow">▼</span>
                    </div>

                    {openCategory && (
                      <ul className="onboarding-options-list">
                        {["Design", "Development", "Marketing", "Content", "Sales"].map((item) => (
                          <li
                            key={item}
                            className={formData.category === item ? "active" : ""}
                            onClick={() => {
                              handleInputChange({ target: { name: 'category', value: item } });
                              setOpenCategory(false);
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Team Members Section */}
              <div className="team-info-section">
                <div className="section-header">
                  <h2>Team Members</h2>
                  <div className="header-line"></div>
                </div>
                <p className="section-subtext">Invite existing users or external creators. Assign roles directly in the table</p>

                {/* Search */}
                <div className="form-group full-width">
                  <label className="form-label">Search creator by name / email</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="eg., Ava, Mia Malgova, ben@windex.dev"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Results Grid */}
                <div className="search-results-grid">
                  {mockUsers.map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-info">
                        <div className="user-avatar" style={{ backgroundColor: '#ceff1b' }}>
                          {user.avatar}
                        </div>
                        <div className="user-details">
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <button
                        className={`btn-invite ${invitedUsers.includes(user.id) ? 'active' : ''}`}
                        onClick={() => toggleInvite(user.id)}
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>

                {/* Invite Container - wraps both invite email and status table */}
                <div className="invite-container">
                  {/* Invite External */}
                  <div className="invite-external-section">
                    <label className="form-label" style={{ marginBottom: 0 }}>Invite external via email</label>
                    <div className="invite-external-row">
                      <input type="email" className="form-input" placeholder="name@example.com" style={{ flex: 1 }} />
                      <button className="btn-send-invite">Send Invite</button>
                    </div>
                  </div>

                  {/* Invite Status Table */}
                  <div className="invite-status-section">
                    <label className="form-label">Invite Status</label>
                    <table className="status-table">
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Member Title</th>
                          <th>Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map(member => (
                          <tr key={member.id}>
                            <td data-label="Member">
                              <div className="status-member-info">
                                <div className="table-avatar">{member.avatar}</div>
                                <div>
                                  <div className="member-name">{member.name}</div>
                                  <div className="member-email">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td data-label="Member Title">
                              <input type="text" className="table-input" placeholder="Title" defaultValue={member.title !== 'Title' ? member.title : ''} />
                            </td>
                            <td data-label="Role">
                              {!member.isMe ? (
                                <RoleDropdown
                                  value={member.role}
                                  onChange={(newRole) => {
                                    setTeamMembers((prev) =>
                                      prev.map((m) =>
                                        m.id === member.id ? { ...m, role: newRole } : m
                                      )
                                    );
                                  }}
                                />
                              ) : (
                                <div className="role-badge owner">Owner</div>
                              )}
                            </td>

                            <td data-label="Status">
                              <span className={`status-badge ${member.status.toLowerCase().replace(' ', '-')}`}>
                                {member.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* My Portfolio Section */}
              <div className="team-info-section">
                <MyPortfolio theme={theme} />
              </div>

              {/* Team Contract & Rules Section */}
              <div className="team-info-section">
                <div className="section-header">
                  <h2>Team Contract & Rules</h2>
                  <div className="header-line"></div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '10px' }}>Team Terms</label>
                  <textarea
                    className="form-textarea"
                    placeholder="This project involves designing a next-generation salon mobile application with AI-powered recommendations, seamless booking experience, and elegant user interface."
                    style={{ height: '120px', resize: 'none' }}
                  ></textarea>
                </div>

                <div className="rules-section">
                  <label className="form-label" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '10px' }}>Creator Rules & Expectations</label>
                  <div className="rules-input-row">
                    <input
                      type="text"
                      className="form-input rules-input"
                      placeholder="Add rule and press enter"
                      value={inputStates.rule}
                      onChange={(e) => handleTagInput(e, 'rule')}
                      onKeyDown={(e) => addTag(e, 'rule', 'rules', 16)}
                    />
                    <button
                      type="button"
                      className="btn-add-rule"
                      onClick={(e) => addTag({ key: 'Enter', preventDefault: () => { } }, 'rule', 'rules', 16)}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="rules-helper-text">You can add {16 - formData.rules.length} more rules & expectations</div>

                  {formData.rules.length > 0 && (
                    <div className="tags-container">
                      <div className="flex flex-wrap gap-2 flex-1">
                        {formData.rules.map((tag, index) => (
                          <span key={index} className="tag-pill">
                            {tag}
                            <button type="button" className="tag-remove" onClick={() => removeTag(tag, 'rules')}>✕</button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rules: [] }))}
                        className="tag-clear-btn ml-2 px-3 h-full flex items-center justify-center text-sm"
                        title="Clear all"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <button className="btn-discard">Discard</button>
                  <button className="btn-create-team">Create Team</button>
                </div>
              </div>

            </div>
          </div>

          {/* Avatar Upload Modal */}
          {isAvatarModalOpen && createPortal(
            <div className={`user-page ${theme || 'light'}`}>
              <div
                className="
                z-[9999] flex
                md:mt-0 p-4 md:p-0
                fixed inset-0 items-center justify-center image-modal
                backdrop-blur-sm bg-black/30
              "
              >
                <div
                  className="
                  flex flex-col items-center
                  w-[90%] max-w-[380px] h-auto max-h-[90vh] overflow-y-auto
                  p-5 md:p-6
                  rounded-2xl
                  image-modal-card relative
                  bg-white dark:bg-[#121212]
                "
                >
                  <button
                    onClick={closeAvatarModal}
                    className="
                    text-red-500 font-bold
                    absolute top-4 right-4
                  "
                  >
                    ✕
                  </button>

                  <h3
                    className="
                    mb-6
                    text-center font-semibold text-black dark:text-gray-100
                  "
                  >
                    Resize and adjust <br /> your photo
                  </h3>

                  <div
                    className="
                    flex
                    w-full aspect-square max-w-[280px]
                    mb-5 mx-auto
                    bg-[#2B2B2B]
                    rounded-xl
                    items-center justify-center
                    relative overflow-hidden
                  "
                  >
                    {selectedAvatarImage ? (
                      <>
                        <img
                          src={selectedAvatarImage}
                          alt="Preview"
                          className="preview-image w-full h-full object-cover transition-transform duration-200"
                          style={{ transform: `scale(${1 + avatarZoom / 100})` }}
                        />
                        {/* CIRCULAR PREVIEW OVERLAY */}
                        <div
                          className="
                          absolute inset-0
                          pointer-events-none
                          flex items-center justify-center
                        "
                        >
                          <div
                            className="
                            w-[230px] h-[230px] md:w-[250px] md:h-[250px]
                            rounded-full
                            border-2 border-white/50
                          "
                          />
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={handleSelectImageClick}
                        className="
                        w-[157px] h-[58.41px]
                        text-sm
                        bg-white text-black
                        rounded
                      "
                      >
                        Select Image
                      </button>
                    )}
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <p
                    className="
                    mb-2
                    text-xs text-center text-red-500
                    -mt-6
                  "
                  >
                    Maximum upload size: 10 MB
                  </p>
                  <div
                    className="
                    flex w-full max-w-[280px] mx-auto
                    mb-6
                    items-center justify-between gap-3
                    zoom-bar
                  "
                  >
                    {/* MINUS */}
                    <button
                      onClick={() => setAvatarZoom(Math.max(0, avatarZoom - 10))}
                      className="p-2 flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors flex items-center justify-center"
                    >
                      <img
                        src="/minus.svg"
                        alt="Decrease"
                        className="w-8 h-8 sm:w-6 sm:h-6 object-contain"
                      />
                    </button>

                    {/* RANGE */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={avatarZoom}
                      onChange={(e) => setAvatarZoom(parseInt(e.target.value))}
                      className="
                      flex-1
                      min-w-[100px]
                      accent-[#CEFF1B]
                    "
                    />

                    {/* PLUS */}
                    <button
                      onClick={() => setAvatarZoom(Math.min(100, avatarZoom + 10))}
                      className="p-2 flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors flex items-center justify-center"
                    >
                      <img
                        src="/plus.svg"
                        alt="Increase"
                        className="w-8 h-8 sm:w-6 sm:h-6 object-contain"
                      />
                    </button>
                  </div>

                  <button
                    className="
                    w-full
                    mt-auto py-3
                    font-medium
                    bg-[#CEFF1B] text-black
                    rounded-md
                  "
                    onClick={closeAvatarModal}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
