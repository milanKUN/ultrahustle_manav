import React, { useState, useEffect } from 'react';
import UserNavbar from "../../../components/layout/UserNavbar";
import Sidebar from "../../../components/layout/Sidebar";
import './ReviewPage.css';
import "../../../Darkuser.css";

const reviewsData = [
  {
    id: 1,
    name: "Emily Chen",
    date: "Nov 15, 2025",
    rating: 5,
    text: "Exceptional designer! Sovan delivered a comprehensive design system that transformed our product. His attention to detail and communication throughout the project was outstanding. Highly recommend for any serious design work!",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    date: "Nov 10, 2025",
    rating: 4,
    text: "Great communication and fantastic results. The component library exceeded our expectations and saved us months of development time. Worth every penny!",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    date: "Nov 5, 2025",
    rating: 4,
    text: "Very professional and delivered quality work on time. The mobile app designs were pixel-perfect and the developer handoff was seamless. Would definitely work with again!",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: 4,
    name: "David Kim",
    date: "Oct 28, 2025",
    rating: 5,
    text: "Solid work overall. The designs were modern and user-friendly. Minor revisions needed but Sovan was very responsive to feedback.",
    avatar: "https://i.pravatar.cc/150?img=13"
  },
  {
    id: 5,
    name: "Sarah Williams",
    date: "Oct 20, 2025",
    rating: 5,
    text: "Outstanding experience from start to finish. Sovan took the time to understand our business needs and delivered designs that not only looked beautiful but actually improved our conversion rates by 40%!",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

const ratingBreakdown = [
  { star: 5, count: 38, percentage: 80 },
  { star: 4, count: 7, percentage: 15 },
  { star: 3, count: 2, percentage: 4 },
  { star: 2, count: 1, percentage: 2 },
  { star: 1, count: 0, percentage: 0 }
];

const StarRating = ({ rating, size = 16 }) => {
  return (
    <div className="star-rating" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "star filled" : "star empty"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default function ReviewPage({ theme, setTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState("basic");

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    setShowSettings(false);
  }, []);

  return (
    <div className={`review-layout-wrapper user-page ${theme}`}>
      <UserNavbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
        theme={theme}
      />

      <div className="review-layout-body">
        <Sidebar
          expanded={sidebarOpen}
          setExpanded={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          activeSetting={activeSetting}
          onSectionChange={setActiveSetting}
          theme={theme}
          setTheme={setTheme}
        />
        
        <div className="review-main-content">
          <div className="review-scroll-area">
            <div className="review-page-container">
              
              <div className="review-content-grid">
                
                {/* Left Column: Stats */}
                <div className="review-stats-column">
                  <h1 className="review-page-title">Review</h1>
                  
                  <div className="review-average-aggregate">
                    <span className="avg-rating-number">4.9</span>
                    <StarRating rating={5} size={18} />
                    <span className="avg-rating-count">(48 reviews)</span>
                  </div>
                  
                  <div className="review-breakdown-bars">
                    {ratingBreakdown.map((item) => (
                      <div key={item.star} className="breakdown-row">
                        <div className="breakdown-label">
                          <span>{item.star}</span>
                          <span className="tiny-star">★</span>
                        </div>
                        <div className="breakdown-bar-shell">
                          <div 
                            className="breakdown-bar-fill" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="breakdown-count">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Reviews List */}
                <div className="review-list-column">
                  <div className="reviews-scroll-container">
                    {reviewsData.map((review) => (
                      <div key={review.id} className="review-item-card">
                        <img 
                          src={review.avatar} 
                          alt={`${review.name} avatar`} 
                          className="reviewer-avatar" 
                        />
                        <div className="review-item-body">
                          <div className="review-item-header">
                            <div className="review-name-cluster">
                              <span className="reviewer-name">{review.name}</span>
                              <StarRating rating={review.rating} size={13} />
                            </div>
                            <span className="reviewer-date">{review.date}</span>
                          </div>
                          <p className="reviewer-text">{review.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
