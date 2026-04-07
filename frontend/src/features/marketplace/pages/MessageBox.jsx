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
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar"; 
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import DetailedTeamCard from "../components/DetailedTeamCard";
import "../../../Darkuser.css";
import "./MessageBox.css";

const CONVERSATIONS = [
  {
    id: 1,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "Sure",
    time: "5 hours",
    online: true,
  },
  {
    id: 2,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "Sure",
    time: "5 hours",
    online: true,
  },
  {
    id: 3,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "Can you review this today?",
    time: "7 hours",
    online: false,
  },
  {
    id: 4,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "Sharing the latest files now",
    time: "1 day",
    online: true,
  },
  {
    id: 5,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "Let me know once done",
    time: "1 day",
    online: false,
  },
  {
    id: 6,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "We can start from this screen very soon now",
    time: "2 days",
    online: true,
  },
  {
    id: 7,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "Thanks for the quick update",
    time: "3 days",
    online: false,
  },
  {
    id: 8,
    name: "Mehedi",
    handle: "@Abigail_12",
    preview: "Please send the final version",
    time: "4 days",
    online: true,
  },
];

const MESSAGES = [
  {
    id: 1,
    sender: "Mehedi",
    text: "Frontend Hey, could you please do this?",
    time: "Jan 22, 5:20 PM",
    tone: "dark",
  },
  {
    id: 2,
    sender: "Me",
    text: "Sure",
    time: "Jan 23, 3:23 PM",
    tone: "light",
  },
  {
    id: 3,
    sender: "Mehedi",
    text: "Please keep the first two columns exactly aligned with the mock.",
    time: "Jan 23, 3:31 PM",
    tone: "dark",
  },
  {
    id: 4,
    sender: "Me",
    text: "Working on it. I will update the spacing and scrollbar next.",
    time: "Jan 23, 3:36 PM",
    tone: "light",
  },
  {
    id: 5,
    sender: "Mehedi",
    text: "Perfect, and keep the create contract button at the top right.",
    time: "Jan 23, 3:38 PM",
    tone: "dark",
  },
  {
    id: 6,
    sender: "Me",
    text: "Sure, I am also adding more rows so the panel scrolls like the reference.",
    time: "Jan 23, 3:42 PM",
    tone: "light",
  },
  {
    id: 7,
    sender: "Mehedi",
    text: "That sounds good.",
    time: "Jan 23, 3:44 PM",
    tone: "dark",
  },
  {
    id: 8,
    sender: "Me",
    text: "Almost done, checking the final proportions now.",
    time: "Jan 23, 3:50 PM",
    tone: "light",
  },
];

export default function MessageBox({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSetting, setActiveSetting] = useState("basic");
    const [selectedChatId, setSelectedChatId] = useState(1);
    const [draft, setDraft] = useState("");
    const [isConversationListMinimized, setIsConversationListMinimized] =
        useState(false);
    const [isMobileView, setIsMobileView] = useState(
        () => typeof window !== "undefined" && window.innerWidth <= 900,
    );
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
        setShowSettings(false);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const handleResize = () => {
            const mobile = window.innerWidth <= 900;
            setIsMobileView(mobile);

            if (!mobile) {
                setIsMobileChatOpen(false);
            }

            if (mobile) {
                setIsConversationListMinimized(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const activeConversation = useMemo(
        () =>
            CONVERSATIONS.find((item) => item.id === selectedChatId) ??
            CONVERSATIONS[0],
        [selectedChatId],
    );

    const showConversationList = !isMobileView || !isMobileChatOpen;
    const showChatPanel = !isMobileView || isMobileChatOpen;

    return (
        <div className={`messagebox-page user-page ${theme} min-h-screen`}>
            <UserNavbar
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
                isSidebarOpen={sidebarOpen}
                theme={theme}
            />

            <div className="pt-[85px] flex relative w-full">
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
                        className={`messagebox-layout ${
                            isConversationListMinimized
                                ? "messagebox-layout-list-minimized"
                                : ""
                        }`}
                    >
                        <aside
                            className={`messagebox-column messagebox-list ${
                                isConversationListMinimized
                                    ? "messagebox-list-minimized"
                                    : ""
                            } ${
                                showConversationList ? "" : "messagebox-hidden-mobile"
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
                                    {CONVERSATIONS.map((conversation) => (
                                        <button
                                            type="button"
                                            key={conversation.id}
                                            className={`messagebox-thread ${
                                                conversation.id ===
                                                selectedChatId
                                                    ? "active"
                                                    : ""
                                            } ${
                                                isConversationListMinimized
                                                    ? "messagebox-thread-minimized"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setSelectedChatId(
                                                    conversation.id,
                                                );
                                                if (isMobileView) {
                                                    setIsMobileChatOpen(true);
                                                }
                                            }}
                                        >
                                            <div className="messagebox-avatar placeholder">
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
                                                            {conversation.time}
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
                            className={`messagebox-column messagebox-chat ${
                                showChatPanel ? "" : "messagebox-hidden-mobile"
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
                                        <span className="messagebox-dot" />
                                    </div>

                                    <div>
                                        <div className="messagebox-chat-name">
                                            <span>
                                                {activeConversation.name}
                                            </span>
                                            <BadgeCheck size={15} />
                                        </div>
                                        <p>{activeConversation.handle}</p>
                                        <small>Online</small>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="messagebox-contract-btn"
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
                                        {MESSAGES.map((message) => (
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
                                                            {message.time}
                                                        </time>
                                                    </div>
                                                    <p>{message.text}</p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <footer className="messagebox-composer-wrap">
                                <button
                                    type="button"
                                    className="messagebox-sticker-btn"
                                    aria-label="Open quick tools"
                                >
                                    <span />
                                    <span />
                                    <span />
                                </button>

                                <div className="messagebox-composer">
                                    <input
                                        type="text"
                                        placeholder="Type a message.."
                                        value={draft}
                                        onChange={(event) =>
                                            setDraft(event.target.value)
                                        }
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
                                        >
                                            <SendHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>
                            </footer>
                        </section>

                        <aside className="messagebox-column messagebox-profile">
                            <DetailedTeamCard />
                        </aside>
                    </main>
                </div>

                <MobileBottomNav theme={theme} />
            </div>
        </div>
    );
}
