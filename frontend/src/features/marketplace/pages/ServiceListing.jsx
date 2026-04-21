import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListingByUsername, getPublicUserListings } from "../api/listingApi";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
    Share2,
    Flag,
    Heart,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Maximize2,
    Check,
    Star,
    Clock,
    Zap,
    X,
    ShieldCheck,
    MessageCircle,
    ShoppingBag
} from "lucide-react";
import "./TeamServiceListing.css";
import UserNavbar from "../../../components/layout/UserNavbar";
import "../../../Darkuser.css";
import MobileBottomNav from "../../../components/layout/MobileBottomNav";

const TABS = ["Basic", "Standard", "Premium"];

const ServiceListing = ({ theme, setTheme }) => {
    const navigate = useNavigate();
    const { username } = useParams();
    
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [activeTab, setActiveTab] = useState("Basic");
    const [activeImg, setActiveImg] = useState(0);
    const [selectedAddOns, setSelectedAddOns] = useState(new Set());
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImgIndex, setModalImgIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    const recommendedGridRef = useRef(null);
    const moreFromGridRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!username) { setIsLoading(false); return; }
        setIsLoading(true);
        getListingByUsername(username)
            .then((res) => {
                const data = res?.listing || res?.data || res || null;
                setListing(data);
                if (data?.details?.packages?.length) {
                    setActiveTab(data.details.packages[0].package_name || "Basic");
                }
            })
            .catch((e) => setFetchError(e?.message || "Failed to load listing."))
            .finally(() => setIsLoading(false));
    }, [username]);

    const scrollGridRef = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = 600;
            ref.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleChatNow = () => {
        const creator = listing?.creator?.username || listing?.creator_username;
        if (creator) {
            navigate(`/messages/${creator}`);
        } else {
            Swal.fire({
                icon: "info",
                title: "Chat Unavailable",
                text: "The creator profile is not available for chat at this moment.",
            });
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        Swal.fire({
            icon: "success",
            title: "Link Copied!",
            text: "The listing link has been copied to your clipboard.",
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    };

    const handleReport = () => {
        Swal.fire({
            title: "Report Listing",
            input: "textarea",
            inputLabel: "Please describe the issue",
            inputPlaceholder: "Type your reason here...",
            showCancelButton: true,
            confirmButtonText: "Submit Report",
            confirmButtonColor: "#ff4444",
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                Swal.fire("Report Submitted", "Thank you for your feedback. We will review this listing.", "success");
            }
        });
    };

    const handleBuyPackage = () => {
        // Redirect to contract/checkout
        navigate("/contracts-listing", { 
            state: { 
                listingId: listing?.id, 
                package: activeTab,
                addOns: Array.from(selectedAddOns).map(idx => listing?.details?.add_ons?.[idx])
            } 
        });
    };

    if (isLoading) {
        return (
            <div className="light bg-white min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#CEFF1B]" />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="light bg-white min-h-screen flex items-center justify-center text-red-500">
                {fetchError}
            </div>
        );
    }

    const details = listing?.details || {};
    const packages = Array.isArray(details.packages) ? details.packages : [];
    const addOns = Array.isArray(details.add_ons) ? details.add_ons : [];
    const faqs = Array.isArray(listing?.faqs) ? listing.faqs : [];
    const portfolio = Array.isArray(listing?.portfolio_projects) ? listing.portfolio_projects : [];
    
    const gallery = Array.isArray(listing?.gallery) ? listing.gallery : [];
    const images = (gallery.length ? gallery : [listing?.cover_media_url]).filter(Boolean).map(img => typeof img === 'string' ? img : (img?.url || img?.media_url));
    if (!images.length) images.push("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop");

    const currentPkg = packages.find(p => (p.package_name || "Basic") === activeTab) || packages[0] || {};

    const totalPrice = (Number(currentPkg.price) || 0) + 
        Array.from(selectedAddOns).reduce((acc, idx) => acc + (Number(addOns[idx]?.price) || 0), 0);

    return (
        <div className={`user-page light bg-white min-h-screen font-sans text-gray-900`}>
            <UserNavbar theme="light" setTheme={setTheme} />
            
            <div className="pt-[100px] max-w-7xl mx-auto px-4 md:px-10 pb-32">
                {/* Header Section */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                            {listing?.category}
                        </span>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                            {listing?.sub_category}
                        </span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="flex flex-col gap-4 flex-1">
                            <div className="flex items-center gap-4 flex-wrap">
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                    {listing?.title}
                                </h1>
                                {listing?.ai_powered && (
                                    <div className="flex items-center gap-2 bg-[#CEFF1B] text-black px-4 py-1.5 rounded-full text-xs font-black border-2 border-black shadow-[3px_3px_0px_black] animate-bounce-subtle">
                                        <Zap size={14} fill="black" /> AI POWERED
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5 text-[#CEFF1B]">
                                        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#CEFF1B" />)}
                                    </div>
                                    <span className="text-gray-900 font-black">4.9</span>
                                    <span>(1.2k reviews)</span>
                                </div>
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-400" />
                                    <span>Avg. 1h response</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                            <button onClick={handleShare} className="w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-all shadow-sm group">
                                <Share2 size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button onClick={() => setIsLiked(!isLiked)} className="w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:border-black hover:text-red-500 transition-all shadow-sm group">
                                <Heart size={24} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "currentColor"} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button onClick={handleReport} className="w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-all shadow-sm group">
                                <Flag size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start">
                    
                    {/* Left Column */}
                    <div className="flex flex-col gap-16">
                        {/* Gallery Section */}
                        <div className="flex flex-col gap-6">
                            <div className="relative aspect-[16/10] bg-gray-50 rounded-[48px] overflow-hidden group border-2 border-gray-100 shadow-xl">
                                <img 
                                    src={images[activeImg]} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                    alt="Service Preview" 
                                />
                                
                                {/* Navigation Arrows */}
                                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                                        className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full border-2 border-black/5 flex items-center justify-center text-black shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <ChevronLeft size={28} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setActiveImg(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                                        className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full border-2 border-black/5 flex items-center justify-center text-black shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <ChevronRight size={28} />
                                    </button>
                                </div>

                                {/* Fullscreen Trigger */}
                                <button 
                                    onClick={() => { setModalImgIndex(activeImg); setShowImageModal(true); }}
                                    className="absolute bottom-8 right-8 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-black/5 flex items-center justify-center text-black shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                >
                                    <Maximize2 size={24} />
                                </button>

                                {/* Image Counter Overlay */}
                                <div className="absolute bottom-8 left-8 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black tracking-widest uppercase border border-white/20">
                                    {activeImg + 1} / {images.length}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImg(idx)}
                                        className={`relative w-28 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImg === idx ? "border-[#CEFF1B] scale-105 shadow-lg" : "border-gray-100 opacity-60 hover:opacity-100"}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* About This Service Section */}
                        <div className="bg-white p-12 rounded-[56px] border-2 border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-3 h-full bg-[#CEFF1B]" />
                            <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">About This Service</h3>
                            <div className="text-gray-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                                {listing?.about || listing?.short_description || "No detailed description provided."}
                            </div>
                        </div>

                        {/* Portfolio Section */}
                        {portfolio.length > 0 && (
                            <div className="flex flex-col gap-10">
                                <div className="flex justify-between items-end border-b-4 border-gray-50 pb-8">
                                    <div>
                                        <h3 className="text-4xl font-black text-gray-900 tracking-tight">My Portfolio</h3>
                                        <p className="text-gray-400 mt-2 font-black text-xs uppercase tracking-[0.2em]">Selected Works & Case Studies</p>
                                    </div>
                                    <button className="text-gray-900 font-black text-sm border-b-2 border-black pb-1 hover:text-[#CEFF1B] hover:border-[#CEFF1B] transition-all">
                                        View All Projects
                                    </button>
                                </div>

                                <div className="flex flex-col gap-10">
                                    {/* Main Featured Project */}
                                    {portfolio[0] && (
                                        <div className="group bg-white rounded-[56px] overflow-hidden border-2 border-gray-100 hover:border-black transition-all shadow-2xl flex flex-col md:flex-row h-auto md:h-[420px]">
                                            <div className="w-full md:w-3/5 relative overflow-hidden bg-gray-50">
                                                <img 
                                                    src={portfolio[0].media?.[0]?.url || portfolio[0].cover_media_url} 
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                    alt="Featured Portfolio" 
                                                />
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="w-full md:w-2/5 p-12 flex flex-col justify-center bg-white">
                                                <span className="text-[10px] font-black text-[#CEFF1B] bg-black px-3 py-1 rounded-full uppercase tracking-widest inline-block w-fit mb-6 shadow-[3px_3px_0px_#CEFF1B]">
                                                    Featured
                                                </span>
                                                <h5 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{portfolio[0].title}</h5>
                                                <p className="text-gray-500 leading-relaxed font-bold text-sm mb-8 line-clamp-4 italic">
                                                    "{portfolio[0].description}"
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-[#CEFF1B] text-black px-6 py-2.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_black] text-xs font-black uppercase tracking-widest">
                                                        Cost: {portfolio[0].cost || "$2,500"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub Projects Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {portfolio.slice(1, 4).map((p, i) => (
                                            <div key={i} className="group bg-white rounded-[40px] overflow-hidden border-2 border-gray-100 hover:border-black transition-all shadow-md">
                                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                                                    <img src={p.media?.[0]?.url || p.cover_media_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Portfolio Sub" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-8">
                                                        <h6 className="text-white font-black text-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{p.title}</h6>
                                                        <span className="text-[#CEFF1B] text-[10px] font-black uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                                            Cost: {p.cost || "$1.2k"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Compare Packages Table */}
                        <div className="flex flex-col gap-10">
                            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Compare Packages</h3>
                            <div className="overflow-hidden bg-white rounded-[56px] border-2 border-gray-100 shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b-2 border-gray-100">
                                            <th className="p-10 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Tier Breakdown</th>
                                            {packages.map((p, i) => (
                                                <th key={i} className="p-10 text-gray-900 font-black text-center text-xl uppercase tracking-tighter">
                                                    {p.package_name || TABS[i]}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800 font-bold">
                                        <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <td className="p-10 text-sm uppercase tracking-widest text-gray-400">Price Point</td>
                                            {packages.map((p, i) => (
                                                <td key={i} className="p-10 text-center text-3xl font-black text-gray-900 tracking-tighter">${p.price}</td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <td className="p-10 text-sm uppercase tracking-widest text-gray-400">Delivery Time</td>
                                            {packages.map((p, i) => (
                                                <td key={i} className="p-10 text-center">
                                                    <div className="inline-flex items-center gap-3 bg-white border border-gray-200 px-6 py-2 rounded-full text-sm font-black shadow-sm">
                                                        <Clock size={16} className="text-[#CEFF1B]" strokeWidth={4} /> {p.delivery_days} Days
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <td className="p-10 text-sm uppercase tracking-widest text-gray-400">Revisions</td>
                                            {packages.map((p, i) => (
                                                <td key={i} className="p-10 text-center text-lg">{p.revisions === -1 ? "∞" : p.revisions}</td>
                                            ))}
                                        </tr>
                                        <tr className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                                            <td className="p-10 text-sm uppercase tracking-widest text-gray-400">Included Scope</td>
                                            {packages.map((p, i) => (
                                                <td key={i} className="p-10 text-center text-xs leading-relaxed max-w-[240px] mx-auto text-gray-500 italic">
                                                    "{p.scope}"
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="bg-gray-50/50">
                                            <td className="p-10"></td>
                                            {packages.map((p, i) => (
                                                <td key={i} className="p-10 text-center">
                                                    <button 
                                                        onClick={() => setActiveTab(p.package_name || TABS[i])}
                                                        className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${activeTab === (p.package_name || TABS[i]) ? "bg-[#CEFF1B] border-black shadow-[6px_6px_0px_black] text-black scale-105" : "bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black"}`}
                                                    >
                                                        Select Plan
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* About The Creator Section */}
                        <div className="bg-white p-12 rounded-[56px] border-2 border-gray-100 shadow-sm relative overflow-hidden">
                             <div className="flex flex-col md:flex-row gap-16 items-start">
                                 <div className="flex flex-col items-center gap-6 shrink-0">
                                     <div className="relative w-40 h-40">
                                         <img 
                                            src={listing?.creator?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
                                            className="w-full h-full rounded-[48px] object-cover border-8 border-gray-50 shadow-2xl" 
                                            alt="Creator" 
                                         />
                                         <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full shadow-lg flex items-center justify-center">
                                            <ShieldCheck size={20} className="text-white" />
                                         </div>
                                     </div>
                                     <button className="w-full py-3 bg-black text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">
                                        Follow User
                                     </button>
                                 </div>
                                 
                                 <div className="flex-1">
                                     <div className="flex flex-col gap-2 mb-10">
                                        <h4 className="text-4xl font-black text-gray-900 tracking-tight">
                                            {listing?.creator?.full_name || listing?.creator?.username}
                                        </h4>
                                        <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                                            <div className="flex items-center gap-1.5 text-[#CEFF1B]">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#CEFF1B" />)}
                                            </div>
                                            <span className="text-gray-900 font-black">4.9 / 5.0 Rating</span>
                                            <span>•</span>
                                            <span>Member since 2021</span>
                                        </div>
                                     </div>

                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                         {[
                                             { label: "Response", value: "1 Hour" },
                                             { label: "Completed", value: "850+ Orders" },
                                             { label: "Country", value: "United States" },
                                             { label: "Earnings", value: "$50k+" }
                                         ].map((stat, i) => (
                                             <div key={i} className="bg-gray-50 p-6 rounded-[32px] border-2 border-gray-100 flex flex-col gap-1">
                                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                                                 <span className="text-lg font-black text-gray-900">{stat.value}</span>
                                             </div>
                                         ))}
                                     </div>

                                     <div className="p-8 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
                                         <p className="text-gray-600 leading-relaxed font-bold text-base italic">
                                             "{listing?.creator?.bio || "I am a professional creator with over 5 years of experience in delivering high-quality digital solutions. My mission is to help brands stand out through exceptional design and strategic thinking."}"
                                         </p>
                                     </div>

                                     <div className="flex flex-wrap gap-3 mt-10">
                                         {["English (Fluent)", "French (Native)", "German (Expert)"].map(lang => (
                                             <span key={lang} className="px-5 py-2 bg-white border-2 border-gray-100 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                {lang}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* FAQ Section */}
                        {faqs.length > 0 && (
                            <div className="flex flex-col gap-10">
                                <h3 className="text-4xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h3>
                                <div className="flex flex-col gap-6">
                                    {faqs.map((f, i) => (
                                        <div key={i} className={`bg-white rounded-[40px] border-4 transition-all duration-500 overflow-hidden ${activeFaq === i ? "border-black shadow-2xl" : "border-gray-50 shadow-sm hover:border-gray-200"}`}>
                                            <button 
                                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                                className="w-full flex items-center justify-between p-10 text-left"
                                            >
                                                <span className="text-gray-900 font-black text-xl tracking-tight">{f.q || f.question}</span>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeFaq === i ? "bg-[#CEFF1B] text-black rotate-180" : "bg-gray-100 text-gray-400"}`}>
                                                    <ChevronDown size={28} strokeWidth={3} />
                                                </div>
                                            </button>
                                            <div className={`px-10 overflow-hidden transition-all duration-500 ${activeFaq === i ? "max-h-[500px] pb-10" : "max-h-0"}`}>
                                                <p className="text-gray-500 leading-relaxed font-bold text-lg border-t-2 border-gray-50 pt-8">
                                                    {f.a || f.answer}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div className="flex flex-col gap-12">
                            <div className="flex justify-between items-end border-b-4 border-gray-50 pb-10">
                                <div>
                                    <h3 className="text-4xl font-black text-gray-900 tracking-tight">Community Reviews</h3>
                                    <p className="text-gray-400 mt-2 font-black text-xs uppercase tracking-[0.2em]">Validated feedback from past clients</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-20">
                                {/* Star Breakdown Card */}
                                <div className="bg-gray-50 p-10 rounded-[56px] border-2 border-gray-100 flex flex-col gap-10 sticky top-32 h-fit">
                                    <div className="flex items-center gap-6">
                                        <span className="text-7xl font-black text-gray-900 tracking-tighter">4.9</span>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-[#CEFF1B]">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={24} fill="#CEFF1B" />)}
                                            </div>
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">1,248 Reviews</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-5">
                                        {[5,4,3,2,1].map((stars, idx) => (
                                            <div key={idx} className="flex items-center gap-6 group cursor-pointer">
                                                <span className="text-xs font-black text-gray-900 w-4">{stars}</span>
                                                <div className="flex-1 h-3 bg-white rounded-full overflow-hidden border border-gray-100">
                                                    <div className="h-full bg-[#CEFF1B] transition-all duration-1000 group-hover:scale-x-105 origin-left" style={{ width: `${stars === 5 ? 85 : stars === 4 ? 10 : 5}%` }} />
                                                </div>
                                                <span className="text-xs font-black text-gray-300 w-8 text-right group-hover:text-black transition-colors">{stars === 5 ? "85%" : stars === 4 ? "10%" : "5%"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="flex flex-col gap-12">
                                    {[1, 2, 3, 4].map(r => (
                                        <div key={r} className="group bg-white p-10 rounded-[48px] border-2 border-gray-50 hover:border-black transition-all shadow-sm hover:shadow-2xl">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="relative w-16 h-16">
                                                        <img 
                                                            src={`https://i.pravatar.cc/150?u=${r + 100}`} 
                                                            className="w-full h-full rounded-[24px] object-cover border-4 border-white shadow-lg" 
                                                            alt="Reviewer" 
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#CEFF1B] border-2 border-white rounded-full" />
                                                    </div>
                                                    <div>
                                                        <h6 className="font-black text-gray-900 text-lg tracking-tight">VerifiedClient_{r}</h6>
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">United States • 2 days ago</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-[#CEFF1B]">
                                                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#CEFF1B" />)}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed font-bold text-lg italic border-l-4 border-gray-100 pl-8">
                                                "Exceptional work! The creator followed every detail of my brief and exceeded expectations. The communication was flawless and the final delivery was exactly what I needed for my brand. Highly recommended!"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Purchase Card Sidebar */}
                    <div className="relative z-10">
                        <div className="flex flex-col gap-10">
                            {/* Main Purchase Card */}
                            <div className="bg-white rounded-[64px] border-2 border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                                {/* Tab Header */}
                                <div className="flex bg-gray-50/80 p-4 border-b-2 border-gray-50">
                                    {packages.map((p, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setActiveTab(p.package_name || TABS[i])}
                                            className={`flex-1 py-5 rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === (p.package_name || TABS[i]) ? "bg-white text-gray-900 shadow-2xl border-2 border-black/5 scale-105 z-10" : "text-gray-400 hover:text-gray-900"}`}
                                        >
                                            {p.package_name || TABS[i]}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="p-12">
                                    <div className="flex flex-col mb-12">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-1">{activeTab} Plan</span>
                                                <h4 className="text-6xl font-black text-gray-900 tracking-tighter leading-none">${currentPkg.price}</h4>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-[#CEFF1B]/10 px-3 py-1.5 rounded-full border border-[#CEFF1B]/20">
                                                <Star size={14} fill="#CEFF1B" className="text-[#CEFF1B]" />
                                                <span className="text-[10px] font-black text-gray-900">4.9 Rating</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Fixed price • Secure Escrow Payment</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-12">
                                        <div className="flex flex-col gap-2 p-5 bg-gray-50 rounded-[32px] border-2 border-gray-100">
                                            <Clock size={20} className="text-[#CEFF1B]" strokeWidth={3} />
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{currentPkg.delivery_days} Days</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase">Delivery</span>
                                        </div>
                                        <div className="flex flex-col gap-2 p-5 bg-gray-50 rounded-[32px] border-2 border-gray-100">
                                            <Zap size={20} className="text-[#CEFF1B]" strokeWidth={3} />
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{currentPkg.revisions === -1 ? "Unlimited" : `${currentPkg.revisions} Revs`}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase">Revisions</span>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-gray-900 rounded-[40px] mb-12 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#CEFF1B]/10 rounded-full blur-3xl group-hover:bg-[#CEFF1B]/20 transition-all duration-700" />
                                        <h6 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Project Intent</h6>
                                        <p className="text-white text-sm leading-relaxed font-bold italic">
                                            "{currentPkg.scope}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-8 mb-12">
                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Key Deliverables</h5>
                                        <ul className="space-y-5">
                                            {(currentPkg.included || []).map((item, i) => (
                                                <li key={i} className="flex items-start gap-5 text-sm text-gray-700 font-black">
                                                    <div className="w-7 h-7 bg-[#CEFF1B] rounded-[10px] flex items-center justify-center shrink-0 shadow-lg border-2 border-black mt-0.5">
                                                        <Check size={16} className="text-black" strokeWidth={4} />
                                                    </div>
                                                    <span className="leading-tight">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Add-ons List */}
                                    {addOns.length > 0 && (
                                        <div className="flex flex-col gap-8 mb-12 pt-12 border-t-4 border-gray-50">
                                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Available Add-ons</h5>
                                            <div className="flex flex-col gap-4">
                                                {addOns.map((ao, i) => (
                                                    <label key={i} className={`flex items-center justify-between p-6 rounded-[32px] border-2 transition-all duration-300 cursor-pointer ${selectedAddOns.has(i) ? "bg-[#CEFF1B]/10 border-black shadow-xl scale-[1.02]" : "bg-white border-gray-100 hover:border-gray-300"}`}>
                                                        <div className="flex items-center gap-5">
                                                            <input type="checkbox" className="hidden" checked={selectedAddOns.has(i)} onChange={() => {
                                                                const next = new Set(selectedAddOns);
                                                                if(next.has(i)) next.delete(i); else next.add(i);
                                                                setSelectedAddOns(next);
                                                            }} />
                                                            <div className={`w-7 h-7 rounded-[10px] border-2 flex items-center justify-center transition-all duration-300 ${selectedAddOns.has(i) ? "bg-black border-black" : "border-gray-200 bg-gray-50"}`}>
                                                                {selectedAddOns.has(i) && <Check size={16} className="text-[#CEFF1B]" strokeWidth={4} />}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-gray-900">{ao.name}</span>
                                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">+{ao.days} Day(s)</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-black text-gray-900 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">+${ao.price}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-5 pt-12 border-t-4 border-gray-50">
                                        <button 
                                            onClick={handleBuyPackage}
                                            className="w-full py-6 bg-[#CEFF1B] text-black rounded-[28px] font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.03] transition-all border-4 border-black shadow-[8px_8px_0px_black] active:shadow-none active:translate-x-2 active:translate-y-2"
                                        >
                                            <ShoppingBag size={28} /> BUY PACKAGE (${totalPrice})
                                        </button>
                                        <button 
                                            onClick={handleChatNow}
                                            className="w-full py-6 bg-white text-gray-900 rounded-[28px] font-black text-lg border-4 border-gray-100 flex items-center justify-center gap-4 hover:border-black hover:bg-gray-50 transition-all active:scale-95"
                                        >
                                            <MessageCircle size={28} /> CONTACT SELLER
                                        </button>
                                    </div>
                                    
                                    <div className="mt-10 flex items-center justify-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                                        <ShieldCheck size={18} className="text-green-500" /> Secure Ultrahustle Protection
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Badges */}
                            <div className="bg-white p-10 rounded-[56px] border-2 border-gray-100 grid grid-cols-3 gap-8 shadow-xl">
                                {[
                                    { icon: ShieldCheck, label: "Escrow", color: "#CEFF1B" },
                                    { icon: Star, label: "Top Rated", color: "#gray-400" },
                                    { icon: Zap, label: "Fast", color: "#gray-400" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-4 text-center">
                                        <div className={`w-16 h-16 ${idx === 0 ? "bg-[#CEFF1B]/20" : "bg-gray-50"} rounded-[24px] flex items-center justify-center text-gray-900 border-2 border-black/5 shadow-inner`}>
                                            <item.icon size={28} strokeWidth={idx === 0 ? 3 : 2} />
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* More from creator section */}
                <div className="mt-40 border-t-8 border-gray-50 pt-32">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">More from {listing?.creator?.full_name || "this Creator"}</h2>
                            <p className="text-gray-400 font-black text-sm uppercase tracking-widest">Explore other premium services in this category</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => scrollGridRef(moreFromGridRef, "left")} className="w-16 h-16 rounded-[24px] border-4 border-gray-100 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all shadow-lg active:scale-90"><ChevronLeft size={32} strokeWidth={3} /></button>
                            <button onClick={() => scrollGridRef(moreFromGridRef, "right")} className="w-16 h-16 rounded-[24px] border-4 border-gray-100 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all shadow-lg active:scale-90"><ChevronRight size={32} strokeWidth={3} /></button>
                        </div>
                    </div>
                    <div className="flex gap-10 overflow-x-auto pb-16 scrollbar-hide px-4 -mx-4" ref={moreFromGridRef}>
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="min-w-[360px] bg-white rounded-[56px] overflow-hidden border-2 border-gray-100 group cursor-pointer hover:border-black transition-all shadow-xl hover:shadow-2xl">
                                <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=600&q=80`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Other Listing" />
                                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="px-5 py-2 bg-[#CEFF1B] text-black rounded-2xl text-[10px] font-black uppercase border-2 border-black shadow-[4px_4px_0px_black]">Pro Service</span>
                                        <span className="text-white font-black text-2xl tracking-tighter drop-shadow-2xl">$2,500+</span>
                                    </div>
                                </div>
                                <div className="p-10">
                                    <h4 className="text-gray-900 font-black text-xl mb-4 line-clamp-1 group-hover:text-[#CEFF1B] transition-colors">Premium Digital Brand Transformation Pack</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[#CEFF1B]">
                                            <Star size={16} fill="#CEFF1B" />
                                            <span className="text-gray-900 font-black text-sm">5.0</span>
                                        </div>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">24 Orders</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <MobileBottomNav theme={theme} />

            {/* Premium Lightbox Portal */}
            {showImageModal && createPortal(
                <div className="fixed inset-0 z-[9999] bg-white/98 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500" onClick={() => setShowImageModal(false)}>
                    <button 
                        className="absolute top-12 right-12 w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-all z-20 shadow-2xl" 
                        onClick={() => setShowImageModal(false)}
                    >
                        <X size={40} strokeWidth={3} />
                    </button>
                    
                    <div className="w-full max-w-7xl relative flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <button 
                            className="absolute -left-20 top-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full text-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-2xl border-4 border-black/5 z-10" 
                            onClick={() => setModalImgIndex(p => p === 0 ? images.length - 1 : p - 1)}
                        >
                            <ChevronLeft size={48} strokeWidth={3} />
                        </button>

                        <div className="relative group/modal">
                            <img 
                                src={images[modalImgIndex]} 
                                className="w-full max-h-[85vh] object-contain rounded-[40px] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.2)] border-8 border-white bg-white" 
                                alt="Gallery Expanded" 
                            />
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-8 py-3 bg-black text-white rounded-full text-xs font-black tracking-[0.4em] uppercase border-4 border-white shadow-2xl">
                                IMAGE {modalImgIndex + 1} OF {images.length}
                            </div>
                        </div>

                        <button 
                            className="absolute -right-20 top-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full text-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-2xl border-4 border-black/5 z-10" 
                            onClick={() => setModalImgIndex(p => p === images.length - 1 ? 0 : p + 1)}
                        >
                            <ChevronRight size={48} strokeWidth={3} />
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ServiceListing;

