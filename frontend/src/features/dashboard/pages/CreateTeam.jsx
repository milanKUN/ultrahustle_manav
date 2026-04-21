import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "./CreateTeam.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MyPortfolio from "../components/UserProfile/MyPortfolio";
import "../../../Darkuser.css";

import { getCurrentUserEmail } from "../../auth/api/authApi";
import {
  createTeam,
  getTeam,
  getTeamMembers,
  listTeamInvites,
  patchTeam,
  searchCreators,
  sendTeamInvite,
  uploadTeamAvatar,
  patchTeamMember,
  checkTeamUsernameAvailability,
} from "../api/teamApi";

const CreateTeam = ({ theme, setTheme, mode = "create", initialTeamId = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const resolvedRouteTeamId = useMemo(() => {
    const raw =
      initialTeamId ??
      location?.state?.teamId ??
      location?.state?.team?.id ??
      params?.teamId ??
      params?.id ??
      null;

    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [initialTeamId, location?.state, params]);

  const currentEmailKey = String(getCurrentUserEmail() || "").trim().toLowerCase() || "anon";
  const storageScope = mode === "edit" && resolvedRouteTeamId ? `edit:${resolvedRouteTeamId}` : "create";
  const DRAFT_KEY = `uh_team_form_draft:${storageScope}:${currentEmailKey}`;
  const TEAM_ID_KEY = `uh_team_form_team_id:${storageScope}:${currentEmailKey}`;

  const [formData, setFormData] = useState({
    // ... (rest of the state remains the same, will use replace_file_content specifically for targeted areas)

    teamName: '',
    teamUsername: '',
    title: '',
    bio: '',
    about: '',
    whatWeDo: '',
    hashtags: '',
    skills: '',
    tools: '',
    availability: '',
    languages: '',
    rules: '',
    category: '',
    terms: "",
  });

  const [successPopup, setSuccessPopup] = useState({
    open: false,
    title: "",
    message: "",
  });

  const showSuccess = (title, message) => {
    setSuccessPopup({
      open: true,
      title,
      message,
    });
  };

  //username status
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: "",
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

    if (name === "teamUsername") {
      value = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    }
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

  const [searchQuery, setSearchQuery] = useState('');
  const [creatorResults, setCreatorResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [teamId, setTeamId] = useState(resolvedRouteTeamId);
  const [isSaving, setIsSaving] = useState(false);

  const [invitedEmails, setInvitedEmails] = useState(() => new Set());
  const [teamMembers, setTeamMembers] = useState([]);

  const [externalInviteEmail, setExternalInviteEmail] = useState("");

  const isHydratingRef = useRef(false);
  const hasBootstrappedRef = useRef(false);


  //check username status
  useEffect(() => {
    if (mode === "edit") {
      setUsernameStatus({
        checking: false,
        available: true,
        message: "Username cannot be changed after creation.",
      });
      return;
    }

    const username = String(formData.teamUsername || "").trim().toLowerCase();

    if (!username) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "",
      });
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: "Use only lowercase letters, numbers, underscore, or hyphen.",
      });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setUsernameStatus({
          checking: true,
          available: null,
          message: "Checking availability...",
        });

        const res = await checkTeamUsernameAvailability(username);

        const available =
          res?.available ??
          res?.data?.available ??
          false;

        setUsernameStatus({
          checking: false,
          available,
          message: available ? "Username is available." : "Username is already taken.",
        });
      } catch (err) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: err?.message || "Could not verify username.",
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.teamUsername, mode]);

  // Restore draft + teamId on first mount.
  useEffect(() => {
    if (resolvedRouteTeamId) {
      setTeamId((prev) => prev || resolvedRouteTeamId);
    }

    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed && typeof parsed === "object") {
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            // Ensure arrays stay arrays.
            hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : prev.hashtags,
            skills: Array.isArray(parsed.skills) ? parsed.skills : prev.skills,
            tools: Array.isArray(parsed.tools) ? parsed.tools : prev.tools,
            languages: Array.isArray(parsed.languages) ? parsed.languages : prev.languages,
            rules: Array.isArray(parsed.rules) ? parsed.rules : prev.rules,
          }));
        }
      }

      const storedTeamId = localStorage.getItem(TEAM_ID_KEY);
      if (storedTeamId) {
        const id = parseInt(storedTeamId, 10);
        if (!Number.isNaN(id) && id > 0) setTeamId(id);
      }
    } catch {
      // Ignore corrupted localStorage.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save draft to localStorage (debounced) so reload keeps input values.
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      } catch {
        // Ignore quota issues.
      }
    }, 400);

    return () => clearTimeout(t);
  }, [DRAFT_KEY, formData]);

  // Persist teamId so we can restore from backend after reload.
  React.useEffect(() => {
    try {
      if (teamId) localStorage.setItem(TEAM_ID_KEY, String(teamId));
      if (teamId) hasBootstrappedRef.current = true;
    } catch {
      // ignore
    }
  }, [TEAM_ID_KEY, teamId]);


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
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [teamAvatarUrl, setTeamAvatarUrl] = useState("");
  const [avatarModalInitialSrc, setAvatarModalInitialSrc] = useState(null);
  const avatarInputRef = React.useRef(null);

  const handleSectionChange = (id) => {
    setActiveSetting(id);
  };

  const openAvatarModal = () => {
    setAvatarModalInitialSrc(selectedAvatarImage || teamAvatarUrl || null);
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
    // Revert to what we had before opening the modal (unless upload updates it).
    setSelectedAvatarImage(avatarModalInitialSrc || teamAvatarUrl || null);
    setSelectedAvatarFile(null);
    setAvatarZoom(50);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatarFile(file);
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

  const requiredFieldsMissing = useMemo(() => {
    const required = [
      "teamName",
      "teamUsername",
      "title",
      "bio",
      "about",
      "whatWeDo",
      "category",
    ];
    return required.some((k) => !String(formData[k] || "").trim());
  }, [formData]);

  const normalizeTeamPayload = () => {
    return {
      name: String(formData.teamName || "").trim(),
      username: String(formData.teamUsername || "").trim(),
      title: String(formData.title || "").trim(),
      bio: String(formData.bio || "").trim(),
      about: String(formData.about || "").trim(),
      what_we_do: String(formData.whatWeDo || "").trim(),
      category: String(formData.category || "").trim(),
      availability: formData.availability || null,
      terms: String(formData.terms || "").trim() || null,
      hashtags: (formData.hashtags || []).map((t) => String(t).trim()).filter(Boolean),
      skills: (formData.skills || []).map((t) => String(t).trim()).filter(Boolean),
      tools: (formData.tools || []).map((t) => String(t).trim()).filter(Boolean),
      languages: (formData.languages || []).map((t) => String(t).trim()).filter(Boolean),
      rules: (formData.rules || []).map((t) => String(t).trim()).filter(Boolean),
    };
  };

  const extractAvatarUrl = (res) => {
    // Accept a few possible response shapes.
    const team = res?.data || res?.team || res?.data?.team || res;
    return (
      team?.avatar_url ||
      res?.data?.avatar_url ||
      res?.avatar_url ||
      ""
    );
  };

  const hydrateFromTeamResponse = (res) => {
    const team = res?.team || res?.data?.team || res?.data || res;
    if (!team || typeof team !== "object") return;

    const url = team?.avatar_url || "";
    if (url) {
      setTeamAvatarUrl(url);
      setSelectedAvatarImage(url);
    }

    setFormData((prev) => ({
      ...prev,
      teamName: team?.name ?? prev.teamName,
      teamUsername: team?.username ?? prev.teamUsername,
      title: team?.title ?? prev.title,
      bio: team?.bio ?? prev.bio,
      about: team?.about ?? prev.about,
      whatWeDo: team?.what_we_do ?? team?.whatWeDo ?? prev.whatWeDo,
      category: team?.category ?? prev.category,
      availability: team?.availability ?? prev.availability,
      terms: team?.terms ?? prev.terms,
      hashtags: Array.isArray(team?.hashtags) ? team.hashtags : prev.hashtags,
      skills: Array.isArray(team?.skills) ? team.skills : prev.skills,
      tools: Array.isArray(team?.tools) ? team.tools : prev.tools,
      languages: Array.isArray(team?.languages) ? team.languages : prev.languages,
      rules: Array.isArray(team?.rules) ? team.rules : prev.rules,
    }));
  };

  // If teamId exists (created earlier), hydrate UI from backend after reload.
  useEffect(() => {
    if (!teamId) return;

    (async () => {
      isHydratingRef.current = true;
      try {
        const res = await getTeam(teamId);
        hydrateFromTeamResponse(res);
        await refreshMembersAndInvites(teamId, res);
      } catch {
        // If fetch fails, draft values still show.
      } finally {
        isHydratingRef.current = false;
        hasBootstrappedRef.current = true;
      }
    })();
  }, [teamId]);

  // Auto-save changes to backend when team already exists (debounced).
  useEffect(() => {
    if (!teamId || isHydratingRef.current || !hasBootstrappedRef.current) return;

    const t = setTimeout(async () => {
      try {
        await patchTeam(teamId, normalizeTeamPayload());
      } catch {
        // Avoid noisy alerts during typing.
      }
    }, 800);

    return () => clearTimeout(t);
  }, [teamId, formData]);

  const extractTeamId = (res) => {
    // Be flexible with backend response shapes.
    return (
      res?.team?.id ||
      res?.data?.team?.id ||
      res?.data?.id ||
      res?.id ||
      null
    );
  };

  const refreshMembersAndInvites = async (id, teamResponse = null) => {
    if (!id) return;

    let membersRes = teamResponse;
    let invitesRes = teamResponse;

    if (!teamResponse) {
      [membersRes, invitesRes] = await Promise.all([
        getTeamMembers(id),
        listTeamInvites(id),
      ]);
    }

    const members =
      membersRes?.memberships ||
      membersRes?.members ||
      membersRes?.data?.memberships ||
      membersRes?.data?.members ||
      [];
    const invites =
      invitesRes?.invitations ||
      invitesRes?.invites ||
      invitesRes?.data?.invitations ||
      invitesRes?.data?.invites ||
      [];

    const myEmail = String(getCurrentUserEmail() || "").trim().toLowerCase();

    const memberRows = (Array.isArray(members) ? members : []).map((m) => {
      const email = String(m?.email || m?.user?.email || "").trim();
      const name = String(m?.name || m?.user?.full_name || m?.user?.name || "").trim();
      const role = String(m?.role || "Contributor");
      const memberTitle = m?.member_title ?? m?.title ?? "";
      const id = m?.id ?? m?.membership_id ?? m?.pivot_id;

      const initials = (name || email || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") || "U";

      return {
        kind: "member",
        id,
        name: name || email,
        email,
        title: memberTitle,
        role,
        status: "Joined",
        avatar: initials,
        isMe: myEmail && email && myEmail === String(email).toLowerCase(),
      };
    });

    const inviteRows = (Array.isArray(invites) ? invites : []).map((inv) => {
      const email = String(inv?.email || "").trim();
      const name = String(inv?.name || inv?.invited_user?.full_name || email).trim();
      const role = String(inv?.role || "Contributor");
      const memberTitle = inv?.member_title ?? inv?.title ?? "";

      const statusRaw =
        inv?.status ||
        (inv?.accepted_at ? "Joined" : inv?.declined_at ? "Declined" : "Pending Invite");
      const status = statusRaw === "accepted" ? "Joined" : statusRaw === "declined" ? "Declined" : statusRaw;

      const initials = (name || email || "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") || "I";

      return {
        kind: "invite",
        id: inv?.id,
        name,
        email,
        title: memberTitle,
        role,
        status: status === "Joined" ? "Joined" : status === "Declined" ? "Declined" : "Pending Invite",
        avatar: initials,
        isMe: false,
      };
    });

    const allRows = [...memberRows, ...inviteRows];
    setTeamMembers(allRows);

    const invited = new Set(
      inviteRows
        .filter((r) => r.status === "Pending Invite" || r.status === "Joined")
        .map((r) => String(r.email || "").trim().toLowerCase())
        .filter(Boolean)
    );
    setInvitedEmails(invited);
  };

  const ensureTeamCreated = async () => {
    if (teamId) return teamId;
    if (requiredFieldsMissing) {
      window.alert("Please fill all required team fields before inviting or creating.");
      return null;
    }
    const username = String(formData.teamUsername || "").trim().toLowerCase();

    if (!username) {
      window.alert("Team username is required.");
      return null;
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      window.alert("Username must contain only lowercase letters, numbers, underscore, or hyphen.");
      return null;
    }

    if (usernameStatus.available === false) {
      window.alert("This team username is already taken.");
      return null;
    }
    setIsSaving(true);
    try {
      const res = await createTeam(normalizeTeamPayload());
      const newId = extractTeamId(res);
      if (!newId) {
        throw new Error("Team created but no team id returned by API.");
      }
      setTeamId(newId);

      try {
        localStorage.setItem(TEAM_ID_KEY, String(newId));
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }

      if (selectedAvatarFile) {
        try {
          const avatarRes = await uploadTeamAvatar(newId, selectedAvatarFile);
          const url = extractAvatarUrl(avatarRes);
          if (url) {
            setTeamAvatarUrl(url);
            setSelectedAvatarImage(url);
          }
        } catch (e) {
          // Avatar upload should not block team creation.
          window.alert(e?.message || "Avatar upload failed");
        }
      }

      await refreshMembersAndInvites(newId);
      showSuccess("Team Created!", "Your team has been created successfully.");
      return newId;
    } catch (e) {
      window.alert(e?.message || "Failed to create team");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTeam = async () => {
    if (requiredFieldsMissing) {
      window.alert("Please fill all required team fields.");
      return null;
    }

    if (!teamId) {
      return ensureTeamCreated();
    }

    setIsSaving(true);
    try {
      const res = await patchTeam(teamId, normalizeTeamPayload());
      hydrateFromTeamResponse(res);

      if (selectedAvatarFile) {
        const avatarRes = await uploadTeamAvatar(teamId, selectedAvatarFile);
        const url = extractAvatarUrl(avatarRes);
        if (url) {
          setTeamAvatarUrl(url);
          setSelectedAvatarImage(url);
          setAvatarModalInitialSrc(url);
        }
      }

      await refreshMembersAndInvites(teamId);
      showSuccess("Team Updated!", "Your team has been updated successfully.");
      return teamId;
    } catch (e) {
      window.alert(e?.message || "Failed to update team");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendInvite = async ({ email, role = "Contributor", member_title = "" }) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) return;

    const id = await ensureTeamCreated();
    if (!id) return;

    try {
      await sendTeamInvite(id, {
        email: normalizedEmail,
        role,
        member_title: String(member_title || "").trim() || null,
      });
      await refreshMembersAndInvites(id);
    } catch (e) {
      window.alert(e?.message || "Failed to send invite");
    }
  };

  React.useEffect(() => {
    let timer = null;
    const q = String(searchQuery || "").trim();

    if (!q) {
      setCreatorResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    timer = setTimeout(async () => {
      try {
        const res = await searchCreators(q);
        const list = res?.results || res?.data?.results || res?.creators || res?.data?.creators || res;
        setCreatorResults(Array.isArray(list) ? list : []);
      } catch (e) {
        setCreatorResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchQuery]);

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
    <><div
      className={`create-team-page user-page ${theme} min-h-screen relative overflow-hidden`}
    >
      {/* ✅ NAVBAR */}
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className={`pt-[72px] flex relative z-10 transition-all duration-300 ${isAvatarModalOpen ? "blur-sm pointer-events-none select-none" : ""}`}>
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
          <div className="relative z-10 overflow-y-auto h-[calc(100vh-72px)]">
            <div className="create-team-container">
              <header className="header-section">
                <h1>{teamId || mode === "edit" ? "Edit Team" : "Create Your Team"}</h1>
                <p className="">Build a team of creators and collaborate on services, products, or projects</p>
              </header>

              {/* Avatar Section */}
              <div className="team-avatar-card">
                <div
                  className="relative w-20 h-20 rounded-full bg-[#D9D9D9] cursor-pointer flex items-center justify-center avatar-container"
                  onClick={openAvatarModal}
                >
                  {(selectedAvatarImage || teamAvatarUrl) ? (
                    <img
                      src={selectedAvatarImage || teamAvatarUrl}
                      alt="Team Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
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
                        value={formData.teamName}
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
                        className={`form-input ${mode === "edit" ? "opacity-60 cursor-not-allowed bg-gray-100" : ""}`}
                        placeholder="teamusername"
                        value={formData.teamUsername}
                        onChange={handleInputChange}
                        readOnly={mode === "edit"}
                      />
                      {mode === "edit" ? (
                        <div className="text-xs text-gray-500 mt-2">
                          Username cannot be changed after creation.
                        </div>
                      ) : usernameStatus.message ? (
                        <div
                          className={`text-xs mt-2 ${
                            usernameStatus.checking
                              ? "text-yellow-600"
                              : usernameStatus.available
                                ? "text-green-600"
                                : "text-red-600"
                          }`}
                        >
                          {usernameStatus.message}
                        </div>
                      ) : null}
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
                  {(creatorResults || []).map((user) => {
                    const name = user?.name || user?.full_name || user?.fullName || "";
                    const email = user?.email || "";
                    const normalizedEmail = String(email || "").trim().toLowerCase();
                    const initials = String(name || email || "?")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase())
                      .join("") || "U";

                    const isInvited = invitedEmails.has(normalizedEmail);

                    return (
                      <div key={user?.id || normalizedEmail} className="user-card">
                        <div className="user-info">
                          <div className="user-avatar" style={{ backgroundColor: '#ceff1b' }}>
                            {initials}
                          </div>
                          <div className="user-details">
                            <h4>{name || email}</h4>
                            <p>{email}</p>
                          </div>
                        </div>
                        <button
                          className={`btn-invite ${isInvited ? 'active' : ''}`}
                          onClick={() => handleSendInvite({ email, role: "Contributor" })}
                          disabled={isSaving}
                        >
                          Invite
                        </button>
                      </div>
                    );
                  })}

                  {isSearching && (
                    <div className="user-card" style={{ opacity: 0.7 }}>
                      Searching...
                    </div>
                  )}
                </div>

                {/* Invite Container - wraps both invite email and status table */}
                <div className="invite-container">
                  {/* Invite External */}
                  <div className="invite-external-section">
                    <label className="form-label" style={{ marginBottom: 0 }}>Invite external via email</label>
                    <div className="invite-external-row">
                      <input
                        type="email"
                        className="form-input"
                        placeholder="name@example.com"
                        style={{ flex: 1 }}
                        value={externalInviteEmail}
                        onChange={(e) => setExternalInviteEmail(e.target.value)}
                      />
                      <button
                        className="btn-send-invite"
                        disabled={isSaving}
                        onClick={async (e) => {
                          e.preventDefault();
                          const email = String(externalInviteEmail || "").trim();
                          if (!email) return;
                          await handleSendInvite({ email, role: "Contributor" });
                          setExternalInviteEmail("");
                        }}
                      >
                        Send Invite
                      </button>
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
                          <tr key={`${member.kind}-${member.id || member.email}`}>
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
                              <input
                                type="text"
                                className="table-input"
                                placeholder="Title"
                                value={member.title || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setTeamMembers((prev) =>
                                    prev.map((m) => (m.kind === member.kind && m.email === member.email ? { ...m, title: value } : m))
                                  );
                                }}
                                onBlur={async () => {
                                  if (!teamId) return;
                                  try {
                                    if (member.kind === "member" && member.id) {
                                      await patchTeamMember(teamId, member.id, { member_title: member.title || null });
                                      await refreshMembersAndInvites(teamId);
                                    }
                                    if (member.kind === "invite") {
                                      await sendTeamInvite(teamId, {
                                        email: member.email,
                                        role: member.role,
                                        member_title: member.title || null,
                                      });
                                      await refreshMembersAndInvites(teamId);
                                    }
                                  } catch (e) {
                                    window.alert(e?.message || "Failed to update title");
                                  }
                                }}
                              />
                            </td>
                            <td data-label="Role">
                              {!member.isMe ? (
                                <RoleDropdown
                                  value={member.role}
                                  onChange={(newRole) => {
                                    setTeamMembers((prev) =>
                                      prev.map((m) =>
                                        m.kind === member.kind && m.email === member.email ? { ...m, role: newRole } : m
                                      )
                                    );

                                    (async () => {
                                      if (!teamId) return;
                                      try {
                                        if (member.kind === "member" && member.id) {
                                          await patchTeamMember(teamId, member.id, { role: newRole });
                                        }
                                        if (member.kind === "invite") {
                                          await sendTeamInvite(teamId, {
                                            email: member.email,
                                            role: newRole,
                                            member_title: member.title || null,
                                          });
                                        }
                                        await refreshMembersAndInvites(teamId);
                                      } catch (e) {
                                        window.alert(e?.message || "Failed to update role");
                                      }
                                    })();
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
              <MyPortfolio
                mode="team"
                teamId={teamId}
                onSuccess={(msg) =>
                  showSuccess(
                    "Team Portfolio Updated!",
                    msg || "Team portfolio updated successfully."
                  )
                }
              />

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
                    value={formData.terms}
                    onChange={(e) => handleInputChange({ target: { name: 'terms', value: e.target.value } })}
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
                  <button
                    className="btn-discard"
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={isSaving}
                  >
                    Discard
                  </button>
                  <button
                    className="btn-create-team"
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      await handleSaveTeam();
                    }}
                  >
                    {isSaving ? (teamId ? "Saving..." : "Creating...") : (teamId || mode === "edit" ? "Save Changes" : "Create Team")}
                  </button>
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
                    onClick={async () => {
                      // If the team already exists, upload immediately.
                      if (teamId && selectedAvatarFile) {
                        try {
                          const avatarRes = await uploadTeamAvatar(teamId, selectedAvatarFile);
                          const url = extractAvatarUrl(avatarRes);
                          if (url) {
                            setTeamAvatarUrl(url);
                            setSelectedAvatarImage(url);
                            setAvatarModalInitialSrc(url);
                          }
                          await refreshMembersAndInvites(teamId);
                        } catch (e) {
                          window.alert(e?.message || "Avatar upload failed");
                        }
                      }
                      closeAvatarModal();
                    }}
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
    <SuccessPopup
      open={successPopup.open}
      title={successPopup.title}
      message={successPopup.message}
      onClose={() => setSuccessPopup({ open: false, title: "", message: "" })}
    />
    </>
    

    
  );
  
};

export default CreateTeam;

function SuccessPopup({ open, title, message, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-3xl shadow-[0_0_30px_rgba(206,255,27,0.4)] border border-[#CEFF1B] px-8 py-10 w-full max-w-[420px] text-center animate-[fadeIn_.25s_ease]">
        <div className="w-20 h-20 rounded-full bg-[#CEFF1B] mx-auto flex items-center justify-center mb-6 shadow-lg">
          <img src="/right.svg" alt="success" className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>

        <button
          onClick={onClose}
          className="bg-[#CEFF1B] text-black font-semibold px-6 py-3 rounded-xl border border-black hover:scale-[1.02] transition"
        >
          Continue
        </button>
      </div>
    </div>,
    document.body
  );
}
