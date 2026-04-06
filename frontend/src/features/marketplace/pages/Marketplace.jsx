import React, { useMemo, useState, useEffect, useRef } from "react";
import UserNavbar from "../../../components/layout/UserNavbar";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";
import heroImg from "../../../assets/marketplacehero.png";
import heroImgDark from "../../../assets/marketplacedark.png";
import filterIcon from "../../../assets/filtericon.svg";
import "./Marketplace.css";

const categories = [
    {
        label: "Service",
        chips: [
            {
                label: "Graphics & Design",
                groups: [
                    { title: "Logo & Brand Identity", items: ["Logo Design", "Brand Style Guides", "Business Cards & Stationery", "Fonts & Typography", "Brand Naming & Strategy", "Art Direction", "Brand Collateral Kits"] },
                    { title: "Web & App Design", items: ["Website Design", "App UI Design", "UX Research & Wireframing", "Landing Page Design", "Dashboard Design", "Icon Design", "Mobile Design Systems"] },
                    { title: "Art & Illustration", items: ["Illustration", "Character Design", "Concept Art", "Portraits & Caricatures", "AI Art & Avatar Design", "Comic Book Illustration", "Children's Book Illustration", "Storyboards", "Tattoo Design", "Pattern Design", "Album & Cover Art"] },
                    { title: "Print & Product Design", items: ["Brochure & Flyer Design", "Business Cards", "Packaging & Label Design", "Poster Design", "Menu Design", "Catalogs & Lookbooks", "Signage & Banners"] },
                    { title: "Visual Design", items: ["Image Editing & Retouching", "Presentation Design", "Resume Design", "Infographic Design", "Vector Tracing", "Slide Decks"] },
                    { title: "Marketing Design", items: ["Social Media Posts & Ads", "Email Design", "Display Ads", "Web Banners", "Promotional Graphics", "Campaign Branding"] },
                    { title: "3D & Architecture Design", items: ["3D Modeling & Rendering", "3D Architecture", "Interior Design", "Landscape Design", "Product Mockups", "3D Printing & Characters", "Lighting & Spatial Design"] },
                    { title: "Fashion & Merchandise", items: ["T-Shirt & Apparel Design", "Jewelry Design", "Accessory & Footwear Design", "Fashion Illustration", "Textile & Fabric Patterns"] },
                    { title: "Miscellaneous Design", items: ["Design Consultation", "Style Adaptation", "Design Audits"] },
                ],
            },
            {
                label: "Programming & Tech",
                groups: [
                    { title: "Website Development", items: ["Business Websites", "E-Commerce Websites", "Portfolio & Personal Sites", "Landing Pages", "Custom Websites", "Dropshipping Stores"] },
                    { title: "Web Platforms", items: ["WordPress", "Shopify", "Wix", "Webflow", "Bubble", "Squarespace", "Framer"] },
                    { title: "Website Maintenance", items: ["Bug Fixes", "Backup & Migration", "Speed Optimization", "Hosting Setup", "Security Patches", "CMS Updates"] },
                    { title: "Mobile App Development", items: ["iOS Development", "Android Development", "Flutter Development", "React Native Development", "Cross-Platform Apps", "App Maintenance & Debugging"] },
                    { title: "Software Development", items: ["Web Applications", "Desktop Software", "APIs & Integrations", "Automations & Workflows", "Database Development", "Testing & QA", "SaaS Product Development"] },
                    { title: "Game Development", items: ["2D/3D Game Design", "Unity Development", "Unreal Engine Development", "Roblox Games", "AR/VR Games", "Game Environment Design", "Game Character Design"] },
                    { title: "AI Development", items: ["AI Websites & Apps", "Chatbots", "AI Automations & Agents", "AI Model Training & Fine-Tuning", "Prompt Engineering", "AI Technology Consulting", "Data Labeling & Tagging"] },
                    { title: "Cloud & Cybersecurity", items: ["Cloud Setup (AWS, GCP, Azure)", "DevOps & Deployment", "Cybersecurity Audits", "Penetration Testing", "Data Backup & Recovery", "API & Server Management"] },
                    { title: "Blockchain & Crypto", items: ["Smart Contract Development", "Token Launch Support", "NFT Minting", "dApp Development", "Wallet Integrations", "Blockchain Consulting"] },
                    { title: "Miscellaneous Tech", items: ["Troubleshooting & Debugging", "Code Review", "IT Support & Consultation"] },
                ],
            },
            {
                label: "Digital Marketing",
                groups: [
                    { title: "Search & SEO", items: ["SEO Audit", "On-Page SEO", "Off-Page SEO", "Local SEO", "E-Commerce SEO", "Video SEO", "SEM & PPC Ads", "Generative Engine Optimization (AI SEO)"] },
                    { title: "Social Media Marketing", items: ["Social Media Strategy", "Social Media Management", "Social Media Design", "Influencer Marketing", "UGC Content Creation", "Social Media Automation"] },
                    { title: "Channel-Specific Marketing", items: ["Instagram Marketing", "TikTok Marketing", "YouTube Marketing", "LinkedIn Marketing", "Facebook Ads Campaigns", "Twitter/X Growth", "Pinterest Marketing", "Shopify Marketing"] },
                    { title: "Email & Automation", items: ["Email Marketing", "Newsletter Creation", "Automation Workflows", "Drip Campaigns", "Cold Email Systems", "CRM Integration"] },
                    { title: "Marketing Analytics & Strategy", items: ["Brand Strategy", "Marketing Funnels", "CRO (Conversion Optimization)", "Web Analytics", "Attribution Tracking", "Market Research"] },
                    { title: "AI Marketing", items: ["AI Prompt Marketing", "AI-Powered Campaigns", "AI Ad Bidding Optimization", "AI Personalization", "Predictive Marketing"] },
                    { title: "Industry-Specific", items: ["Music Promotion", "Podcast Promotion", "Book & eBook Marketing", "Course Launch Marketing", "App Store Optimization"] },
                    { title: "Public Relations & Advertising", items: ["PR Campaigns", "Press Release Writing", "Display Advertising", "Sponsorship Strategy", "Media Buying"] },
                ],
            },
            {
                label: "Writing & Translation",
                groups: [
                    { title: "Content Writing", items: ["Blog & Article Writing", "Website Content", "Scriptwriting", "Creative Writing", "Ghostwriting", "Research Summaries"] },
                    { title: "Copywriting", items: ["Ad Copy", "Email Copy", "Sales Copy", "Product Descriptions", "Case Studies", "Landing Page Copy"] },
                    { title: "Editing & Proofreading", items: ["Grammar & Style Editing", "Copy Editing", "Formatting", "Academic Editing", "AI Content Polishing"] },
                    { title: "Book & Publishing", items: ["Book & eBook Writing", "Book Editing", "Beta Reading", "Book Layout & Formatting", "Publishing Assistance"] },
                    { title: "Translation & Transcription", items: ["Document Translation", "Website Localization", "Subtitles & Captions", "Proofreading", "Audio Transcription", "Live Interpretation"] },
                    { title: "Industry Writing", items: ["Business & Finance Writing", "Technical Writing", "Medical Writing", "Real Estate Writing", "Marketing Writing"] },
                    { title: "AI Writing", items: ["AI Prompt Writing", "AI Story Creation", "AI Editing & Review"] },
                ],
            },
            {
                label: "Video & Animation",
                groups: [
                    { title: "Video Editing", items: ["YouTube Editing", "Short-Form Reels & TikToks", "Visual Effects (VFX)", "Subtitles & Captions", "Multi-Cam Sync & Transitions"] },
                    { title: "Animation & Motion Graphics", items: ["2D Animation", "3D Animation", "Motion Graphics", "Whiteboard Animation", "Lottie Animations", "NFT & Web3 Animation"] },
                    { title: "Marketing & Social Videos", items: ["Ads & Commercials", "Explainer Videos", "Product Demos", "Slideshow Videos", "Music Videos"] },
                    { title: "AI Video", items: ["AI Avatars", "Text-to-Video Creation", "Lip-Sync AI Videos", "AI UGC Content", "Virtual Presenter Videos"] },
                    { title: "Filmed Video Production", items: ["Drone Videography", "Live Action Explainers", "Event Videography", "Corporate Videos"] },
                    { title: "Product & App Videos", items: ["3D Product Animation", "App Previews", "E-Commerce Videos", "Kickstarter Videos"] },
                    { title: "Miscellaneous", items: ["Game Trailers", "Book Trailers", "Meditation Videos", "Video Advice"] },
                ],
            },
            {
                label: "Music & Audio",
                groups: [
                    { title: "Music Production", items: ["Custom Music Composition", "Mixing & Mastering", "Songwriting & Lyrics", "Jingles & Intros", "Soundtracks"] },
                    { title: "Voice Over & Narration", items: ["Commercial Voice", "Character Voice", "Audiobook Narration", "Podcast Intros"] },
                    { title: "Audio Engineering", items: ["Audio Editing", "Vocal Tuning", "Restoration & Cleaning", "Sound Enhancement"] },
                    { title: "Sound Design", items: ["Sound Effects", "Audio Logos & Sonic Branding", "Plugin & Patch Creation"] },
                    { title: "DJ & Performance", items: ["DJ Mixing", "Drops & Tags", "Remixes"] },
                    { title: "AI Audio", items: ["AI Voice Generation", "Text-to-Speech", "Voice Cloning", "AI Music Generation"] },
                    { title: "Lessons", items: ["Music Theory", "Instrument Lessons", "Voice Coaching"] },
                ],
            },
            {
                label: "Business",
                groups: [
                    { title: "Business Formation", items: ["Company Registration", "Market Research", "Business Plans", "Financial Forecasting", "HR Consulting"] },
                    { title: "Operations & Management", items: ["Virtual Assistant", "Project Management", "SOP Documentation", "Workflow Optimization", "Event Management"] },
                    { title: "Legal & Compliance", items: ["Contract Drafting", "Legal Review", "Policy Creation", "IP & Trademark Services"] },
                    { title: "Sales & Customer Care", items: ["Sales Strategy", "CRM Setup", "Customer Support", "Lead Generation"] },
                    { title: "Analytics & Intelligence", items: ["Data Visualization", "Business Intelligence", "Market Analytics", "Reporting Dashboards"] },
                    { title: "AI & Automation in Business", items: ["Process Automation", "AI Assistants for Operations", "Data-Driven Decision Tools"] },
                ],
            },
            {
                label: "Finance & Accounting",
                groups: [
                    { title: "Accounting & Reporting", items: ["Bookkeeping", "Payroll Management", "Financial Statements", "CFO Consulting"] },
                    { title: "Corporate Finance", items: ["Valuation", "M&A Advisory", "Due Diligence", "Fundraising Documents"] },
                    { title: "Tax & Compliance", items: ["Tax Planning", "Filing & Returns", "Audit Support", "Compliance Reports"] },
                    { title: "Personal Finance", items: ["Budgeting & Forecasting", "Investment Planning", "Retirement Planning", "Credit Score Advisory"] },
                    { title: "Financial Analysis", items: ["Financial Modeling", "Cost Analysis", "Profitability Analysis"] },
                ],
            },
            {
                label: "Personal Growth & Lifestyle",
                groups: [
                    { title: "Coaching & Mentorship", items: ["Life Coaching", "Career Mentorship", "Business Mentorship", "Productivity Coaching", "Public Speaking"] },
                    { title: "Wellness & Fitness", items: ["Fitness Training", "Nutrition Coaching", "Yoga & Meditation", "Wellness Programs"] },
                    { title: "Fashion & Style", items: ["Personal Styling", "Modeling & Acting Coaching", "Beauty Consulting", "Wardrobe Strategy"] },
                    { title: "Gaming & Entertainment", items: ["Game Coaching", "Streaming Setup", "Esports Strategy", "Gameplay Reviews"] },
                    { title: "Leisure & Hobbies", items: ["Astrology & Tarot", "Art & Crafts", "DIY Projects", "Traveling Guidance"] },
                ],
            },
            {
                label: "AI Services",
                groups: [
                    { title: "AI Development", items: ["AI App Creation", "AI Websites", "AI Chatbots", "Automations & Agents", "API & Workflow Integration"] },
                    { title: "AI Art & Design", items: ["Midjourney Design", "Stable Diffusion Illustration", "AI Avatar Design", "AI Image Editing"] },
                    { title: "AI Video", items: ["AI Avatars", "AI Music Videos", "AI Video Art", "Text-to-Video"] },
                    { title: "AI Writing & Content", items: ["Prompt Writing", "AI Storytelling", "Article Generation", "AI Copywriting"] },
                    { title: "AI Data & Analytics", items: ["Data Collection", "Data Annotation", "Model Training", "Machine Learning Setup"] },
                    { title: "AI Consulting", items: ["AI Strategy & Integration", "AI Education & Workshops"] },
                ],
            },
        ],
    },
    {
        label: "Digital Products",
        chips: [
            {
                label: "Business & Entrepreneurship Kits",
                groups: [
                    {
                        title: "Startup & Strategy Templates",
                        items: [
                            "Business Plan Templates",
                            "Pitch Deck Templates",
                            "Market Research Frameworks",
                            "Competitor Analysis Templates",
                            "SWOT Analysis Tools",
                            "Financial Forecast Models",
                            "Business Model Canvas",
                        ],
                    },
                    {
                        title: "Operations & Management Systems",
                        items: [
                            "SOP Templates",
                            "Role & Responsibility Charts",
                            "Daily/Weekly Planner Dashboards",
                            "Process Flowcharts",
                            "Company Policy Templates",
                            "Onboarding Kits",
                            "Task Delegation Sheets",
                        ],
                    },
                    {
                        title: "Legal & Compliance Packs",
                        items: [
                            "NDA & Contract Templates",
                            "Freelancer Agreements",
                            "Partnership Agreements",
                            "Client Proposal Templates",
                            "Invoice & Payment Terms Templates",
                            "Privacy Policy & Terms of Service",
                            "Trademark/Patent Docs",
                        ],
                    },
                    {
                        title: "Agency & Freelance Kits",
                        items: [
                            "Client Intake Forms",
                            "Service Proposal Decks",
                            "Deliverable Checklists",
                            "Revision Tracker",
                            "Project Brief Templates",
                            "Portfolio Decks",
                            "Feedback & Testimonial Sheets",
                        ],
                    },
                    {
                        title: "Finance & Accounting Systems",
                        items: [
                            "Expense Trackers",
                            "Profit & Loss Dashboards",
                            "Subscription Tracker",
                            "Cash Flow Templates",
                            "Pricing Calculators",
                            "Invoice Templates",
                            "Tax Summary Sheets",
                        ],
                    },
                ],
            },

            {
                label: "Design Assets & Creative Elements",
                groups: [
                    {
                        title: "Graphic Packs",
                        items: [
                            "Icon Sets (Flat / 3D / Line)",
                            "Illustration Packs",
                            "Logo Mockups",
                            "Brand Identity Templates",
                            "Social Media Template Kits",
                            "Ad & Poster Templates",
                            "Presentation Templates",
                        ],
                    },
                    {
                        title: "UI & UX Components",
                        items: [
                            "Figma UI Kits",
                            "Webflow Template Kits",
                            "Mobile App UI Kits",
                            "Dashboard & SaaS UI Kits",
                            "Component Libraries",
                            "Style Guide Templates",
                            "Design Systems",
                        ],
                    },
                    {
                        title: "Print & Product Templates",
                        items: [
                            "Brochure & Flyer Templates",
                            "Packaging Mockups",
                            "Business Card Templates",
                            "Menu & Label Templates",
                            "Resume & Portfolio Templates",
                            "Stationery & Merch Designs",
                        ],
                    },
                    {
                        title: "3D & Motion Assets",
                        items: [
                            "3D Object Packs",
                            "Animation Presets",
                            "Blender/GLB Models",
                            "Motion Graphics Packs",
                            "LUTs & Color Presets",
                            "Transition & Effect Packs",
                        ],
                    },
                    {
                        title: "Font & Typography Packs",
                        items: [
                            "Display Fonts",
                            "Handwritten Fonts",
                            "Sans Serif/Serif Font Families",
                            "Custom Font Licenses",
                        ],
                    },
                    {
                        title: "Branding Kits",
                        items: [
                            "Logo Pack (Editable)",
                            "Moodboard Templates",
                            "Brand Guideline PDFs",
                            "Brand Color Palette Kits",
                            "Typography & Iconography Sets",
                        ],
                    },
                ],
            },

            {
                label: "Marketing & Sales Toolkits",
                groups: [
                    {
                        title: "Content Planning & Strategy",
                        items: [
                            "Content Calendar Templates",
                            "Campaign Planning Sheets",
                            "30/60/90-Day Strategy Templates",
                            "Hashtag & Keyword Tracker",
                            "Social Media Posting Systems",
                        ],
                    },
                    {
                        title: "Funnel & Automation Kits",
                        items: [
                            "Lead Magnet Templates",
                            "Email Sequence Blueprints",
                            "Landing Page Copy Frameworks",
                            "Funnel Mapping Templates",
                            "Automation Workflows (Make/Zapier)",
                        ],
                    },
                    {
                        title: "Social Media Templates",
                        items: [
                            "Instagram Carousel Templates",
                            "Reel Thumbnail Packs",
                            "Story & Highlight Templates",
                            "LinkedIn Post Templates",
                            "YouTube Thumbnail Packs",
                        ],
                    },
                    {
                        title: "Advertising & Copy Packs",
                        items: [
                            "Ad Copy Swipes (FB/IG/Google)",
                            "UGC Script Templates",
                            "Headline Formula Sheets",
                            "Ad Design Templates",
                        ],
                    },
                    {
                        title: "PR & Outreach Resources",
                        items: [
                            "Cold Email Swipe Files",
                            "Media Pitch Templates",
                            "Influencer Outreach Sheets",
                            "Affiliate Tracking Sheets",
                            "Press Release Templates",
                        ],
                    },
                ],
            },

            {
                label: "Freelancer & Creator Toolkits",
                groups: [
                    {
                        title: "Portfolio & Brand Assets",
                        items: [
                            "Portfolio Website Templates",
                            "Case Study Templates",
                            "Personal Brand Playbook",
                            "Bio & About Page Templates",
                            "Link-in-Bio Templates",
                        ],
                    },
                    {
                        title: "Client Management Tools",
                        items: [
                            "Proposal & Quote Sheets",
                            "Client Brief Templates",
                            "Contract Templates",
                            "Project Tracker Sheets",
                            "Feedback Forms",
                        ],
                    },
                    {
                        title: "Income & Productivity Tools",
                        items: [
                            "Time Tracker Templates",
                            "Productivity Dashboard",
                            "Invoice Generator Templates",
                            "Income & Expense Spreadsheet",
                            "Goal Setting Templates",
                        ],
                    },
                    {
                        title: "Creator Ecosystem",
                        items: [
                            "Collaboration Agreement Templates",
                            "Royalty & Licensing Sheets",
                            "Team SOP Tracker",
                            "Deliverables Checklist",
                        ],
                    },
                    {
                        title: "Creator AI Tools",
                        items: [
                            "AI Prompt Pack for Creators",
                            "AI Workflow Templates",
                            "Video Script Generator Templates",
                            "Content Automation Blueprints",
                        ],
                    },
                ],
            },

            {
                label: "Productivity & Personal Systems",
                groups: [
                    {
                        title: "Notion Dashboards",
                        items: [
                            "Personal Productivity Dashboard",
                            "Daily Journal & Planner",
                            "Habit Tracker",
                            "Life OS Template",
                            "Finance Tracker",
                            "Goal Planner",
                        ],
                    },
                    {
                        title: "AI Productivity Tools",
                        items: [
                            "ChatGPT Prompt Packs",
                            "GPT Workflow Automations",
                            "Custom GPT Blueprints",
                            "AI Meeting Notes Templates",
                        ],
                    },
                    {
                        title: "Task & Project Management",
                        items: [
                            "Task Planner Spreadsheets",
                            "Project Timeline Templates",
                            "Sprint Tracker",
                            "To-Do Dashboards",
                        ],
                    },
                    {
                        title: "Time & Focus Systems",
                        items: [
                            "Pomodoro Tracker",
                            "Focus Planner",
                            "Time Blocking Template",
                            "Weekly Review Template",
                        ],
                    },
                ],
            },

            {
                label: "Educational Materials & Resources",
                groups: [
                    {
                        title: "E-Books & Guides",
                        items: [
                            "Business Strategy E-Books",
                            "Marketing Playbooks",
                            "AI & Automation Guides",
                            "Productivity Handbooks",
                            "Personal Development Manuals",
                        ],
                    },
                    {
                        title: "Swipe Files & Frameworks",
                        items: [
                            "Headline Swipe Files",
                            "Offer Frameworks",
                            "Hook Libraries",
                            "Copywriting Formulas",
                            "Funnel Frameworks",
                        ],
                    },
                    {
                        title: "Worksheets & Checklists",
                        items: [
                            "Goal Setting Worksheets",
                            "Daily Habit Sheets",
                            "Systemization Checklists",
                            "Launch Checklists",
                            "Content Calendar Sheets",
                        ],
                    },
                    {
                        title: "Workbooks & Printables",
                        items: [
                            "Learning Workbooks",
                            "Reflection Journals",
                            "Printable Planner Sheets",
                            "Creative Practice Templates",
                        ],
                    },
                ],
            },

            {
                label: "Audio, Music & Sound Packs",
                groups: [
                    {
                        title: "Music Loops & Beats",
                        items: [
                            "Royalty-Free Beats",
                            "Background Loops",
                            "Ambient Music Packs",
                            "Drum & Bass Samples",
                        ],
                    },
                    {
                        title: "Sound Effects",
                        items: [
                            "UI & Notification Sounds",
                            "Ambient Soundscapes",
                            "Cinematic Sound Effects",
                            "Game Sound Packs",
                        ],
                    },
                    {
                        title: "Voice & Podcast Assets",
                        items: [
                            "Voiceover Packs",
                            "Podcast Intro/Outro Templates",
                            "Audio Branding Elements",
                            "Sound Bed Tracks",
                        ],
                    },
                    {
                        title: "AI Audio Tools",
                        items: [
                            "AI Voice Generator Presets",
                            "Text-to-Speech Voice Packs",
                            "AI Music Model Prompts",
                        ],
                    },
                ],
            },

            {
                label: "Video, Motion & Visual Assets",
                groups: [
                    {
                        title: "Stock Footage Packs",
                        items: [
                            "Lifestyle & People Clips",
                            "Nature & Travel Clips",
                            "Business & Office Footage",
                            "Tech & Startup Stock Videos",
                        ],
                    },
                    {
                        title: "Motion Templates",
                        items: [
                            "After Effects Templates",
                            "Premiere Pro Presets",
                            "Transition & Zoom Packs",
                            "Text Animation Presets",
                        ],
                    },
                    {
                        title: "LUTs & Color Presets",
                        items: [
                            "Cinematic LUTs",
                            "YouTube LUTs",
                            "Vlog LUT Packs",
                            "Film Grain Overlays",
                        ],
                    },
                    {
                        title: "AI Video Resources",
                        items: [
                            "Sora/Midjourney Prompt Packs",
                            "AI Video Avatar Templates",
                            "Scene Prompt Blueprints",
                            "Storyboard Generation Templates",
                        ],
                    },
                ],
            },

            {
                label: "AI & Automation Resources",
                groups: [
                    {
                        title: "AI Prompt Libraries",
                        items: [
                            "ChatGPT Prompts (Marketing, Business, Design)",
                            "Midjourney Prompts",
                            "Leonardo.ai & RunwayML Prompts",
                            "Prompt Engineering Playbooks",
                        ],
                    },
                    {
                        title: "AI Automation Workflows",
                        items: ["n8n Workflow JSONs", "Make.com Blueprints", "Zapier Templates", "AI Task Bots"],
                    },
                    {
                        title: "AI Business Systems",
                        items: [
                            "AI SOP Kits",
                            "Auto-Reply Templates",
                            "Client AI Agent Blueprints",
                            "AI CRM Templates",
                        ],
                    },
                    {
                        title: "AI Product Bundles",
                        items: [
                            "AI Art & Video Packs",
                            "AI Content Starter Kits",
                            "AI App Build Templates",
                            "GPT Marketplace Launch Kit",
                        ],
                    },
                ],
            },

            {
                label: "Personal Development & Wellness",
                groups: [
                    {
                        title: "Mindset & Success",
                        items: [
                            "Affirmation Journals",
                            "Self-Reflection Worksheets",
                            "Goal Visualization Boards",
                            "Success Habit Trackers",
                        ],
                    },
                    {
                        title: "Health & Wellness",
                        items: [
                            "Fitness Planner Templates",
                            "Meal Planner & Nutrition Tracker",
                            "Meditation Scripts",
                            "Wellness Routines",
                        ],
                    },
                    {
                        title: "Career & Learning",
                        items: ["Resume Templates", "Cover Letter Templates", "Job Search Tracker", "Learning Roadmaps"],
                    },
                    {
                        title: "Lifestyle & Creative",
                        items: [
                            "Creative Routine Trackers",
                            "Budget & Spending Sheets",
                            "Minimalist Life Templates",
                            "Hobby Planners",
                        ],
                    },
                ],
            },

            {
                label: "Bundle Packs & Mega Collections",
                groups: [
                    {
                        title: "Business & Agency Bundles",
                        items: [
                            "Full Business System Kit (SOP + Legal + Finance)",
                            "Freelancer Toolkit Pro Pack",
                            "Marketing Automation Bundle",
                        ],
                    },
                    {
                        title: "AI Creator Bundles",
                        items: [
                            "AI Starter Kit (Prompts + Templates + Workflows)",
                            "AI Art & Design Pack",
                            "AI Automation Agency Bundle",
                        ],
                    },
                    {
                        title: "Design & Creative Bundles",
                        items: ["1000+ Canva Templates", "Ultimate Figma UI Kit", "3D + Animation Bundle"],
                    },
                    {
                        title: "Productivity & Life OS Bundles",
                        items: ["Notion Life & Work OS", "Ultimate Planner System", "Habit + Focus Bundle"],
                    },
                ],
            },
        ],
    },
    {
        label: "Courses",
        chips: [
            {
                label: "Business & Entrepreneurship",
                groups: [
                    {
                        title: "Startup & Business Foundations",
                        items: [
                            "Startup Ideation & Validation",
                            "Market Research & Analysis",
                            "Building an MVP",
                            "Business Model Design",
                            "Go-To-Market Planning",
                            "Lean Startup Methodology",
                            "Business Systems & SOP Setup",
                        ],
                    },
                    {
                        title: "Freelancing & Agency Building",
                        items: [
                            "Freelancing 101: Getting Started",
                            "Client Acquisition & Retention",
                            "Pricing & Negotiation",
                            "Project Management for Freelancers",
                            "From Freelancer to Agency Owner",
                            "Scaling Your Service Business",
                        ],
                    },
                    {
                        title: "Operations & Productivity",
                        items: [
                            "Time Management Mastery",
                            "Process Design & Optimization",
                            "Workflow Automation",
                            "Delegation & Team Management",
                            "KPI Tracking & Reporting",
                            "System Thinking for Entrepreneurs",
                        ],
                    },
                    {
                        title: "Finance for Founders",
                        items: [
                            "Business Accounting Basics",
                            "Profit & Loss Management",
                            "Budgeting for Startups",
                            "Investment & Fundraising",
                            "Building Financial Dashboards",
                            "Valuation & Exit Strategies",
                        ],
                    },
                    {
                        title: "Legal & Compliance Essentials",
                        items: [
                            "Legal Setup & Entity Formation",
                            "Contracts & Agreements",
                            "IP & Trademark Fundamentals",
                            "Taxation for Small Businesses",
                            "Risk Management",
                        ],
                    },
                ],
            },

            {
                label: "Marketing & Sales",
                groups: [
                    {
                        title: "Marketing Fundamentals",
                        items: [
                            "Marketing Strategy 101",
                            "Consumer Psychology",
                            "Branding & Positioning",
                            "Market Segmentation & Targeting",
                            "Marketing Analytics",
                        ],
                    },
                    {
                        title: "Digital Marketing",
                        items: [
                            "SEO Mastery",
                            "Paid Ads (Google, Meta, LinkedIn)",
                            "Social Media Marketing",
                            "Influencer Marketing",
                            "Affiliate & Referral Systems",
                            "Marketing Automation with AI",
                        ],
                    },
                    {
                        title: "Copywriting & Content Strategy",
                        items: [
                            "Copywriting for Conversions",
                            "Email Marketing",
                            "Storytelling & Hook Writing",
                            "Landing Page Copy Optimization",
                            "Funnel Copywriting",
                            "Offer Crafting Frameworks",
                        ],
                    },
                    {
                        title: "Funnel & Growth Systems",
                        items: [
                            "Building a Marketing Funnel",
                            "Lead Magnet Creation",
                            "CRM Setup & Nurture Systems",
                            "Conversion Rate Optimization (CRO)",
                            "Retargeting Campaigns",
                            "Analytics & Funnel Reports",
                        ],
                    },
                    {
                        title: "Sales & Closing",
                        items: [
                            "Sales Psychology",
                            "Building Offers That Sell",
                            "Sales Pitching & Demos",
                            "Cold Email & Cold Calling",
                            "Negotiation Techniques",
                            "Closing & Upselling Systems",
                        ],
                    },
                ],
            },

            {
                label: "Design, Branding & Creative Arts",
                groups: [
                    {
                        title: "Graphic Design",
                        items: [
                            "Design Principles & Color Theory",
                            "Adobe Photoshop / Illustrator",
                            "Canva Pro Design Systems",
                            "Creating Brand Assets",
                            "Poster & Ad Design",
                            "Print & Packaging Design",
                        ],
                    },
                    {
                        title: "UI/UX Design",
                        items: [
                            "UX Research Fundamentals",
                            "Wireframing & Prototyping",
                            "Figma Masterclass",
                            "UI Animation & Microinteractions",
                            "Web Design Systems",
                            "Accessibility & Usability",
                        ],
                    },
                    {
                        title: "Branding & Visual Identity",
                        items: [
                            "Brand Strategy Development",
                            "Brand Naming & Storytelling",
                            "Visual Identity Creation",
                            "Brand Guideline Documentation",
                            "Personal Branding for Creators",
                        ],
                    },
                    {
                        title: "Art & Illustration",
                        items: [
                            "Character Design",
                            "Digital Painting",
                            "Comic Art Creation",
                            "AI Art Tools (Midjourney, Leonardo, Firefly)",
                            "Vector Illustration",
                        ],
                    },
                    {
                        title: "3D & Motion Design",
                        items: [
                            "3D Modeling (Blender/Cinema4D)",
                            "Lighting & Rendering",
                            "Product Visualization",
                            "Motion Graphics & Animation",
                            "Video Intros & Titles",
                        ],
                    },
                ],
            },

            {
                label: "Programming & Tech Development",
                groups: [
                    {
                        title: "Web Development",
                        items: [
                            "HTML, CSS, JavaScript Foundations",
                            "Frontend with React/Next.js",
                            "Backend with Node.js / Laravel",
                            "APIs & Integrations",
                            "E-Commerce Website Development",
                            "CMS Development (WordPress, Webflow)",
                        ],
                    },
                    {
                        title: "App Development",
                        items: [
                            "Flutter App Development",
                            "React Native Crash Course",
                            "iOS (Swift) Development",
                            "Android (Kotlin) Development",
                            "App Store Optimization",
                        ],
                    },
                    {
                        title: "Software & Product Development",
                        items: [
                            "Building SaaS Applications",
                            "Database Design",
                            "API Development",
                            "QA Testing & Debugging",
                            "DevOps Basics",
                        ],
                    },
                    {
                        title: "Game Development",
                        items: [
                            "Unity Development",
                            "Unreal Engine",
                            "Character Rigging & Animation",
                            "Level Design",
                            "Publishing & Monetization",
                        ],
                    },
                    {
                        title: "Cloud & Cybersecurity",
                        items: [
                            "Cloud Computing Basics",
                            "AWS / Google Cloud Setup",
                            "DevOps Deployment",
                            "Cybersecurity Fundamentals",
                            "Data Encryption & Protection",
                        ],
                    },
                ],
            },

            {
                label: "Artificial Intelligence & Automation",
                groups: [
                    {
                        title: "AI Fundamentals",
                        items: [
                            "Understanding AI & ML",
                            "Prompt Engineering Mastery",
                            "Data Science Essentials",
                            "NLP Basics",
                            "Generative AI Explained",
                        ],
                    },
                    {
                        title: "Applied AI Tools",
                        items: [
                            "ChatGPT for Business",
                            "Midjourney & Leonardo for Design",
                            "Runway & Pika for Video",
                            "Sora for AI Animation",
                            "Custom GPTs & Agents",
                        ],
                    },
                    {
                        title: "AI Development",
                        items: [
                            "Building AI Chatbots",
                            "API & Model Integrations",
                            "Fine-Tuning LLMs",
                            "Building AI Workflows",
                            "AI Automation using Make/Zapier/n8n",
                        ],
                    },
                    {
                        title: "Data & Analytics",
                        items: [
                            "Data Cleaning & Visualization",
                            "Machine Learning with Python",
                            "Predictive Modeling",
                            "Building AI Dashboards",
                        ],
                    },
                    {
                        title: "AI Business Strategy",
                        items: [
                            "AI Consulting for Agencies",
                            "Building AI Service Businesses",
                            "Monetizing Prompts & Models",
                            "Ethics & AI Governance",
                        ],
                    },
                ],
            },

            {
                label: "Video, Animation & Multimedia",
                groups: [
                    {
                        title: "Video Editing",
                        items: [
                            "Adobe Premiere Pro",
                            "DaVinci Resolve",
                            "CapCut / Descript for Creators",
                            "YouTube Video Editing",
                            "Short-Form Video Creation",
                        ],
                    },
                    {
                        title: "Animation",
                        items: [
                            "After Effects Fundamentals",
                            "Motion Graphics",
                            "Whiteboard Animation",
                            "3D Animation & Rigging",
                            "Logo & Text Animation",
                        ],
                    },
                    {
                        title: "Content Creation",
                        items: [
                            "Filming & Lighting Basics",
                            "Scriptwriting for Video",
                            "UGC Video Creation",
                            "Storyboarding & Visual Planning",
                        ],
                    },
                    {
                        title: "AI Video Creation",
                        items: [
                            "AI Avatar Creation (HeyGen, Synthesia)",
                            "Text-to-Video with Sora",
                            "Lip Sync & Voice Integration",
                            "AI Short-Form Video Systems",
                        ],
                    },
                    {
                        title: "YouTube & Social Mastery",
                        items: [
                            "Channel Branding",
                            "SEO for YouTube",
                            "Retention Analytics",
                            "Monetization & Sponsorships",
                        ],
                    },
                ],
            },

            {
                label: "Music, Audio & Podcasting",
                groups: [
                    {
                        title: "Music Production",
                        items: [
                            "DAW Setup (FL Studio, Ableton, Logic)",
                            "Music Theory & Composition",
                            "Mixing & Mastering",
                            "Beat Making & Sampling",
                        ],
                    },
                    {
                        title: "Audio Engineering",
                        items: [
                            "Recording & Editing",
                            "Voice Cleaning & Tuning",
                            "Sound Effects Design",
                            "Audio Restoration",
                        ],
                    },
                    {
                        title: "Voice Over & Podcasting",
                        items: [
                            "Voice Acting & Narration",
                            "Podcast Setup & Hosting",
                            "Scriptwriting for Audio",
                            "Monetizing Podcasts",
                        ],
                    },
                    {
                        title: "DJing & Live Sound",
                        items: [
                            "DJ Basics (Serato, Rekordbox)",
                            "Live Mixing Techniques",
                            "Stage Setup & Sound Management",
                        ],
                    },
                    {
                        title: "AI Audio Creation",
                        items: [
                            "AI Music Generation",
                            "Text-to-Speech Voiceovers",
                            "Voice Cloning for Content",
                        ],
                    },
                ],
            },

            {
                label: "Writing, Content & Communication",
                groups: [
                    {
                        title: "Creative Writing",
                        items: [
                            "Storytelling & Narrative Design",
                            "Scriptwriting for Film/Video",
                            "Fiction & Nonfiction Writing",
                            "Blogging & SEO Writing",
                        ],
                    },
                    {
                        title: "Copywriting",
                        items: [
                            "Sales Copy & Persuasion",
                            "Email Copywriting",
                            "Ad Copy for Campaigns",
                            "Product Descriptions",
                            "Landing Page Optimization",
                        ],
                    },
                    {
                        title: "Technical Writing",
                        items: [
                            "Documentation Writing",
                            "Proposal & Grant Writing",
                            "Business Reports",
                            "UX Writing",
                        ],
                    },
                    {
                        title: "AI Writing Tools",
                        items: [
                            "AI-Assisted Content Creation",
                            "Prompt Frameworks for Copy",
                            "ChatGPT for Writers",
                            "Editing with AI",
                        ],
                    },
                    {
                        title: "Public Speaking & Communication",
                        items: [
                            "Speech Writing",
                            "Presentation Skills",
                            "Personal Storytelling",
                            "Video Speaking On Camera",
                        ],
                    },
                ],
            },

            {
                label: "Finance, Investing & Economics",
                groups: [
                    {
                        title: "Personal Finance",
                        items: ["Budgeting Basics", "Savings Strategies", "Debt Management", "Retirement Planning"],
                    },
                    {
                        title: "Investing",
                        items: [
                            "Stock Market Fundamentals",
                            "Crypto Investing",
                            "Real Estate Investing",
                            "Portfolio Diversification",
                        ],
                    },
                    {
                        title: "Business Finance",
                        items: [
                            "Financial Planning for Startups",
                            "Building Financial Models",
                            "Business Valuation",
                            "Fundraising Pitch Prep",
                        ],
                    },
                    {
                        title: "Accounting & Compliance",
                        items: [
                            "Bookkeeping Basics",
                            "Tax Management",
                            "Auditing Essentials",
                            "Payroll Setup",
                        ],
                    },
                    {
                        title: "Fintech & AI Finance",
                        items: [
                            "Building Finance Dashboards",
                            "AI Tools for Financial Tracking",
                            "Predictive Financial Analytics",
                        ],
                    },
                ],
            },

            {
                label: "Personal Development & Wellness",
                groups: [
                    {
                        title: "Self-Improvement",
                        items: [
                            "Building Discipline & Focus",
                            "Goal Setting & Achievement",
                            "Productivity Frameworks",
                            "Time Blocking Techniques",
                        ],
                    },
                    {
                        title: "Mindset & Motivation",
                        items: [
                            "Confidence Building",
                            "Overcoming Procrastination",
                            "Growth Mindset Coaching",
                            "Mental Resilience",
                        ],
                    },
                    {
                        title: "Health & Fitness",
                        items: [
                            "Home Workout Systems",
                            "Yoga & Meditation",
                            "Nutrition & Meal Planning",
                            "Stress Management",
                        ],
                    },
                    {
                        title: "Career Growth",
                        items: [
                            "Resume & LinkedIn Optimization",
                            "Interview Preparation",
                            "Remote Work Skills",
                            "Leadership Development",
                        ],
                    },
                    {
                        title: "Lifestyle & Creativity",
                        items: [
                            "Fashion & Styling Basics",
                            "Photography & Editing",
                            "DIY & Craft Skills",
                            "Creative Expression",
                        ],
                    },
                ],
            },

            {
                label: "Consulting, Leadership & Coaching",
                groups: [
                    {
                        title: "Business Consulting",
                        items: [
                            "Business Process Consulting",
                            "Strategy Consulting",
                            "Management Consulting",
                            "Digital Transformation",
                        ],
                    },
                    {
                        title: "Marketing Consulting",
                        items: [
                            "Marketing Strategy Development",
                            "Brand Positioning Consulting",
                            "PR & Communication Consulting",
                        ],
                    },
                    {
                        title: "Tech & AI Consulting",
                        items: [
                            "AI Integration for Companies",
                            "Automation Audit",
                            "Digital Product Strategy",
                        ],
                    },
                    {
                        title: "Leadership Development",
                        items: [
                            "Building High-Performance Teams",
                            "Emotional Intelligence",
                            "Decision-Making for Leaders",
                        ],
                    },
                    {
                        title: "Coaching Specializations",
                        items: ["Life Coaching", "Career Coaching", "Wellness Coaching", "Mindfulness & Emotional Coaching"],
                    },
                ],
            },
        ],
    },


    {
        label: "Webinars",
        chips: [
            /* ===================== 1) BUSINESS & ENTREPRENEURSHIP ===================== */
            {
                label: "Business & Entrepreneurship",
                groups: [
                    {
                        title: "Startup & Growth Strategy",
                        items: [
                            "From Idea to Launch: Building Your First Startup",
                            "MVP Mastery: How to Build, Test, and Validate Quickly",
                            "Systemize Your Business: Scaling with SOPs & Automation",
                            "Bootstrapping 101: Launch Without Funding",
                            "Business in 2025: New-Age Models & Trends",
                        ],
                    },
                    {
                        title: "Freelancing & Agency Building",
                        items: [
                            "Freelance Freedom: Landing Your First 5 Clients",
                            "Building an Agency from Scratch",
                            "Client Communication Mastery",
                            "Scaling from Solo to Team",
                            "Managing Multiple Projects Without Burnout",
                        ],
                    },
                    {
                        title: "Business Operations",
                        items: [
                            "Time, Tasks & Tools: Creating a Productive Business Workflow",
                            "Managing Remote Teams with AI Tools",
                            "Project Management Simplified",
                            "Delegation & Outsourcing Masterclass",
                        ],
                    },
                    {
                        title: "Legal & Compliance",
                        items: [
                            "Contracts Made Simple: Protecting Yourself & Clients",
                            "Business Formation & Taxation for Solopreneurs",
                            "Legal Pitfalls Every Freelancer Should Avoid",
                        ],
                    },
                    {
                        title: "Finance & Planning",
                        items: [
                            "Budgeting for Small Businesses",
                            "Pricing Psychology & Profit Margins",
                            "Cashflow Systems That Work",
                            "Raising Capital: Investor Readiness 101",
                        ],
                    },
                ],
            },

            /* ===================== 2) MARKETING, SALES & BRANDING ===================== */
            {
                label: "Marketing, Sales & Branding",
                groups: [
                    {
                        title: "Digital Marketing Deep Dives",
                        items: [
                            "SEO in the Age of AI",
                            "Mastering Performance Ads",
                            "Social Media Growth for 2025",
                            "Email Automation Systems",
                            "Influencer & UGC Strategy",
                        ],
                    },
                    {
                        title: "Branding & Positioning",
                        items: [
                            "How to Build a Magnetic Brand Identity",
                            "Personal Branding that Converts",
                            "Visual Storytelling for Entrepreneurs",
                            "Rebranding for Relevance",
                        ],
                    },
                    {
                        title: "Content & Copy",
                        items: [
                            "Copywriting that Sells: Live Workshop",
                            "Hook Writing for Reels & Ads",
                            "Storytelling for Growth",
                            "Creating Content Pillars that Scale",
                        ],
                    },
                    {
                        title: "Funnels & Conversions",
                        items: [
                            "Building High-Converting Landing Pages",
                            "Lead Generation Strategies That Actually Work",
                            "Mastering Retargeting & Email Sequences",
                        ],
                    },
                    {
                        title: "Sales Mastery",
                        items: [
                            "Closing High-Value Clients",
                            "Sales Psychology in 2025",
                            "Building a Predictable Sales Pipeline",
                        ],
                    },
                ],
            },

            /* ===================== 3) DESIGN, BRANDING & CREATIVITY ===================== */
            {
                label: "Design, Branding & Creativity",
                groups: [
                    {
                        title: "Graphic Design Masterclasses",
                        items: [
                            "Designing for Social Media Virality",
                            "Color, Contrast & Composition Simplified",
                            "How to Build a Visual System that Sells",
                            "Designing for AI-First Brands",
                        ],
                    },
                    {
                        title: "UI/UX & Product Design",
                        items: [
                            "UX for Founders & Marketers",
                            "Building Design Systems in Figma",
                            "Mobile-First UI Design Principles",
                            "From Concept to Prototype: Live Demo",
                        ],
                    },
                    {
                        title: "Brand Identity Sessions",
                        items: [
                            "Logo Design Live Review & Breakdown",
                            "Creating a Brand Guideline Kit",
                            "Rebranding Strategy & Execution",
                        ],
                    },
                    {
                        title: "AI & Creative Tools",
                        items: [
                            "Designing with Midjourney & Leonardo",
                            "AI Workflows for Designers",
                            "Future of AI-Assisted Creativity",
                        ],
                    },
                ],
            },

            /* ===================== 4) TECHNOLOGY, DEVELOPMENT & AUTOMATION ===================== */
            {
                label: "Technology, Development & Automation",
                groups: [
                    {
                        title: "Web & App Development",
                        items: [
                            "Building No-Code Websites in 2025",
                            "Integrating APIs for Business Automation",
                            "Building a Web App from Scratch (Live Coding)",
                            "UI to Code: Figma to Webflow/Framer",
                        ],
                    },
                    {
                        title: "AI & Automation",
                        items: [
                            "Creating AI Agents for Business",
                            "Make.com vs Zapier: Automation Battle",
                            "n8n Deep Dive Workshop",
                            "Building an AI Workflow from Google Sheets to Social Media",
                        ],
                    },
                    {
                        title: "App & Software Demos",
                        items: [
                            "How to Launch a SaaS Without a Dev Team",
                            "Turning Scripts into Apps Using AI Builders",
                            "Cloud Setup & Deployment Simplified",
                        ],
                    },
                    {
                        title: "Cybersecurity & Cloud",
                        items: [
                            "Protecting Your Freelance Business from Data Breaches",
                            "Simple Cloud Storage & Automation Setup for Teams",
                        ],
                    },
                ],
            },

            /* ===================== 5) AI & FUTURE TECH ===================== */
            {
                label: "Artificial Intelligence & Future Tech",
                groups: [
                    {
                        title: "AI for Creators",
                        items: [
                            "Prompt Engineering Live Workshop",
                            "AI Content Creation System (Reels/Posts/Carousels)",
                            "Midjourney + Leonardo: Viral Visuals Live Demo",
                            "AI for Passive Income: Products, Templates & Funnels",
                        ],
                    },
                    {
                        title: "AI for Business",
                        items: [
                            "Building AI-Powered Systems for Clients (End-to-End)",
                            "Customer Support Chatbots (WhatsApp/Website)",
                            "Custom GPTs for Your Brand / Team",
                            "AI Analytics for Founders (Dashboards + Insights)",
                        ],
                    },
                    {
                        title: "AI Tools Live Demos",
                        items: [
                            "Runway + Pika: AI Video Workflow",
                            "Sora: Storytelling & Scene Building",
                            "AI Agents: Automations with n8n/Make/Zapier",
                        ],
                    },
                    {
                        title: "Ethics, Copyright & Policy",
                        items: [
                            "Copyright & Licensing in AI Content",
                            "Ethical AI Workflows for Creators & Brands",
                            "AI Compliance Basics for Agencies",
                        ],
                    },
                ],
            },

            /* ===================== 6) VIDEO, ANIMATION & CONTENT CREATION ===================== */
            {
                label: "Video, Animation & Content Creation",
                groups: [
                    {
                        title: "Video Editing & Production",
                        items: [
                            "YouTube Editing Like a Pro (Live Breakdown)",
                            "Short-Form Storytelling for Reels/TikTok",
                            "Transitions & Motion Editing Workshop",
                            "CapCut + Premiere Workflow for Creators",
                        ],
                    },
                    {
                        title: "Motion Graphics & Animation",
                        items: [
                            "After Effects for Beginners (Live)",
                            "Motion Graphics Simplified",
                            "Logo Animation Bootcamp",
                            "3D Product Animation Demo",
                        ],
                    },
                    {
                        title: "AI Video Creation",
                        items: [
                            "AI Avatars (HeyGen/Synthesia) Live Setup",
                            "Text-to-Video Workflow with Sora",
                            "AI Voice + Lip Sync Integration",
                        ],
                    },
                    {
                        title: "Creator Growth Series",
                        items: [
                            "YouTube SEO Live Breakdown",
                            "Build Your Creator Studio Setup",
                            "Reels that Reach Millions (Hooks + Retention)",
                            "Content Repurposing System in 60 Minutes",
                        ],
                    },
                ],
            },

            /* ===================== 7) MUSIC, AUDIO & PODCASTING ===================== */
            {
                label: "Music, Audio & Podcasting",
                groups: [
                    {
                        title: "Music Production Workshops",
                        items: [
                            "Beat Making Live (FL Studio / Ableton)",
                            "Mixing & Mastering Fundamentals",
                            "Vocal Tuning Live Demo",
                            "Music for Ads & Creators",
                        ],
                    },
                    {
                        title: "Podcasting Sessions",
                        items: [
                            "Start Your Podcast in One Day",
                            "Podcast Branding & Positioning",
                            "Monetizing Your Podcast",
                            "Voice Training for Podcasters",
                        ],
                    },
                    {
                        title: "AI Audio Tools",
                        items: [
                            "AI Voice Generation for Creators",
                            "Voice Cloning Demo + Use Cases",
                            "AI Music Prompts & Sound Packs",
                        ],
                    },
                    {
                        title: "Sound Design",
                        items: [
                            "Sound Effects for Games & Film",
                            "Cinematic Sound Design Techniques",
                        ],
                    },
                ],
            },

            /* ===================== 8) WRITING, CONTENT & COMMUNICATION ===================== */
            {
                label: "Writing, Content & Communication",
                groups: [
                    {
                        title: "Writing Workshops",
                        items: [
                            "Storytelling for Creators & Founders",
                            "Blog Writing that Ranks (SEO Live)",
                            "Book Publishing Q&A",
                            "Fiction Writing for Beginners",
                        ],
                    },
                    {
                        title: "Copywriting & Persuasion",
                        items: [
                            "Offers that Convert (Live Workshop)",
                            "Sales Copy Breakdown (Real Examples)",
                            "Cold Email Masterclass",
                            "Landing Page Copy for High Conversions",
                        ],
                    },
                    {
                        title: "Communication Mastery",
                        items: [
                            "Public Speaking in the Creator Era",
                            "Pitching Ideas with Impact",
                            "Confidence on Camera",
                            "Scriptwriting for Video & Podcast",
                        ],
                    },
                    {
                        title: "AI Writing Systems",
                        items: [
                            "ChatGPT for Copywriting",
                            "AI Content Workflows (Research → Draft → Polish)",
                            "Prompt-Based Writing Systems",
                        ],
                    },
                ],
            },

            /* ===================== 9) FINANCE, INVESTING & ECONOMICS ===================== */
            {
                label: "Finance, Investing & Economics",
                groups: [
                    {
                        title: "Business Finance",
                        items: [
                            "Accounting for Non-Finance Founders",
                            "Pricing Your Services Strategically",
                            "Financial Planning Templates Live",
                        ],
                    },
                    {
                        title: "Investing",
                        items: [
                            "Stock Market for Beginners",
                            "Crypto in 2025: What's Next?",
                            "Building a Personal Investment Plan",
                            "Web3 Finance Explained",
                        ],
                    },
                    {
                        title: "Personal Finance",
                        items: [
                            "Money Management for Freelancers",
                            "Budgeting with Notion / Sheets",
                            "Smart Savings & Taxes Simplified",
                        ],
                    },
                    {
                        title: "Financial Tools & AI",
                        items: [
                            "AI for Expense Tracking",
                            "Building Smart Financial Dashboards",
                        ],
                    },
                ],
            },

            /* ===================== 10) PERSONAL GROWTH, LIFESTYLE & CAREER ===================== */
            {
                label: "Personal Growth, Lifestyle & Career",
                groups: [
                    {
                        title: "Mindset & Motivation",
                        items: [
                            "Goal Setting with Clarity",
                            "Beating Procrastination (Live Workshop)",
                            "Daily Systems for High Performance",
                            "Mindset for Freelancers & Founders",
                        ],
                    },
                    {
                        title: "Career Growth",
                        items: [
                            "Personal Brand on LinkedIn (Live)",
                            "Resume & Portfolio Review",
                            "Interview Confidence Workshop",
                            "Career Pivot in the Creator Economy",
                        ],
                    },
                    {
                        title: "Health & Wellness",
                        items: [
                            "Morning Routines that Transform Productivity",
                            "Fitness for Busy Entrepreneurs",
                            "Mindfulness & Focus Training",
                            "Nutrition for Brain Power",
                        ],
                    },
                    {
                        title: "Lifestyle & Hobbies",
                        items: [
                            "Travel Creator Masterclass",
                            "Photography for Social Media",
                            "Fashion Styling for Creators",
                            "Gaming & Esports Strategy Live",
                        ],
                    },
                ],
            },

            /* ===================== 11) COMMUNITY, NETWORKING & PANEL EVENTS ===================== */
            {
                label: "Community, Networking & Panel Events",
                groups: [
                    {
                        title: "Expert Panels",
                        items: [
                            "AI & the Future of Work",
                            "The Creator Economy in 2025",
                            "Women in Tech & Business",
                            "Building Global Teams",
                        ],
                    },
                    {
                        title: "Founder Stories & Case Studies",
                        items: [
                            "Zero to One: Live Founder Interviews",
                            "Building a Million-Dollar Freelance Agency",
                            "Bootstrapped Success Stories",
                        ],
                    },
                    {
                        title: "Community AMAs",
                        items: [
                            "Ask the Expert (Monthly Live Q&A)",
                            "Pitch Your Idea Sessions",
                            "Skill Exchange Live (Peer to Peer)",
                        ],
                    },
                    {
                        title: "Collaboration Webinars",
                        items: [
                            "Partner-Led Tutorials",
                            "Cross-Creator Case Study Breakdowns",
                            "Guest Speaker Series",
                        ],
                    },
                ],
            },
        ],
    },
    {
        label: "Teams",
        chips: [
            {
                label: "Graphics & Design",
                groups: [
                    { title: "Logo & Brand Identity", items: ["Logo Design", "Brand Style Guides", "Business Cards & Stationery", "Fonts & Typography", "Brand Naming & Strategy", "Art Direction", "Brand Collateral Kits"] },
                    { title: "Web & App Design", items: ["Website Design", "App UI Design", "UX Research & Wireframing", "Landing Page Design", "Dashboard Design", "Icon Design", "Mobile Design Systems"] },
                    { title: "Art & Illustration", items: ["Illustration", "Character Design", "Concept Art", "Portraits & Caricatures", "AI Art & Avatar Design", "Comic Book Illustration", "Children's Book Illustration", "Storyboards", "Tattoo Design", "Pattern Design", "Album & Cover Art"] },
                    { title: "Print & Product Design", items: ["Brochure & Flyer Design", "Business Cards", "Packaging & Label Design", "Poster Design", "Menu Design", "Catalogs & Lookbooks", "Signage & Banners"] },
                    { title: "Visual Design", items: ["Image Editing & Retouching", "Presentation Design", "Resume Design", "Infographic Design", "Vector Tracing", "Slide Decks"] },
                    { title: "Marketing Design", items: ["Social Media Posts & Ads", "Email Design", "Display Ads", "Web Banners", "Promotional Graphics", "Campaign Branding"] },
                    { title: "3D & Architecture Design", items: ["3D Modeling & Rendering", "3D Architecture", "Interior Design", "Landscape Design", "Product Mockups", "3D Printing & Characters", "Lighting & Spatial Design"] },
                    { title: "Fashion & Merchandise", items: ["T-Shirt & Apparel Design", "Jewelry Design", "Accessory & Footwear Design", "Fashion Illustration", "Textile & Fabric Patterns"] },
                    { title: "Miscellaneous Design", items: ["Design Consultation", "Style Adaptation", "Design Audits"] },
                ],
            },
            {
                label: "Programming & Tech",
                groups: [
                    { title: "Website Development", items: ["Business Websites", "E-Commerce Websites", "Portfolio & Personal Sites", "Landing Pages", "Custom Websites", "Dropshipping Stores"] },
                    { title: "Web Platforms", items: ["WordPress", "Shopify", "Wix", "Webflow", "Bubble", "Squarespace", "Framer"] },
                    { title: "Website Maintenance", items: ["Bug Fixes", "Backup & Migration", "Speed Optimization", "Hosting Setup", "Security Patches", "CMS Updates"] },
                    { title: "Mobile App Development", items: ["iOS Development", "Android Development", "Flutter Development", "React Native Development", "Cross-Platform Apps", "App Maintenance & Debugging"] },
                    { title: "Software Development", items: ["Web Applications", "Desktop Software", "APIs & Integrations", "Automations & Workflows", "Database Development", "Testing & QA", "SaaS Product Development"] },
                    { title: "Game Development", items: ["2D/3D Game Design", "Unity Development", "Unreal Engine Development", "Roblox Games", "AR/VR Games", "Game Environment Design", "Game Character Design"] },
                    { title: "AI Development", items: ["AI Websites & Apps", "Chatbots", "AI Automations & Agents", "AI Model Training & Fine-Tuning", "Prompt Engineering", "AI Technology Consulting", "Data Labeling & Tagging"] },
                    { title: "Cloud & Cybersecurity", items: ["Cloud Setup (AWS, GCP, Azure)", "DevOps & Deployment", "Cybersecurity Audits", "Penetration Testing", "Data Backup & Recovery", "API & Server Management"] },
                    { title: "Blockchain & Crypto", items: ["Smart Contract Development", "Token Launch Support", "NFT Minting", "dApp Development", "Wallet Integrations", "Blockchain Consulting"] },
                    { title: "Miscellaneous Tech", items: ["Troubleshooting & Debugging", "Code Review", "IT Support & Consultation"] },
                ],
            },
            {
                label: "Digital Marketing",
                groups: [
                    { title: "Search & SEO", items: ["SEO Audit", "On-Page SEO", "Off-Page SEO", "Local SEO", "E-Commerce SEO", "Video SEO", "SEM & PPC Ads", "Generative Engine Optimization (AI SEO)"] },
                    { title: "Social Media Marketing", items: ["Social Media Strategy", "Social Media Management", "Social Media Design", "Influencer Marketing", "UGC Content Creation", "Social Media Automation"] },
                    { title: "Channel-Specific Marketing", items: ["Instagram Marketing", "TikTok Marketing", "YouTube Marketing", "LinkedIn Marketing", "Facebook Ads Campaigns", "Twitter/X Growth", "Pinterest Marketing", "Shopify Marketing"] },
                    { title: "Email & Automation", items: ["Email Marketing", "Newsletter Creation", "Automation Workflows", "Drip Campaigns", "Cold Email Systems", "CRM Integration"] },
                    { title: "Marketing Analytics & Strategy", items: ["Brand Strategy", "Marketing Funnels", "CRO (Conversion Optimization)", "Web Analytics", "Attribution Tracking", "Market Research"] },
                    { title: "AI Marketing", items: ["AI Prompt Marketing", "AI-Powered Campaigns", "AI Ad Bidding Optimization", "AI Personalization", "Predictive Marketing"] },
                    { title: "Industry-Specific", items: ["Music Promotion", "Podcast Promotion", "Book & eBook Marketing", "Course Launch Marketing", "App Store Optimization"] },
                    { title: "Public Relations & Advertising", items: ["PR Campaigns", "Press Release Writing", "Display Advertising", "Sponsorship Strategy", "Media Buying"] },
                ],
            },
            {
                label: "Writing & Translation",
                groups: [
                    { title: "Content Writing", items: ["Blog & Article Writing", "Website Content", "Scriptwriting", "Creative Writing", "Ghostwriting", "Research Summaries"] },
                    { title: "Copywriting", items: ["Ad Copy", "Email Copy", "Sales Copy", "Product Descriptions", "Case Studies", "Landing Page Copy"] },
                    { title: "Editing & Proofreading", items: ["Grammar & Style Editing", "Copy Editing", "Formatting", "Academic Editing", "AI Content Polishing"] },
                    { title: "Book & Publishing", items: ["Book & eBook Writing", "Book Editing", "Beta Reading", "Book Layout & Formatting", "Publishing Assistance"] },
                    { title: "Translation & Transcription", items: ["Document Translation", "Website Localization", "Subtitles & Captions", "Proofreading", "Audio Transcription", "Live Interpretation"] },
                    { title: "Industry Writing", items: ["Business & Finance Writing", "Technical Writing", "Medical Writing", "Real Estate Writing", "Marketing Writing"] },
                    { title: "AI Writing", items: ["AI Prompt Writing", "AI Story Creation", "AI Editing & Review"] },
                ],
            },
            {
                label: "Video & Animation",
                groups: [
                    { title: "Video Editing", items: ["YouTube Editing", "Short-Form Reels & TikToks", "Visual Effects (VFX)", "Subtitles & Captions", "Multi-Cam Sync & Transitions"] },
                    { title: "Animation & Motion Graphics", items: ["2D Animation", "3D Animation", "Motion Graphics", "Whiteboard Animation", "Lottie Animations", "NFT & Web3 Animation"] },
                    { title: "Marketing & Social Videos", items: ["Ads & Commercials", "Explainer Videos", "Product Demos", "Slideshow Videos", "Music Videos"] },
                    { title: "AI Video", items: ["AI Avatars", "Text-to-Video Creation", "Lip-Sync AI Videos", "AI UGC Content", "Virtual Presenter Videos"] },
                    { title: "Filmed Video Production", items: ["Drone Videography", "Live Action Explainers", "Event Videography", "Corporate Videos"] },
                    { title: "Product & App Videos", items: ["3D Product Animation", "App Previews", "E-Commerce Videos", "Kickstarter Videos"] },
                    { title: "Miscellaneous", items: ["Game Trailers", "Book Trailers", "Meditation Videos", "Video Advice"] },
                ],
            },
            {
                label: "Music & Audio",
                groups: [
                    { title: "Music Production", items: ["Custom Music Composition", "Mixing & Mastering", "Songwriting & Lyrics", "Jingles & Intros", "Soundtracks"] },
                    { title: "Voice Over & Narration", items: ["Commercial Voice", "Character Voice", "Audiobook Narration", "Podcast Intros"] },
                    { title: "Audio Engineering", items: ["Audio Editing", "Vocal Tuning", "Restoration & Cleaning", "Sound Enhancement"] },
                    { title: "Sound Design", items: ["Sound Effects", "Audio Logos & Sonic Branding", "Plugin & Patch Creation"] },
                    { title: "DJ & Performance", items: ["DJ Mixing", "Drops & Tags", "Remixes"] },
                    { title: "AI Audio", items: ["AI Voice Generation", "Text-to-Speech", "Voice Cloning", "AI Music Generation"] },
                    { title: "Lessons", items: ["Music Theory", "Instrument Lessons", "Voice Coaching"] },
                ],
            },
            {
                label: "Business",
                groups: [
                    { title: "Business Formation", items: ["Company Registration", "Market Research", "Business Plans", "Financial Forecasting", "HR Consulting"] },
                    { title: "Operations & Management", items: ["Virtual Assistant", "Project Management", "SOP Documentation", "Workflow Optimization", "Event Management"] },
                    { title: "Legal & Compliance", items: ["Contract Drafting", "Legal Review", "Policy Creation", "IP & Trademark Services"] },
                    { title: "Sales & Customer Care", items: ["Sales Strategy", "CRM Setup", "Customer Support", "Lead Generation"] },
                    { title: "Analytics & Intelligence", items: ["Data Visualization", "Business Intelligence", "Market Analytics", "Reporting Dashboards"] },
                    { title: "AI & Automation in Business", items: ["Process Automation", "AI Assistants for Operations", "Data-Driven Decision Tools"] },
                ],
            },
            {
                label: "Finance & Accounting",
                groups: [
                    { title: "Accounting & Reporting", items: ["Bookkeeping", "Payroll Management", "Financial Statements", "CFO Consulting"] },
                    { title: "Corporate Finance", items: ["Valuation", "M&A Advisory", "Due Diligence", "Fundraising Documents"] },
                    { title: "Tax & Compliance", items: ["Tax Planning", "Filing & Returns", "Audit Support", "Compliance Reports"] },
                    { title: "Personal Finance", items: ["Budgeting & Forecasting", "Investment Planning", "Retirement Planning", "Credit Score Advisory"] },
                    { title: "Financial Analysis", items: ["Financial Modeling", "Cost Analysis", "Profitability Analysis"] },
                ],
            },
            {
                label: "Personal Growth & Lifestyle",
                groups: [
                    { title: "Coaching & Mentorship", items: ["Life Coaching", "Career Mentorship", "Business Mentorship", "Productivity Coaching", "Public Speaking"] },
                    { title: "Wellness & Fitness", items: ["Fitness Training", "Nutrition Coaching", "Yoga & Meditation", "Wellness Programs"] },
                    { title: "Fashion & Style", items: ["Personal Styling", "Modeling & Acting Coaching", "Beauty Consulting", "Wardrobe Strategy"] },
                    { title: "Gaming & Entertainment", items: ["Game Coaching", "Streaming Setup", "Esports Strategy", "Gameplay Reviews"] },
                    { title: "Leisure & Hobbies", items: ["Astrology & Tarot", "Art & Crafts", "DIY Projects", "Traveling Guidance"] },
                ],
            },
            {
                label: "AI Services",
                groups: [
                    { title: "AI Development", items: ["AI App Creation", "AI Websites", "AI Chatbots", "Automations & Agents", "API & Workflow Integration"] },
                    { title: "AI Art & Design", items: ["Midjourney Design", "Stable Diffusion Illustration", "AI Avatar Design", "AI Image Editing"] },
                    { title: "AI Video", items: ["AI Avatars", "AI Music Videos", "AI Video Art", "Text-to-Video"] },
                    { title: "AI Writing & Content", items: ["Prompt Writing", "AI Storytelling", "Article Generation", "AI Copywriting"] },
                    { title: "AI Data & Analytics", items: ["Data Collection", "Data Annotation", "Model Training", "Machine Learning Setup"] },
                    { title: "AI Consulting", items: ["AI Strategy & Integration", "AI Education & Workshops"] },
                ],
            },
        ],
    },
];

