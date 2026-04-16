import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import {
  LayoutDashboard, Users, TrendingUp, DollarSign,
  ShoppingBag, Star, AlertTriangle, Zap, Globe,
  ChevronUp, ChevronDown, Search, Bell, Settings,
  Package, BookOpen, Video, Users2, Shield, Cpu,
  Wallet, Lock, ArrowDownLeft, ArrowUpRight,
  Clock, CheckCircle, RefreshCcw, ArrowRight,
  ChevronRight
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────
const Y      = "#CEFF1B";
const BG     = "#000000";
const CARD   = "#0d0d0d";
const BORDER = "#1e1e1e";
const WHITE  = "#FFFFFF";
const DIM    = "#666666";
const DIM2   = "#999999";
const RED    = "#FF4D4D";
const GREEN  = "#39FF78";
const ORANGE = "#FF9500";

// ── Helpers ───────────────────────────────────────────────
const inr = (n) => {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n/100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n/1000).toFixed(1)}K`;
  return `₹${n}`;
};
const PctBadge = ({ n, up }) => (
  <span style={{ display:"flex", alignItems:"center", gap:2, fontSize:11,
    fontFamily:"Montserrat,sans-serif", fontWeight:700, color: up ? Y : RED }}>
    {up ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}{n}%
  </span>
);

// ── Shared Data ───────────────────────────────────────────
const revenueData = [
  { month:"Nov", gmv:1200000,  revenue:96000,  profit:58000  },
  { month:"Dec", gmv:1850000,  revenue:148000, profit:89000  },
  { month:"Jan", gmv:2100000,  revenue:168000, profit:101000 },
  { month:"Feb", gmv:1780000,  revenue:142400, profit:85440  },
  { month:"Mar", gmv:2650000,  revenue:212000, profit:127200 },
  { month:"Apr", gmv:3420000,  revenue:273600, profit:164160 },
];
const userGrowthData = [
  { month:"Nov", creators:1200, clients:890,  total:2090 },
  { month:"Dec", creators:1580, clients:1240, total:2820 },
  { month:"Jan", creators:2100, clients:1780, total:3880 },
  { month:"Feb", creators:2650, clients:2340, total:4990 },
  { month:"Mar", creators:3400, clients:3100, total:6500 },
  { month:"Apr", creators:4280, clients:3960, total:8240 },
];
const orderData = [
  { day:"Mon", services:340, products:210, courses:98,  webinars:45 },
  { day:"Tue", services:290, products:180, courses:112, webinars:38 },
  { day:"Wed", services:420, products:260, courses:134, webinars:62 },
  { day:"Thu", services:380, products:290, courses:118, webinars:55 },
  { day:"Fri", services:510, products:340, courses:156, webinars:78 },
  { day:"Sat", services:460, products:380, courses:144, webinars:91 },
  { day:"Sun", services:320, products:240, courses:98,  webinars:64 },
];
const locationData = [
  { name:"India",         value:58, color:Y         },
  { name:"United States", value:16, color:"#ffffff"  },
  { name:"UAE",           value:9,  color:"#888888"  },
  { name:"United Kingdom",value:7,  color:"#555555"  },
  { name:"Australia",     value:5,  color:"#333333"  },
  { name:"Canada",        value:3,  color:"#222222"  },
  { name:"Others",        value:2,  color:"#1a1a1a"  },
];
const ageData = [
  { range:"18–22", creators:18, clients:8  },
  { range:"23–27", creators:34, clients:19 },
  { range:"28–32", creators:26, clients:28 },
  { range:"33–37", creators:13, clients:24 },
  { range:"38–45", creators:6,  clients:15 },
  { range:"45+",   creators:3,  clients:6  },
];
const deviceData = [
  { name:"Mobile",  value:64, color:Y       },
  { name:"Desktop", value:28, color:"#555"  },
  { name:"Tablet",  value:8,  color:"#333"  },
];
const topCreators = [
  { name:"Arjun Mehta",  category:"UI/UX Design",    gmv:"₹4,82,000", rating:4.9, orders:142, level:"Pro"    },
  { name:"Priya Sharma", category:"Content Writing", gmv:"₹3,91,000", rating:4.8, orders:218, level:"Pro"    },
  { name:"Rohan Das",    category:"Video Editing",   gmv:"₹3,14,000", rating:4.7, orders:97,  level:"Elite"  },
  { name:"Sneha Iyer",   category:"Web Dev",         gmv:"₹2,87,000", rating:4.9, orders:74,  level:"Pro"    },
  { name:"Karan Patel",  category:"Motion Design",   gmv:"₹2,43,000", rating:4.6, orders:88,  level:"Rising" },
];
const recentDisputes = [
  { id:"#D-1042", buyer:"Startup X",  seller:"Dev Y",      amount:"₹18,500", status:"Open",     age:"2d" },
  { id:"#D-1038", buyer:"Agency Z",   seller:"Writer A",   amount:"₹6,200",  status:"Resolved", age:"5d" },
  { id:"#D-1031", buyer:"Brand Co",   seller:"Designer B", amount:"₹32,000", status:"Escalated",age:"8d" },
  { id:"#D-1028", buyer:"Founder C",  seller:"Video D",    amount:"₹9,800",  status:"Open",     age:"11d"},
];
const LISTING_TYPES = [
  { id:"services", label:"Freelance Services", icon:ShoppingBag, feeRate:0.10, color:Y,        orders:7840, avgOrder:8200,  escrow:6420000, description:"Custom gigs, hourly, retainers"   },
  { id:"products", label:"Digital Products",   icon:Package,     feeRate:0.08, color:"#AAAAAA", orders:2980, avgOrder:1400,  escrow:1240000, description:"Templates, assets, downloadables" },
  { id:"courses",  label:"Courses",            icon:BookOpen,    feeRate:0.07, color:"#777777", orders:1420, avgOrder:3600,  escrow:880000,  description:"Self-paced learning modules"      },
  { id:"webinars", label:"Webinars",           icon:Video,       feeRate:0.06, color:"#555555", orders:600,  avgOrder:2200,  escrow:340000,  description:"Live sessions & recordings"       },
  { id:"teams",    label:"Teams",              icon:Users2,      feeRate:0.12, color:"#333333", orders:220,  avgOrder:42000, escrow:3600000, description:"Collaborative project pods"       },
];
const ESCROW_TX = [
  { id:"ESC-8841", buyer:"Aarav Shah",  seller:"Priya Sharma", type:"Services", amount:28000,  status:"Active",          milestone:"2/3", age:"3d" },
  { id:"ESC-8840", buyer:"Neon Labs",   seller:"Rohan Das",    type:"Teams",    amount:120000, status:"Active",          milestone:"1/4", age:"1d" },
  { id:"ESC-8835", buyer:"Pixel Co.",   seller:"Arjun Mehta",  type:"Services", amount:45000,  status:"Pending Release", milestone:"3/3", age:"6h" },
  { id:"ESC-8828", buyer:"Fintech X",   seller:"Sneha Iyer",   type:"Services", amount:62000,  status:"In Dispute",      milestone:"2/3", age:"2d" },
  { id:"ESC-8820", buyer:"Brand K",     seller:"Karan Patel",  type:"Courses",  amount:18000,  status:"Pending Release", milestone:"Done",age:"1d" },
  { id:"ESC-8810", buyer:"Startup Y",   seller:"Dev Z",        type:"Teams",    amount:280000, status:"Active",          milestone:"1/5", age:"4d" },
  { id:"ESC-8802", buyer:"Media Hub",   seller:"Writer A",     type:"Services", amount:14000,  status:"Released",        milestone:"Done",age:"8d" },
  { id:"ESC-8799", buyer:"Corp B",      seller:"Designer C",   type:"Services", amount:38000,  status:"Released",        milestone:"Done",age:"9d" },
];
const CREATOR_WALLETS = [
  { name:"Arjun Mehta",  level:"Pro",    available:148400, pending:45000,  onHold:62000,  withdrawn:334000 },
  { name:"Priya Sharma", level:"Pro",    available:112800, pending:28000,  onHold:38000,  withdrawn:281000 },
  { name:"Rohan Das",    level:"Elite",  available:98600,  pending:120000, onHold:45000,  withdrawn:196000 },
  { name:"Sneha Iyer",   level:"Pro",    available:84200,  pending:62000,  onHold:28000,  withdrawn:168000 },
  { name:"Karan Patel",  level:"Rising", available:64800,  pending:18000,  onHold:14000,  withdrawn:124000 },
  { name:"Meera Nair",   level:"Rising", available:48200,  pending:22000,  onHold:18000,  withdrawn:88000  },
  { name:"Vikram Bose",  level:"Pro",    available:72400,  pending:34000,  onHold:22000,  withdrawn:148000 },
];
const CLIENT_WALLETS = [
  { name:"Neon Labs",  type:"Startup",    loaded:480000, spent:240000, available:240000, inEscrow:120000, refundPending:0    },
  { name:"Fintech X",  type:"Startup",    loaded:320000, spent:178000, available:142000, inEscrow:62000,  refundPending:0    },
  { name:"Pixel Co.",  type:"Agency",     loaded:280000, spent:214000, available:66000,  inEscrow:45000,  refundPending:0    },
  { name:"Brand K",    type:"Brand",      loaded:160000, spent:142000, available:18000,  inEscrow:18000,  refundPending:0    },
  { name:"Startup Y",  type:"Startup",    loaded:620000, spent:280000, available:340000, inEscrow:280000, refundPending:0    },
  { name:"Media Hub",  type:"Agency",     loaded:120000, spent:114000, available:6000,   inEscrow:0,      refundPending:4200 },
  { name:"Corp B",     type:"Enterprise", loaded:880000, spent:680000, available:200000, inEscrow:0,      refundPending:0    },
];
const escrowFlow = [
  { month:"Nov", locked:4200000,  released:3100000, disputed:280000 },
  { month:"Dec", locked:6800000,  released:5200000, disputed:340000 },
  { month:"Jan", locked:8400000,  released:6900000, disputed:420000 },
  { month:"Feb", locked:7200000,  released:6400000, disputed:280000 },
  { month:"Mar", locked:10600000, released:8800000, disputed:380000 },
  { month:"Apr", locked:12200000, released:9800000, disputed:460000 },
];
const payoutTrend = [
  { week:"W1 Feb", payouts:1840000 }, { week:"W2 Feb", payouts:2100000 },
  { week:"W3 Feb", payouts:1620000 }, { week:"W4 Feb", payouts:2480000 },
  { week:"W1 Mar", payouts:2840000 }, { week:"W2 Mar", payouts:3120000 },
  { week:"W3 Mar", payouts:2760000 }, { week:"W4 Mar", payouts:3480000 },
  { week:"W1 Apr", payouts:3840000 }, { week:"W2 Apr", payouts:4200000 },
];

// ── Computed totals ───────────────────────────────────────
const totalGOV    = LISTING_TYPES.reduce((s,l)=>s+l.orders*l.avgOrder,0);
const totalFees   = LISTING_TYPES.reduce((s,l)=>s+l.orders*l.avgOrder*l.feeRate,0);
const totalPayout = totalGOV - totalFees;
const totalEscrow = LISTING_TYPES.reduce((s,l)=>s+l.escrow,0);
const cwAvailable = CREATOR_WALLETS.reduce((s,w)=>s+w.available,0);
const cwPending   = CREATOR_WALLETS.reduce((s,w)=>s+w.pending,0);
const cwOnHold    = CREATOR_WALLETS.reduce((s,w)=>s+w.onHold,0);
const cwWithdrawn = CREATOR_WALLETS.reduce((s,w)=>s+w.withdrawn,0);
const clLoaded    = CLIENT_WALLETS.reduce((s,w)=>s+w.loaded,0);
const clSpent     = CLIENT_WALLETS.reduce((s,w)=>s+w.spent,0);
const clAvailable = CLIENT_WALLETS.reduce((s,w)=>s+w.available,0);
const clEscrow    = CLIENT_WALLETS.reduce((s,w)=>s+w.inEscrow,0);
const clRefund    = CLIENT_WALLETS.reduce((s,w)=>s+w.refundPending,0);

// ── Reusable UI ───────────────────────────────────────────
const Tooltip_ = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1a1a1a", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 14px" }}>
      <p style={{ color:Y, fontFamily:"Montserrat,sans-serif", fontWeight:700, fontSize:11, margin:"0 0 6px" }}>{label}</p>
      {payload.map((p,i)=>(
        <p key={i} style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:600, fontSize:12, margin:"3px 0", display:"flex", justifyContent:"space-between", gap:14 }}>
          <span style={{ color:DIM2 }}>{p.name}</span>
          <span style={{ color:p.color }}>{typeof p.value==="number"&&p.value>999?inr(p.value):p.value}</span>
        </p>
      ))}
    </div>
  );
};
const Box = ({ children, style={} }) => (
  <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:14, padding:20, ...style }}>{children}</div>
);
const SH = ({ title, sub }) => (
  <div style={{ marginBottom:16 }}>
    <h2 style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:16, margin:0 }}>{title}</h2>
    {sub&&<p style={{ color:DIM, fontSize:11, margin:"4px 0 0", fontStyle:"italic" }}>{sub}</p>}
  </div>
);
const Th = ({ children }) => (
  <th style={{ color:DIM, fontSize:10, fontFamily:"Montserrat,sans-serif", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", textAlign:"left", padding:"9px 12px", borderBottom:`1px solid ${BORDER}`, whiteSpace:"nowrap" }}>{children}</th>
);
const Td = ({ children, style={} }) => (
  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${BORDER}`, ...style }}>{children}</td>
);
const Tag = ({ children, color=Y, bg }) => (
  <span style={{ background:bg||`${color}18`, color, border:`1px solid ${color}35`, borderRadius:20, padding:"3px 9px", fontSize:10, fontFamily:"Montserrat,sans-serif", fontWeight:700, letterSpacing:0.4, textTransform:"uppercase" }}>{children}</span>
);
const StatusTag = ({ status }) => {
  const m = { "Active":[ORANGE,"#ff950018"], "Pending Release":[GREEN,"#39ff7818"], "In Dispute":[RED,"#ff4d4d18"], "Released":[DIM2,"#66666618"] };
  const [color,bg] = m[status]||[DIM2,"transparent"];
  return <Tag color={color} bg={bg}>{status}</Tag>;
};
const MiniBar = ({ value, max, color=Y }) => (
  <div style={{ background:"#1a1a1a", borderRadius:3, height:5, marginTop:5 }}>
    <div style={{ height:"100%", width:`${Math.min((value/max)*100,100)}%`, background:color, borderRadius:3 }}/>
  </div>
);
const StatCard = ({ icon:Icon, label, value, change, up, sub, accent=Y }) => (
  <Box>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <p style={{ color:DIM, fontSize:10, fontFamily:"Montserrat,sans-serif", fontWeight:700, letterSpacing:1, textTransform:"uppercase", margin:"0 0 8px" }}>{label}</p>
        <p style={{ color:WHITE, fontSize:24, fontFamily:"Montserrat,sans-serif", fontWeight:800, margin:0 }}>{value}</p>
        {sub&&<p style={{ color:DIM, fontSize:11, marginTop:4, fontStyle:"italic" }}>{sub}</p>}
      </div>
      <div style={{ background:`${accent}15`, borderRadius:10, padding:9, border:`1px solid ${accent}30` }}>
        <Icon size={16} color={accent}/>
      </div>
    </div>
    <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:6 }}>
      <PctBadge n={change} up={up}/>
      <span style={{ color:DIM, fontSize:10 }}>vs last month</span>
    </div>
  </Box>
);

