import React from 'react';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Globe,
    CircleHelp,
    Coins
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = ({ containerRef }) => {
    const footerLinks = [
        {
            title: "For Clients",
            links: [
                "How Ultra Hustle Works",
                "Customer Success Stories",
                "Trust & Safety",
                "Quality Guide",
            ]
        },
        {
            title: "For Freelancers",
            links: [
                "Become an Ultra Freelancer",
                "Become an Ultra Agency",
                "Community Hub",
            ]
        },
        {
            title: "Company",
            links: [
                "About Ultra Hustle",
                "Help Center",
                "Social Impact",
                "Careers",
                "Terms of Service",
                "Privacy Policy",
            ]
        }
    ];

    return (
        <footer className="uh-footer">
            <div className="uh-footer-shell">
                {/* Top Section: Navigation Links */}
                <div className="uh-footer-grid">
                    {footerLinks.map((column, idx) => (
                        <div key={idx} className="uh-footer-col">
                            <h3 className="uh-footer-title">{column.title}</h3>
                            <ul className="uh-footer-list">
                                {column.links.map((link, lIdx) => (
                                    <li key={lIdx} className="uh-footer-item">
                                        <a href="#" className="uh-footer-link">{link}</a>
                                    </li>
                                ))}
                            </ul>

                            {/* Place Socials & Settings below the FIRST column (For Clients) */}
                            {idx === 0 && (
                                <div className="uh-footer-inline-extras">
                                    <div className="uh-footer-socials">
                                        <a href="#" aria-label="TikTok" className="uh-footer-social-link"><Facebook size={20} /></a>
                                        <a href="#" aria-label="Instagram" className="uh-footer-social-link"><Instagram size={20} /></a>
                                        <a href="#" aria-label="LinkedIn" className="uh-footer-social-link"><Linkedin size={20} /></a>
                                        <a href="#" aria-label="Twitter" className="uh-footer-social-link"><Twitter size={20} /></a>
                                        <a href="#" aria-label="YouTube" className="uh-footer-social-link"><Youtube size={20} /></a>
                                    </div>

                                    <div className="uh-footer-settings">
                                        <button className="uh-footer-setting-btn">
                                            <Globe size={16} />
                                            <span>English</span>
                                        </button>
                                        <button className="uh-footer-setting-btn">
                                            <Coins size={16} />
                                            <span>INR</span>
                                        </button>
                                        <button className="uh-footer-setting-btn uh-footer-acc-btn">
                                            <CircleHelp size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* The Cube Branding Banner */}
                {/* <div className="uh-footer-banner">
                    <img src="/UHlogo-new.png" alt="Ultra Hustle" className="uh-footer-banner-img" />
                </div> */}

                {/* Bottom Section: Branding & Copyright */}
                {/* <div className="uh-footer-divider" />
                
                <div className="uh-footer-bottom">
                    <div className="uh-footer-bottom-left">
                        <div className="uh-footer-brand">
                            <span className="clash uh-footer-logo">ultra hustle.</span>
                        </div>
                        <p className="uh-footer-copyright">
                            © Ultra Hustle International Ltd. 2026
                        </p>
                    </div>
                </div> */}
            </div>
            <div className="uh-footer-banner">
                <motion.img
                    src="/UHlogo.png"
                    alt="Ultra Hustle"
                    className="uh-footer-banner-img"
                    initial={{ opacity: 0, y: 56 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3, root: containerRef }}
                    transition={{
                        duration: 1.4,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                />
            </div>
        </footer>
    );
};

export default Footer;
