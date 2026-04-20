import React from "react";
import { Plus, X, Video, Image as ImageIcon } from "lucide-react";
import "./LessonSection.css";

const LessonSection = ({ lessons, onAddLesson, onRemoveLesson, onUpdateLesson, onUploadMedia }) => {
    return (
        <div className="lesson-section">
            <div className="lesson-section-header">
                <h3 className="lesson-section-title">Upload Course</h3>
            </div>

            <div className="lesson-grid">
                {lessons.map((lesson, index) => (
                    <div key={index} className="lesson-card">
                        <div className="lesson-card-header">
                            Lesson {index + 1}
                        </div>

                        <div className={`lesson-media-box ${lesson.media ? 'has-media' : ''}`}>
                            {lesson.media ? (
                                <>
                                    {lesson.media?.type === 'video' ? (
                                        <video
                                            src={lesson.media?.preview || (lesson.media?.url || (typeof lesson.media === 'string' ? lesson.media : ''))}
                                            className="lesson-media-preview"
                                            controls
                                        />
                                    ) : (
                                        <img
                                            src={lesson.media?.preview || (lesson.media?.url || (typeof lesson.media === 'string' ? lesson.media : ''))}
                                            alt={`Lesson ${index + 1}`}
                                            className="lesson-media-preview"
                                        />
                                    )}
                                    <div className="lesson-media-overlay">
                                        <button 
                                            className="lesson-remove-btn" 
                                            onClick={() => onUpdateLesson(index, 'media', null)}
                                        >
                                            <X size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button className="lesson-add-media-btn" onClick={() => onUploadMedia(index)}>
                                    <div className="lesson-placeholder-icons">
                                        <img src="/video2.svg" className="lesson-svg-v2" alt="" />
                                        <img src="/video1.svg" className="lesson-svg-v1" alt="" />
                                        <div className="lesson-plus-circle-small">+</div>
                                    </div>
                                </button>
                            )}
                        </div>

                        <div className="lesson-input-group">
                            <label className="lesson-label">Title</label>
                            <input 
                                type="text" 
                                className="lesson-input" 
                                placeholder="Title" 
                                value={lesson.title}
                                onChange={(e) => onUpdateLesson(index, 'title', e.target.value)}
                            />
                        </div>

                        <div className="lesson-input-group">
                            <label className="lesson-label">Description</label>
                            <textarea 
                                className="lesson-textarea" 
                                placeholder="Description"
                                value={lesson.description}
                                onChange={(e) => onUpdateLesson(index, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="lesson-section-footer">
                <button className="lesson-add-more-btn" onClick={onAddLesson}>
                    <Plus size={18} strokeWidth={3} />
                    Add more
                </button>
            </div>
        </div>
    );
};

export default LessonSection;
