import React, { useState, useRef } from "react";
import { Paperclip, X } from "lucide-react";
import "./AttachImage.css";

const AttachImage = ({ theme = "light" }) => {
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);
    const fileRef = useRef();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const newImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));

        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={`ask-box ${theme}`}>
            {/* Request button */}
            <button className="request-btn top" disabled={!text.trim()}>
                Request
            </button>

            {/* Image previews */}
            {images.length > 0 && (
                <div className="preview-container">
                    {images.map((img, index) => (
                        <div key={index} className="preview">
                            <img src={img.url} alt="preview" />
                            <button
                                className="remove-btn"
                                onClick={() => removeImage(index)}
                            >
                                <X size={14} className="ml-[2px] text-black" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Textarea */}
            <textarea
                placeholder="Ask anything"
                value={text}
                maxLength={500}
                onChange={(e) => setText(e.target.value)}
            />

            {/* Footer */}
            <div className="ask-footer">
                <button
                    className="attach-btn"
                    onClick={() => fileRef.current.click()}
                >
                    <Paperclip size={16} />
                    Attach
                </button>

                <span className="counter">{text.length}/500</span>
            </div>

            {/* Hidden input */}
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileRef}
                onChange={handleFileChange}
                hidden
            />
        </div>
    );
};

export default AttachImage;
