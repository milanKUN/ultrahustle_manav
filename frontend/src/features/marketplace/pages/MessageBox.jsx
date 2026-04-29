import React, { useMemo, useState, useEffect } from "react";
import {
    ArrowLeft,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Paperclip,
    Search,
    SendHorizontal,
    Smile,
    Star,
    SquarePen,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import DetailedTeamCard from "../components/DetailedTeamCard";
import "../../../Darkuser.css";
import "./MessageBox.css";
import { getMyPersonalInfo } from "../../dashboard/api/personalInfoApi";
import { getConversations, getMessages, sendMessage, setTypingStatus } from "../api/messageApi";
import { getListingByUsername, getCreatorProfile } from "../api/listingApi";


export default function MessageBox({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [otherUserInfo, setOtherUserInfo] = useState(null);
    const [draft, setDraft] = useState("");
    const [isConversationListMinimized, setIsConversationListMinimized] =
        useState(false);
    const [isMobileView, setIsMobileView] = useState(
        () => typeof window !== "undefined" && window.innerWidth <= 900,
    );
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Handle window resize for mobile view
    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleResize = () => {
            const mobile = window.innerWidth <= 900;
            setIsMobileView(mobile);
            if (!mobile) setIsMobileChatOpen(false);
            if (mobile) setIsConversationListMinimized(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const showConversationList = !isMobileView || !isMobileChatOpen;
    const showChatPanel = !isMobileView || isMobileChatOpen;

    useEffect(() => {
        setSidebarOpen(false);
        setShowSettings(false);
    }, []);

    // Fetch My Info
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await getMyPersonalInfo();
                setCurrentUser(res.data);
            } catch (err) {
                console.error("Failed to fetch current user info", err);
            }
        };
        fetchMe();
    }, []);

    // Fetch Conversations
    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const res = await getConversations();

                // Handle redirection from listing page
                let currentConversations = res.data;
                let foundActive = null;

                if (location.state?.creatorUsername) {
                    const existing = res.data.find(c => c.handle === '@' + location.state.creatorUsername);
                    if (existing) {
                        foundActive = existing;
                    } else {
                        // Start a temporary conversation object for UI
                        const tempConv = {
                            id: 'temp',
                            name: location.state.creatorName || location.state.creatorUsername,
                            handle: '@' + location.state.creatorUsername,
                            avatar_url: null,
                            preview: 'New Message',
                            time: 'Now',
                            online: true,
                            other_user_id: location.state.creatorId,
                            listing_id: location.state.listingId
                        };
                        currentConversations = [tempConv, ...res.data];
                        foundActive = tempConv;
                    }
                }

                setConversations(prev => {
                    const hasTemp = prev.some(c => c.id === 'temp');
                    if (hasTemp && selectedChatId === 'temp') {
                        const tempObj = prev.find(c => c.id === 'temp');
                        const filtered = res.data.filter(c => c.other_user_id !== tempObj.other_user_id);
                        return [tempObj, ...filtered];
                    }
                    return currentConversations;
                });

                // Initialize selection
                if (!selectedChatId && currentConversations.length > 0) {
                    setSelectedChatId(currentConversations[0].id);
                    setActiveConversation(currentConversations[0]);
                } else if (foundActive) {
                    setSelectedChatId(foundActive.id);
                    setActiveConversation(foundActive);
                } else if (selectedChatId && selectedChatId !== 'temp') {
                    const updatedActive = res.data.find(c => c.id === Number(selectedChatId));
                    if (updatedActive) setActiveConversation(updatedActive);
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConversations();
        const convInterval = setInterval(fetchConversations, 5000);
        return () => clearInterval(convInterval);
    }, [location.state]);

    // Fetch Messages when chatId changes
    useEffect(() => {
        if (!selectedChatId || selectedChatId === 'temp') {
            setMessages([]);
            return;
        }

        const fetchMessagesData = async () => {
            try {
                const res = await getMessages(selectedChatId);
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };
        fetchMessagesData();
        
        // Polling (optional, but requested simple dynamic)
        const interval = setInterval(fetchMessagesData, 5000);
        return () => clearInterval(interval);
    }, [selectedChatId]);

    // Fetch Other User Info for Sidebar
    useEffect(() => {
        setOtherUserInfo(null);
        if (!activeConversation) return;
        console.log("Active Conversation updated:", activeConversation);

        const fetchOtherUser = async () => {
            const username = activeConversation.handle?.replace('@', '') || "";
            if (!username) return;

            console.log("Fetching profile for username:", username);
            try {
                const data = await getCreatorProfile(username); // This API works for any user by username
                console.log("Other user profile data:", data);
                if (data.user) {
                    setOtherUserInfo(data.user);
                }
            } catch (err) {
                console.error("Failed to fetch other user info", err);
            }
        };
        fetchOtherUser();
    }, [activeConversation]);

    // Handle Typing Status
    useEffect(() => {
        if (!draft.trim() || !selectedChatId || selectedChatId === 'temp') return;

        const startTyping = async () => {
            try {
                await setTypingStatus(selectedChatId, true);
            } catch (err) {
                console.error("Failed to set typing status", err);
            }
        };

        startTyping();

        const timeout = setTimeout(async () => {
            try {
                await setTypingStatus(selectedChatId, false);
            } catch (err) {
                console.error("Failed to clear typing status", err);
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [draft, selectedChatId]);

    const handleSendMessage = async () => {
        if (!draft.trim()) return;

        try {
            const payload = {
                content: draft,
                conversation_id: selectedChatId === 'temp' ? null : selectedChatId,
                receiver_id: activeConversation?.other_user_id || location.state?.creatorId,
                listing_id: activeConversation?.listing_id || location.state?.listingId
            };

            const res = await sendMessage(payload);
            if (res.success) {
                setDraft("");
                if (selectedChatId === 'temp') {
                    // Refresh conversations to get the real ID
                    const convRes = await getConversations();
                    setConversations(convRes.data);
                    const newConv = convRes.data.find(c => c.handle === activeConversation.handle);
                    if (newConv) {
                        setSelectedChatId(newConv.id);
                        setActiveConversation(newConv);
                    }
                } else {
                    setMessages(prev => [...prev, res.data]);
                }
            }
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleCreateContract = () => {
        const type = localStorage.getItem("userType") || "client";

        let provider, client;
        if (type === "creator") {
            provider = {
                username: currentUser?.username || "",
                full_name: currentUser ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() : currentUser?.full_name || "",
                email: currentUser?.email || "",
                company: currentUser?.company_name || ""
            };
            client = {
                username: otherUserInfo?.username || activeConversation?.handle?.replace("@", "") || "",
                full_name: otherUserInfo?.full_name || activeConversation?.name || "",
                email: otherUserInfo?.email || "",
                company: otherUserInfo?.company_name || ""
            };
        } else {
            client = {
                username: currentUser?.username || "",
                full_name: currentUser ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() : currentUser?.full_name || "",
                email: currentUser?.email || "",
                company: currentUser?.company_name || ""
            };
            provider = {
                username: otherUserInfo?.username || activeConversation?.handle?.replace("@", "") || "",
                full_name: otherUserInfo?.full_name || activeConversation?.name || "",
                email: otherUserInfo?.email || "",
                company: otherUserInfo?.company_name || ""
            };
        }

        const state = { provider, client };
        navigate("/contracts-listing", { state });
    };

    return (
        <div className={`messagebox-page user-page ${theme} min-h-screen`}>
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="pt-[72px] flex relative w-full">
                <Sidebar
                    expanded={sidebarOpen}
                    setExpanded={setSidebarOpen}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    activeSetting={activeSetting}
                    onSectionChange={setActiveSetting}
                    forceClient
                    theme={theme}
                    setTheme={setTheme}
                />

                <div className="messagebox-shell">
                    <main
                        className={`messagebox-layout ${isConversationListMinimized
                            ? "messagebox-layout-list-minimized"
                            : ""
                            }`}
                    >
                        <aside
                            className={`messagebox-column messagebox-list ${isConversationListMinimized
                                ? "messagebox-list-minimized"
                                : ""
                                } ${showConversationList ? "" : "messagebox-hidden-mobile"
                                }`}
                        >
                            <div className="messagebox-list-inner">
                                <div className="messagebox-list-toolbar">
                                    {!isConversationListMinimized && (
                                        <div className="messagebox-search">
                                            <Search size={16} />
                                            <input
                                                type="text"
                                                placeholder="Search here"
                                                aria-label="Search messages"
                                            />
                                        </div>
                                    )}

                                    {!isMobileView && (
                                        <button
                                            type="button"
                                            className="messagebox-list-toggle"
                                            onClick={() =>
                                                setIsConversationListMinimized(
                                                    (prev) => !prev,
                                                )
                                            }
                                            aria-label={
                                                isConversationListMinimized
                                                    ? "Expand conversations list"
                                                    : "Minimize conversations list"
                                            }
                                        >
                                            {isConversationListMinimized ? (
                                                <ChevronRight size={16} />
                                            ) : (
                                                <ChevronLeft size={16} />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {!isConversationListMinimized && (
                                    <div className="messagebox-list-head">
                                        <span>All Messages</span>
                                    </div>
                                )}

                                <div className="messagebox-thread-list">
                                    {conversations.map((conversation) => (
                                        <button
                                            type="button"
                                            key={conversation.id}
                                            className={`messagebox-thread ${conversation.id ===
                                                selectedChatId
                                                ? "active"
                                                : ""
                                                } ${isConversationListMinimized
                                                    ? "messagebox-thread-minimized"
                                                    : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedChatId(
                                                    conversation.id,
                                                );
                                                setActiveConversation(conversation);
                                                if (isMobileView) {
                                                    setIsMobileChatOpen(true);
                                                }
                                            }}
                                        >
                                            <div className="messagebox-avatar placeholder">
                                                {conversation.avatar_url ? (
                                                    <img src={conversation.avatar_url} alt="" className="rounded-full w-full h-full object-cover" />
                                                ) : null}
                                                {conversation.online && (
                                                    <span className="messagebox-dot" />
                                                )}
                                            </div>

                                            <div className="messagebox-thread-copy">
                                                <div className="messagebox-thread-top">
                                                    <div className="messagebox-thread-name">
                                                        <span>
                                                            {conversation.name}
                                                        </span>
                                                        <BadgeCheck size={14} />
                                                    </div>
                                                    <div className="messagebox-thread-meta">
                                                        <span className="messagebox-thread-time">
                                                            {conversation.timestamp ? new Date(conversation.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : conversation.time}
                                                        </span>
                                                        <Star size={13} />
                                                    </div>
                                                </div>
                                                <p className="messagebox-thread-preview">
                                                    {conversation.preview}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <section
                            className={`messagebox-column messagebox-chat ${showChatPanel ? "" : "messagebox-hidden-mobile"
                                }`}
                        >
                            <header className="messagebox-chat-header">
                                <div className="messagebox-chat-user">
                                    {isMobileView && (
                                        <button
                                            type="button"
                                            className="messagebox-mobile-back"
                                            onClick={() =>
                                                setIsMobileChatOpen(false)
                                            }
                                            aria-label="Back to conversations"
                                        >
                                            <ArrowLeft size={18} />
                                        </button>
                                    )}

                                    <div className="messagebox-avatar large placeholder">
                                        {activeConversation?.avatar_url ? (
                                            <img src={activeConversation.avatar_url} alt="" className="rounded-full w-full h-full object-cover" />
                                        ) : null}
                                        <span className="messagebox-dot" />
                                    </div>

                                    <div>
                                        <div className="messagebox-chat-name">
                                            <span>
                                                {activeConversation?.name || "Chat"}
                                            </span>
                                            <BadgeCheck size={15} />
                                        </div>
                                        <p>{activeConversation?.handle}</p>
                                        <small>
                                            {activeConversation?.is_typing 
                                                ? "Typing..." 
                                                : (activeConversation?.time 
                                                    ? `Last message sent ${activeConversation.time}` 
                                                    : "Online")
                                            }
                                        </small>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="messagebox-contract-btn"
                                    onClick={handleCreateContract}
                                >
                                    <SquarePen size={14} />
                                    <span>Create Contract</span>
                                </button>
                            </header>

                            <div className="messagebox-chat-body">
                                <div className="messagebox-chat-scroll">
                                    <div className="messagebox-notice">
                                        Messages are end-to-end encrypted. Only
                                        people in this chat can read, or share
                                        them. Learn more
                                    </div>

                                    <div className="messagebox-messages">
                                        {messages.map((message) => (
                                            <article
                                                key={message.id}
                                                className="messagebox-message"
                                            >
                                                <div
                                                    className={`messagebox-message-avatar ${message.tone}`}
                                                />
                                                <div className="messagebox-message-content">
                                                    <div className="messagebox-message-row">
                                                        <h3>
                                                            {message.sender}
                                                        </h3>
                                                        <time>
                                                            {isNaN(message.time) ? message.time : new Date(message.time * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </time>
                                                    </div>
                                                    <p>{message.text}</p>
                                                    {message.is_me && message.is_read && (
                                                        <div className="messagebox-message-seen">
                                                            <span>Seen {message.read_at ? `at ${new Date(message.read_at * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ""}</span>
                                                            <CheckCircle2 size={10} className="ml-1 text-[#ceff1b]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <footer className="messagebox-composer-wrap">
                                {activeConversation?.is_typing && (
                                    <div className="messagebox-sticker-btn typing-indicator-active">
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                )}

                                <div className="messagebox-composer">
                                    <input
                                        type="text"
                                        placeholder="Type a message.."
                                        value={draft}
                                        onChange={(event) =>
                                            setDraft(event.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        aria-label="Type a message"
                                    />

                                    <div className="messagebox-composer-actions">
                                        <button
                                            type="button"
                                            aria-label="Add emoji"
                                        >
                                            <Smile size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Attach file"
                                        >
                                            <Paperclip size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Send message"
                                            onClick={handleSendMessage}
                                        >
                                            <SendHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>
                            </footer>
                        </section>

                        <aside className="messagebox-column messagebox-profile pr-1">
                            {otherUserInfo ? (
                                <DetailedTeamCard 
                                    teamName={otherUserInfo.full_name || otherUserInfo.username}
                                    location={otherUserInfo.country}
                                    rating={4.5} // Placeholder
                                    reviewCount={28} // Placeholder
                                    description={otherUserInfo.bio || otherUserInfo.about}
                                    languages={otherUserInfo.languages || []}
                                    karma={120} // Placeholder
                                    projectsCompleted={15} // Placeholder
                                    responseSpeed="1 hour"
                                    memberSince={otherUserInfo.created_at}
                                    skills={otherUserInfo.skills || []}
                                    avatarUrl={otherUserInfo.avatar_url}
                                    onViewProfile={() => navigate(`/creators/${otherUserInfo.username}`)}
                                />
                            ) : (
                                <DetailedTeamCard />
                            )}
                        </aside>
                    </main>
                </div>

                <MobileBottomNav theme={theme} />
            </div>
        </div>
    );
}
