import { useState, useEffect, useRef, useCallback } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Roboto+Slab:wght@300;400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:#fff;color:#111;font-family:'Roboto Slab',serif;overflow-x:hidden;}
:root{
  --y:#CEFF1B;--yd:#b8e000;
  --black:#000;--white:#fff;
  --g1:#F2F2F2;--g2:#e8e8e8;--g3:#d0d0d0;
  --t1:#111;--t2:#444;--t3:#888;
  --fh:'Montserrat',sans-serif;
  --fb:'Roboto Slab',serif;
}

/* ── NAV ── */
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 60px;display:flex;align-items:center;justify-content:space-between;transition:all .4s;background:rgba(255,255,255,0);}
nav.sc{background:rgba(255,255,255,.97);backdrop-filter:blur(20px);border-bottom:1px solid #eee;box-shadow:0 2px 20px rgba(0,0,0,.06);}
.logo{font-family:var(--fh);font-weight:900;font-size:22px;letter-spacing:-.03em;color:#000;text-decoration:none;}
.logo span{background:var(--y);color:#000;padding:0 4px;}
.nl{display:flex;gap:32px;list-style:none;}
.nl a{color:var(--t2);text-decoration:none;font-family:var(--fh);font-size:12px;font-weight:700;letter-spacing:.06em;transition:color .2s;}
.nl a:hover{color:#000;}
.nc{display:flex;gap:10px;}
.btn-ghost{background:transparent;border:1.5px solid #ddd;color:#000;padding:9px 22px;border-radius:100px;font-family:var(--fh);font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;}
.btn-ghost:hover{border-color:#aaa;}
.btn-primary{background:#000;border:none;color:#fff;padding:9px 22px;border-radius:100px;font-family:var(--fh);font-size:12px;font-weight:900;cursor:pointer;transition:all .2s;}
.btn-primary:hover{background:var(--y);color:#000;}

/* ── HERO ── */
.hero{min-height:100vh;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 60px 100px;position:relative;overflow:hidden;}
.hero-accent{position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:800px;height:600px;background:radial-gradient(ellipse at center,rgba(206,255,27,.25) 0%,transparent 70%);pointer-events:none;}
.hero-accent2{position:absolute;bottom:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(ellipse at center,rgba(206,255,27,.15) 0%,transparent 70%);pointer-events:none;}
.hpill{display:inline-flex;align-items:center;gap:8px;background:#000;color:var(--y);font-family:var(--fh);font-size:11px;font-weight:700;letter-spacing:.15em;padding:6px 18px;border-radius:100px;margin-bottom:48px;animation:fadeUp .8s .2s both;}
.hpill::before{content:'';width:6px;height:6px;background:var(--y);border-radius:50%;animation:pulse 2s infinite;}
.hh1{font-family:var(--fh);font-weight:900;font-size:clamp(52px,9vw,108px);line-height:.96;letter-spacing:-.05em;max-width:1000px;color:#000;animation:fadeUp .9s .4s both;}
.hh1 mark{background:var(--y);color:#000;padding:2px 6px;line-height:1.1;}
.hsub{font-size:clamp(16px,1.8vw,20px);line-height:1.75;color:var(--t3);max-width:580px;margin:28px auto 0;font-weight:300;animation:fadeUp .8s .6s both;}
.dual-cta{display:flex;gap:20px;margin-top:52px;align-items:stretch;animation:fadeUp .8s .8s both;}
.ctac{background:#fff;border:1.5px solid #e0e0e0;border-radius:20px;padding:28px 32px;display:flex;flex-direction:column;gap:10px;min-width:240px;transition:all .3s;cursor:pointer;text-align:left;box-shadow:0 2px 12px rgba(0,0,0,.06);}
.ctac:hover{border-color:#000;transform:translateY(-5px);box-shadow:0 8px 32px rgba(0,0,0,.12);}
.ctac.dark{background:#000;border-color:#000;}
.ctac.dark .ctac-who{color:rgba(206,255,27,.6);}
.ctac.dark .ctac-act{color:#fff;}
.ctac.dark .ctac-desc{color:#888;}
.ctac-who{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.15em;color:var(--t3);text-transform:uppercase;}
.ctac-act{font-family:var(--fh);font-weight:900;font-size:18px;letter-spacing:-.02em;color:#000;}
.ctac-desc{font-size:12px;color:var(--t3);line-height:1.65;font-weight:300;flex:1;}
.ctac-btn{padding:11px 22px;border-radius:100px;font-family:var(--fh);font-size:12px;font-weight:900;letter-spacing:.05em;transition:all .3s;cursor:pointer;align-self:flex-start;border:none;background:#000;color:#fff;}
.ctac:not(.dark):hover .ctac-btn{background:var(--y);color:#000;}
.ctac.dark .ctac-btn{background:var(--y);color:#000;}
.ctac.dark:hover .ctac-btn{box-shadow:0 0 24px rgba(206,255,27,.5);}
.hmic{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.1em;color:#ccc;margin-top:24px;animation:fadeIn .8s 1.1s both;}
.hscroll{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;animation:fadeIn 1s 1.6s both;}
.sline{width:1px;height:36px;background:linear-gradient(to bottom,#ccc,transparent);animation:scrollpulse 2s infinite;}
.slbl{font-family:var(--fh);font-size:9px;letter-spacing:.2em;color:#ccc;}

/* ── IMAGE PLACEHOLDER ── */
.img-sec{width:100%;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.img-ph{display:flex;flex-direction:column;align-items:center;gap:16px;font-family:var(--fh);text-align:center;padding:40px;}
.img-num{font-size:80px;font-weight:900;color:#ddd;letter-spacing:-.04em;line-height:1;}
.img-label{font-size:13px;font-weight:700;letter-spacing:.12em;color:#bbb;text-transform:uppercase;}
.img-prompt-txt{font-size:11px;color:#ccc;max-width:500px;line-height:1.7;font-weight:300;font-family:var(--fb);margin-top:4px;}
.img-badge{background:var(--y);color:#000;font-family:var(--fh);font-size:10px;font-weight:900;letter-spacing:.1em;padding:5px 14px;border-radius:100px;}

/* ── WORD REVEAL ── */
.wrsec{height:400vh;position:relative;}
.wrseq{position:sticky;top:0;height:100vh;overflow:hidden;}
.wi{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .5s;}
.wi.vis{opacity:1;}
.wi span{font-family:var(--fh);font-weight:900;font-size:clamp(80px,17vw,200px);letter-spacing:-.05em;color:#000;}
.wb0{background:#fff;}
.wb1{background:var(--g1);}
.wb2{background:var(--g2);}
.wb3{background:var(--y);}
.wi.last span{-webkit-text-stroke:3px #000;color:transparent;}

/* ── DUAL VALUE ── */
.dvwrap{display:flex;gap:0;}
.dvh{flex:1;padding:56px 52px;position:relative;overflow:hidden;transition:flex .4s ease;}
.dvh.cr{background:var(--g1);border:1.5px solid var(--g2);border-radius:24px 0 0 24px;}
.dvh.cl{background:#000;border-radius:0 24px 24px 0;}
.dvh:hover{flex:1.14;}
.dvlabel{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:20px;}
.dvh.cr .dvlabel{color:var(--t3);}
.dvh.cl .dvlabel{color:var(--y);}
.dvh2{font-family:var(--fh);font-weight:900;font-size:clamp(28px,3.2vw,44px);letter-spacing:-.03em;line-height:1.1;}
.dvh.cr .dvh2{color:#000;}
.dvh.cl .dvh2{color:#fff;}
.dvbody{font-size:15px;line-height:1.85;margin-top:16px;font-weight:300;max-width:420px;}
.dvh.cr .dvbody{color:var(--t2);}
.dvh.cl .dvbody{color:#888;}
.dvlist{list-style:none;margin-top:24px;display:flex;flex-direction:column;gap:11px;}
.dvlist li{display:flex;gap:12px;align-items:flex-start;font-size:13px;line-height:1.55;font-weight:300;}
.dvh.cr .dvlist li{color:var(--t2);}
.dvh.cl .dvlist li{color:#777;}
.dvlist li::before{content:'→';font-family:var(--fh);font-weight:900;font-size:12px;flex-shrink:0;margin-top:2px;}
.dvh.cr .dvlist li::before{color:#000;}
.dvh.cl .dvlist li::before{color:var(--y);}
.dvcta{display:inline-block;margin-top:30px;padding:13px 28px;border-radius:100px;font-family:var(--fh);font-size:13px;font-weight:900;letter-spacing:.05em;cursor:pointer;transition:all .25s;border:none;}
.dvh.cr .dvcta{background:#000;color:#fff;}
.dvh.cr .dvcta:hover{background:var(--y);color:#000;}
.dvh.cl .dvcta{background:var(--y);color:#000;}
.dvh.cl .dvcta:hover{box-shadow:0 0 32px rgba(206,255,27,.5);}

/* ── STATEMENT ── */
.stmt{min-height:70vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:100px 60px;position:relative;overflow:hidden;background:var(--y);}
.stmth{font-family:var(--fh);font-weight:900;font-size:clamp(48px,8vw,96px);letter-spacing:-.05em;line-height:.98;max-width:900px;color:#000;}
.stmts{font-size:18px;margin-top:20px;font-weight:300;max-width:480px;margin-left:auto;margin-right:auto;color:rgba(0,0,0,.55);}

/* ── STEPS ── */
.stepsec{padding:140px 60px;background:#fff;}
.stab-row{display:flex;width:fit-content;margin:16px auto 56px;background:var(--g1);border:1.5px solid var(--g2);border-radius:100px;padding:4px;}
.stab{padding:10px 28px;border-radius:100px;font-family:var(--fh);font-size:12px;font-weight:700;letter-spacing:.06em;cursor:pointer;transition:all .3s;color:var(--t3);background:transparent;border:none;}
.stab.on{background:#000;color:var(--y);}
.spanel{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;}
.sitem{background:var(--g1);border:1.5px solid var(--g2);padding:40px 32px;transition:all .3s;}
.sitem:hover{background:var(--y);border-color:var(--yd);}
.sitem:hover .snum{color:rgba(0,0,0,.08);}
.sitem:hover .stitle,.sitem:hover .sdesc{color:#000;}
.sitem:hover .sbadge{background:#000;color:var(--y);}
.snum{font-family:var(--fh);font-weight:900;font-size:60px;color:var(--g3);line-height:1;margin-bottom:20px;transition:color .3s;}
.sbadge{display:inline-block;background:#000;color:var(--y);font-family:var(--fh);font-size:9px;font-weight:900;letter-spacing:.12em;padding:4px 12px;border-radius:100px;margin-bottom:14px;transition:all .3s;}
.stitle{font-family:var(--fh);font-weight:700;font-size:17px;margin-bottom:10px;color:#000;transition:color .3s;}
.sdesc{font-size:13px;color:var(--t2);line-height:1.75;font-weight:300;transition:color .3s;}

/* ── MODULES ── */
.modsec{padding:140px 60px;background:var(--y);}
.modsec .sl-dark{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.2em;color:rgba(0,0,0,.5);text-transform:uppercase;margin-bottom:20px;}
.modgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:56px;}
.mcard{border-radius:20px;overflow:hidden;display:flex;flex-direction:row;cursor:pointer;transition:transform .3s,box-shadow .3s;background:#fff;min-height:220px;}
.mcard:hover{transform:translateY(-5px);box-shadow:0 24px 64px rgba(0,0,0,.18);}
.mcard.wide{grid-column:span 2;}
.mcard-left{width:44%;flex-shrink:0;position:relative;overflow:hidden;}
.mcard-left svg{position:absolute;inset:0;width:100%;height:100%;}
.mc1 .mcard-left{background:linear-gradient(135deg,#0d9488 0%,#059669 100%);}
.mc2 .mcard-left{background:linear-gradient(135deg,#f97316 0%,#be185d 55%,#4f46e5 100%);}
.mc3 .mcard-left{background:linear-gradient(135deg,#f59e0b 0%,#ea580c 100%);}
.mc4 .mcard-left{background:linear-gradient(135deg,#7c3aed 0%,#a855f7 100%);}
.mcard-right{flex:1;padding:36px 40px;display:flex;flex-direction:column;justify-content:center;background:#fff;}
.mcard.wide .mcard-right{padding:44px 52px;}
.mtag{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:12px;}
.mc1 .mtag{color:#059669;}
.mc2 .mtag{color:#f97316;}
.mc3 .mtag{color:#ea580c;}
.mc4 .mtag{color:#7c3aed;}
.mtit{font-family:var(--fh);font-weight:900;font-size:clamp(18px,1.8vw,24px);letter-spacing:-.02em;margin-bottom:10px;color:#000;line-height:1.15;}
.mdesc{font-size:13px;color:var(--t2);line-height:1.75;font-weight:300;max-width:320px;}
.mcard.wide .mdesc{max-width:420px;}

/* ── TRUST ── */
.trustsec{padding:140px 60px;display:flex;gap:80px;align-items:center;background:#fff;}
.tl{flex:1;}
.tr{flex:1;display:flex;flex-direction:column;gap:14px;}
.tcard{background:var(--g1);border:1.5px solid var(--g2);border-radius:16px;padding:28px 30px;display:flex;gap:20px;transition:all .3s;}
.tcard:hover{border-color:#000;box-shadow:0 4px 24px rgba(0,0,0,.08);}
.tcard.dark{background:#000;}
.tcard.dark:hover{border-color:var(--y);}
.tcard.yellow{background:var(--y);}
.tico{font-size:26px;flex-shrink:0;}
.twho{font-family:var(--fh);font-size:9px;font-weight:700;letter-spacing:.15em;color:var(--t3);text-transform:uppercase;margin-bottom:7px;}
.tcard.dark .twho{color:rgba(206,255,27,.6);}
.tcard.yellow .twho{color:rgba(0,0,0,.5);}
.ttit{font-family:var(--fh);font-weight:700;font-size:15px;margin-bottom:6px;color:#000;}
.tcard.dark .ttit{color:#fff;}
.tdesc{font-size:13px;color:var(--t2);line-height:1.75;font-weight:300;}
.tcard.dark .tdesc{color:#777;}
.tmets{display:flex;gap:2px;margin-top:36px;}
.tmet{flex:1;background:var(--g1);border:1.5px solid var(--g2);padding:28px 16px;text-align:center;}
.tnum{font-family:var(--fh);font-weight:900;font-size:38px;color:#000;letter-spacing:-.02em;display:block;}
.tlbl{font-size:11px;color:var(--t3);margin-top:6px;font-weight:300;line-height:1.5;}

/* ── AUDIENCE SPLIT ── */
.audsplit{display:flex;}
.ah{flex:1;padding:120px 80px;display:flex;align-items:center;}
.ah.acr{background:#fff;border-right:1.5px solid var(--g2);}
.ah.acl{background:var(--y);}
.ain{max-width:460px;}
.awho{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:20px;color:var(--t3);}
.ah.acl .awho{color:rgba(0,0,0,.5);}
.ah2{font-family:var(--fh);font-weight:900;font-size:clamp(30px,3.2vw,46px);letter-spacing:-.04em;line-height:1.05;color:#000;}
.abody{font-size:15px;line-height:1.85;margin-top:14px;font-weight:300;color:var(--t2);}
.ah.acl .abody{color:rgba(0,0,0,.6);}
.alist{list-style:none;margin-top:22px;display:flex;flex-direction:column;gap:10px;}
.alist li{display:flex;gap:10px;font-size:13px;font-weight:300;line-height:1.5;color:var(--t2);}
.ah.acl .alist li{color:rgba(0,0,0,.65);}
.alist li::before{content:'✓';font-family:var(--fh);font-weight:900;font-size:11px;flex-shrink:0;margin-top:2px;color:#000;}
.ah.acl .alist li::before{color:rgba(0,0,0,.5);}
.abtn{margin-top:30px;display:inline-block;padding:13px 26px;border-radius:100px;font-family:var(--fh);font-size:13px;font-weight:900;letter-spacing:.05em;cursor:pointer;transition:all .25s;border:none;background:#000;color:#fff;}
.ah.acr .abtn:hover{background:var(--y);color:#000;}
.ah.acl .abtn{color:var(--y);}
.ah.acl .abtn:hover{box-shadow:0 4px 24px rgba(0,0,0,.3);}

/* ── FEATURE GRID ── */
.gridsec{padding:140px 60px;background:var(--g1);}
.fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:60px;}
.fgi{background:#fff;border:1.5px solid var(--g2);padding:36px;position:relative;overflow:hidden;transition:all .3s;}
.fgi::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:var(--y);transform:scaleX(0);transform-origin:left;transition:transform .3s;}
.fgi:hover::after{transform:scaleX(1);}
.fgi:hover{border-color:var(--g3);box-shadow:0 4px 24px rgba(0,0,0,.07);}
.ftag{display:inline-block;padding:3px 10px;border-radius:100px;font-family:var(--fh);font-size:9px;font-weight:700;letter-spacing:.12em;margin-bottom:16px;}
.ftag.cr{background:rgba(0,0,0,.06);color:var(--t3);}
.ftag.cl{background:rgba(0,0,0,.85);color:var(--y);}
.ftag.bo{background:var(--y);color:#000;}
.fgico{font-size:24px;margin-bottom:14px;display:block;}
.fgtit{font-family:var(--fh);font-weight:700;font-size:15px;margin-bottom:8px;color:#000;}
.fgdesc{font-size:13px;color:var(--t2);line-height:1.75;font-weight:300;}

/* ── PROOF ── */
.proofsec{padding:140px 60px;background:#fff;}
.phdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:56px;}
.pratingbadge{display:flex;align-items:center;gap:8px;font-family:var(--fh);font-size:12px;font-weight:700;color:var(--t3);}
.stars{color:#000;font-size:16px;}
.tcards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.tc{background:var(--g1);border:1.5px solid var(--g2);border-radius:16px;padding:28px;transition:all .3s;}
.tc:hover{border-color:#000;box-shadow:0 8px 32px rgba(0,0,0,.08);transform:translateY(-4px);}
.tc.cl{background:#000;}
.tc.cl:hover{border-color:var(--y);}
.tctype{font-family:var(--fh);font-size:9px;font-weight:700;letter-spacing:.15em;margin-bottom:14px;display:flex;align-items:center;gap:6px;color:var(--t3);}
.tc.cl .tctype{color:var(--y);}
.tctype::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;display:inline-block;}
.tctxt{font-size:13px;line-height:1.85;font-weight:300;margin-bottom:20px;color:var(--t2);}
.tc.cl .tctxt{color:#aaa;}
.tcauth{display:flex;align-items:center;gap:12px;}
.tav{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-weight:900;font-size:12px;flex-shrink:0;background:#000;color:var(--y);}
.tc.cl .tav{background:var(--y);color:#000;}
.tname{font-family:var(--fh);font-size:13px;font-weight:700;color:#000;}
.tc.cl .tname{color:#fff;}
.trole-sm{font-size:11px;color:var(--t3);margin-top:2px;font-weight:300;}
.tc.cl .trole-sm{color:#555;}

/* ── FAQ ── */
.faqsec{padding:140px 60px;background:var(--g1);}
.fqtabs{display:flex;width:fit-content;margin:0 auto 50px;background:#fff;border:1.5px solid var(--g2);border-radius:100px;padding:4px;box-shadow:0 2px 12px rgba(0,0,0,.05);}
.fqtab{padding:9px 26px;border-radius:100px;font-family:var(--fh);font-size:11px;font-weight:700;letter-spacing:.06em;cursor:pointer;transition:all .3s;color:var(--t3);background:transparent;border:none;}
.fqtab.on{background:#000;color:var(--y);}
.fqpanel{max-width:780px;margin:0 auto;}
.fqitem{border-bottom:1.5px solid var(--g2);}
.fqq{padding:22px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-family:var(--fh);font-size:14px;font-weight:700;transition:color .2s;gap:20px;color:#000;background:none;border:none;width:100%;text-align:left;}
.fqq:hover{color:var(--t3);}
.fqico{font-size:18px;color:var(--g3);transition:transform .3s;flex-shrink:0;}
.fqitem.op .fqico{transform:rotate(45deg);color:#000;}
.fqa{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .3s;font-size:13px;color:var(--t2);line-height:1.9;font-weight:300;}
.fqitem.op .fqa{max-height:220px;padding-bottom:22px;}

/* ── CTA ── */
.ctasec{padding:140px 60px;text-align:center;position:relative;overflow:hidden;background:#000;}
.ctabg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(206,255,27,.08),transparent);}
.ctacont{position:relative;z-index:2;max-width:800px;margin:0 auto;}
.ctah2{font-family:var(--fh);font-weight:900;font-size:clamp(40px,6vw,72px);letter-spacing:-.04em;line-height:1.0;color:#fff;}
.ctadual{display:flex;gap:20px;margin-top:52px;justify-content:center;}
.ctablock{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-radius:20px;padding:32px 36px;flex:1;max-width:310px;text-align:left;transition:all .3s;}
.ctablock:hover{transform:translateY(-4px);}
.ctablock.crcta:hover{border-color:rgba(255,255,255,.25);}
.ctablock.clcta{border-color:rgba(206,255,27,.2);}
.ctablock.clcta:hover{border-color:var(--y);}
.ctawho{font-family:var(--fh);font-size:9px;font-weight:700;letter-spacing:.15em;color:rgba(255,255,255,.3);margin-bottom:10px;}
.ctablock.clcta .ctawho{color:var(--y);}
.ctablkh{font-family:var(--fh);font-weight:900;font-size:18px;letter-spacing:-.02em;margin-bottom:8px;color:#fff;}
.ctablkp{font-size:12px;color:rgba(255,255,255,.4);line-height:1.65;margin-bottom:20px;font-weight:300;}
.eform{display:flex;gap:8px;}
.einp{flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:#fff;padding:11px 16px;border-radius:100px;font-family:var(--fb);font-size:12px;outline:none;transition:border-color .2s;}
.einp:focus{border-color:var(--y);}
.einp::placeholder{color:rgba(255,255,255,.25);}
.ebtn{background:var(--y);border:none;color:#000;padding:11px 18px;border-radius:100px;font-family:var(--fh);font-size:11px;font-weight:900;cursor:pointer;letter-spacing:.04em;transition:all .25s;white-space:nowrap;}
.ebtn:hover{transform:scale(1.04);}
.crcta .ebtn{background:#fff;color:#000;}
.crcta .ebtn:hover{background:var(--y);}
.ctamic{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.08em;color:rgba(255,255,255,.2);margin-top:32px;}

/* ── FOOTER ── */
footer{background:#000;border-top:1px solid #111;padding:80px 60px 40px;}
.ftop{display:grid;grid-template-columns:2fr repeat(4,1fr);gap:50px;padding-bottom:60px;border-bottom:1px solid #111;}
.fdesc{font-size:12px;color:#444;line-height:1.8;margin-top:14px;font-weight:300;}
.fctit{font-family:var(--fh);font-weight:700;font-size:10px;letter-spacing:.15em;color:#333;text-transform:uppercase;margin-bottom:18px;}
.flinks{list-style:none;display:flex;flex-direction:column;gap:9px;}
.flinks a{color:#333;text-decoration:none;font-size:12px;transition:color .2s;font-weight:300;}
.flinks a:hover{color:#888;}
.fbtm{display:flex;justify-content:space-between;align-items:center;padding-top:36px;}
.fcopy{font-size:11px;color:#222;font-weight:300;}
.fslogan{font-family:var(--fh);font-size:11px;font-weight:700;letter-spacing:.08em;color:#222;}
.fslogan span{color:var(--y);}

/* ── SHARED ── */
.sec-label{font-family:var(--fh);font-size:10px;font-weight:700;letter-spacing:.2em;color:var(--t3);text-transform:uppercase;margin-bottom:20px;}
.sec-label.inv{color:rgba(255,255,255,.4);}
.sec-label.dark{color:#000;}
.sec-h{font-family:var(--fh);font-weight:900;font-size:clamp(36px,5vw,58px);letter-spacing:-.04em;line-height:1.02;color:#000;}
.sec-h.inv{color:#fff;}
.sec-sub{font-size:17px;line-height:1.85;color:var(--t2);margin-top:18px;font-weight:300;max-width:520px;}

/* ── SCROLL REVEAL ── */
.rv{opacity:0;transform:translateY(36px);transition:opacity .8s ease,transform .8s ease;}
.rv.vis{opacity:1;transform:translateY(0);}
.d1{transition-delay:.1s;}.d2{transition-delay:.2s;}.d3{transition-delay:.3s;}

@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}
@keyframes scrollpulse{0%,100%{opacity:.2}50%{opacity:.8}}
`;

/* ── SVG SHAPES ── */
function ServicesSVG() {
  return (
    <svg viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <defs><filter id="f1"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <rect x="40" y="18" width="138" height="166" rx="24" fill="rgba(255,255,255,0.13)" filter="url(#f1)"/>
      <rect x="40" y="18" width="138" height="166" rx="24" fill="rgba(255,255,255,0.10)"/>
      <circle cx="109" cy="72" r="30" fill="rgba(255,255,255,0.18)"/>
      <rect x="98" y="108" width="138" height="96" rx="24" fill="rgba(255,255,255,0.16)" filter="url(#f1)"/>
      <rect x="98" y="108" width="138" height="96" rx="24" fill="rgba(255,255,255,0.13)"/>
      <circle cx="109" cy="72" r="8" fill="rgba(206,255,27,0.6)"/>
    </svg>
  );
}

function ProductsSVG() {
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <defs><filter id="f2"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <circle cx="72" cy="158" r="72" fill="rgba(255,120,60,0.35)" filter="url(#f2)"/>
      <circle cx="72" cy="158" r="72" fill="rgba(255,255,255,0.10)"/>
      <circle cx="148" cy="78" r="52" fill="rgba(100,80,220,0.3)" filter="url(#f2)"/>
      <circle cx="148" cy="78" r="52" fill="rgba(255,255,255,0.12)"/>
      <circle cx="108" cy="118" r="30" fill="rgba(255,255,255,0.18)"/>
      <rect x="128" y="158" width="44" height="44" rx="10" fill="rgba(255,140,40,0.45)"/>
      <rect x="128" y="158" width="44" height="44" rx="10" fill="rgba(255,255,255,0.10)"/>
      <circle cx="108" cy="118" r="9" fill="rgba(206,255,27,0.65)"/>
    </svg>
  );
}

function CoursesSVG() {
  return (
    <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <defs><filter id="f3"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <rect x="58" y="20" width="64" height="148" rx="32" fill="rgba(255,255,255,0.13)" filter="url(#f3)"/>
      <rect x="58" y="20" width="64" height="148" rx="32" fill="rgba(255,255,255,0.10)"/>
      <polygon points="148,50 178,90 158,138 118,138 98,90 128,50" fill="rgba(255,255,255,0.16)" filter="url(#f3)"/>
      <polygon points="148,50 178,90 158,138 118,138 98,90 128,50" fill="rgba(255,255,255,0.10)"/>
      <circle cx="90" cy="160" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <circle cx="90" cy="160" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <circle cx="138" cy="94" r="8" fill="rgba(206,255,27,0.6)"/>
    </svg>
  );
}

function TeamsSVG() {
  return (
    <svg viewBox="0 0 280 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <defs><filter id="f4"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <rect x="22" y="28" width="100" height="52" rx="26" fill="rgba(255,255,255,0.13)" filter="url(#f4)"/>
      <rect x="22" y="28" width="100" height="52" rx="26" fill="rgba(255,255,255,0.10)"/>
      <rect x="140" y="28" width="100" height="52" rx="26" fill="rgba(255,255,255,0.13)" filter="url(#f4)"/>
      <rect x="140" y="28" width="100" height="52" rx="26" fill="rgba(255,255,255,0.10)"/>
      <rect x="100" y="46" width="80" height="130" rx="40" fill="rgba(255,255,255,0.18)" filter="url(#f4)"/>
      <rect x="100" y="46" width="80" height="130" rx="40" fill="rgba(255,255,255,0.13)"/>
      <rect x="22" y="145" width="90" height="48" rx="24" fill="rgba(255,255,255,0.13)" filter="url(#f4)"/>
      <rect x="22" y="145" width="90" height="48" rx="24" fill="rgba(255,255,255,0.10)"/>
      <rect x="148" y="145" width="90" height="48" rx="24" fill="rgba(255,255,255,0.13)" filter="url(#f4)"/>
      <rect x="148" y="145" width="90" height="48" rx="24" fill="rgba(255,255,255,0.10)"/>
      <circle cx="140" cy="54" r="6" fill="rgba(206,255,27,0.7)"/>
      <circle cx="140" cy="169" r="6" fill="rgba(206,255,27,0.7)"/>
    </svg>
  );
}

/* ── HOOKS ── */
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.rv').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useWordReveal() {
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      if (r.top > 0 || r.bottom < window.innerHeight) return;
      setIdx(Math.min(3, Math.floor(Math.max(0, Math.min(1, -r.top / (ref.current.offsetHeight - window.innerHeight))) * 4)));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return { ref, idx };
}

/* ── DATA ── */
const CREATOR_STEPS = [
  { num: '01', badge: 'BUILD',    title: 'Set up your profile',          desc: 'Create your profile and list your services, products, or courses. Go from signup to live in under an hour.' },
  { num: '02', badge: 'LIST',     title: 'Publish everything you offer',  desc: 'Services, digital products, courses, webinars, or teams — all on one profile, one dashboard.' },
  { num: '03', badge: 'DISCOVER', title: 'Clients discover you',          desc: 'Your listings go live on the marketplace. Clients browsing your category find you, review your profile, and reach out when they\'re ready to hire.' },
  { num: '04', badge: 'EARN',     title: 'Deliver. Get paid. Same day.',  desc: 'Escrow releases the moment your work is approved. Payout hits your wallet automatically.' },
];

const CLIENT_STEPS = [
  { num: '01', badge: 'BROWSE',    title: 'Search the marketplace',     desc: 'Browse thousands of verified creators by category, skill, and budget. Filter by rating, delivery time, and reputation level.' },
  { num: '02', badge: 'SHORTLIST', title: 'Find your perfect creator',   desc: 'Review real profiles, real ratings, and real delivery history. Every creator is KYC-verified. No fake reviews, no paid placement.' },
  { num: '03', badge: 'PROTECT',   title: 'Fund escrow. Work begins.',   desc: 'Your payment is held until you approve each milestone. You stay in control from first message to final delivery.' },
  { num: '04', badge: 'DONE',      title: 'Approve. Pay. Repeat.',       desc: 'Review the work, approve, funds release. No invoices. No wire transfers. No friction.' },
];

const FEATURES = [
  { tag: 'cr', icon: '📊', title: 'Creator Dashboard',    desc: 'Revenue, active orders, listing performance, and reputation — all live in one place.' },
  { tag: 'cl', icon: '🏪', title: 'Marketplace',          desc: 'Browse thousands of verified creators by category, skill, and reputation. Filter by delivery time, rating, and price — find the right fit fast.' },
  { tag: 'cr', icon: '💳', title: 'Payout Wallet',        desc: 'Instant withdrawals via UPI, bank transfer, and international wire. Track every transaction.' },
  { tag: 'bo', icon: '🏆', title: 'Reputation System',    desc: 'XP, Karma, Pro badges — built from real completed work, never gamed or purchased.' },
  { tag: 'bo', icon: '📋', title: 'Milestones & Escrow',  desc: 'Break any project into funded milestones. Creators know what to deliver. Clients control every release.' },
  { tag: 'cr', icon: '🚀', title: 'Analytics & Boost',    desc: 'See which listings perform, which fall flat, and amplify the ones that work.' },
];

const TESTIMONIALS = [
  { cl: false, role: 'CREATOR · UI/UX DESIGNER',      text: '"Finally a platform where the listing tools actually help me look professional. Landed 3 clients in my first week without a single cold message."', av: 'PR', name: 'Priya R.',    loc: 'UI/UX Designer · Chennai' },
  { cl: true,  role: 'CLIENT · STARTUP FOUNDER',       text: '"Found the right product designer on the marketplace in minutes. Escrow meant I didn\'t have to worry about getting burned on a large project."',   av: 'RV', name: 'Rahul V.',    loc: 'Founder, SaaS startup · Bangalore' },
  { cl: false, role: 'CREATOR · BRAND DESIGNER',       text: '"Uploaded my Figma template pack and forgot about it. Three weeks later I\'d made ₹40,000 in passive income. This platform actually delivers."',    av: 'SM', name: 'Sneha M.',    loc: 'Brand Designer · Mumbai' },
  { cl: true,  role: 'CLIENT · MARKETING MANAGER',     text: '"Brief to first draft in 48 hours. Milestone escrow made my finance team happy. No more chasing invoices or managing freelancer spreadsheets."',     av: 'AK', name: 'Ananya K.',   loc: 'Marketing Lead · D2C Brand' },
  { cl: false, role: 'CREATOR · FULLSTACK DEV',         text: '"The escrow system gave me the confidence to take on international clients for the first time. Payment secured before I write a line of code."',      av: 'AK', name: 'Aditya K.',   loc: 'Fullstack Developer · Bangalore' },
  { cl: true,  role: 'CLIENT · BUSINESS OWNER',         text: '"I\'ve used three other platforms. Ultra Hustle is the first one where I felt the process was designed for me — not just to extract my money."',     av: 'MK', name: 'Mihir K.',    loc: 'Business Owner · Ahmedabad' },
];

const CR_FAQS = [
  { id: 'cr1', q: 'Is it free to join and list my services?',             a: 'Yes — joining is completely free. Founding creators also lock in 0% commission permanently. This offer closes at launch.' },
  { id: 'cr2', q: 'How does escrow work for me as a creator?',            a: 'Clients fund the project into escrow before you begin any work. Complete each milestone, mark it done, and funds release instantly to your payout wallet. You never start work without the money already secured.' },
  { id: 'cr3', q: 'Can I sell services and digital products on the same profile?', a: 'Absolutely — and courses, webinars, and team packages too. Your entire income streams live on one profile.' },
  { id: 'cr4', q: 'How do clients find me on Ultra Hustle?',              a: 'Once your listing is live on the marketplace, clients browsing your category can discover your profile, review your work, and reach out to hire you. The better your profile and reputation score, the higher your visibility.' },
  { id: 'cr5', q: 'When and how do I receive my payout?',                 a: 'Payouts land in your wallet the same day a milestone is approved. Withdraw instantly via UPI, bank transfer, or international wire.' },
];

const CL_FAQS = [
  { id: 'cl1', q: 'Is it free to post a project?',                       a: 'Yes. Posting a project and browsing creators is completely free. You only pay when you hire and fund a milestone.' },
  { id: 'cl2', q: 'How do I know the creator is actually good?',          a: 'Every creator has a reputation score built from real completed projects — XP, Karma, completion rate, and verified client reviews. No fake ratings, no paid placement.' },
  { id: 'cl3', q: 'What if the work isn\'t what I expected?',             a: 'Your money stays in escrow until you approve each milestone. If there\'s a dispute, our team steps in within 2 hours. You never lose money to work you didn\'t approve.' },
  { id: 'cl4', q: 'How quickly can I find and hire someone?',             a: 'Browse the marketplace, filter by category and budget, and start a conversation with your shortlisted creators straight away. Most clients are talking to the right talent within the hour.' },
  { id: 'cl5', q: 'Can I hire a full team, not just one person?',         a: 'Yes. Through the Teams module, you can hire a complete squad — designer, developer, and copywriter as one package — without the agency overhead.' },
];

/* ── COMPONENT ── */
export default function Test() {
  const [scrolled,   setScrolled]   = useState(false);
  const [stepsTab,   setStepsTab]   = useState('creator');
  const [faqTab,     setFaqTab]     = useState('cr');
  const [openFaq,    setOpenFaq]    = useState(null);
  const { ref: wrRef, idx: wordIdx } = useWordReveal();

  useScrollReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const toggleFaq = useCallback(id => setOpenFaq(p => p === id ? null : id), []);

  const words   = ['create.', 'connect.', 'grow.', 'ultra.'];
  const wordBgs = ['#fff', '#F2F2F2', '#e8e8e8', '#CEFF1B'];

  return (
    <>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className={scrolled ? 'sc' : ''}>
        <a href="#" className="logo">ultra<span>hustle</span></a>
        <ul className="nl">
          <li><a href="#">Marketplace</a></li>
          <li><a href="#">For Creators</a></li>
          <li><a href="#">For Clients</a></li>
          <li><a href="#">Pricing</a></li>
        </ul>
        <div className="nc">
          <button className="btn-ghost">Sign in</button>
          <button className="btn-primary">Join free →</button>
        </div>
      </nav>

      {/* ── 1. HERO ── */}
      <section className="hero">
        <div className="hero-accent" />
        <div className="hero-accent2" />
        <div className="hpill">THE FUTURE OF CREATIVE WORK · GLOBAL MARKETPLACE</div>
        <h1 className="hh1">
          Your best work,<br />your best clients —<br /><mark>one marketplace.</mark>
        </h1>
        <p className="hsub">
          Ultra Hustle is where ambitious creators build careers they're proud of, and businesses find the talent that actually moves the needle — all in one place, protected end to end.
        </p>
        <div className="dual-cta">
          <div className="ctac">
            <div className="ctac-who">FOR CREATORS &amp; FREELANCERS</div>
            <div className="ctac-act">Build your creative career</div>
            <div className="ctac-desc">Your profile is your stage. List everything you offer, get discovered by clients who are already browsing, and earn what your work is truly worth.</div>
            <button className="ctac-btn">Start for free →</button>
          </div>
          <div className="ctac dark">
            <div className="ctac-who">FOR CLIENTS &amp; BUSINESSES</div>
            <div className="ctac-act">Find talent that delivers</div>
            <div className="ctac-desc">Browse the marketplace to find verified creators across every category. Review real reputation scores, shortlist your favourites, and control every payment milestone.</div>
            <button className="ctac-btn">Browse creators →</button>
          </div>
        </div>
        <p className="hmic">TRUSTED BY EARLY CREATORS &amp; CLIENTS · LAUNCHING SOON</p>
        <div className="hscroll"><span className="slbl">SCROLL</span><div className="sline" /></div>
      </section>

      {/* ── IMAGE 01 ── */}
      <div className="img-sec" style={{height:520,background:'#F2F2F2'}}>
        <div className="img-ph">
          <div className="img-badge">IMAGE 01 · HERO BANNER</div>
          <div className="img-num">01</div>
          <div className="img-label">Creator at Work</div>
          <div className="img-prompt-txt">Place the cinematic editorial photograph here — creator, neon yellow light, white studio.</div>
        </div>
      </div>

      {/* ── 2. WORD REVEAL ── */}
      <div style={{height:'400vh',position:'relative'}} ref={wrRef}>
        <div className="wrseq">
          {words.map((w, i) => (
            <div key={i} className={`wi${i === wordIdx ? ' vis' : ''}${i === 3 ? ' last' : ''}`} style={{background:wordBgs[i]}}>
              <span>{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. DUAL VALUE ── */}
      <section style={{padding:0}}>
        <div className="dvwrap">
          <div className="dvh cr rv">
            <div className="dvlabel">FOR CREATORS &amp; FREELANCERS</div>
            <h2 className="dvh2">Imagine building a career on your terms.<br />Now do it.</h2>
            <p className="dvbody">Ultra Hustle is designed to make your talent visible to the clients who are already looking for it — so you spend less time pitching and more time doing what you do best.</p>
            <ul className="dvlist">
              <li>List services, products, courses, webinars, and teams from one profile</li>
              <li>Your listings go live on the marketplace where clients are already browsing</li>
              <li>Escrow locks funds in before you start a single task</li>
              <li>Instant payout the moment your work is approved</li>
            </ul>
            <button className="dvcta">Start earning free →</button>
          </div>
          <div className="dvh cl rv d2">
            <div className="dvlabel">FOR CLIENTS &amp; BUSINESSES</div>
            <h2 className="dvh2">Every creator you need is one search away.</h2>
            <p className="dvbody">The marketplace puts verified talent in front of you — ranked by real reputation, real reviews, and real delivery history. Browse freely. Hire confidently. Pay only when work is done.</p>
            <ul className="dvlist">
              <li>Browse verified creators on the marketplace and connect directly to the right fit</li>
              <li>Milestone escrow — you control every single payment release</li>
              <li>KYC-verified creators with real reputation scores, not fake reviews</li>
              <li>Smart contracts lock scope before work begins — no surprises</li>
            </ul>
            <button className="dvcta">Browse the marketplace →</button>
          </div>
        </div>
      </section>

      {/* ── 4. STATEMENT ── */}
      <section className="stmt">
        <div style={{position:'relative',zIndex:2,textAlign:'center'}}>
          <h2 className="stmth rv">Great work happens when great talent<br />meets great clients.</h2>
          <p className="stmts rv d2">Ultra Hustle is the place where both sides of that equation finally get what they came for — in one marketplace built for both.</p>
        </div>
      </section>

      {/* ── 5. STEPS ── */}
      <section className="stepsec">
        <div style={{textAlign:'center'}} className="rv">
          <div className="sec-label">HOW IT WORKS</div>
          <h2 className="sec-h">Your journey starts here</h2>
        </div>
        <div className="stab-row rv d1">
          <button className={`stab${stepsTab === 'creator' ? ' on' : ''}`} onClick={() => setStepsTab('creator')}>I'm a Creator</button>
          <button className={`stab${stepsTab === 'client'  ? ' on' : ''}`} onClick={() => setStepsTab('client')}>I'm a Client</button>
        </div>
        <div className="spanel">
          {(stepsTab === 'creator' ? CREATOR_STEPS : CLIENT_STEPS).map((s, i) => (
            <div key={s.num} className={`sitem rv d${i}`}>
              <div className="snum">{s.num}</div>
              <div className="sbadge">{s.badge}</div>
              <div className="stitle">{s.title}</div>
              <div className="sdesc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMAGE 02 ── */}
      <div className="img-sec" style={{height:480,background:'#000'}}>
        <div className="img-ph" style={{color:'#333'}}>
          <div className="img-badge">IMAGE 02 · CLIENT SECTION</div>
          <div className="img-num" style={{color:'#222'}}>02</div>
          <div className="img-label" style={{color:'#333'}}>Business Client</div>
          <div className="img-prompt-txt" style={{color:'#333'}}>Confident entrepreneur/founder editorial. Dark background, neon yellow accent light.</div>
        </div>
      </div>

      {/* ── 6. MODULES ── */}
      <section className="modsec">
        <div className="rv" style={{textAlign:'center'}}>
          <div className="sl-dark">PLATFORM MODULES</div>
          <h2 className="sec-h" style={{marginTop:8}}>One platform. Every way to work.</h2>
        </div>
        <div className="modgrid">
          <div className="mcard mc1 wide rv">
            <div className="mcard-left"><ServicesSVG /></div>
            <div className="mcard-right">
              <div className="mtag">SERVICES</div>
              <div className="mtit">The core of every deal</div>
              <div className="mdesc">Creators list skills. Clients browse the marketplace and connect directly. Escrow protects every deal.</div>
            </div>
          </div>
          <div className="mcard mc2 rv d1">
            <div className="mcard-left"><ProductsSVG /></div>
            <div className="mcard-right">
              <div className="mtag">DIGITAL PRODUCTS</div>
              <div className="mtit">Sell once,<br />earn always</div>
              <div className="mdesc">Templates, presets, packs — passive income for creators, instant downloads for clients.</div>
            </div>
          </div>
          <div className="mcard mc3 rv d2">
            <div className="mcard-left"><CoursesSVG /></div>
            <div className="mcard-right">
              <div className="mtag">COURSES &amp; WEBINARS</div>
              <div className="mtit">Knowledge that<br />compounds</div>
              <div className="mdesc">Creators teach. Clients learn. Skills that scale beyond any single project.</div>
            </div>
          </div>
          <div className="mcard mc4 wide rv d1">
            <div className="mcard-left"><TeamsSVG /></div>
            <div className="mcard-right">
              <div className="mtag">TEAMS</div>
              <div className="mtit">Bigger projects,<br />built together</div>
              <div className="mdesc">Creators build squads. Clients get full-stack teams without the agency markup.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TRUST ── */}
      <section className="trustsec">
        <div className="tl rv">
          <div className="sec-label">TRUST &amp; SECURITY</div>
          <h2 className="sec-h">Built on trust.<br />Backed by structure.</h2>
          <p className="sec-sub">Every deal on Ultra Hustle is designed to feel safe — for the creator delivering great work and the client investing in it. Escrow, smart contracts, and KYC verification protect everyone.</p>
          <div className="tmets rv d2">
            <div className="tmet"><span className="tnum">100%</span><div className="tlbl">Escrow-protected transactions</div></div>
            <div className="tmet"><span className="tnum">₹0</span><div className="tlbl">Founding creator commission</div></div>
            <div className="tmet"><span className="tnum">&lt;2hr</span><div className="tlbl">Average dispute resolution</div></div>
          </div>
        </div>
        <div className="tr rv d2">
          <div className="tcard">
            <div className="tico">🔐</div>
            <div>
              <div className="twho">FOR CREATORS</div>
              <div className="ttit">Get paid before it's too late</div>
              <div className="tdesc">Escrow locks client funds before you start. You deliver. Funds release. No invoice chasing, no excuses.</div>
            </div>
          </div>
          <div className="tcard dark">
            <div className="tico">🛡️</div>
            <div>
              <div className="twho">FOR CLIENTS</div>
              <div className="ttit">Your money moves only when you approve</div>
              <div className="tdesc">Browse verified creators on the marketplace, hire with confidence, and release funds only when each milestone meets your standard.</div>
            </div>
          </div>
          <div className="tcard yellow">
            <div className="tico">📝</div>
            <div>
              <div className="twho">SMART CONTRACTS</div>
              <div className="ttit">Scope locked. Terms enforced.</div>
              <div className="tdesc">Auto-generated contracts based on your project. No ambiguity. No scope creep. No "but you said…" moments.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMAGE 03 ── */}
      <div className="img-sec" style={{height:480,background:'#e8e8e8'}}>
        <div className="img-ph">
          <div className="img-badge">IMAGE 03 · TRUST SECTION</div>
          <div className="img-num">03</div>
          <div className="img-label">Trust &amp; Handshake</div>
          <div className="img-prompt-txt">Abstract escrow/trust conceptual — two hands, glowing transaction, clean white studio.</div>
        </div>
      </div>

      {/* ── 8. AUDIENCE SPLIT ── */}
      <section className="audsplit">
        <div className="ah acr">
          <div className="ain rv">
            <div className="awho">CREATORS &amp; FREELANCERS</div>
            <h2 className="ah2">Your skills have always been worth more.<br />The marketplace proves it.</h2>
            <p className="abody">When clients browse Ultra Hustle, they see your listings ranked by real reputation and real reviews — not by who paid to be featured. Your work speaks for itself.</p>
            <ul className="alist">
              <li>Founding creators lock in 0% commission permanently</li>
              <li>Sell services, products, courses and teams from one profile</li>
              <li>Your listings on the marketplace reach clients who are already browsing and ready to buy</li>
              <li>Get paid the same day work is approved</li>
            </ul>
            <button className="abtn">Join as a creator →</button>
          </div>
        </div>
        <div className="ah acl">
          <div className="ain rv d2">
            <div className="awho">STARTUP FOUNDERS · MARKETERS · BUSINESSES</div>
            <h2 className="ah2">The best global talent is on the marketplace.<br />Ready for your project.</h2>
            <p className="abody">Browse verified creators across services, digital products, courses, webinars, and teams. Real profiles, real reviews, real results.</p>
            <ul className="alist">
              <li>Browse the marketplace and connect directly to the verified creator you need</li>
              <li>Pay only when milestones are delivered and approved</li>
              <li>KYC-verified talent with real, earned reputation scores</li>
              <li>Designers, developers, marketers, writers — all in one place</li>
            </ul>
            <button className="abtn">Browse creators →</button>
          </div>
        </div>
      </section>

      {/* ── 9. FEATURE GRID ── */}
      <section className="gridsec">
        <div className="rv">
          <div className="sec-label dark">PLATFORM FEATURES</div>
          <h2 className="sec-h">Every feature you need.<br />For both sides.</h2>
        </div>
        <div className="fgrid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`fgi rv d${i % 4}`}>
              <div className={`ftag ${f.tag}`}>{f.tag === 'cr' ? 'CREATOR' : f.tag === 'cl' ? 'CLIENT' : 'BOTH'}</div>
              <span className="fgico">{f.icon}</span>
              <div className="fgtit">{f.title}</div>
              <div className="fgdesc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMAGE 04 ── */}
      <div className="img-sec" style={{height:500,background:'#F2F2F2'}}>
        <div className="img-ph">
          <div className="img-badge">IMAGE 04 · COMMUNITY SECTION</div>
          <div className="img-num">04</div>
          <div className="img-label">Creator Community</div>
          <div className="img-prompt-txt">Diverse young professionals, bright editorial lighting, neon yellow accents.</div>
        </div>
      </div>

      {/* ── 10. TESTIMONIALS ── */}
      <section className="proofsec">
        <div className="phdr rv">
          <div>
            <div className="sec-label">TESTIMONIALS</div>
            <h2 className="sec-h">Real stories from real people</h2>
          </div>
          <div className="pratingbadge"><span className="stars">★★★★★</span> 4.9 · Early access members</div>
        </div>
        <div className="tcards">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`tc${t.cl ? ' cl' : ''} rv d${i % 4}`}>
              <div className="tctype">{t.role}</div>
              <p className="tctxt">{t.text}</p>
              <div className="tcauth">
                <div className="tav">{t.av}</div>
                <div>
                  <div className="tname">{t.name}</div>
                  <div className="trole-sm">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. FAQ ── */}
      <section className="faqsec">
        <div style={{textAlign:'center'}} className="rv">
          <div className="sec-label dark">FAQ</div>
          <h2 className="sec-h">Clear answers for<br />both sides</h2>
        </div>
        <div className="fqtabs rv d1">
          <button className={`fqtab${faqTab === 'cr' ? ' on' : ''}`} onClick={() => { setFaqTab('cr'); setOpenFaq(null); }}>For Creators</button>
          <button className={`fqtab${faqTab === 'cl' ? ' on' : ''}`} onClick={() => { setFaqTab('cl'); setOpenFaq(null); }}>For Clients</button>
        </div>
        <div className="fqpanel">
          {(faqTab === 'cr' ? CR_FAQS : CL_FAQS).map(faq => (
            <div key={faq.id} className={`fqitem${openFaq === faq.id ? ' op' : ''}`}>
              <button className="fqq" onClick={() => toggleFaq(faq.id)}>
                {faq.q} <span className="fqico">+</span>
              </button>
              <div className="fqa">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 12. CTA ── */}
      <section className="ctasec">
        <div className="ctabg" />
        <div className="ctacont">
          <div className="sec-label inv rv">JOIN NOW</div>
          <h2 className="ctah2 rv d1">
            Two sides.<br />One marketplace.<br /><span style={{color:'#CEFF1B'}}>Infinite potential.</span>
          </h2>
          <p className="rv d2" style={{fontSize:17,color:'rgba(255,255,255,.4)',marginTop:18,fontWeight:300,maxWidth:480,marginLeft:'auto',marginRight:'auto',textAlign:'center'}}>
            The place where the best creators and the best clients finally find each other — and every deal is protected.
          </p>
          <div className="ctadual rv d2">
            <div className="ctablock crcta">
              <div className="ctawho">FOR CREATORS</div>
              <div className="ctablkh">Start your creator journey</div>
              <div className="ctablkp">Free to join. Get discovered from day one.</div>
              <div className="eform">
                <input type="email" className="einp" placeholder="Your email" />
                <button className="ebtn">Join →</button>
              </div>
            </div>
            <div className="ctablock clcta">
              <div className="ctawho">FOR CLIENTS</div>
              <div className="ctablkh">Browse the marketplace</div>
              <div className="ctablkp">Free to browse. Hire when you find the right fit.</div>
              <div className="eform">
                <input type="email" className="einp" placeholder="Your email" />
                <button className="ebtn">Browse free →</button>
              </div>
            </div>
          </div>
          <p className="ctamic rv d3">NO CREDIT CARD REQUIRED · LAUNCHING SOON · FOUNDING SPOTS LIMITED</p>
        </div>
      </section>

      {/* ── IMAGE 05 ── */}
      <div className="img-sec" style={{height:480,background:'#0a0a0a'}}>
        <div className="img-ph" style={{color:'#222'}}>
          <div className="img-badge">IMAGE 05 · CLOSING</div>
          <div className="img-num" style={{color:'#111'}}>05</div>
          <div className="img-label" style={{color:'#222'}}>Ambition &amp; Movement</div>
          <div className="img-prompt-txt" style={{color:'#222'}}>Wide cinematic city/ambition. Urban skyline, movement, neon yellow glow on black.</div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="ftop">
          <div>
            <a href="#" className="logo" style={{fontSize:22,color:'#fff'}}>ultra<span>hustle</span></a>
            <p className="fdesc">Work Hard. Work Smart. Work Ultra.<br />Creator marketplace for talent and the businesses that hire it.</p>
          </div>
          {[
            { title: 'Platform', links: ['Marketplace','Services','Digital Products','Courses','Teams'] },
            { title: 'Creators', links: ['Dashboard','Payout Wallet','Reputation','Analytics','Boost'] },
            { title: 'Clients',  links: ['Browse Marketplace','How it Works','Smart Contracts','Escrow'] },
            { title: 'Company',  links: ['About','Blog','Contact','Privacy','Terms'] },
          ].map(col => (
            <div key={col.title}>
              <div className="fctit">{col.title}</div>
              <ul className="flinks">{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="fbtm">
          <div className="fcopy">© 2025 Ultra Hustle. All rights reserved. @ultrahustle</div>
          <div className="fslogan">Work Hard. Work Smart. Work <span>Ultra.</span></div>
        </div>
      </footer>
    </>
  );
}
