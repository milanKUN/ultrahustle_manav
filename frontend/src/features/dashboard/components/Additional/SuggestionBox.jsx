import React, { useState } from "react";
import { X } from "lucide-react";
import "./SuggestionBox.css";

const SuggestionBox = ({ theme = "light" }) => {
    const [suggestions, setSuggestions] = useState([
        { id: 1, name: "Name", userName: "User Name", avatar: null },
        { id: 2, name: "Name", userName: "User Name", avatar: null },
        { id: 3, name: "Name", userName: "User Name", avatar: null },
    ]);

    const handleRemove = (id) => {
        setSuggestions(suggestions.filter((item) => item.id !== id));
    };

    const handleFollow = (id) => {
        console.log("Following user:", id);
    };

    return (
        <div className={`suggestion-box-container ${theme}`}>
            <h2 className="suggestion-title">Suggested for you</h2>

            <div className="suggestion-cards">
                {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="suggestion-card">
                        {/* Close Button */}
                        <button
                            className="suggestion-close-btn"
                            onClick={() => handleRemove(suggestion.id)}
                            aria-label="Remove suggestion"
                        >
                            <X size={16} />
                        </button>

                        {/* Avatar Section */}
                        <div className="suggestion-avatar">
                            {suggestion.avatar ? (
                                <img
                                    src={suggestion.avatar}
                                    alt={suggestion.name}
                                />
                            ) : (
                                <div className="avatar-placeholder"></div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="suggestion-content">
                            <h3 className="suggestion-name">
                                {suggestion.name}
                            </h3>
                            <p className="suggestion-username">
                                {suggestion.userName}
                            </p>
                        </div>

                        {/* Follow Button */}
                        <button
                            className="suggestion-follow-btn"
                            onClick={() => handleFollow(suggestion.id)}
                        >
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestionBox;