export default function Marketplace({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    const [activeCat, setActiveCat] = useState("Service");
    const [openChip, setOpenChip] = useState(null);
    const [dropdownTop, setDropdownTop] = useState(0);
    const gridRef = useRef(null);
    const chipRowRef = useRef(null);
    const filterRowRef = useRef(null);

    // filter panel state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterCats, setFilterCats] = useState([]);
    const [filterLangs, setFilterLangs] = useState([]);
    const [filterTags, setFilterTags] = useState([]);
    const [aiOnly, setAiOnly] = useState(false);
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [sortBy, setSortBy] = useState("most_relevant");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null);

    // Searchable Filter States
    const [langSearch, setLangSearch] = useState("");
    const [tagSearch, setTagSearch] = useState("");

    const allLanguages = useMemo(() => [
        "English", "Hindi", "Tamil", "Spanish", "French", "German", "Japanese",
        "Chinese", "Arabic", "Portuguese", "Russian", "Italian", "Korean", "Dutch",
        "Turkish", "Bengali", "Marathi", "Telugu", "Gujarati", "Punjabi"
    ], []);

    const allTags = useMemo(() => [
        "Ai", "Automation", "Branding", "Web Dev", "Copywriting", "Design", "Video",
        "Voiceover", "3D Design", "SEO", "Marketing", "SaaS", "Mobile App", "BlockChain",
        "UX/UI", "Illustrations", "Social Media", "Cybersecurity", "E-commerce", "Consulting"
    ], []);

    const filteredLangSuggestions = useMemo(() => {
        if (!langSearch.trim()) return [];
        return allLanguages.filter(l =>
            l.toLowerCase().includes(langSearch.toLowerCase()) && !filterLangs.includes(l)
        );
    }, [langSearch, allLanguages, filterLangs]);

    const filteredTagSuggestions = useMemo(() => {
        if (!tagSearch.trim()) return [];
        return allTags.filter(t =>
            t.toLowerCase().includes(tagSearch.toLowerCase()) && !filterTags.includes(t)
        );
    }, [tagSearch, allTags, filterTags]);

    const sortOptions = useMemo(
        () => [
            { value: "most_relevant", label: "Most Relevant" },
            { value: "newest", label: "Newest" },
            { value: "price_low", label: "Price: Low to High" },
            { value: "price_high", label: "Price: High to Low" },
            { value: "top_rated", label: "Top Rated" },
        ],
        []
    );
    const logoGridRef = useRef(null);
    const webGridRef = useRef(null);

    const scrollGridRef = (ref, direction) => {
        if (!ref.current) return;
        const scrollAmount = window.innerWidth > 900 ? 500 : 300;
        ref.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const logoDesigns = useMemo(
        () => [
            {
                id: "l1",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Modern minimalist logo + brand kit for your business",
                rating: 4.8,
                reviews: 342,
                priceLabel: "Price: ₹ 6,999",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "l2",
                name: "Abigail",
                verified: true,
                ai: false,
                title: "Luxury logo design with 3 concepts + revisions",
                rating: 4.7,
                reviews: 210,
                priceLabel: "Price: ₹ 9,999",
                cta: "Buy Now",
                image:
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "l3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Mascot logo + social media kit (AI assisted)",
                rating: 4.6,
                reviews: 188,
                priceLabel: "Price: ₹ 12,499",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "l3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Mascot logo + social media kit (AI assisted)",
                rating: 4.6,
                reviews: 188,
                priceLabel: "Price: ₹ 12,499",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "l3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Mascot logo + social media kit (AI assisted)",
                rating: 4.6,
                reviews: 188,
                priceLabel: "Price: ₹ 12,499",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "l3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Mascot logo + social media kit (AI assisted)",
                rating: 4.6,
                reviews: 188,
                priceLabel: "Price: ₹ 12,499",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
            },
        ],
        []
    );

    const webDesigns = useMemo(
        () => [
            {
                id: "w1",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "High-converting landing page design (Figma/Canva)",
                rating: 4.9,
                reviews: 401,
                priceLabel: "Price: ₹ 14,999",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "w2",
                name: "Abigail",
                verified: true,
                ai: false,
                title: "Full website UI (5 pages) + responsive components",
                rating: 4.7,
                reviews: 156,
                priceLabel: "Price: From ₹ 29,999",
                cta: "Buy Now",
                image:
                    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "w3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Web + app UI kit for SaaS dashboard (AI assisted)",
                rating: 4.6,
                reviews: 98,
                priceLabel: "Price: ₹ 24,000",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "w3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Web + app UI kit for SaaS dashboard (AI assisted)",
                rating: 4.6,
                reviews: 98,
                priceLabel: "Price: ₹ 24,000",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "w3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Web + app UI kit for SaaS dashboard (AI assisted)",
                rating: 4.6,
                reviews: 98,
                priceLabel: "Price: ₹ 24,000",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: "w3",
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Web + app UI kit for SaaS dashboard (AI assisted)",
                rating: 4.6,
                reviews: 98,
                priceLabel: "Price: ₹ 24,000",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
            },
        ],
        []
    );

    const selectedSortLabel =
        sortOptions.find((opt) => opt.value === sortBy)?.label || "Select Sort";

    // Outside click for sort dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        if (isSortOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSortOpen]);

    const toggleFilterCat = (cat) => {
        setFilterCats((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };


    const scrollChips = (direction) => {
        if (chipRowRef.current) {
            const scrollAmount = 300;
            chipRowRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // close chip dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                chipRowRef.current && !chipRowRef.current.contains(e.target) &&
                filterRowRef.current && !filterRowRef.current.contains(e.target)
            ) {
                setOpenChip(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // update dropdown top on scroll so it follows the filter row
    useEffect(() => {
        if (!openChip) return;
        const scrollEl = document.querySelector(".mp-scroll-area");
        if (!scrollEl) return;
        const onScroll = () => {
            if (filterRowRef.current) {
                const rect = filterRowRef.current.getBoundingClientRect();
                setDropdownTop(rect.bottom);
            }
        };
        scrollEl.addEventListener("scroll", onScroll);
        return () => scrollEl.removeEventListener("scroll", onScroll);
    }, [openChip]);

    const handleChipClick = (label) => {
        if (filterRowRef.current) {
            const rect = filterRowRef.current.getBoundingClientRect();
            setDropdownTop(rect.bottom);
        }
        setOpenChip((prev) => (prev === label ? null : label));
    };

    // chips derived from the active category's chips array
    const chips = useMemo(() => {
        const cat = categories.find((c) => c.label === activeCat);
        return cat?.chips || [];
    }, [activeCat]);


    const products = useMemo(
        () => [
            {
                id: 1,
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Browse services, products, courses, and webinars tailored...",
                rating: 4.5,
                reviews: 123,
                priceLabel: "Price: ₹ 24,000",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: 2,
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Browse services, products, courses, and webinars tailored...",
                rating: 4.5,
                reviews: 123,
                priceLabel: "Price: ₹ 24,000",
                cta: "Buy Now",
                image:
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: 3,
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Browse services, products, courses, and webinars tailored...",
                rating: 4.5,
                reviews: 123,
                priceLabel: "Price: ₹ 24,000",
                cta: "Enroll Now",
                image:
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: 4,
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Browse services, products, courses, and webinars tailored...",
                rating: 4.5,
                reviews: 123,
                priceLabel: "Price: From ₹ 24,000",
                cta: "Know More  ",
                image:
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
            },
            {
                id: 5,
                name: "Abigail",
                verified: true,
                ai: true,
                title: "Browse services, products, courses, and webinars tailored...",
                rating: 4.5,
                reviews: 123,
                priceLabel: "Price: From ₹ 24,000",
                cta: "Know More",
                image:
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop",
            },
        ],
        [],
    );

    return (
        <>
            <div className={`mp-page user-page ${theme} h-screen relative overflow-hidden`}>
                {/* NAVBAR */}
                <UserNavbar
                    toggleSidebar={() => setSidebarOpen((p) => !p)}
                    isSidebarOpen={sidebarOpen}
                    theme={theme}
                />

                <div className="mp-content-wrapper flex flex-1 relative z-10">


                    {/* MAIN CONTENT */}
                    <div className="relative flex-1 min-w-5 overflow-hidden">
                        <div className="mp-scroll-area relative z-10 overflow-y-auto h-full">
                            <section className="mp-hero">
                                <img
                                    src={theme === "dark" ? heroImgDark : heroImg}
                                    alt="Marketplace Hero"
                                    className="mp-heroImg"
                                />
                                <div className="mp-heroOverlay" />
                                <div className="mp-heroInner">
                                    <div className="mp-heroText">
                                        <h1 className="mp-heroTitle">Welcome back, Name!</h1>
                                        <h1 className="mp-heroSub">Your <span className="mp-highlight">hustle</span> starts here.</h1>
                                    </div>



                                </div>
                            </section>

                            <div className="mp-shell">
                                <div className="mp-catRow">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.label}
                                            className={`mp-pill ${activeCat === cat.label ? "active" : ""}`}
                                            onClick={() => { setActiveCat(cat.label); setOpenChip(null); }}
                                            type="button"
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="mp-filterRow" ref={filterRowRef}>
                                    <button className="mp-filterBtn" type="button" onClick={() => setIsFilterOpen(true)}>
                                        <span>Filter</span>
                                        <img src={filterIcon} alt="filtericon" />
                                    </button>

                                    <div className="mp-chipScroller-wrapper">
                                        <button
                                            className="chip-arrow left"
                                            type="button"
                                            onClick={() => scrollChips("left")}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </button>

                                        <div className="mp-chipScroller" ref={chipRowRef}>
                                            {chips.map((chip, idx) => (
                                                <div className="mp-chipWrap" key={chip.label}>
                                                    <button
                                                        className={`mp-chip ${openChip === chip.label ? "active open" : ""}`}
                                                        type="button"
                                                        onClick={() => handleChipClick(chip.label)}
                                                    >
                                                        {chip.label}
                                                        <svg className="mp-chipIcon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="6 9 12 15 18 9"></polyline>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            className="chip-arrow right"
                                            type="button"
                                            onClick={() => scrollChips("right")}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mp-listing-container">
                                    <h2 className="mp-sectionTitle">All Products</h2>

                                    <div className="mp-grid" ref={gridRef}>
                                        {products.map((p) => (
                                            <article className="mp-card" key={p.id}>
                                                <div className="mp-imgWrap">
                                                    <img className="mp-img" src={p.image} alt="" />
                                                </div>

                                                <div className="mp-cardBody">
                                                    <div className="mp-topLine">
                                                        <div className="mp-user">
                                                            <div className="mp-avatar"></div>
                                                            <span className="mp-userName">{p.name}</span>
                                                            {p.verified && (
                                                                <svg className="mp-verifyIcon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                    <path
                                                                        fill="#1DA1F2"
                                                                        d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.7.54-1.51.26-3.23-.97-4.46-1.23-1.23-2.95-1.51-4.46-.97C14.13 2.08 12.76 1.2 11.18 1.2c-1.58 0-2.95.88-3.7 2.18-1.51-.54-3.23-.26-4.46.97-1.23 1.23-1.51 2.95-.97 4.46C.88 9.55 0 10.92 0 12.5c0 1.58.88 2.95 2.18 3.7-.54 1.51-.26 3.23.97 4.46 1.23 1.23 2.95 1.51 4.46.97 0.74 1.3 2.11 2.18 3.69 2.18 1.58 0 2.95-.88 3.7-2.18 1.51.54 3.23.26 4.46-.97 1.23-1.23 1.51-2.95.97-4.46 1.3-.75 2.18-2.12 2.18-3.7z"
                                                                    />
                                                                    <path
                                                                        stroke="#FFF"
                                                                        strokeWidth="3"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M8 12.5l3 3 5-5"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        {p.ai && (
                                                            <span className="mp-aiBadge">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                                                                </svg>
                                                                Ai Powered
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mp-desc">{p.title}</p>

                                                    <div className="mp-metaRow">
                                                        <div className="mp-rating">
                                                            <span className="mp-star">★</span>
                                                            <span>{p.rating.toFixed(1)}</span>
                                                            <span className="mp-rev">({p.reviews})</span>
                                                        </div>
                                                    </div>

                                                    <div className="mp-bottomRow">
                                                        <div className="mp-price">Price: ₹ 24,000</div>
                                                        <button className="mp-cta" type="button">
                                                            {p.cta}
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mp-ctaIcon">
                                                                <polyline points="9 18 15 12 9 6"></polyline>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    <button
                                        className="mp-floatArrow left"
                                        type="button"
                                        aria-label="Previous"
                                        onClick={() => scrollGridRef(gridRef, "left")}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>

                                    <button
                                        className="mp-floatArrow right"
                                        type="button"
                                        aria-label="Next"
                                        onClick={() => scrollGridRef(gridRef, "right")}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>

                                    <div className="mp-viewAllRow">
                                        <button className="mp-viewAllBtn" type="button">
                                            View All
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="mp-listing-container">
                                    <h2 className="mp-sectionTitle">Logo Design</h2>

                                    <div className="mp-grid" ref={logoGridRef}>
                                        {logoDesigns.map((p) => (
                                            <article className="mp-card" key={p.id}>
                                                <div className="mp-imgWrap">
                                                    <img className="mp-img" src={p.image} alt="" />
                                                </div>

                                                <div className="mp-cardBody">
                                                    <div className="mp-topLine">
                                                        <div className="mp-user">
                                                            <div className="mp-avatar"></div>
                                                            <span className="mp-userName">{p.name}</span>
                                                            {p.verified && (
                                                                <svg className="mp-verifyIcon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                    <path
                                                                        fill="#1DA1F2"
                                                                        d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.7.54-1.51.26-3.23-.97-4.46-1.23-1.23-2.95-1.51-4.46-.97C14.13 2.08 12.76 1.2 11.18 1.2c-1.58 0-2.95.88-3.7 2.18-1.51-.54-3.23-.26-4.46.97-1.23 1.23-1.51 2.95-.97 4.46C.88 9.55 0 10.92 0 12.5c0 1.58.88 2.95 2.18 3.7-.54 1.51-.26 3.23.97 4.46 1.23 1.23 2.95 1.51 4.46.97 0.74 1.3 2.11 2.18 3.69 2.18 1.58 0 2.95-.88 3.7-2.18 1.51.54 3.23.26 4.46-.97 1.23-1.23 1.51-2.95.97-4.46 1.3-.75 2.18-2.12 2.18-3.7z"
                                                                    />
                                                                    <path
                                                                        stroke="#FFF"
                                                                        strokeWidth="3"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M8 12.5l3 3 5-5"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        {p.ai && (
                                                            <span className="mp-aiBadge">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                                                                </svg>
                                                                Ai Powered
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mp-desc">{p.title}</p>

                                                    <div className="mp-metaRow">
                                                        <div className="mp-rating">
                                                            <span className="mp-star">★</span>
                                                            <span>{p.rating.toFixed(1)}</span>
                                                            <span className="mp-rev">({p.reviews})</span>
                                                        </div>
                                                    </div>

                                                    <div className="mp-bottomRow">
                                                        <div className="mp-price">{p.priceLabel}</div>
                                                        <button className="mp-cta" type="button">
                                                            {p.cta}
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mp-ctaIcon">
                                                                <polyline points="9 18 15 12 9 6"></polyline>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    <button className="mp-floatArrow left" type="button" aria-label="Previous" onClick={() => scrollGridRef(logoGridRef, "left")}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>

                                    <button className="mp-floatArrow right" type="button" aria-label="Next" onClick={() => scrollGridRef(logoGridRef, "right")}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>

                                    <div className="mp-viewAllRow">
                                        <button className="mp-viewAllBtn" type="button">
                                            View All
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="mp-listing-container">
                                    <h2 className="mp-sectionTitle">Web Design</h2>

                                    <div className="mp-grid" ref={webGridRef}>
                                        {webDesigns.map((p) => (
                                            <article className="mp-card" key={p.id}>
                                                <div className="mp-imgWrap">
                                                    <img className="mp-img" src={p.image} alt="" />
                                                </div>

                                                <div className="mp-cardBody">
                                                    <div className="mp-topLine">
                                                        <div className="mp-user">
                                                            <div className="mp-avatar"></div>
                                                            <span className="mp-userName">{p.name}</span>
                                                            {p.verified && (
                                                                <svg className="mp-verifyIcon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                    <path
                                                                        fill="#1DA1F2"
                                                                        d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.7.54-1.51.26-3.23-.97-4.46-1.23-1.23-2.95-1.51-4.46-.97C14.13 2.08 12.76 1.2 11.18 1.2c-1.58 0-2.95.88-3.7 2.18-1.51-.54-3.23-.26-4.46.97-1.23 1.23-1.51 2.95-.97 4.46C.88 9.55 0 10.92 0 12.5c0 1.58.88 2.95 2.18 3.7-.54 1.51-.26 3.23.97 4.46 1.23 1.23 2.95 1.51 4.46.97 0.74 1.3 2.11 2.18 3.69 2.18 1.58 0 2.95-.88 3.7-2.18 1.51.54 3.23.26 4.46-.97 1.23-1.23 1.51-2.95.97-4.46 1.3-.75 2.18-2.12 2.18-3.7z"
                                                                    />
                                                                    <path
                                                                        stroke="#FFF"
                                                                        strokeWidth="3"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M8 12.5l3 3 5-5"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        {p.ai && (
                                                            <span className="mp-aiBadge">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M7 2L9 6.81l4.89 2L9 10.81 7 15.62l-2-4.81-4.81-2 4.81-2L7 2zM17.5 15l1.25 3.01 3 1.25-3 1.25-1.25 3-1.25-3-3-1.25 3-1.25L17.5 15z" />
                                                                </svg>
                                                                Ai Powered
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mp-desc">{p.title}</p>

                                                    <div className="mp-metaRow">
                                                        <div className="mp-rating">
                                                            <span className="mp-star">★</span>
                                                            <span>{p.rating.toFixed(1)}</span>
                                                            <span className="mp-rev">({p.reviews})</span>
                                                        </div>
                                                    </div>

                                                    <div className="mp-bottomRow">
                                                        <div className="mp-price">{p.priceLabel}</div>
                                                        <button className="mp-cta" type="button">
                                                            {p.cta}
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mp-ctaIcon">
                                                                <polyline points="9 18 15 12 9 6"></polyline>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    <button className="mp-floatArrow left" type="button" aria-label="Previous" onClick={() => scrollGridRef(webGridRef, "left")}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>

                                    <button className="mp-floatArrow right" type="button" aria-label="Next" onClick={() => scrollGridRef(webGridRef, "right")}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </button>

                                    <div className="mp-viewAllRow">
                                        <button className="mp-viewAllBtn" type="button">
                                            View All
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* CHIP FILTER MEGA DROPDOWN — root level, escapes overflow */}
                {openChip && (() => {
                    const chip = chips.find(c => c.label === openChip);
                    return chip ? (
                        <div
                            className="mp-megaDropdown"
                            style={{ top: dropdownTop }}
                            onWheel={(e) => {
                                const scrollEl = document.querySelector(".mp-scroll-area");
                                if (scrollEl) scrollEl.scrollTop += e.deltaY;
                            }}
                        >
                            <div className="mp-megaGrid">
                                {chip.groups.map((grp) => (
                                    <div className="mp-megaGroup" key={grp.title}>
                                        <p className="mp-megaGroupTitle">{grp.title}</p>
                                        {grp.items.map((item) => (
                                            <button
                                                key={item}
                                                className="mp-megaItem"
                                                type="button"
                                                onClick={() => setOpenChip(null)}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null;
                })()}
            </div>

            {/* FILTER DRAWER */}
            {isFilterOpen && (
                <div className="mp-filterOverlay" onClick={() => setIsFilterOpen(false)}>
                    <div className="mp-filterDrawer" onClick={(e) => e.stopPropagation()}>
                        <div className="mp-filterHeader">
                            <span className="mp-filterTitle">Filters</span>
                            <div className="flex items-center gap-4">
                                <button
                                    className="mp-clearBtn"
                                    type="button"
                                    onClick={() => {
                                        setFilterCats([]);
                                        setFilterLangs([]);
                                        setFilterTags([]);
                                        setAiOnly(false);
                                        setPriceMin("");
                                        setPriceMax("");
                                    }}
                                >
                                    Clear All
                                </button>
                                <button className="mp-filterClose" type="button" onClick={() => setIsFilterOpen(false)}>✕</button>
                            </div>
                        </div>

                        <div className="mp-filter-scroll-body">
                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Product Categories</div>
                                <div className="mp-filterCatRow">
                                    {["Service", "Digital Product", "Course", "Webinar", "Teams"].map((cat) => (
                                        <button key={cat} type="button" className={`mp-filterCatBtn ${filterCats.includes(cat) ? "active" : ""}`} onClick={() => toggleFilterCat(cat)}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Language</div>
                                <div className="mp-searchWrapper">
                                    <input
                                        type="text"
                                        placeholder="Search language..."
                                        className="mp-filterSearchInput"
                                        value={langSearch}
                                        onChange={(e) => setLangSearch(e.target.value)}
                                    />
                                    {filteredLangSuggestions.length > 0 && (
                                        <div className="mp-filterSuggestions">
                                            {filteredLangSuggestions.map(lang => (
                                                <div
                                                    key={lang}
                                                    className="mp-suggestionItem"
                                                    onClick={() => {
                                                        setFilterLangs(prev => [...prev, lang]);
                                                        setLangSearch("");
                                                    }}
                                                >
                                                    {lang}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mp-filterCatRow mt-3">
                                    {filterLangs.map((lang) => (
                                        <button
                                            key={lang}
                                            type="button"
                                            className="mp-filterCatBtn active"
                                            onClick={() => setFilterLangs((prev) => prev.filter((l) => l !== lang))}
                                        >
                                            {lang} ✕
                                        </button>
                                    ))}
                                    {!langSearch && filterLangs.length === 0 && (
                                        <div className="mp-searchHint"></div>
                                    )}
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Tags</div>
                                <div className="mp-searchWrapper">
                                    <input
                                        type="text"
                                        placeholder="Search tags..."
                                        className="mp-filterSearchInput"
                                        value={tagSearch}
                                        onChange={(e) => setTagSearch(e.target.value)}
                                    />
                                    {filteredTagSuggestions.length > 0 && (
                                        <div className="mp-filterSuggestions">
                                            {filteredTagSuggestions.map(tag => (
                                                <div
                                                    key={tag}
                                                    className="mp-suggestionItem"
                                                    onClick={() => {
                                                        setFilterTags(prev => [...prev, tag]);
                                                        setTagSearch("");
                                                    }}
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mp-filterCatRow mt-3">
                                    {filterTags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className="mp-filterCatBtn active"
                                            onClick={() => setFilterTags((prev) => prev.filter((t) => t !== tag))}
                                        >
                                            {tag} ✕
                                        </button>
                                    ))}
                                    {!tagSearch && filterTags.length === 0 && (
                                        <div className="mp-searchHint"></div>
                                    )}
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Trust Filter</div>
                                <div className="mp-filterToggleRow">
                                    <button type="button" className={`mp-toggle ${aiOnly ? "on" : ""}`} onClick={() => setAiOnly((p) => !p)} aria-pressed={aiOnly}><span className="mp-toggleKnob" /></button>
                                    <span className="mp-filterToggleLabel">AI-Powered only</span>
                                </div>

                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterHeaderPrice">
                                    <div className="mp-filterLabel">Price Range</div>
                                    <div className="mp-filterValueText">${priceMin || 0} — ${priceMax || 50000}</div>
                                </div>
                                <div className="mp-price-slider-container">
                                    <div
                                        className="mp-slider-track"
                                        style={{
                                            background: `linear-gradient(to right, 
                                            rgba(255, 255, 255, 0.1) ${((priceMin || 0) / 50000) * 100}%, 
                                            #ceff1b ${((priceMin || 0) / 50000) * 100}%, 
                                            #ceff1b ${((priceMax || 50000) / 50000) * 100}%, 
                                            rgba(255, 255, 255, 0.1) ${((priceMax || 50000) / 50000) * 100}%)`
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        value={priceMin || 0}
                                        onChange={(e) => {
                                            const value = Math.min(Number(e.target.value), (priceMax || 50000) - 100);
                                            setPriceMin(value);
                                        }}
                                        className="mp-range-input mp-range-min"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000"
                                        value={priceMax || 50000}
                                        onChange={(e) => {
                                            const value = Math.max(Number(e.target.value), (priceMin || 0) + 100);
                                            setPriceMax(value);
                                        }}
                                        className="mp-range-input mp-range-max"
                                    />
                                </div>
                                <div className="mp-price-labels">
                                    <div className="mp-price-label-item">
                                        <span>Min</span>
                                        <div className="mp-price-label-box">${priceMin || 0}</div>
                                    </div>
                                    <div className="mp-price-label-item">
                                        <span>Max</span>
                                        <div className="mp-price-label-box">${priceMax || 50000}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mp-filterSection">
                                <div className="mp-filterLabel">Sort By</div>
                                <div className="mp-custom-select" ref={sortRef}>
                                    <div
                                        className={`mp-selected-option ${isSortOpen ? "open" : ""}`}
                                        onClick={() => setIsSortOpen((v) => !v)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") setIsSortOpen((v) => !v);
                                        }}
                                    >
                                        {selectedSortLabel}
                                        <span className="mp-arrow">▼</span>
                                    </div>

                                    {isSortOpen && (
                                        <ul className="mp-options-list">
                                            {sortOptions.map((option) => (
                                                <li
                                                    key={option.value}
                                                    className={sortBy === option.value ? "active" : ""}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mp-filterFooter">
                            <button type="button" className="mp-filterApply" onClick={() => setIsFilterOpen(false)}>Apply filters</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE BOTTOM NAV */}
            <MobileBottomNav theme={theme} />
        </>
    );
}