// ── Sidebar config ────────────────────────────────────────
const NAV = [
  { section:"Platform Analytics" },
  { icon:LayoutDashboard, label:"Overview",        id:"overview"   },
  { icon:TrendingUp,      label:"Profits",          id:"profits"    },
  { icon:Users,           label:"Users",            id:"users"      },
  { icon:ShoppingBag,     label:"Orders",           id:"orders"     },
  { icon:Globe,           label:"Demographics",     id:"demographics"},
  { icon:Zap,             label:"Boost & Ads",      id:"boost"      },
  { icon:AlertTriangle,   label:"Disputes",         id:"disputes"   },
  { icon:Shield,          label:"KYC & Trust",      id:"trust"      },
  { icon:Cpu,             label:"AI Features",      id:"ai"         },
  { section:"Financial Intelligence" },
  { icon:DollarSign,      label:"Financial Overview",id:"fin_overview"},
  { icon:Package,         label:"Listing Revenue",  id:"listings"   },
  { icon:Wallet,          label:"Creator Wallets",  id:"creator_w"  },
  { icon:Users2,          label:"Client Wallets",   id:"client_w"   },
  { icon:Lock,            label:"Escrow Vault",     id:"escrow"     },
];

// ═════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [active, setActive]       = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded]   = useState(null);

  const navItemStyle = (id) => ({
    display:"flex", alignItems:"center", gap:10,
    padding:"9px 12px", borderRadius:8, cursor:"pointer", marginBottom:2,
    background: active===id ? "#1a1a1a" : "transparent",
    border: active===id ? `1px solid ${BORDER}` : "1px solid transparent",
    color: active===id ? Y : DIM,
    fontFamily:"Montserrat,sans-serif", fontWeight:600, fontSize:12,
    borderLeft: active===id ? `3px solid ${Y}` : "3px solid transparent",
    transition:"all 0.15s",
  });

  return (
    <div style={{ display:"flex", height:"100vh", background:BG, overflow:"hidden", fontFamily:"Montserrat,sans-serif" }}>

      {/* ── Sidebar ── */}
      <div style={{ width:collapsed?56:220, background:"#060606", borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column", transition:"width 0.2s", flexShrink:0, overflow:"hidden" }}>
        {/* Logo */}
        <div style={{ padding:"18px 12px", borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>setCollapsed(!collapsed)}>
          <div style={{ width:32, height:32, background:Y, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Zap size={16} color={BG}/>
          </div>
          {!collapsed&&(
            <div>
              <p style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:13, margin:0 }}>Ultra Hustle</p>
              <p style={{ color:DIM, fontSize:10, margin:0 }}>Admin Console</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", padding:"12px 8px" }}>
          {NAV.map((item, idx) => {
            if (item.section) {
              return !collapsed ? (
                <p key={idx} style={{ color:DIM, fontSize:9, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", margin:"16px 0 6px 12px" }}>{item.section}</p>
              ) : (
                <div key={idx} style={{ height:1, background:BORDER, margin:"12px 4px" }}/>
              );
            }
            const Icon = item.icon;
            return (
              <div key={item.id} style={navItemStyle(item.id)} onClick={()=>setActive(item.id)}>
                <Icon size={15} style={{ flexShrink:0 }}/>
                {!collapsed&&<span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {/* Settings */}
        <div style={{ padding:"10px 8px", borderTop:`1px solid ${BORDER}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, cursor:"pointer", color:DIM }}>
            <Settings size={15} style={{ flexShrink:0 }}/>
            {!collapsed&&<span style={{ fontSize:12, fontWeight:600 }}>Settings</span>}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ height:58, background:"#060606", borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#111", border:`1px solid ${BORDER}`, borderRadius:8, padding:"7px 14px", width:260 }}>
            <Search size={13} color={DIM}/>
            <input placeholder="Search users, orders, listings…" style={{ background:"transparent", border:"none", outline:"none", color:WHITE, fontFamily:"Montserrat,sans-serif", fontSize:12, width:"100%" }}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ background:"#111", border:`1px solid ${BORDER}`, borderRadius:8, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>
              <RefreshCcw size={12} color={DIM}/>
              <span style={{ color:DIM2, fontSize:11, fontWeight:600 }}>Live</span>
              <div style={{ width:6, height:6, borderRadius:"50%", background:GREEN, boxShadow:`0 0 5px ${GREEN}` }}/>
            </div>
            <div style={{ position:"relative" }}>
              <Bell size={17} color={DIM} style={{ cursor:"pointer" }}/>
              <div style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:Y, borderRadius:"50%" }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#111", border:`1px solid ${BORDER}`, borderRadius:8, padding:"5px 12px", cursor:"pointer" }}>
              <div style={{ width:25, height:25, background:Y, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:BG, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:11 }}>M</span>
              </div>
              <span style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:700, fontSize:12 }}>Manav</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>

          {/* ════════════════ OVERVIEW ════════════════ */}
          {active==="overview"&&(
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                <div>
                  <h1 style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:20, margin:0 }}>Platform Overview</h1>
                  <p style={{ color:DIM, fontSize:12, margin:"4px 0 0" }}>April 2026 · Live Data</p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:18 }}>
                <StatCard icon={TrendingUp} label="Total GMV"     value="₹34.2L" change="29.1" up sub="This month"                  />
                <StatCard icon={DollarSign} label="Net Profit"    value="₹1.64L" change="18.7" up sub="After fees & ops"            />
                <StatCard icon={Users}      label="Total Users"   value="8,240"  change="26.8" up sub="4,280 creators · 3,960 clients"/>
                <StatCard icon={ShoppingBag}label="Active Orders" value="1,847"  change="4.2" up={false} sub="This week"            />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={Star}         label="Avg Rating"    value="4.78"  change="0.3"  up />
                <StatCard icon={Package}      label="Total Listings" value="3,612" change="14.2" up />
                <StatCard icon={AlertTriangle}label="Open Disputes" value="23"    change="8.0"  up accent={ORANGE}/>
                <StatCard icon={Zap}          label="Active Boosts" value="184"   change="41.6" up />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
                <Box>
                  <SH title="Revenue & Profit Trend" sub="Last 6 months"/>
                  <ResponsiveContainer width="100%" height={210}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="gGMV"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={Y}     stopOpacity={0.15}/><stop offset="95%" stopColor={Y}     stopOpacity={0}/></linearGradient>
                        <linearGradient id="gRev"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={WHITE} stopOpacity={0.07}/><stop offset="95%" stopColor={WHITE} stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                      <XAxis dataKey="month" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                      <Tooltip content={<Tooltip_/>}/>
                      <Area type="monotone" dataKey="gmv"     name="GMV"     stroke={Y}     strokeWidth={2} fill="url(#gGMV)" dot={false}/>
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke={WHITE} strokeWidth={2} fill="url(#gRev)" dot={false}/>
                      <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#888" strokeWidth={2} fill="none"        dot={false}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  <SH title="User Split" sub="Creators vs Clients"/>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={[{name:"Creators",value:4280},{name:"Clients",value:3960}]} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                        <Cell fill={Y}/><Cell fill="#333"/>
                      </Pie>
                      <Tooltip content={<Tooltip_/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
                    {[["Creators","4,280",Y],["Clients","3,960","#888"]].map(([l,v,c])=>(
                      <div key={l} style={{ textAlign:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"center" }}>
                          <div style={{ width:7, height:7, borderRadius:2, background:c }}/>
                          <span style={{ color:DIM, fontSize:10, fontWeight:600 }}>{l}</span>
                        </div>
                        <p style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:17, margin:"4px 0 0" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </Box>
              </div>
              <Box>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <SH title="Top Creators by GMV"/>
                  <span style={{ color:Y, fontSize:12, fontWeight:700, cursor:"pointer" }}>View All →</span>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>{["Creator","Category","GMV","Rating","Orders","Level"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {topCreators.map((c,i)=>(
                      <tr key={i}>
                        <Td>
                          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                            <div style={{ width:28, height:28, background:i===0?Y:"#1f1f1f", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <span style={{ color:i===0?BG:WHITE, fontWeight:800, fontSize:11 }}>{c.name[0]}</span>
                            </div>
                            <span style={{ color:WHITE, fontWeight:700, fontSize:13 }}>{c.name}</span>
                          </div>
                        </Td>
                        <Td><span style={{ color:DIM2, fontSize:12 }}>{c.category}</span></Td>
                        <Td><span style={{ color:Y, fontWeight:700 }}>{c.gmv}</span></Td>
                        <Td><span style={{ color:WHITE, fontSize:13 }}>⭐ {c.rating}</span></Td>
                        <Td><span style={{ color:WHITE, fontSize:13 }}>{c.orders}</span></Td>
                        <Td><Tag color={c.level==="Elite"?Y:c.level==="Pro"?GREEN:DIM2}>{c.level}</Tag></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </div>
          )}

          {/* ════════════════ PROFITS ════════════════ */}
          {active==="profits"&&(
            <div>
              <SH title="Profit Analytics" sub="GMV · Revenue · Fees · Net"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={TrendingUp} label="This Month GMV"    value="₹34.2L" change="29.1" up sub="Gross merchandise value"/>
                <StatCard icon={DollarSign} label="Platform Revenue"  value="₹2.74L" change="22.4" up sub="8% commission avg"/>
                <StatCard icon={DollarSign} label="Net Profit"        value="₹1.64L" change="18.7" up sub="After ops & infra"/>
                <StatCard icon={Zap}        label="Boost Revenue"     value="₹21,400" change="41.6" up sub="Ad spend collected"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"3fr 1fr", gap:16, marginBottom:16 }}>
                <Box>
                  <SH title="Monthly Profit Breakdown"/>
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={revenueData} barGap={6}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                      <XAxis dataKey="month" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                      <Tooltip content={<Tooltip_/>}/>
                      <Bar dataKey="revenue" name="Revenue"    fill={Y}    radius={[4,4,0,0]}/>
                      <Bar dataKey="profit"  name="Net Profit" fill="#333" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Box style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <SH title="Fee Structure"/>
                  {[["Freelance Services","10%",Y],["Digital Products","8%","#aaa"],["Courses","7%","#666"],["Webinars","6%","#444"],["Teams","12%","#888"],["Boost Ads","100%","#333"]].map(([l,v,c])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${BORDER}` }}>
                      <span style={{ color:DIM2, fontSize:12 }}>{l}</span>
                      <span style={{ color:c, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:14 }}>{v}</span>
                    </div>
                  ))}
                </Box>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                {[["Escrow Held","₹8.4L","Pending release",TrendingUp],["Refunds Issued","₹14,200","This month",AlertTriangle],["Payout Queue","₹6.1L","Pending creator payouts",DollarSign]].map(([l,v,s,Icon])=>(
                  <Box key={l}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9 }}><Icon size={15} color={Y}/><span style={{ color:DIM, fontSize:10, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase" }}>{l}</span></div>
                    <p style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:22, margin:0 }}>{v}</p>
                    <p style={{ color:DIM, fontSize:11, margin:"5px 0 0" }}>{s}</p>
                  </Box>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════ USERS ════════════════ */}
          {active==="users"&&(
            <div>
              <SH title="User Analytics" sub="Growth · Retention · Activity"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={Users}          label="Total Users"      value="8,240"  change="26.8" up sub="Registered accounts"/>
                <StatCard icon={Users2}         label="New This Month"   value="1,740"  change="34.1" up sub="Creators + Clients"/>
                <StatCard icon={ArrowUpRight}   label="Monthly Active"   value="5,980"  change="12.4" up sub="72.6% MAU rate"/>
                <StatCard icon={ArrowDownLeft}  label="Churn Rate"       value="3.2%"   change="0.8"  up sub="Down from 4.0%" accent={GREEN}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16 }}>
                <Box>
                  <SH title="User Growth" sub="Creators vs Clients"/>
                  <ResponsiveContainer width="100%" height={210}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                      <XAxis dataKey="month" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <Tooltip content={<Tooltip_/>}/>
                      <Line type="monotone" dataKey="creators" name="Creators" stroke={Y}     strokeWidth={2.5} dot={false}/>
                      <Line type="monotone" dataKey="clients"  name="Clients"  stroke={WHITE} strokeWidth={2.5} dot={false}/>
                      <Line type="monotone" dataKey="total"    name="Total"    stroke="#555"  strokeWidth={1.5} strokeDasharray="4 4" dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  <SH title="Creator Levels" sub="XP distribution"/>
                  <div style={{ display:"flex", flexDirection:"column", gap:11, marginTop:6 }}>
                    {[["Elite",142,3.3],["Pro",820,19.2],["Rising",1640,38.3],["Starter",1678,39.2]].map(([l,n,p])=>(
                      <div key={l}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ color:WHITE, fontSize:12, fontWeight:600 }}>{l}</span>
                          <span style={{ color:DIM, fontSize:11 }}>{n} ({p}%)</span>
                        </div>
                        <div style={{ background:"#1a1a1a", borderRadius:4, height:5 }}>
                          <div style={{ height:"100%", width:`${p}%`, background:l==="Elite"?Y:l==="Pro"?GREEN:l==="Rising"?"#555":"#333", borderRadius:4 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>
              </div>
            </div>
          )}

          {/* ════════════════ ORDERS ════════════════ */}
          {active==="orders"&&(
            <div>
              <SH title="Order Analytics" sub="Services · Products · Courses · Webinars · Teams"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={ShoppingBag}  label="Total Orders"     value="12,840" change="22.1" up sub="All time"/>
                <StatCard icon={Package}      label="Completion Rate"  value="96.2%"  change="1.1"  up sub="Delivered on time"/>
                <StatCard icon={Star}         label="Avg Delivery"     value="2.4d"   change="12.3" up sub="Down from 2.8d" accent={GREEN}/>
                <StatCard icon={AlertTriangle}label="Dispute Rate"     value="1.8%"   change="0.4"  up sub="Industry avg 3.1%" accent={GREEN}/>
              </div>
              <Box style={{ marginBottom:16 }}>
                <SH title="Orders by Type (This Week)"/>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={orderData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                    <XAxis dataKey="day" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<Tooltip_/>}/>
                    <Bar dataKey="services" name="Services" fill={Y}      radius={[4,4,0,0]}/>
                    <Bar dataKey="products" name="Products" fill="#555"   radius={[4,4,0,0]}/>
                    <Bar dataKey="courses"  name="Courses"  fill="#333"   radius={[4,4,0,0]}/>
                    <Bar dataKey="webinars" name="Webinars" fill="#1f1f1f" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
                {[["Freelance Services","7,840","61%",ShoppingBag],["Digital Products","2,980","23.2%",Package],["Courses","1,420","11.1%",BookOpen],["Webinars","600","4.7%",Video],["Teams","220","1.7%",Users2]].map(([l,v,p,Icon])=>(
                  <Box key={l}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <p style={{ color:DIM, fontSize:10, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", margin:"0 0 6px" }}>{l}</p>
                      <Icon size={14} color={Y}/>
                    </div>
                    <p style={{ color:WHITE, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:20, margin:0 }}>{v}</p>
                    <p style={{ color:Y, fontWeight:700, fontSize:12, margin:"8px 0 0" }}>{p}</p>
                  </Box>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════ DEMOGRAPHICS ════════════════ */}
          {active==="demographics"&&(
            <div>
              <SH title="User Demographics" sub="Geography · Age · Device"/>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <Box>
                  <SH title="Geographic Distribution"/>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {locationData.map(l=>(
                      <div key={l.name}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ color:WHITE, fontSize:13, fontWeight:600 }}>{l.name}</span>
                          <span style={{ color:Y, fontWeight:700 }}>{l.value}%</span>
                        </div>
                        <div style={{ background:"#1a1a1a", borderRadius:4, height:5 }}>
                          <div style={{ height:"100%", width:`${l.value}%`, background:l.value>20?Y:l.value>10?"#aaa":"#555", borderRadius:4 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>
                <Box>
                  <SH title="Age Distribution" sub="Creators vs Clients (%)"/>
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={ageData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                      <XAxis dataKey="range" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} unit="%"/>
                      <Tooltip content={<Tooltip_/>}/>
                      <Bar dataKey="creators" name="Creators" fill={Y}    radius={[4,4,0,0]}/>
                      <Bar dataKey="clients"  name="Clients"  fill="#444" radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16 }}>
                <Box>
                  <SH title="Device Type"/>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                        {deviceData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                      </Pie>
                      <Tooltip content={<Tooltip_/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:"flex", flexDirection:"column", gap:7, marginTop:4 }}>
                    {deviceData.map(d=>(
                      <div key={d.name} style={{ display:"flex", justifyContent:"space-between" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:7, height:7, borderRadius:2, background:d.color }}/>
                          <span style={{ color:DIM2, fontSize:12 }}>{d.name}</span>
                        </div>
                        <span style={{ color:WHITE, fontWeight:700, fontSize:12 }}>{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </Box>
                <Box>
                  <SH title="India City Breakdown" sub="Tier 1 & Tier 2"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                    {[["Mumbai",18.4],["Bangalore",16.2],["Delhi",13.8],["Chennai",11.6],["Hyderabad",9.4],["Pune",7.8],["Ahmedabad",5.6],["Kolkata",4.8],["Jaipur",3.9],["Others",8.5]].map(([city,p])=>(
                      <div key={city} style={{ background:"#1a1a1a", borderRadius:8, padding:"10px 14px", border:`1px solid ${BORDER}` }}>
                        <p style={{ color:DIM, fontSize:10, fontWeight:600, margin:"0 0 3px" }}>{city}</p>
                        <p style={{ color:Y, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:15, margin:0 }}>{p}%</p>
                      </div>
                    ))}
                  </div>
                </Box>
              </div>
            </div>
          )}

          {/* ════════════════ BOOST ════════════════ */}
          {active==="boost"&&(
            <div>
              <SH title="Boost & Ads Analytics" sub="CPM · CPC · CPA · ROAS"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={Zap}        label="Active Boosts"  value="184"    change="41.6" up sub="Live campaigns"/>
                <StatCard icon={DollarSign} label="Total Ad Spend" value="₹2.1L"  change="38.4" up sub="This month"/>
                <StatCard icon={TrendingUp} label="Avg ROAS"       value="4.2x"   change="12.8" up sub="Return on ad spend" accent={GREEN}/>
                <StatCard icon={Star}       label="Avg CTR"        value="3.8%"   change="0.6"  up sub="Click-through rate"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
                {[["Avg CPM","₹142","Cost per 1000 impressions"],["Avg CPC","₹3.74","Cost per click"],["Avg CPA","₹840","Cost per acquisition"],["Boost Conversions","2,490","Orders from boosted listings"]].map(([l,v,s])=>(
                  <Box key={l}>
                    <p style={{ color:DIM, fontSize:10, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", margin:"0 0 8px" }}>{l}</p>
                    <p style={{ color:Y, fontFamily:"Montserrat,sans-serif", fontWeight:800, fontSize:26, margin:0 }}>{v}</p>
                    <p style={{ color:DIM, fontSize:11, margin:"6px 0 0" }}>{s}</p>
                  </Box>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════ DISPUTES ════════════════ */}
          {active==="disputes"&&(
            <div>
              <SH title="Dispute Management" sub="Open · Resolved · Escalated"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={AlertTriangle} label="Open Disputes"   value="23"  change="8.0"  up accent={GREEN} sub="Needs action"/>
                <StatCard icon={Shield}        label="Resolved (30d)"  value="184" change="14.2" up sub="94.4% resolution rate"/>
                <StatCard icon={AlertTriangle} label="Escalated"       value="4"   change="33.3" up accent={RED}   sub="Admin review"/>
                <StatCard icon={DollarSign}    label="Disputed Value"  value="₹3.8L" change="12.1" up accent={GREEN} sub="Under review"/>
              </div>
              <Box>
                <SH title="Recent Disputes"/>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>{["ID","Buyer","Seller","Amount","Status","Age","Action"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {recentDisputes.map((d,i)=>(
                      <tr key={i}>
                        <Td><span style={{ color:Y, fontWeight:700, fontSize:12 }}>{d.id}</span></Td>
                        <Td><span style={{ color:WHITE, fontSize:13 }}>{d.buyer}</span></Td>
                        <Td><span style={{ color:WHITE, fontSize:13 }}>{d.seller}</span></Td>
                        <Td><span style={{ color:WHITE, fontWeight:700 }}>{d.amount}</span></Td>
                        <Td>
                          <Tag color={d.status==="Open"?ORANGE:d.status==="Escalated"?RED:GREEN}
                               bg={d.status==="Open"?"#1a0a00":d.status==="Escalated"?"#1a0000":"#0a1a00"}>
                            {d.status}
                          </Tag>
                        </Td>
                        <Td><span style={{ color:DIM2, fontSize:12 }}>{d.age}</span></Td>
                        <Td><button style={{ background:"transparent", border:`1px solid ${Y}`, color:Y, borderRadius:6, padding:"4px 10px", fontSize:10, fontFamily:"Montserrat,sans-serif", fontWeight:700, cursor:"pointer" }}>Review</button></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </div>
          )}

          {/* ════════════════ TRUST ════════════════ */}
          {active==="trust"&&(
            <div>
              <SH title="KYC & Trust System" sub="Verification · XP · Karma · Pro Badges"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={Shield}        label="KYC Verified"    value="3,840" change="18.4" up sub="Creators verified"/>
                <StatCard icon={Shield}        label="Pending KYC"     value="440"   change="12.1" up accent={ORANGE} sub="Awaiting review"/>
                <StatCard icon={Star}          label="Pro Badges"      value="820"   change="24.6" up sub="Earned this month"/>
                <StatCard icon={AlertTriangle} label="Flagged Accounts" value="14"   change="30.0" up accent={GREEN} sub="Under review"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Box>
                  <SH title="KYC Status"/>
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie data={[{name:"Verified",value:3840},{name:"Pending",value:440},{name:"Flagged",value:14}]} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                        <Cell fill={Y}/><Cell fill="#555"/><Cell fill={RED}/>
                      </Pie>
                      <Tooltip content={<Tooltip_/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  <SH title="XP Leaderboard" sub="Top 5 this month"/>
                  <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                    {[["Arjun Mehta",9840,4.92],["Priya Sharma",9210,4.88],["Rohan Das",8640,4.75],["Sneha Iyer",8100,4.91],["Karan Patel",7820,4.65]].map(([name,xp,karma],i)=>(
                      <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${BORDER}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ color:i===0?Y:DIM, fontWeight:800, fontSize:12, width:18 }}>#{i+1}</span>
                          <span style={{ color:WHITE, fontWeight:600, fontSize:13 }}>{name}</span>
                        </div>
                        <div style={{ display:"flex", gap:14 }}>
                          <span style={{ color:Y, fontWeight:700, fontSize:12 }}>{xp.toLocaleString()} XP</span>
                          <span style={{ color:DIM2, fontSize:12 }}>⭐ {karma}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>
              </div>
            </div>
          )}

          {/* ════════════════ AI FEATURES ════════════════ */}
          {active==="ai"&&(
            <div>
              <SH title="AI Feature Usage" sub="Gig Matcher · Brief Gen · Profile Builder · Insights"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                <StatCard icon={Cpu}     label="AI Actions (30d)"   value="48,420" change="62.4" up sub="Total feature uses"/>
                <StatCard icon={Zap}     label="Gig Matches Made"   value="12,840" change="44.1" up sub="AI-powered matches"/>
                <StatCard icon={Package} label="Briefs Generated"   value="8,610"  change="38.6" up sub="By clients"/>
                <StatCard icon={Users}   label="Profiles Optimized" value="2,340"  change="27.8" up sub="AI Profile Builder"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Box>
                  <SH title="Feature Usage"/>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={[{feature:"Gig Matcher",uses:12840},{feature:"Brief Gen",uses:8610},{feature:"Profile Builder",uses:2340},{feature:"Listing Assist",uses:3980},{feature:"AI Insights",uses:6840},{feature:"Content Scanner",uses:13810}]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false}/>
                      <XAxis type="number" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis dataKey="feature" type="category" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} width={110}/>
                      <Tooltip content={<Tooltip_/>}/>
                      <Bar dataKey="uses" name="Uses" fill={Y} radius={[0,4,4,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  <SH title="AI-Attributed Revenue"/>
                  <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                    {[["Gig Matcher → Order","₹12.4L",36.3],["Brief Gen → Hire","₹8.1L",23.7],["Profile Builder → Click","₹4.2L",12.3],["AI Insights Used","₹5.8L",17.0],["Other AI Touch","₹3.7L",10.7]].map(([l,v,p])=>(
                      <div key={l}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ color:WHITE, fontSize:12 }}>{l}</span>
                          <span style={{ color:Y, fontWeight:700, fontSize:12 }}>{v}</span>
                        </div>
                        <div style={{ background:"#1a1a1a", borderRadius:4, height:5 }}>
                          <div style={{ height:"100%", width:`${p}%`, background:Y, borderRadius:4 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>
              </div>
            </div>
          )}

          {/* ════════════════ FINANCIAL OVERVIEW ════════════════ */}
          {active==="fin_overview"&&(
            <div>
              <SH title="Financial Overview" sub="GOV · Platform Fees · Creator Payouts · Wallet & Escrow Summary"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
                <StatCard icon={TrendingUp} label="Gross Order Value"   value={inr(totalGOV)}    change="29.1" up sub="All listing types" accent={WHITE}/>
                <StatCard icon={DollarSign} label="Platform Fees"       value={inr(totalFees)}   change="22.4" up sub={`Blended ${((totalFees/totalGOV)*100).toFixed(1)}% rate`}/>
                <StatCard icon={Wallet}     label="Creator Payouts Due" value={inr(totalPayout)} change="31.8" up sub="Net after fee" accent={GREEN}/>
                <StatCard icon={Lock}       label="Total Escrow Held"   value={inr(totalEscrow)} change="18.3" up sub="Active contracts" accent={ORANGE}/>
              </div>

              {/* Money Flow */}
              <Box style={{ marginBottom:20 }}>
                <SH title="Platform Money Flow" sub="How value moves through Ultra Hustle"/>
                <div style={{ display:"flex", alignItems:"center", gap:0, overflowX:"auto", padding:"10px 0" }}>
                  {[
                    { label:"Client Pays", value:inr(totalGOV),    sub:"Gross Order Value",  icon:Users2, color:WHITE  },
                    { arrow:true, color:Y },
                    { label:"Escrow Holds", value:inr(totalEscrow), sub:"Active contracts",  icon:Lock,   color:Y,     dark:true },
                    { arrow:true, color:Y },
                    { label:"Platform Fee", value:inr(totalFees),   sub:"Revenue retained",  icon:Zap,    color:Y      },
                    { arrow:true, color:GREEN },
                    { label:"Creator Gets", value:inr(totalPayout), sub:"Net payout pool",   icon:Wallet, color:GREEN, dark:true },
                  ].map((item, i) => {
                    if (item.arrow) return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", minWidth:60 }}>
                        <div style={{ height:1, width:"100%", background:`linear-gradient(90deg, ${BORDER}, ${item.color}, ${BORDER})` }}/>
                        <ArrowRight size={13} color={item.color} style={{ marginTop:-7 }}/>
                      </div>
                    );
                    const Icon = item.icon;
                    return (
                      <div key={i} style={{ textAlign:"center", minWidth:148 }}>
                        <div style={{ background:item.dark?`${item.color}12`:"#111", border:`1px solid ${item.color === WHITE ? BORDER : item.color+"30"}`, borderRadius:12, padding:"16px 18px" }}>
                          <div style={{ width:40, height:40, background:`${item.color}18`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 9px", border:`1px solid ${item.color}30` }}>
                            <Icon size={18} color={item.color}/>
                          </div>
                          <p style={{ color:DIM2, fontSize:10, letterSpacing:0.8, textTransform:"uppercase", fontWeight:700, margin:"0 0 5px" }}>{item.label}</p>
                          <p style={{ color:item.color, fontSize:19, fontWeight:800, margin:0 }}>{item.value}</p>
                          <p style={{ color:DIM, fontSize:10, margin:"3px 0 0" }}>{item.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Box>

              <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16, marginBottom:20 }}>
                <Box>
                  <SH title="Escrow Flow — Locked vs Released"/>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={escrowFlow}>
                      <defs>
                        <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={Y}     stopOpacity={0.12}/><stop offset="95%" stopColor={Y}     stopOpacity={0}/></linearGradient>
                        <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={GREEN} stopOpacity={0.1}/><stop offset="95%"  stopColor={GREEN} stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                      <XAxis dataKey="month" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>inr(v)}/>
                      <Tooltip content={<Tooltip_/>}/>
                      <Area type="monotone" dataKey="locked"   name="Locked"   stroke={Y}     strokeWidth={2}   fill="url(#gL)" dot={false}/>
                      <Area type="monotone" dataKey="released" name="Released" stroke={GREEN} strokeWidth={2}   fill="url(#gR)" dot={false}/>
                      <Area type="monotone" dataKey="disputed" name="Disputed" stroke={RED}   strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={false}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Box>
                  <SH title="GOV by Listing Type"/>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={LISTING_TYPES.map(l=>({ name:l.label, value:l.orders*l.avgOrder }))} cx="50%" cy="50%" innerRadius={56} outerRadius={80} paddingAngle={3} dataKey="value">
                        {LISTING_TYPES.map((l,i)=><Cell key={i} fill={l.color}/>)}
                      </Pie>
                      <Tooltip content={<Tooltip_/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"5px 14px", justifyContent:"center", marginTop:8 }}>
                    {LISTING_TYPES.map(l=>(
                      <div key={l.id} style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <div style={{ width:6, height:6, borderRadius:2, background:l.color, border:l.color==="#333333"?`1px solid ${BORDER}`:"none" }}/>
                        <span style={{ color:DIM, fontSize:9, fontWeight:600 }}>{l.label.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </Box>
              </div>

              {/* Wallet strips */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
                <Box>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
                    <Wallet size={14} color={GREEN}/>
                    <p style={{ color:WHITE, fontWeight:800, fontSize:13, margin:0 }}>Creator Wallets</p>
                  </div>
                  {[["Available",inr(cwAvailable),GREEN],["Pending",inr(cwPending),ORANGE],["On Hold",inr(cwOnHold),Y],["Withdrawn MTD",inr(cwWithdrawn),DIM2]].map(([l,v,c])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${BORDER}` }}>
                      <span style={{ color:DIM2, fontSize:12 }}>{l}</span>
                      <span style={{ color:c, fontWeight:700, fontSize:13 }}>{v}</span>
                    </div>
                  ))}
                </Box>
                <Box>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
                    <Wallet size={14} color={WHITE}/>
                    <p style={{ color:WHITE, fontWeight:800, fontSize:13, margin:0 }}>Client Wallets</p>
                  </div>
                  {[["Total Loaded",inr(clLoaded),WHITE],["Spent",inr(clSpent),DIM2],["Available",inr(clAvailable),Y],["In Escrow",inr(clEscrow),ORANGE],["Refund Pending",inr(clRefund),RED]].map(([l,v,c])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${BORDER}` }}>
                      <span style={{ color:DIM2, fontSize:12 }}>{l}</span>
                      <span style={{ color:c, fontWeight:700, fontSize:13 }}>{v}</span>
                    </div>
                  ))}
                </Box>
                <Box>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
                    <Lock size={14} color={Y}/>
                    <p style={{ color:WHITE, fontWeight:800, fontSize:13, margin:0 }}>Escrow Vault</p>
                  </div>
                  {[["Active (Delivery)",inr(6480000),ORANGE],["Pending Release",inr(3180000),GREEN],["In Dispute",inr(620000),RED],["Auto-Release Queue",inr(1580000),DIM2],["Total Held",inr(totalEscrow),Y]].map(([l,v,c])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${BORDER}` }}>
                      <span style={{ color:DIM2, fontSize:12 }}>{l}</span>
                      <span style={{ color:c, fontWeight:700, fontSize:13 }}>{v}</span>
                    </div>
                  ))}
                </Box>
              </div>
            </div>
          )}

          {/* ════════════════ LISTING REVENUE ════════════════ */}
          {active==="listings"&&(
            <div>
              <SH title="Listing Revenue Breakdown" sub="GOV · Platform Fee · Creator Payout · per listing type"/>
              <Box style={{ marginBottom:18 }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0 }}>
                  {[["Total GOV",inr(totalGOV),WHITE],["Total Orders","13,060",WHITE],[`Blended Fee`,`${((totalFees/totalGOV)*100).toFixed(2)}%`,Y],["Total Fees",inr(totalFees),Y],["Creator Payout",inr(totalPayout),GREEN]].map(([l,v,c],i)=>(
                    <div key={l} style={{ padding:"0 18px", borderRight:i<4?`1px solid ${BORDER}`:"none" }}>
                      <p style={{ color:DIM, fontSize:10, letterSpacing:0.8, textTransform:"uppercase", fontWeight:700, margin:"0 0 7px" }}>{l}</p>
                      <p style={{ color:c, fontSize:20, fontWeight:800, margin:0 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </Box>

              {LISTING_TYPES.map(lt=>{
                const gov    = lt.orders * lt.avgOrder;
                const fee    = gov * lt.feeRate;
                const payout = gov - fee;
                const isOpen = expanded===lt.id;
                const Icon   = lt.icon;
                return (
                  <Box key={lt.id} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }} onClick={()=>setExpanded(isOpen?null:lt.id)}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:40, height:40, background:`${lt.color}18`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${lt.color}30`, flexShrink:0 }}>
                          <Icon size={17} color={lt.color}/>
                        </div>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                            <h3 style={{ color:WHITE, fontWeight:800, fontSize:14, margin:0 }}>{lt.label}</h3>
                            <Tag color={lt.color}>{(lt.feeRate*100).toFixed(0)}% fee</Tag>
                          </div>
                          <p style={{ color:DIM, fontSize:11, margin:"3px 0 0", fontStyle:"italic" }}>{lt.description}</p>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:28 }}>
                        {[["GOV",inr(gov),WHITE],["Platform Fee",inr(fee),Y],["Creator Payout",inr(payout),GREEN]].map(([l,v,c])=>(
                          <div key={l} style={{ textAlign:"right" }}>
                            <p style={{ color:DIM, fontSize:9, letterSpacing:0.7, textTransform:"uppercase", fontWeight:700, margin:"0 0 3px" }}>{l}</p>
                            <p style={{ color:c, fontSize:18, fontWeight:800, margin:0 }}>{v}</p>
                          </div>
                        ))}
                        <div style={{ color:isOpen?Y:DIM }}>{isOpen?<ChevronUp size={17}/>:<ChevronDown size={17}/>}</div>
                      </div>
                    </div>

                    {isOpen&&(
                      <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${BORDER}` }}>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12, marginBottom:18 }}>
                          {[["Total Orders",lt.orders.toLocaleString(),WHITE],["Avg Order Value",inr(lt.avgOrder),WHITE],["Fee Rate",`${(lt.feeRate*100).toFixed(0)}%`,Y],["Fee Amount",inr(fee),Y],["Creator Payout",inr(payout),GREEN],["In Escrow",inr(lt.escrow),ORANGE]].map(([l,v,c])=>(
                            <div key={l} style={{ background:"#080808", borderRadius:9, padding:"12px 14px", border:`1px solid ${BORDER}` }}>
                              <p style={{ color:DIM, fontSize:9, letterSpacing:0.8, textTransform:"uppercase", fontWeight:700, margin:"0 0 6px" }}>{l}</p>
                              <p style={{ color:c, fontSize:17, fontWeight:800, margin:0 }}>{v}</p>
                            </div>
                          ))}
                        </div>
                        <p style={{ color:DIM, fontSize:10, letterSpacing:0.8, textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Revenue Split</p>
                        <div style={{ display:"flex", borderRadius:7, overflow:"hidden", height:26 }}>
                          <div style={{ width:`${lt.feeRate*100}%`, background:Y, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ color:BG, fontSize:10, fontWeight:800 }}>Platform {(lt.feeRate*100).toFixed(0)}%</span>
                          </div>
                          <div style={{ flex:1, background:"#1a2a0a", border:`1px solid ${GREEN}25`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ color:GREEN, fontSize:10, fontWeight:800 }}>Creator {(100-lt.feeRate*100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                          <span style={{ color:DIM, fontSize:10 }}>{inr(fee)} → Platform</span>
                          <span style={{ color:DIM, fontSize:10 }}>{inr(payout)} → Creator Wallets</span>
                        </div>
                      </div>
                    )}
                  </Box>
                );
              })}

              <Box style={{ marginTop:18 }}>
                <SH title="GOV vs Fee vs Payout — All Types"/>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={LISTING_TYPES.map(l=>({ name:l.label.split(" ")[0], GOV:l.orders*l.avgOrder, Fee:l.orders*l.avgOrder*l.feeRate, Payout:l.orders*l.avgOrder*(1-l.feeRate) }))} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                    <XAxis dataKey="name" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>inr(v)}/>
                    <Tooltip content={<Tooltip_/>}/>
                    <Bar dataKey="GOV"    name="Gross Order Value" fill="#333"  radius={[4,4,0,0]}/>
                    <Bar dataKey="Fee"    name="Platform Fee"      fill={Y}     radius={[4,4,0,0]}/>
                    <Bar dataKey="Payout" name="Creator Payout"    fill={GREEN} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </div>
          )}

          {/* ════════════════ CREATOR WALLETS ════════════════ */}
          {active==="creator_w"&&(
            <div>
              <SH title="Creator Wallets" sub="Available · Pending · On Hold · Withdrawn"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
                <StatCard icon={ArrowUpRight}  label="Available to Withdraw" value={inr(cwAvailable)} change="14.2" up sub="Across all creators"    accent={GREEN}/>
                <StatCard icon={Clock}         label="Pending (In Delivery)" value={inr(cwPending)}   change="8.4"  up sub="Held until complete"    accent={ORANGE}/>
                <StatCard icon={Lock}          label="On Hold (Escrow)"      value={inr(cwOnHold)}    change="18.3" up sub="In active contracts"    accent={Y}/>
                <StatCard icon={ArrowDownLeft} label="Withdrawn MTD"         value={inr(cwWithdrawn)} change="22.1" up sub="Paid to bank/UPI"       accent={DIM2}/>
              </div>

              <Box style={{ marginBottom:16 }}>
                <SH title="Wallet State Distribution"/>
                {(()=>{
                  const total=cwAvailable+cwPending+cwOnHold;
                  return(
                    <div>
                      <div style={{ display:"flex", borderRadius:8, overflow:"hidden", height:32 }}>
                        {[[cwAvailable,GREEN,"Available"],[cwPending,ORANGE,"Pending"],[cwOnHold,Y,"On Hold"]].map(([v,c,l])=>(
                          <div key={l} style={{ width:`${(v/total)*100}%`, background:`${c}22`, borderRight:`2px solid ${BG}`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${c}30` }}>
                            <span style={{ color:c, fontSize:10, fontWeight:700 }}>{((v/total)*100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:18, marginTop:8 }}>
                        {[[GREEN,"Available",inr(cwAvailable)],[ORANGE,"Pending",inr(cwPending)],[Y,"On Hold",inr(cwOnHold)]].map(([c,l,v])=>(
                          <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:7, height:7, borderRadius:2, background:c }}/>
                            <span style={{ color:DIM2, fontSize:11 }}>{l}: <strong style={{ color:c }}>{v}</strong></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </Box>

              <Box style={{ marginBottom:16 }}>
                <SH title="Individual Creator Balances"/>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><Th>Creator</Th><Th>Level</Th><Th>Available</Th><Th>Pending</Th><Th>On Hold</Th><Th>Total</Th><Th>Withdrawn MTD</Th><Th>Liquidity</Th></tr></thead>
                    <tbody>
                      {CREATOR_WALLETS.map((w,i)=>{
                        const total=w.available+w.pending+w.onHold;
                        const liq=Math.round((w.available/total)*100);
                        return(
                          <tr key={i}>
                            <Td>
                              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                                <div style={{ width:28, height:28, background:i===0?Y:"#1a1a1a", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                  <span style={{ color:i===0?BG:WHITE, fontWeight:800, fontSize:11 }}>{w.name[0]}</span>
                                </div>
                                <span style={{ color:WHITE, fontWeight:700, fontSize:13 }}>{w.name}</span>
                              </div>
                            </Td>
                            <Td><Tag color={w.level==="Elite"?Y:w.level==="Pro"?GREEN:DIM2}>{w.level}</Tag></Td>
                            <Td><span style={{ color:GREEN, fontWeight:700 }}>{inr(w.available)}</span></Td>
                            <Td><span style={{ color:ORANGE, fontWeight:700 }}>{inr(w.pending)}</span></Td>
                            <Td><span style={{ color:Y, fontWeight:700 }}>{inr(w.onHold)}</span></Td>
                            <Td><span style={{ color:WHITE, fontWeight:800, fontSize:14 }}>{inr(total)}</span></Td>
                            <Td><span style={{ color:DIM2, fontWeight:600 }}>{inr(w.withdrawn)}</span></Td>
                            <Td>
                              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                                <span style={{ color:liq>50?GREEN:liq>30?ORANGE:RED, fontWeight:700, fontSize:12 }}>{liq}%</span>
                                <div style={{ width:52, background:"#1a1a1a", borderRadius:3, height:5 }}>
                                  <div style={{ width:`${liq}%`, height:"100%", background:liq>50?GREEN:liq>30?ORANGE:RED, borderRadius:3 }}/>
                                </div>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background:"#0d0d0d" }}>
                        <Td><span style={{ color:Y, fontWeight:800 }}>Platform Total</span></Td>
                        <Td></Td>
                        <Td><span style={{ color:GREEN, fontWeight:800, fontSize:13 }}>{inr(cwAvailable)}</span></Td>
                        <Td><span style={{ color:ORANGE, fontWeight:800, fontSize:13 }}>{inr(cwPending)}</span></Td>
                        <Td><span style={{ color:Y, fontWeight:800, fontSize:13 }}>{inr(cwOnHold)}</span></Td>
                        <Td><span style={{ color:WHITE, fontWeight:800, fontSize:14 }}>{inr(cwAvailable+cwPending+cwOnHold)}</span></Td>
                        <Td><span style={{ color:DIM2, fontWeight:800, fontSize:13 }}>{inr(cwWithdrawn)}</span></Td>
                        <Td></Td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Box>

              <Box>
                <SH title="Weekly Payout Volume"/>
                <ResponsiveContainer width="100%" height={170}>
                  <AreaChart data={payoutTrend}>
                    <defs>
                      <linearGradient id="gPay" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={GREEN} stopOpacity={0.15}/><stop offset="95%" stopColor={GREEN} stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                    <XAxis dataKey="week" tick={{ fill:DIM, fontSize:9 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>inr(v)}/>
                    <Tooltip content={<Tooltip_/>}/>
                    <Area type="monotone" dataKey="payouts" name="Payouts" stroke={GREEN} strokeWidth={2} fill="url(#gPay)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </div>
          )}

          {/* ════════════════ CLIENT WALLETS ════════════════ */}
          {active==="client_w"&&(
            <div>
              <SH title="Client Wallets" sub="Loaded · Spent · Available · Escrow · Refunds"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:20 }}>
                <StatCard icon={ArrowDownLeft} label="Total Loaded"   value={inr(clLoaded)}    change="18.4" up accent={WHITE}/>
                <StatCard icon={ShoppingBag}   label="Total Spent"    value={inr(clSpent)}     change="22.1" up accent={DIM2}/>
                <StatCard icon={Wallet}        label="Available"      value={inr(clAvailable)} change="8.6"  up accent={Y}/>
                <StatCard icon={Lock}          label="In Escrow"      value={inr(clEscrow)}    change="18.3" up accent={ORANGE}/>
                <StatCard icon={RefreshCcw}    label="Refund Pending" value={inr(clRefund)}    change="0.0" up={false} accent={RED}/>
              </div>

              <Box style={{ marginBottom:16 }}>
                <SH title="Wallet Utilization by Client"/>
                {CLIENT_WALLETS.map((w,i)=>{
                  const sp=(w.spent/w.loaded)*100;
                  const ep=(w.inEscrow/w.loaded)*100;
                  const ap=(w.available/w.loaded)*100;
                  return(
                    <div key={i} style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <div style={{ width:26, height:26, background:"#1a1a1a", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${BORDER}`, flexShrink:0 }}>
                            <span style={{ color:WHITE, fontSize:10, fontWeight:800 }}>{w.name[0]}</span>
                          </div>
                          <span style={{ color:WHITE, fontWeight:700, fontSize:13 }}>{w.name}</span>
                          <Tag color={DIM2}>{w.type}</Tag>
                        </div>
                        <div style={{ display:"flex", gap:16 }}>
                          <span style={{ color:DIM2, fontSize:11 }}>Loaded: <strong style={{ color:WHITE }}>{inr(w.loaded)}</strong></span>
                          <span style={{ color:DIM2, fontSize:11 }}>Available: <strong style={{ color:Y }}>{inr(w.available)}</strong></span>
                          {w.inEscrow>0&&<span style={{ color:DIM2, fontSize:11 }}>Escrow: <strong style={{ color:ORANGE }}>{inr(w.inEscrow)}</strong></span>}
                        </div>
                      </div>
                      <div style={{ display:"flex", borderRadius:5, overflow:"hidden", height:12 }}>
                        <div style={{ width:`${sp}%`, background:"#2a2a2a" }}/>
                        {w.inEscrow>0&&<div style={{ width:`${ep}%`, background:`${ORANGE}55` }}/>}
                        <div style={{ flex:1, background:`${Y}22` }}/>
                      </div>
                      <div style={{ display:"flex", gap:12, marginTop:4 }}>
                        <span style={{ color:DIM, fontSize:9 }}>■ <span style={{ color:"#555" }}>Spent {sp.toFixed(0)}%</span></span>
                        {w.inEscrow>0&&<span style={{ color:DIM, fontSize:9 }}>■ <span style={{ color:ORANGE }}>Escrow {ep.toFixed(0)}%</span></span>}
                        <span style={{ color:DIM, fontSize:9 }}>■ <span style={{ color:Y }}>Available {ap.toFixed(0)}%</span></span>
                      </div>
                    </div>
                  );
                })}
              </Box>

              <Box>
                <SH title="Client Wallet Table"/>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr><Th>Client</Th><Th>Type</Th><Th>Loaded</Th><Th>Spent</Th><Th>In Escrow</Th><Th>Available</Th><Th>Refund Pending</Th><Th>Utilization</Th></tr></thead>
                  <tbody>
                    {CLIENT_WALLETS.map((w,i)=>(
                      <tr key={i}>
                        <Td><span style={{ color:WHITE, fontWeight:700 }}>{w.name}</span></Td>
                        <Td><Tag color={DIM2}>{w.type}</Tag></Td>
                        <Td><span style={{ color:WHITE, fontWeight:700 }}>{inr(w.loaded)}</span></Td>
                        <Td><span style={{ color:DIM2 }}>{inr(w.spent)}</span></Td>
                        <Td><span style={{ color:w.inEscrow>0?ORANGE:DIM, fontWeight:700 }}>{inr(w.inEscrow)}</span></Td>
                        <Td><span style={{ color:Y, fontWeight:700 }}>{inr(w.available)}</span></Td>
                        <Td><span style={{ color:w.refundPending>0?RED:DIM }}>{inr(w.refundPending)}</span></Td>
                        <Td>
                          <span style={{ color:WHITE, fontWeight:700, fontSize:12 }}>{((w.spent/w.loaded)*100).toFixed(0)}%</span>
                          <MiniBar value={w.spent} max={w.loaded} color={Y}/>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background:"#0d0d0d" }}>
                      <Td><span style={{ color:Y, fontWeight:800 }}>Total</span></Td>
                      <Td></Td>
                      <Td><span style={{ color:WHITE, fontWeight:800 }}>{inr(clLoaded)}</span></Td>
                      <Td><span style={{ color:DIM2, fontWeight:800 }}>{inr(clSpent)}</span></Td>
                      <Td><span style={{ color:ORANGE, fontWeight:800 }}>{inr(clEscrow)}</span></Td>
                      <Td><span style={{ color:Y, fontWeight:800, fontSize:14 }}>{inr(clAvailable)}</span></Td>
                      <Td><span style={{ color:RED, fontWeight:800 }}>{inr(clRefund)}</span></Td>
                      <Td><span style={{ color:WHITE, fontWeight:700 }}>{((clSpent/clLoaded)*100).toFixed(0)}%</span></Td>
                    </tr>
                  </tfoot>
                </table>
              </Box>
            </div>
          )}

          {/* ════════════════ ESCROW VAULT ════════════════ */}
          {active==="escrow"&&(
            <div>
              <SH title="Escrow Vault" sub="Active contracts · Pending release · Disputes · Full ledger"/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:20 }}>
                <StatCard icon={Lock}          label="Total in Escrow"    value={inr(totalEscrow)} change="18.3" up accent={Y}/>
                <StatCard icon={Clock}         label="Active (Delivery)"  value={inr(6480000)}     change="12.1" up accent={ORANGE}/>
                <StatCard icon={CheckCircle}   label="Pending Release"    value={inr(3180000)}     change="6.4"  up accent={GREEN}/>
                <StatCard icon={AlertTriangle} label="In Dispute"         value={inr(620000)}      change="14.2" up={false} accent={RED}/>
                <StatCard icon={ArrowUpRight}  label="Released This Month" value={inr(9800000)}    change="22.8" up accent={DIM2}/>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16, marginBottom:16 }}>
                <Box>
                  <SH title="Escrow by Listing Type"/>
                  <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                    {LISTING_TYPES.map(l=>(
                      <div key={l.id}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <l.icon size={12} color={l.color}/>
                            <span style={{ color:WHITE, fontSize:12, fontWeight:600 }}>{l.label}</span>
                          </div>
                          <span style={{ color:Y, fontWeight:700, fontSize:12 }}>{inr(l.escrow)}</span>
                        </div>
                        <MiniBar value={l.escrow} max={totalEscrow} color={l.color==="#333333"?"#555":l.color}/>
                        <span style={{ color:DIM, fontSize:9, display:"block", marginTop:2 }}>{((l.escrow/totalEscrow)*100).toFixed(1)}% of total</span>
                      </div>
                    ))}
                    <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:10, display:"flex", justifyContent:"space-between" }}>
                      <span style={{ color:Y, fontWeight:700, fontSize:13 }}>Total</span>
                      <span style={{ color:Y, fontWeight:800, fontSize:15 }}>{inr(totalEscrow)}</span>
                    </div>
                  </div>
                </Box>

                <Box>
                  <SH title="Escrow by Status"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
                    {[
                      { status:"Active",           amount:6480000,  count:142, pct:54.6, color:ORANGE, desc:"In delivery, milestones pending"     },
                      { status:"Pending Release",  amount:3180000,  count:38,  pct:26.8, color:GREEN,  desc:"Delivered, awaiting confirmation"    },
                      { status:"In Dispute",       amount:620000,   count:4,   pct:5.2,  color:RED,    desc:"Under admin review"                  },
                      { status:"Auto-Release",     amount:1580000,  count:22,  pct:13.4, color:DIM2,   desc:"72h timer active, no response"       },
                    ].map(({ status, amount, count, pct:p, color, desc })=>(
                      <div key={status} style={{ background:"#080808", borderRadius:10, padding:14, border:`1px solid ${color}22`, borderLeft:`3px solid ${color}` }}>
                        <StatusTag status={status}/>
                        <p style={{ color, fontSize:18, fontWeight:800, margin:"8px 0 3px" }}>{inr(amount)}</p>
                        <p style={{ color:DIM2, fontSize:11, margin:"0 0 5px" }}>{count} contracts · {p}%</p>
                        <p style={{ color:DIM, fontSize:10, margin:0, fontStyle:"italic" }}>{desc}</p>
                      </div>
                    ))}
                  </div>
                </Box>
              </div>

              {/* Full ledger */}
              <Box style={{ marginBottom:16 }}>
                <SH title="Escrow Ledger" sub="Showing 8 of 206 active escrows"/>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><Th>Escrow ID</Th><Th>Buyer</Th><Th>Creator</Th><Th>Type</Th><Th>Amount</Th><Th>Platform Fee</Th><Th>Creator Payout</Th><Th>Milestone</Th><Th>Status</Th><Th>Age</Th><Th>Action</Th></tr></thead>
                    <tbody>
                      {ESCROW_TX.map((tx,i)=>{
                        const fr=tx.type==="Teams"?0.12:tx.type==="Services"?0.10:tx.type==="Courses"?0.07:0.08;
                        const fee=tx.amount*fr;
                        const payout=tx.amount-fee;
                        return(
                          <tr key={i} style={{ background:tx.status==="In Dispute"?"#1a000022":"transparent" }}>
                            <Td><span style={{ color:Y, fontWeight:700, fontSize:12 }}>{tx.id}</span></Td>
                            <Td><span style={{ color:WHITE, fontSize:13 }}>{tx.buyer}</span></Td>
                            <Td><span style={{ color:WHITE, fontSize:13 }}>{tx.seller}</span></Td>
                            <Td><Tag color={DIM2}>{tx.type}</Tag></Td>
                            <Td><span style={{ color:WHITE, fontWeight:700 }}>{inr(tx.amount)}</span></Td>
                            <Td><span style={{ color:Y, fontWeight:700 }}>{inr(fee)}</span></Td>
                            <Td><span style={{ color:GREEN, fontWeight:700 }}>{inr(payout)}</span></Td>
                            <Td><span style={{ color:DIM2, fontSize:12 }}>{tx.milestone}</span></Td>
                            <Td><StatusTag status={tx.status}/></Td>
                            <Td><span style={{ color:DIM2, fontSize:12 }}>{tx.age}</span></Td>
                            <Td>
                              {tx.status==="In Dispute"&&<button style={{ background:"transparent", border:`1px solid ${RED}`, color:RED, borderRadius:6, padding:"4px 10px", fontSize:10, fontFamily:"Montserrat,sans-serif", fontWeight:700, cursor:"pointer" }}>Resolve</button>}
                              {tx.status==="Pending Release"&&<button style={{ background:"transparent", border:`1px solid ${GREEN}`, color:GREEN, borderRadius:6, padding:"4px 10px", fontSize:10, fontFamily:"Montserrat,sans-serif", fontWeight:700, cursor:"pointer" }}>Release</button>}
                              {tx.status==="Active"&&<button style={{ background:"transparent", border:`1px solid ${BORDER}`, color:DIM2, borderRadius:6, padding:"4px 10px", fontSize:10, fontFamily:"Montserrat,sans-serif", fontWeight:700, cursor:"pointer" }}>View</button>}
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background:"#0d0d0d" }}>
                        <Td colSpan={4}><span style={{ color:Y, fontWeight:800 }}>Total held (206 escrows)</span></Td>
                        <Td><span style={{ color:WHITE, fontWeight:800 }}>{inr(totalEscrow)}</span></Td>
                        <Td><span style={{ color:Y, fontWeight:800 }}>{inr(totalEscrow*0.095)}</span></Td>
                        <Td><span style={{ color:GREEN, fontWeight:800 }}>{inr(totalEscrow*0.905)}</span></Td>
                        <Td colSpan={4}></Td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Box>

              <Box>
                <SH title="Monthly Escrow Movement"/>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={escrowFlow} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                    <XAxis dataKey="month" tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:DIM, fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>inr(v)}/>
                    <Tooltip content={<Tooltip_/>}/>
                    <Bar dataKey="locked"   name="Locked"   fill={ORANGE} radius={[4,4,0,0]} opacity={0.85}/>
                    <Bar dataKey="released" name="Released" fill={GREEN}  radius={[4,4,0,0]} opacity={0.85}/>
                    <Bar dataKey="disputed" name="Disputed" fill={RED}    radius={[4,4,0,0]} opacity={0.85}/>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
