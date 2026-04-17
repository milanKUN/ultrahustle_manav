import React, { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./SuggestionBox.css";

const SuggestionBox = ({ theme = "light" }) => {
    const [suggestions, setSuggestions] = useState([
        { id: 1, name: "Name", userName: "User Name" },
        { id: 2, name: "Name", userName: "User Name" },
        { id: 3, name: "Name", userName: "User Name" },
        { id: 4, name: "Name", userName: "User Name" },
        { id: 5, name: "Name", userName: "User Name" },
        { id: 6, name: "Name", userName: "User Name" },
    ]);

    const scrollRef = useRef();

    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = 220;

        if (direction === "left") {
            container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const handleRemove = (id) => {
        setSuggestions(suggestions.filter((item) => item.id !== id));
    };

    return (
        <div className={`suggestion-box-container ${theme}`}>
            <h2 className="suggestion-title">Suggested for you</h2>

            {/* Navigation */}
            <div className="suggestion-wrapper">
                <button className="nav-btn left" onClick={() => scroll("left")}>
                    <ChevronLeft size={18} />
                </button>

                <div className="suggestion-cards" ref={scrollRef}>
                    {suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="suggestion-card">
                            <button
                                className="suggestion-close-btn"
                                onClick={() => handleRemove(suggestion.id)}
                            >
                                <X size={16} />
                            </button>

                            <div className="suggestion-avatar">
                                <div className="avatar-placeholder"></div>
                            </div>

                            <div className="suggestion-content">
                                <h3>{suggestion.name}</h3>
                                <p>{suggestion.userName}</p>
                            </div>

                            <button className="suggestion-follow-btn">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    className="nav-btn right"
                    onClick={() => scroll("right")}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default SuggestionBox;




