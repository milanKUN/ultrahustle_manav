import React, { useState, useRef, useEffect } from "react";
import { X, Smile, Paperclip } from "lucide-react";
import "./ChatSupport.css";

const ChatSupport = ({ theme = "light" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    const userInfo = {
        name: "Husnain",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Husnain",
        status: "Online",
        responseTime: "1 Hour",
    };

    const quickSuggestions = [
        { emoji: "👋", text: "Hey Husnain, can you help me with..." },
        { emoji: "💅", text: "Can you provide your hourly rates for..." },
        { emoji: "📦", text: "Do you think you can deliver an order by..." },
    ];

    const maxCharacters = 2500;

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: "user" }]);
            setMessage("");
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 0);
        }
    };

    const handleQuickSuggestion = (text) => {
        setMessage(text);
        setMessages([...messages, { text, sender: "user" }]);
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    }, [message]);

    return (
        <div className={`chat-support ${theme}`}>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    className="chat-floating-pill"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                >
                    <img
                        src={userInfo.avatar}
                        alt={userInfo.name}
                        className="chat-pill-avatar"
                    />
                    <div className="chat-pill-info">
                        <h4 className="chat-pill-name">
                            Message {userInfo.name}
                        </h4>
                        <p className="chat-pill-status">
                            <span className="status-dot"></span>
                            {userInfo.status} • Avg. response time:{" "}
                            {userInfo.responseTime}
                        </p>
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <img
                                src={userInfo.avatar}
                                alt={userInfo.name}
                                className="chat-header-avatar"
                            />
                            <div className="chat-header-info">
                                <h3 className="chat-header-name">
                                    Message {userInfo.name}
                                </h3>
                                <p className="chat-header-status">
                                    {userInfo.status} • Avg. response time:{" "}
                                    {userInfo.responseTime}
                                </p>
                            </div>
                        </div>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="chat-support-messages">
                        {messages.length === 0 ? (
                            <div className="chat-empty-state">
                                <p className="chat-empty-text">
                                    Ask {userInfo.name} a question or share your
                                    project details (requirements, timeline,
                                    budget, etc.)
                                </p>
                            </div>
                        ) : (
                            <div className="chat-support-messages-list">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`chat-support-message ${msg.sender}`}
                                    >
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    {messages.length === 0 && (
                        <div className="chat-suggestions">
                            {quickSuggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    className="chat-suggestion-btn"
                                    onClick={() =>
                                        handleQuickSuggestion(suggestion.text)
                                    }
                                >
                                    <span className="suggestion-emoji">
                                        {suggestion.emoji}
                                    </span>
                                    <span className="suggestion-text">
                                        {suggestion.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="chat-input-section">
                        <div className="chat-input-wrapper">
                            <textarea
                                ref={textareaRef}
                                className="chat-textarea"
                                placeholder="Ask Husnain a question or share your project details "
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value.slice(0, maxCharacters),
                                    )
                                }
                                onKeyPress={handleKeyPress}
                            />
                            <div className="chat-char-count">
                                {message.length}/{maxCharacters}
                            </div>
                        </div>

                        <div className="chat-footer">
                            <div className="chat-actions">
                                <button
                                    className="chat-action-btn"
                                    aria-label="Add emoji"
                                >
                                    <Smile size={20} />
                                </button>
                                <button
                                    className="chat-action-btn"
                                    aria-label="Attach file"
                                >
                                    <Paperclip size={20} />
                                </button>
                            </div>
                            <button
                                className="chat-send-btn"
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                            >
                                Send message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSupport;
