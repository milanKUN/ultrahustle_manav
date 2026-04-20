import React from "react";
import { Plus } from "lucide-react";
import "./FAQSection.css";

const FAQSection = ({
  mode = "listing",
  listingType = "",
  faqs,
  onAddFaq,
  onUpdateFaq,
  onRemoveFaq,
  showFooter = false,
  onSave,
  onSaveDraft,
  isSaving = false,
  submitMode = "create",
}) => {
  const isEditMode = submitMode === "edit";

  return (
    <div
      className="faq-section-container"
      data-mode={mode}
      data-listing-type={listingType}
    >
      <h2 className="faq-heading">FAQs</h2>

      {faqs.map((faq, index) => (
        <div key={index} className="faq-card">
          <div className="faq-header">
            <h3>FAQ #{index + 1}</h3>

            <button
              type="button"
              className="delete-btn"
              onClick={() => onRemoveFaq(index)}
              disabled={faqs.length === 1 || isSaving}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>

          <div className="faq-field">
            <label>Question</label>
            <input
              type="text"
              value={faq.q}
              onChange={(e) => onUpdateFaq(index, "q", e.target.value)}
              placeholder="What do you need to start?"
              disabled={isSaving}
            />
          </div>

          <div className="faq-field">
            <label>Answer</label>
            <input
              type="text"
              value={faq.a}
              onChange={(e) => onUpdateFaq(index, "a", e.target.value)}
              placeholder="A brief and brand assets."
              disabled={isSaving}
            />
          </div>

          {index === faqs.length - 1 && (
            <button type="button" className="add-btn" onClick={onAddFaq} disabled={isSaving}>
              <Plus size={18} /> Add
            </button>
          )}
        </div>
      ))}

      {showFooter && (
        <div className="faq-footer">
          <button type="button" className="draft-btn" onClick={onSaveDraft} disabled={isSaving}>
            {isSaving
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update as Draft"
                : "Save as Draft"}
          </button>

          <button type="button" className="save-btn" onClick={onSave} disabled={isSaving}>
            {isSaving
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update"
                : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQSection;
