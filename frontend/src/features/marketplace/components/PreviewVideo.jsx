import React from "react";
import "./PreviewVideo.css";

const isVideoUrl = (value = "") => {
  if (!value || typeof value !== "string") return false;

  const clean = value.split("?")[0].toLowerCase();

  return [".mp4", ".mov", ".avi", ".mkv", ".webm", ".ogg"].some((ext) =>
    clean.endsWith(ext)
  );
};

const PreviewVideo = ({
  previewImage = "",
  previewType = "",
  onUpload,
  onClose,
}) => {
  const hasPreview = !!previewImage;
  const showVideo = previewType === "video" || (hasPreview && isVideoUrl(previewImage));

  return (
    <div className="video-preview-section">
      <div className="video-preview-head">
        <h3 className="video-preview-title">Preview video</h3>

        <div className="video-preview-head-actions">
          {hasPreview && (
            <button
              type="button"
              className="video-close-btn-static"
              onClick={onClose}
              aria-label="Remove video"
              title="Remove"
            >
              × Remove
            </button>
          )}
          <button
            type="button"
            className="video-upload-btn"
            onClick={onUpload}
          >
            {hasPreview ? "Change Video" : "Upload Video"}
          </button>
        </div>
      </div>

      <div className="video-preview-card">
        <div className="video-preview-image-wrap">
          {hasPreview ? (
            showVideo ? (
              <video
                src={previewImage}
                className="video-preview-image"
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                playsInline
                preload="metadata"
                onContextMenu={(e) => e.preventDefault()}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={previewImage}
                alt="Video preview"
                className="video-preview-image"
              />
            )
          ) : (
            <div className="video-preview-empty">
              <button
                type="button"
                className="video-upload-btn"
                onClick={onUpload}
              >
                Upload Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewVideo;
