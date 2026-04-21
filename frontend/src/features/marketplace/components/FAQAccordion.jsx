import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./FAQAccordion.css";

const normalizeFaqs = (faqData = []) => {
  return (Array.isArray(faqData) ? faqData : [])
    .map((faq, index) => ({
      id: faq?.id ?? index,
      question:
        faq?.question ||
        faq?.q ||
        faq?.title ||
        "",
      answer:
        faq?.answer ||
        faq?.a ||
        faq?.description ||
        "",
    }))
    .filter((faq) => faq.question || faq.answer);
};

const FAQAccordion = ({
  faqData = [],
  theme = "light",
  title = "Frequently Asked Questions",
  emptyText = "No FAQs added yet.",
}) => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = useMemo(() => normalizeFaqs(faqData), [faqData]);

  return (
    <section className={`faq-section ${theme}`}>
      <div className="faq-header">
        <h3 className="faq-title">{title}</h3>
        <div className="faq-header-line"></div>
      </div>

      <div className="faq-container">
        {faqs.length ? (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq-item ${activeFaq === index ? "active" : ""}`}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() =>
                  setActiveFaq(activeFaq === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  style={{
                    transform:
                      activeFaq === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {activeFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer || "No answer added yet."}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="faq-item active">
            <div className="faq-answer">
              <p>{emptyText}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQAccordion;
