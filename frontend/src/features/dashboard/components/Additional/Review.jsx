import React, { useState } from "react";
import "./Review.css";

const Review = ({ theme = "light" }) => {
    const [rating, setRating] = useState(null);
    const [feedback, setFeedback] = useState("");

    const ratings = [
        { emoji: "😐", label: "Poor" },
        { emoji: "😔", label: "Fair" },
        { emoji: "🙂", label: "Good" },
        { emoji: "😁", label: "Very Good" },
        { emoji: "😍", label: "Excellent" },
    ];

    const handleSubmit = () => {
        if (rating !== null) {
            console.log("Review submitted:", { rating: rating + 1, feedback });
            // Reset form after submission
            setRating(null);
            setFeedback("");
        }
    };

    const handleCancel = () => {
        setRating(null);
        setFeedback("");
    };

    return (
        <div className={`review-container ${theme}`}>
            {/* Header */}
            <div className="review-header">
                <div className="review-logo">
                    <span className="logo-ultra">ULTRA</span>
                    <span className="logo-hustle">HUSTLE</span>
                </div>
                <div className="review-divider"></div>
            </div>

            {/* Title */}
            <h2 className="review-title">
                How would you rate the overall user experience of our website?
            </h2>

            {/* Rating Section */}
            <div className="review-rating-section">
                <div className="review-star-container">
                    {ratings.map((item, index) => (
                        <div key={index} className="emoji-wrapper">
                            <button
                                className={`emoji-btn ${rating === index ? "active" : ""}`}
                                onClick={() => setRating(index)}
                                aria-label={item.label}
                            >
                                {item.emoji}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback Section */}
            <div className="review-feedback-section">
                <label className="feedback-label">Can you tell us more?</label>
                <textarea
                    className="review-textarea"
                    placeholder="We'd love to hear more!"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                />
            </div>

            {/* Buttons */}
            <div className="review-buttons">
                <button className="review-cancel-btn" onClick={handleCancel}>
                    Cancel
                </button>
                <button
                    className="review-submit-btn"
                    onClick={handleSubmit}
                    disabled={rating === null}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Review;
