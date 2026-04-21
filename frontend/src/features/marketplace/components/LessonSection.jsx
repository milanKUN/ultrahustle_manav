import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import "./LessonSection.css";

const LessonSection = ({ lessons, onAddLesson, onRemoveLesson, onUpdateLesson, onUploadMedia }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const activeLesson = lessons[activeTab] || lessons[0];

    const handleUpload = async (index) => {
        setIsUploading(true);
        try {
            await onUploadMedia(index);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="lesson-section">
            <div className="lesson-section-header">
                <h3 className="lesson-section-title">Lessons Builder</h3>
            </div>

            {/* Tabs Navigation */}
            <div className="lesson-tabs-container">
                <div className="lesson-tabs">
                    {lessons.map((_, index) => (
                        <button
                            key={index}
                            className={`lesson-tab ${activeTab === index ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            Lesson {index + 1}
                        </button>
                    ))}
                    {lessons.length < 100 && (
                        <button className="lesson-tab-add" onClick={() => {
                            onAddLesson();
                            setActiveTab(lessons.length);
                        }}>
                            + Add
                        </button>
                    )}
                </div>
            </div>

            <div className="lesson-content">
                <div className="lesson-card active">
                    <div className="lesson-card-top">
                        <h4 className="lesson-number-label">Lesson {activeTab + 1}</h4>
                        {lessons.length > 1 && (
                            <button 
                                className="lesson-delete-tab" 
                                onClick={() => {
                                    onRemoveLesson(activeTab);
                                    setActiveTab(Math.max(0, activeTab - 1));
                                }}
                                title="Delete Lesson"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="lesson-form-grid">
                        <div className="lesson-media-side">
                            <label className="lesson-label">Lesson Thumbnail / Video (Max 10MB)</label>
                            <div className={`lesson-media-box ${activeLesson?.media ? 'has-media' : ''} ${isUploading ? 'uploading' : ''}`}>
                                {isUploading ? (
                                    <div className="lesson-upload-loading">
                                        <div className="lesson-spinner"></div>
                                        <span>Uploading...</span>
                                    </div>
                                ) : activeLesson?.media ? (
                                    <>
                                        {activeLesson.media?.type === 'video' ? (
                                            <video
                                                src={activeLesson.media?.preview || activeLesson.media?.url}
                                                className="lesson-media-preview"
                                                controls
                                            />
                                        ) : (
                                            <img
                                                src={activeLesson.media?.preview || (activeLesson.media?.url || (typeof activeLesson.media === 'string' ? activeLesson.media : ''))}
                                                alt={`Lesson ${activeTab + 1}`}
                                                className="lesson-media-preview"
                                            />
                                        )}
                                        <div className="lesson-media-overlay">
                                            <button 
                                                className="lesson-remove-btn" 
                                                onClick={() => onUpdateLesson(activeTab, 'media', null)}
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button className="lesson-add-media-btn" onClick={() => handleUpload(activeTab)}>
                                        <div className="lesson-placeholder-icons">
                                            <div className="lesson-plus-circle-small">+</div>
                                            <span style={{ fontSize: '12px', marginTop: '40px', display: 'block', color: '#999' }}>
                                                Upload Media
                                            </span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="lesson-inputs-side">
                            <div className="lesson-input-group">
                                <label className="lesson-label">Lesson Title (Required)</label>
                                <input 
                                    type="text" 
                                    className="lesson-input" 
                                    placeholder="e.g. Introduction to Design" 
                                    value={activeLesson?.title || ""}
                                    maxLength={100}
                                    onChange={(e) => onUpdateLesson(activeTab, 'title', e.target.value)}
                                />
                            </div>

                            <div className="lesson-input-group">
                                <label className="lesson-label">Lesson Description (Optional)</label>
                                <textarea 
                                    className="lesson-textarea" 
                                    placeholder="What will students learn in this lesson?"
                                    value={activeLesson?.description || ""}
                                    maxLength={500}
                                    onChange={(e) => onUpdateLesson(activeTab, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonSection;

