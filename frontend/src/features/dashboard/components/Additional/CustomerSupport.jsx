import React, { useState, useRef, useEffect } from "react";
import { X, Smile, Paperclip, Send } from "lucide-react";
import "./CustomerSupport.css";

const CustomerSupport = ({ theme = "light" }) => {
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            type: "support",
            text: "Hi Name, this is Your Name from the Ultra Hustle customer support team. How can I assist you today? Please let me know the issue you're facing, and I'll be happy to help.",
        },
        {
            type: "client",
            text: "Hi",
        },
        {
            type: "support",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        },
    ]);

    const chatRef = useRef();

    /* Auto scroll */
    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    /* Send message (YOU = support) */
    const handleSend = () => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, { type: "support", text: message }]);

        setMessage("");
    };

    return (
        <div className={`chat-box ${theme}`}>
            {/* HEADER */}
            <div className="chat-header">
                <h3>Customer support</h3>
                <X size={18} />
            </div>

            {/* BODY */}
            <div className="chat-body" ref={chatRef}>
                <div className="chat-spacer" />

                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.type}`}>
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* INPUT */}
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message.."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <div className="chat-actions">
                    <Smile size={16} />
                    <Paperclip size={16} />
                    <Send size={16} onClick={handleSend} />
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport;
