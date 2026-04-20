import React from "react";
import "./CoverSection.css";

const CoverSection = ({
  mode = "listing",
  listingType = "",
  cover,
  coverFileName = "",
  onUploadClick,
  onRemoveCover,
}) => {
  return (
    <div className="cover-section-container" data-mode={mode} data-listing-type={listingType}>
      <div className="cover-card">
        <h2 className="cover-title">Media</h2>
        <div className="cover-label">Cover Page</div>

        <div className="cover-upload-box">
          {cover ? (
            <div className="cover-preview-wrapper">
              <img src={cover} alt="cover preview" className="cover-preview" />
              <button className="cover-remove-btn" onClick={onRemoveCover} type="button">
                ×
              </button>

              {coverFileName ? (
                <div className="mt-2 text-xs text-center text-gray-600">{coverFileName}</div>
              ) : null}
            </div>
          ) : (
            <div className="cover-placeholder">
              <button className="cover-upload-btn" onClick={onUploadClick} type="button">
                Upload Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverSection;
