import { NextResponse } from 'next/server'

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="color-scheme" content="light" />
  <meta name="theme-color" content="#faf7f0" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="description" content="eevolvv — AI-native business transformation. A service, not software." />
  <meta property="og:title" content="EEVOLVV — We become your AI operations team." />
  <meta property="og:description" content="Ghost Locker. Internal OS. Diagnostic Engine. A service, not software. — eevolvv.com/yc" />
  <meta property="og:image" content="https://eevolvv.com/yc/opengraph-image" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://eevolvv.com/yc" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="EEVOLVV — We become your AI operations team." />
  <meta name="twitter:description" content="Ghost Locker. Internal OS. Diagnostic Engine. A service, not software." />
  <meta name="twitter:image" content="https://eevolvv.com/yc/opengraph-image" />
  <title>EEVOLVV · OVERVIEW · 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&amp;family=Space+Grotesk:wght@400;600;700&amp;display=swap" rel="stylesheet" />
  <style>
    :root {
      --paper: #faf7f0;
      --ink:   #141413;
      --accent: oklch(0.45 0.13 25);
      --rule:  rgba(20,20,19,.14);
      --rule-s: rgba(20,20,19,.30);
      --font-display: 'Space Grotesk', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --font-serif: 'Newsreader', serif;
      --max: 1100px;
      --px: clamp(24px, 5vw, 80px);
    }

    ::selection { background: var(--ink); color: var(--paper); }
    ::-moz-selection { background: var(--ink); color: var(--paper); }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      background: var(--paper);
      color: var(--ink);
      font-family: var(--font-display);
      font-size: 16px;
      line-height: 1.6;
      overflow-x: hidden;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    /* ─────────────────────────────────────────
       NAV
    ───────────────────────────────────────── */
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: clamp(10px, 2.5vw, 22px);
      padding: calc(10px + env(safe-area-inset-top, 0px))
        max(var(--px), env(safe-area-inset-right, 0px))
        12px
        max(var(--px), env(safe-area-inset-left, 0px));
      background: rgba(250,247,240,.93);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--rule);
    }
    /* Two columns when label hidden on narrow phones */
    @media (max-width: 580px) {
      nav {
        grid-template-columns: auto minmax(0, 1fr);
      }
      .nav-tag { display: none; }
    }
    .nav-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      min-width: 44px;
      padding: 4px 8px 4px 0;
      margin: -4px 0 -4px -4px;
      line-height: 0;
      text-decoration: none;
      flex-shrink: 0;
    }
    .nav-logo img {
      height: clamp(28px, 4.2vw, 40px);
      width: auto;
      display: block;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    .nav-tag {
      font-family: var(--font-mono);
      font-size: clamp(9px, 2.2vw, 10px);
      letter-spacing: .16em;
      text-transform: uppercase;
      opacity: .35;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: min(148px, 22vw);
      justify-self: end;
      text-align: right;
    }
    /* Horizontal swipe for slide dots — no wrapping jungle on phones */
    .nav-dots-scroll {
      justify-self: center;
      width: 100%;
      max-width: min(620px, 100%);
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
      mask-image: linear-gradient(90deg, transparent, #000 10px, #000 calc(100% - 10px), transparent);
      mask-size: 100% 100%;
    }
    .nav-dots-scroll::-webkit-scrollbar { display: none; }
    .nav-dots {
      display: flex;
      flex-wrap: nowrap;
      gap: 0;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      width: max-content;
      max-width: none;
      padding: 4px 0;
    }
    /* 44×44px minimum tap target (WCAG advisory); dot drawn in ::after */
    .nd {
      scroll-snap-align: center;
      width: 44px;
      height: 44px;
      margin: 0;
      appearance: none;
      -webkit-appearance: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      background: transparent;
      border: none;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .nd::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(20,20,19,.25);
      transition: background .2s, transform .2s;
    }
    .nd.on::after {
      background: var(--accent);
      transform: scale(1.5);
    }

    /* GTM “four channels” tiles — stack on narrow phones */
    .channel-subgrid {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    @media (max-width: 640px) {
      .channel-subgrid { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .fi.vis, .fi.vis.line,
      .hero-gradient-word,
      .cover-ew,
      .cover-ew::before,
      .btn-gradient,
      .grid-drift {
        animation: none !important;
      }
      .cover-ghost-wrap,
      .ghost-eye {
        animation: none !important;
      }
      .mascot-track {
        animation: none !important;
        transform: none !important;
      }
      .cover-ew { filter: none !important; }
    }

    /* ─────────────────────────────────────────
       SECTIONS
    ───────────────────────────────────────── */
    section {
      min-height: 100vh; /* fallback */
      min-height: 100dvh; /* avoids mobile browser chrome clipping full-bleed sections */
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding:
        clamp(96px, 22vw, 124px)
        max(var(--px), env(safe-area-inset-left, 0px))
        clamp(52px, 12vw, 88px)
        max(var(--px), env(safe-area-inset-right, 0px));
      border-bottom: 1px solid var(--rule);
      position: relative;
      scroll-margin-top: max(72px, calc(env(safe-area-inset-top, 0px) + 56px));
    }
    section.dk {
      background: var(--ink);
      color: var(--paper);
      --rule: rgba(250,247,240,.12);
      --rule-s: rgba(250,247,240,.28);
    }
    .inner { max-width: var(--max); margin: 0 auto; width: 100%; }

    /* ─────────────────────────────────────────
       ANIMATIONS
    ───────────────────────────────────────── */
    @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    @keyframes fadeUp { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
    @keyframes drawLine { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
    @keyframes gridDrift { 0% { transform: translateY(0); } 100% { transform: translateY(64px); } }
    @keyframes matrixGlitch {
      0%, 94%, 100% { transform: translate(0, 0) skewX(0); }
      95% { transform: translate(-5px, 2px) skewX(15deg); filter: drop-shadow(4px 0 var(--accent)); }
      96% { transform: translate(4px, -3px) skewX(-15deg); filter: drop-shadow(-4px 0 rgba(250,247,240,0.4)); }
      97% { transform: translate(-2px, 1px) skewX(5deg); }
      98% { transform: translate(0, 0) skewX(0); }
    }
    @keyframes epicEntrance {
      0% { opacity: 0; transform: scale(1.15) translateY(30px); filter: blur(20px); letter-spacing: .15em; }
      100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); letter-spacing: -.02em; }
    }
    @keyframes epicGlow {
      0%, 100% { opacity: 0.3; transform: scale(1); filter: blur(16px); }
      50% { opacity: 0.7; transform: scale(1.02); filter: blur(28px); }
    }

    .fi { opacity: 0; }
    .fi.vis { animation: fadeUp 0.9s cubic-bezier(0.2,0.8,0.2,1) forwards; }
    .fi.vis.line { animation: drawLine 1.4s cubic-bezier(0.65,0,0.35,1) forwards; transform-origin: left; transform: scaleX(0); }
    .fi.d1 { animation-delay: .1s; }
    .fi.d2 { animation-delay: .2s; }
    .fi.d3 { animation-delay: .3s; }
    .fi.d4 { animation-delay: .4s; }
    .fi.d5 { animation-delay: .55s; }

    .grid-drift {
      position: absolute; inset: -100px 0 0 0; z-index: -1;
      background-size: 64px 64px;
      background-image: linear-gradient(to right, rgba(20,20,19,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(20,20,19,0.03) 1px, transparent 1px);
      animation: gridDrift 20s linear infinite;
    }
    section.dk .grid-drift {
      background-image: linear-gradient(to right, rgba(250,247,240,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(250,247,240,0.03) 1px, transparent 1px);
    }

    .hero-gradient-word {
      background: linear-gradient(90deg, var(--ink), var(--accent), var(--ink));
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 9s ease-in-out infinite;
    }
    section.dk .hero-gradient-word {
      background: linear-gradient(90deg, var(--paper), var(--accent), var(--paper));
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .btn-gradient {
      background: linear-gradient(90deg, var(--ink), var(--accent), var(--ink));
      background-size: 200% auto;
      color: var(--paper) !important;
      animation: gradientShift 9s ease-in-out infinite;
      border: none;
      transition: transform 0.2s cubic-bezier(0.2,0.8,0.2,1);
    }
    .btn-gradient:hover { transform: translateY(-2px); }

    /* ─────────────────────────────────────────
       TYPOGRAPHY
    ───────────────────────────────────────── */
    .marker {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: .22em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 28px;
    }
    .marker span { opacity: .45; color: inherit; }

    h1 { font-family: var(--font-display); font-size: clamp(52px, 9vw, 100px); font-weight: 700; line-height: .95; letter-spacing: -.03em; }
    h2 { font-family: var(--font-display); font-size: clamp(34px, 5.5vw, 64px); font-weight: 700; line-height: 1.05; letter-spacing: -.025em; }
    h3 { font-family: var(--font-display); font-size: clamp(18px, 2.5vw, 26px); font-weight: 600; line-height: 1.25; }
    .it { font-family: var(--font-serif); font-style: italic; }
    .mono { font-family: var(--font-mono); }
    p.lead { font-size: clamp(15px, 2vw, 20px); line-height: 1.65; opacity: .7; max-width: 620px; margin-top: 20px; }
    .rule { width: 44px; height: 2px; background: var(--accent); margin: 24px 0; }

    /* ─────────────────────────────────────────
       GRID
    ───────────────────────────────────────── */
    .g2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 28px; }
    .g3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; }
    .g4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
    @media(max-width:768px) { .g2,.g3,.g4 { grid-template-columns: 1fr; } }

    /* ─────────────────────────────────────────
       CARD
    ───────────────────────────────────────── */
    .card { border: 1px solid var(--rule); padding: 26px; }
    @media (max-width: 480px) {
      .card { padding: 20px 18px; }
      .founder { padding: 24px 20px; }
      .gl-step { padding: 18px 14px; }
      .term { font-size: 12px; line-height: 1.85; padding: 16px 18px; }
    }
    .card-lbl { font-family: var(--font-mono); font-size: 9px; letter-spacing: .2em; text-transform: uppercase; opacity: .38; margin-bottom: 10px; }
    .card-val { font-family: var(--font-display); font-size: clamp(26px, 4vw, 42px); font-weight: 700; line-height: 1.1; }
    .card-sub { font-size: 12px; opacity: .45; margin-top: 5px; }

    /* ─────────────────────────────────────────
       TERMINAL
    ───────────────────────────────────────── */
    .term {
      background: rgba(20,20,19,.055);
      border: 1px solid var(--rule);
      border-left: 3px solid var(--accent);
      padding: 20px 24px;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.9;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    section.dk .term { background: rgba(250,247,240,.055); }
    .tc { opacity: .3; }
    .tk { color: var(--accent); }
    .tv { opacity: .68; }
    .ta { color: var(--accent); margin-right: 8px; }

    /* ─────────────────────────────────────────
       PROGRESS
    ───────────────────────────────────────── */
    .pbar-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
    .pbar-lbl { font-family: var(--font-mono); font-size: 11px; opacity: .6; min-width: 60px; }
    .pbar { font-family: var(--font-mono); font-size: 15px; color: var(--accent); flex: 1; letter-spacing: -.02em; }
    .pbar-pct { font-family: var(--font-mono); font-size: 11px; opacity: .45; min-width: 36px; text-align: right; }

    /* ─────────────────────────────────────────
       PROBLEM ITEMS
    ───────────────────────────────────────── */
    .prob { display: grid; grid-template-columns: 52px 1fr; gap: 18px; padding: 26px 0; border-bottom: 1px solid var(--rule); align-items: start; }
    @media (max-width: 380px) {
      .prob { grid-template-columns: 40px 1fr; gap: 14px; padding: 20px 0; }
    }
    .prob-n { font-family: var(--font-mono); font-size: 10px; color: var(--accent); letter-spacing: .1em; padding-top: 5px; }

    /* ─────────────────────────────────────────
       TIMELINE
    ───────────────────────────────────────── */
    .tl-item { display: grid; grid-template-columns: 130px 1fr; gap: 24px; padding: 22px 0; border-bottom: 1px solid var(--rule); align-items: start; }
    .tl-ph { font-family: var(--font-mono); font-size: 10px; letter-spacing: .16em; color: var(--accent); text-transform: uppercase; padding-top: 4px; line-height: 1.8; }
    @media(max-width:600px) { .tl-item { grid-template-columns: 1fr; } }

    /* ─────────────────────────────────────────
       MATRIX
    ───────────────────────────────────────── */
    .matrix-wrap { display: flex; gap: clamp(28px, 5vw, 40px); align-items: flex-start; flex-wrap: wrap; margin-top: 48px; }
    .matrix {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 2px;
      max-width: min(460px, 100%);
      flex-shrink: 0;
    }
    @media (max-width: 520px) {
      .matrix-wrap { flex-direction: column; }
      .matrix {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        width: 100%;
        max-width: 100%;
      }
      .mc { min-height: 0; }
    }
    .mc { padding: 22px; border: 1px solid var(--rule); min-height: 130px; display: flex; flex-direction: column; justify-content: flex-end; }
    .mc.hi { background: var(--accent); color: var(--paper); border-color: var(--accent); }
    .mc-name { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
    .mc-desc { font-size: 11px; opacity: .65; font-family: var(--font-mono); line-height: 1.5; }
    .ax { font-family: var(--font-mono); font-size: 9px; letter-spacing: .18em; opacity: .35; text-transform: uppercase; }

    /* ─────────────────────────────────────────
       FOUNDER
    ───────────────────────────────────────── */
    .founder { border: 1px solid var(--rule); padding: 36px; max-width: 500px; }
    .founder-photo { width: 72px; height: 72px; margin-bottom: 22px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
    .founder-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .founder-name  { font-size: 20px; font-weight: 700; margin-bottom: 3px; }
    .founder-title { font-family: var(--font-mono); font-size: 11px; color: var(--accent); letter-spacing: .12em; text-transform: uppercase; margin-bottom: 16px; }
    .founder-bio   { font-size: 14px; opacity: .65; line-height: 1.85; }
    .founder-tags  { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
    .founder-tag   { font-family: var(--font-mono); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--rule); opacity: .6; }
    .founder-email { font-family: var(--font-mono); font-size: 12px; color: var(--accent); margin-top: 18px; }

    /* ─────────────────────────────────────────
       § 00 COVER
    ───────────────────────────────────────── */
    #s00 {
      background:
        radial-gradient(ellipse 90% 75% at 88% 12%, rgba(140, 43, 26, 0.09), transparent 58%),
        radial-gradient(ellipse 55% 45% at 8% 88%, rgba(20, 20, 19, 0.045), transparent 55%),
        linear-gradient(180deg, #fdfcf8 0%, var(--paper) 38%, #f5f1ea 100%);
      color: var(--ink);
      justify-content: center;
      padding-top: 108px;
      padding-bottom: 96px;
      overflow-x: clip;
      overflow-y: visible;
    }
    #s00 .cover-split {
      display: grid;
      grid-template-columns: 1fr minmax(220px, 42%);
      gap: clamp(32px, 5vw, 72px);
      align-items: center;
    }
    @media (max-width: 1024px) {
      #s00 .cover-split { grid-template-columns: 1fr; }
      #s00 .cover-art { order: -1; margin: 0 auto 8px; max-width: min(400px, 100%); }
    }
    .cover-art { position: relative; width: 100%; max-width: 440px; margin-left: auto; pointer-events: none; user-select: none; }
    @media (max-width: 1024px) {
      .cover-art { margin-right: auto; }
    }
    .cover-art svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 28px 56px rgba(20, 20, 19, 0.07)); }
    #s00 .cover-copy {
      min-width: 0;
      max-width: 100%;
    }
    .cover-ew {
      position: relative;
      display: inline-block;
      max-width: 100%;
      font-family: var(--font-mono);
      font-size: clamp(40px, min(13vw, 15vh), 150px);
      font-weight: 700;
      line-height: .9;
      letter-spacing: -0.065em;
      text-transform: uppercase;
      color: transparent;
      background: linear-gradient(110deg, var(--ink) 10%, oklch(0.25 0.08 25) 30%, var(--accent) 50%, oklch(0.25 0.08 25) 70%, var(--ink) 90%);
      background-size: 250% auto;
      -webkit-background-clip: text;
      background-clip: text;
      animation: epicEntrance 2.2s cubic-bezier(0.1, 0.9, 0.1, 1) forwards, gradientShift 8s linear infinite, matrixGlitch 6.2s infinite;
      z-index: 2;
    }
    .cover-ew::before {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      color: transparent;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      z-index: -1;
      animation: epicGlow 5s ease-in-out infinite, gradientShift 8s linear infinite;
      pointer-events: none;
    }
    #s00 .cover-tag { font-family: var(--font-serif); font-style: italic; font-size: clamp(18px, 2.8vw, 30px); color: rgba(20, 20, 19, 0.56); margin-top: 22px; }
    .cover-meta { display: flex; gap: clamp(24px, 5vw, 44px); margin-top: clamp(36px, 8vw, 52px); flex-wrap: wrap; }
    #s00 .cm-lbl { font-family: var(--font-mono); font-size: 9px; letter-spacing: .22em; text-transform: uppercase; opacity: .45; margin-bottom: 4px; color: var(--ink); }
    #s00 .cm-val { font-family: var(--font-display); font-size: 17px; font-weight: 600; color: var(--ink); }

    /* ─────────────────────────────────────────
       GHOST LOCKER FEATURE SECTION
    ───────────────────────────────────────── */
    .gl-pipeline {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2px;
      margin-top: 40px;
    }
    @media(max-width:900px) { .gl-pipeline { grid-template-columns: repeat(3, 1fr); } }
    @media(max-width:600px) { .gl-pipeline { grid-template-columns: 1fr; } }
    .gl-step {
      padding: 22px 18px;
      border: 1px solid var(--rule);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .gl-step-num { font-family: var(--font-mono); font-size: 9px; letter-spacing: .2em; color: var(--accent); }
    .gl-step-name { font-weight: 700; font-size: 14px; }
    .gl-step-desc { font-size: 12px; opacity: .55; line-height: 1.6; }

    /* ─────────────────────────────────────────
       OS ROUTES
    ───────────────────────────────────────── */
    .os-routes {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
      margin-top: 32px;
    }
    @media(max-width:768px) { .os-routes { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:480px) { .os-routes { grid-template-columns: 1fr; } }
    .os-route {
      padding: 14px 16px;
      border: 1px solid var(--rule);
      font-family: var(--font-mono);
      font-size: 11px;
    }
    .os-route-path { color: var(--accent); letter-spacing: .08em; margin-bottom: 4px; }
    .os-route-desc { opacity: .5; font-size: 10px; letter-spacing: .04em; }

    /* ─────────────────────────────────────────
       § 12 CTA
    ───────────────────────────────────────── */
    #s12 .marker { color: rgba(250,247,240,.55); }
    #s12 .rule { background: rgba(250,247,240,.45); }
    #s12 {
      padding-bottom: max(clamp(52px, 12vw, 88px), calc(12px + env(safe-area-inset-bottom, 0px)));
    }
    #s12 .cta-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      margin-top: 28px;
    }
    #s12 .cta-actions .cta-btn {
      margin-top: 0 !important;
    }
    @media (max-width: 560px) {
      #s12 .cta-actions {
        align-items: stretch;
        width: 100%;
        max-width: 440px;
      }
      #s12 .cta-actions .cta-btn {
        justify-content: center;
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
      }
    }
    #s12 .cta-btn--outline {
      background: transparent !important;
      color: var(--paper) !important;
      -webkit-text-fill-color: var(--paper) !important;
      border: 1px solid rgba(250,247,240,.45);
      animation: none;
    }
    #s12 .cta-btn--outline:hover { background: rgba(250,247,240,.12) !important; }
    .cta-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      gap: 10px;
      background: var(--paper);
      color: var(--accent);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 13px;
      letter-spacing: .1em;
      padding: 14px 28px;
      margin-top: 32px;
      text-decoration: none;
      transition: opacity .2s;
    }
    .cta-btn:hover { opacity: .85; }
    .cta-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 3px;
    }
    #s12 .cta-btn:focus-visible {
      outline-color: var(--paper);
      outline-offset: 3px;
    }
    .cta-contact { font-family: var(--font-mono); font-size: 13px; opacity: .65; margin-top: 28px; line-height: 1.9; }

    /* ─────────────────────────────────────────
       FOOTER
    ───────────────────────────────────────── */
    footer {
      background: var(--ink);
      color: var(--paper);
      padding: 22px max(var(--px), env(safe-area-inset-right, 0px))
        max(22px, env(safe-area-inset-bottom, 0px))
        max(var(--px), env(safe-area-inset-left, 0px));
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .fc { font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; opacity: .35; }

    /* ─────────────────────────────────────────
       HELPERS
    ───────────────────────────────────────── */
    .sep { border: none; border-top: 1px solid var(--rule); margin: 40px 0; }
    .pill { display: inline-block; font-family: var(--font-mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--rule); opacity: .55; margin-top: 14px; }
    .pill.live { border-color: var(--accent); color: var(--accent); opacity: 1; }

    /* ─────────────────────────────────────────
       VOLVV-E HERO GHOST
    ───────────────────────────────────────── */
    #hero-ghost {
      display: block;
      width: 100%;
      max-width: min(340px, 92vw);
      height: auto;
      aspect-ratio: 380 / 360;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    .cover-ghost-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: ghostFloat 3.4s ease-in-out infinite;
    }
    @keyframes ghostFloat {
      0%, 100% { transform: translateY(0px);   filter: drop-shadow(0 10px 28px rgba(140,43,26,.18)); }
      50%       { transform: translateY(-22px); filter: drop-shadow(0 32px 52px rgba(140,43,26,.38)); }
    }
    .ghost-eye { animation: eyeBlink 4.8s ease-in-out infinite; }
    @keyframes eyeBlink {
      0%, 84%, 100% { opacity: 1; }
      89%           { opacity: 0; }
    }

    /* ─────────────────────────────────────────
       MASCOT SCROLL STRIP
    ───────────────────────────────────────── */
    .mascot-strip {
      overflow: hidden;
      height: 68px;
      background: var(--ink);
      border-top: 1px solid rgba(250,247,240,.06);
      border-bottom: 1px solid rgba(250,247,240,.06);
      display: flex;
      align-items: center;
    }
    .mascot-track {
      display: flex;
      align-items: center;
      gap: 56px;
      animation: mascotScroll 22s linear infinite;
      flex-shrink: 0;
    }
    .mascot-track img {
      height: 36px;
      width: auto;
      opacity: .28;
      filter: invert(1);
      flex-shrink: 0;
    }
    @keyframes mascotScroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  </style>
</head>
<body>

<nav aria-label="Overview">
  <a class="nav-logo" href="https://eevolvv.com" target="_blank" rel="noopener noreferrer" title="eevolvv · home">
    <img src="/logo.png" width="1024" height="528" alt="eevolvv" decoding="async" fetchpriority="high" sizes="160px" />
  </a>
  <div class="nav-dots-scroll" aria-label="Jump to slide" role="group">
    <div class="nav-dots" id="ndots"></div>
  </div>
  <div class="nav-tag" aria-hidden="true">OVERVIEW · 2026</div>
</nav>

<!-- ─── § 00 COVER ─────────────────────── -->
<section id="s00">
  <div class="grid-drift"></div>
  <div class="inner cover-split">
    <div class="cover-copy">
      <div class="marker fi">00 <span>· OVERVIEW · Q2 2026</span></div>
      <div class="cover-ew" data-text="EEVOLVV">EEVOLVV</div>
      <div class="cover-tag fi d2">A service, not software.</div>
      <div class="cover-meta fi d3">
        <div><div class="cm-lbl">Status</div><div class="cm-val">Live · Shipped</div></div>
        <div><div class="cm-lbl">Stage</div><div class="cm-val">Founder-led</div></div>
        <div><div class="cm-lbl">Category</div><div class="cm-val">AI Operations</div></div>
        <div><div class="cm-lbl">Date</div><div class="cm-val">Q2 2026</div></div>
      </div>
    </div>

    <div class="fi d2" aria-hidden="true" style="display:flex;align-items:center;justify-content:center;padding:20px 0;">
      <div class="cover-ghost-wrap">
        <svg id="hero-ghost" xmlns="http://www.w3.org/2000/svg" width="380" height="360" viewBox="0 0 380 360" aria-hidden="true"></svg>
      </div>
    </div>
  </div>
</section>

<!-- ─── MASCOT SCROLL STRIP ───────────────── -->
<div class="mascot-strip" aria-hidden="true">
  <div class="mascot-track">
    <img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" /><img src="/mascot.png" alt="" width="120" height="36" decoding="async" loading="lazy" />
  </div>
</div>

<!-- ─── § 01 PROBLEM ────────────────────── -->
<section id="s01">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">01 <span>· THE PROBLEM</span></div>
    <h2 class="fi d1">Every business is full of <br><span class="it">work that shouldn't exist.</span></h2>
    <div class="rule fi line d2"></div>

    <div class="fi d2">
      <div class="prob">
        <div class="prob-n">N=01</div>
        <div>
          <h3>Your best people are doing your worst work.</h3>
          <p style="margin-top:10px;font-size:14px;opacity:.6;line-height:1.75;">We call it ghost work — the invisible, habitual tasks haunting every business. The controller reconciling two spreadsheets every Tuesday. The VP of Sales logging calls by hand. The ops lead copy-pasting order data since 2019. Nobody questions it. It just is. The average business loses 23 hours a week to work that shouldn't exist.</p>
        </div>
      </div>
      <div class="prob">
        <div class="prob-n">N=02</div>
        <div>
          <h3>Consulting Is Out of Reach</h3>
          <p style="margin-top:10px;font-size:14px;opacity:.6;line-height:1.75;">McKinsey charges $500K+ per engagement. The 99% of SMBs that need transformation most are permanently priced out. Mid-market companies run structured programs — QA, audit, compliance — on $50K–$500K/yr in consultant labor. There is no good AI solution. Yet.</p>
        </div>
      </div>
      <div class="prob">
        <div class="prob-n">N=03</div>
        <div>
          <h3>Generic AI Has No Context</h3>
          <p style="margin-top:10px;font-size:14px;opacity:.6;line-height:1.75;">Asking ChatGPT for business strategy is like asking a stranger for a health diagnosis. No continuity, no accountability, no institutional memory. Context is everything — and context compounds. That's the moat.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ─── § 02 SOLUTION ───────────────────── -->
<section id="s02" class="dk">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">02 <span>· THE SOLUTION</span></div>
    <h2 class="fi d1">We don't sell software. <br><span class="it">We become your AI operations team.</span></h2>
    <div class="rule fi line d2"></div>
    <p class="lead fi d2">eevolvv builds and deploys AI agents for structured business programs — QA, financial audit, compliance, and beyond. Mid-market companies spend $50K–$500K/yr running these programs on consultant labor. We replace that engagement at a fraction of the cost. Simultaneously, our diagnostic engine serves SMBs at scale — the brand that funds the long game.</p>

    <div class="term fi d3" style="margin-top:44px;">
      <div class="tc">// proprietary_pipeline.log — eevolvv service delivery</div>
      <div><span class="ta">→</span><span class="tk">DIAGNOSE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">↳ AI-led conversation · maps business health across 12 nodes · outputs Evolution Report</span></div>
      <div><span class="ta">→</span><span class="tk">ONBOARD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">↳ Scope agreement · access provisioned · integrations mapped · pilot program defined</span></div>
      <div><span class="ta">→</span><span class="tk">DEPLOY PROGRAM AGENTS</span> <span class="tv">&nbsp;&nbsp;&nbsp;↳ QA · finance audit · compliance · IT security · revenue cycle · and more</span></div>
      <div><span class="ta">→</span><span class="tk">MAINTAIN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">↳ Ongoing advisory · monitoring · quarterly re-calibration · context compounds monthly</span></div>
      <div class="tc" style="margin-top:6px;">// result: irreplaceable AI infrastructure inside every client · the forever customer</div>
    </div>
  </div>
</section>

<!-- ─── § 03 PRODUCT ────────────────────── -->
<section id="s03">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">03 <span>· PRODUCT</span></div>
    <h2 class="fi d1">The stack. <br><span class="it">All of it live.</span></h2>
    <div class="rule fi line d2"></div>

    <div class="g2 fi d2" style="margin-top:44px;">
      <div class="card">
        <div class="card-lbl">CORE · LIVE NOW</div>
        <h3>Diagnostic Engine</h3>
        <p style="margin-top:12px;font-size:14px;opacity:.6;line-height:1.7;">AI-powered conversation that maps business health across 12 dimensions. No forms. No jargon. A real conversation that produces a real Evolution Report, delivered to the client's inbox within minutes.</p>
        <div class="pill live" style="margin-top:18px;">▓▓▓▓▓▓▓░░░ &nbsp;LIVE</div>
      </div>
      <div class="card">
        <div class="card-lbl">CORE · LIVE NOW</div>
        <h3>Evolution Report</h3>
        <p style="margin-top:12px;font-size:14px;opacity:.6;line-height:1.7;">Post-diagnostic report delivered by AI within minutes. Industry-benchmarked, actionable, specific — the first thing most business owners have ever received that actually fits their operation.</p>
        <div class="pill live" style="margin-top:18px;">▓▓▓▓▓▓▓░░░ &nbsp;LIVE</div>
      </div>
      <div class="card" style="border-left:3px solid var(--accent);">
        <div class="card-lbl">PROPRIETARY · LIVE NOW</div>
        <h3>Ghost Locker</h3>
        <p style="margin-top:12px;font-size:14px;opacity:.6;line-height:1.7;">AI agent manufacturing pipeline — from client intake to deployed, tested, documented agent. Five quality-gated phases: Intake → Blueprint → Build → Eval → Lock. Complete agents in hours. The operational moat competitors cannot buy off the shelf.</p>
        <div class="pill live" style="margin-top:18px;">▓▓▓▓▓▓▓▓░░ &nbsp;LIVE</div>
      </div>
      <div class="card">
        <div class="card-lbl">CORE · LIVE · BETA</div>
        <h3>eevolvv/talent</h3>
        <p style="margin-top:12px;font-size:14px;opacity:.6;line-height:1.7;">Micro-contracting marketplace for vetted consultants and specialists. When AI identifies the ghost work, eevolvv/talent finds the human operator to manage the transition. Bridge from diagnosis to execution.</p>
        <div class="pill live" style="margin-top:18px;">▓▓▓▓▓▓░░░░ &nbsp;LIVE · BETA</div>
      </div>
    </div>
  </div>
</section>

<!-- ─── § 04 GHOST LOCKER ───────────────── -->
<section id="s04" class="dk">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">04 <span>· GHOST LOCKER — PROPRIETARY BUILD INFRASTRUCTURE</span></div>
    <h2 class="fi d1">We don't just deploy agents. <br><span class="it">We manufacture them.</span></h2>
    <div class="rule fi line d2"></div>
    <p class="lead fi d2">Ghost Locker is our internal AI agent manufacturing pipeline — the infrastructure that takes a client from "we have a problem" to a deployed, documented, quality-tested AI agent. Built in-house, not off the shelf. This is the operational moat competitors cannot buy.</p>

    <div class="gl-pipeline fi d3">
      <div class="gl-step">
        <div class="gl-step-num">PHASE 01</div>
        <div class="gl-step-name">Intake</div>
        <div class="gl-step-desc">7-section structured client discovery. Maps problem space, workflows, constraints, and defines measurable success criteria before a single line is written.</div>
      </div>
      <div class="gl-step" style="border-left:3px solid var(--accent);">
        <div class="gl-step-num">PHASE 02</div>
        <div class="gl-step-name">Blueprint</div>
        <div class="gl-step-desc">Agent architecture design. Selects tool patterns, defines integration points, determines deployment strategy and escalation paths.</div>
      </div>
      <div class="gl-step">
        <div class="gl-step-num">PHASE 03</div>
        <div class="gl-step-name">Build</div>
        <div class="gl-step-desc">System prompt engineering, tool integration, configuration. The agent is built to spec with full auditability.</div>
      </div>
      <div class="gl-step">
        <div class="gl-step-num">PHASE 04</div>
        <div class="gl-step-name">Eval</div>
        <div class="gl-step-desc">Structured test suite execution. ≥80% pass rate required before deployment. Every agent earns its deployment slot.</div>
      </div>
      <div class="gl-step" style="border-right:3px solid var(--accent);">
        <div class="gl-step-num">PHASE 05</div>
        <div class="gl-step-name">Lock</div>
        <div class="gl-step-desc">Deploy to production. Client documentation, operational runbook, and handoff assets generated automatically. Agent is live.</div>
      </div>
    </div>

    <div class="term fi d4" style="margin-top:44px;">
      <div class="tc">// ghost_locker.log — agent manufacturing metrics · Q2 2026</div>
      <div><span class="ta">→</span><span class="tk">BUILD VELOCITY &nbsp;&nbsp;&nbsp;</span><span class="tv">↳ Complete agent from intake to production in hours — not weeks, not months</span></div>
      <div><span class="ta">→</span><span class="tk">QUALITY GATE &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">↳ ≥80% test pass rate required · no agent deploys without earning it</span></div>
      <div><span class="ta">→</span><span class="tk">OUTPUT ARTIFACTS &nbsp;</span><span class="tv">↳ system prompt · tools.json · config · client docs · operational runbook — all generated</span></div>
      <div><span class="ta">→</span><span class="tk">REPEATABILITY &nbsp;&nbsp;&nbsp;</span><span class="tv">↳ same pipeline, same quality guarantee, for every client, every agent, every time</span></div>
      <div><span class="ta">→</span><span class="tk">INTERNAL USE &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">↳ eevolvv's own agents are built with Ghost Locker — we run the pipeline on ourselves first</span></div>
      <div class="tc" style="margin-top:6px;">// this is how we scale without scaling headcount · the manufacturing advantage</div>
    </div>

    <div class="fi d5" style="margin-top:28px;padding:26px;border:1px solid rgba(250,247,240,.12);border-left:3px solid var(--accent);">
      <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:14px;text-transform:uppercase;">Why This Is the Moat</div>
      <p style="font-size:15px;opacity:.65;line-height:1.75;">Every AI consultancy says they build custom agents. None of them have a manufacturing pipeline. Ghost Locker is not a tool — it's a discipline. It is the reason eevolvv can promise a complete, quality-tested, documented agent to a client and deliver in hours. Competitors using general-purpose platforms cannot replicate this without building what we already built.</p>
    </div>
  </div>
</section>

<!-- ─── § 05 INTERNAL OS ─────────────────── -->
<section id="s05">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">05 <span>· INTERNAL OS — WE RUN EEVOLVV ON EEVOLVV</span></div>
    <h2 class="fi d1">The operations dashboard <br><span class="it">we built for ourselves.</span></h2>
    <div class="rule fi line d2"></div>
    <p class="lead fi d2">Before we sell AI operations infrastructure to clients, we built it for ourselves. The eevolvv OS is a live, 11-route internal operations dashboard managing every dimension of the business — clients, pipeline, finance, agents, investors, tasks, and more — all connected to real data in real time.</p>

    <div class="os-routes fi d3">
      <div class="os-route">
        <div class="os-route-path">/os/clients</div>
        <div class="os-route-desc">Full CRM · CRUD · pipeline status</div>
      </div>
      <div class="os-route">
        <div class="os-route-path">/os/pipeline</div>
        <div class="os-route-desc">Deal flow · stage tracking · total value KPI</div>
      </div>
      <div class="os-route">
        <div class="os-route-path">/os/finance</div>
        <div class="os-route-desc">Bank balance · Stripe MRR · KPI grid</div>
      </div>
      <div class="os-route">
        <div class="os-route-path">/os/agents</div>
        <div class="os-route-desc">Agent registry · status · deployment log</div>
      </div>
      <div class="os-route">
        <div class="os-route-path">/os/tasks</div>
        <div class="os-route-desc">Ops tasks · priority dots · status cycling</div>
      </div>
      <div class="os-route">
        <div class="os-route-path">/os/investors</div>
        <div class="os-route-desc">Raise progress bar · stage cycling · contacts</div>
      </div>
      <div class="os-route">
        <div class="os-route-path">/os/feed</div>
        <div class="os-route-desc">Live activity feed · Supabase-connected</div>
      </div>
      <div class="os-route">
        <div class="os-route-path">/os/links</div>
        <div class="os-route-desc">Quick-access hub · internal + external docs</div>
      </div>
    </div>

    <div class="term fi d4" style="margin-top:40px;">
      <div class="tc">// os_build_log.log — shipped Q2 2026</div>
      <div><span class="ta">→</span><span class="tk">STACK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">↳ Next.js App Router · TypeScript · Supabase real-time · Vercel deploy</span></div>
      <div><span class="ta">→</span><span class="tk">DESIGN SYSTEM &nbsp;</span><span class="tv">↳ Full component library built in-house — Badge, Button, Card, KPIStat, TerminalBlock, and more</span></div>
      <div><span class="ta">→</span><span class="tk">LIVE COUNTS &nbsp;&nbsp;&nbsp;</span><span class="tv">↳ Sidebar badges pull real-time data — every number reflects live Supabase state</span></div>
      <div><span class="ta">→</span><span class="tk">PROOF OF WORK &nbsp;</span><span class="tv">↳ This is exactly what we deploy inside client operations — we proved it on ourselves first</span></div>
      <div class="tc" style="margin-top:6px;">// build velocity: 11 routes, full design system, real-time data — shipped in days by one founder</div>
    </div>

    <div class="fi d5" style="margin-top:28px;padding:26px;border:1px solid var(--rule);border-left:3px solid var(--accent);">
      <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:14px;text-transform:uppercase;">The "Eat Your Own Cooking" Proof</div>
      <p style="font-size:15px;opacity:.65;line-height:1.75;">Every client we pitch will ask: "Have you done this before?" The answer is yes — and we can show them our own OS. We built the infrastructure, ran it in production on our own business, and refined it until it was worth selling. The OS is simultaneously our operations layer and our best sales demo.</p>
    </div>
  </div>
</section>

<!-- ─── § 06 MARKET ─────────────────────── -->
<section id="s06" class="dk">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">06 <span>· MARKET SIZE</span></div>
    <h2 class="fi d1">The market isn't <br><span class="it">a niche. It's the world.</span></h2>
    <div class="rule fi line d2"></div>

    <div class="g3 fi d2" style="margin-top:48px;">
      <div class="card">
        <div class="card-lbl">TAM · SMB + ENTERPRISE AI SERVICES</div>
        <div class="card-val">$340B+</div>
        <div class="card-sub">Global SMB advisory + AI automation</div>
        <div style="margin-top:18px;">
          <div class="pbar-row"><div class="pbar-lbl">Global</div><div class="pbar">▓▓▓▓▓▓▓▓▓▓</div><div class="pbar-pct">100%</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-lbl">SAM · SMB AI AUTOMATION (2033)</div>
        <div class="card-val">$124B</div>
        <div class="card-sub">$68.3B today → $124.5B by 2033</div>
        <div style="margin-top:18px;">
          <div class="pbar-row"><div class="pbar-lbl">SAM</div><div class="pbar">▓▓░░░░░░░░</div><div class="pbar-pct">~36%</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-lbl">SOM · 36-MONTH TARGET</div>
        <div class="card-val">$18M</div>
        <div class="card-sub">Enterprise + Core + Micro combined</div>
        <div style="margin-top:18px;">
          <div class="pbar-row"><div class="pbar-lbl">Yr 1–3</div><div class="pbar">▓░░░░░░░░░</div><div class="pbar-pct">0.01%</div></div>
        </div>
      </div>
    </div>

    <div class="term fi d3" style="margin-top:40px;">
      <div class="tc">// program_agent_markets.log — the structured programs that fund Year 1</div>
      <div><span class="ta">→</span><span class="tk">QA PROGRAMS &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">$28.1B → $55.2B by 2028 · 14.5% CAGR · ISO 9001 / Six Sigma / CMMI · $50K–$200K/yr consultant spend</span></div>
      <div><span class="ta">→</span><span class="tk">FINANCE AUDIT &nbsp;&nbsp;</span><span class="tv">$1.4B → $8.7B by 2033 · 22.8% CAGR · SOX / internal audit · 1 in 2 CFOs still in pilot phase</span></div>
      <div><span class="ta">→</span><span class="tk">IT SECURITY COMP</span><span class="tv">$18.3B by 2027 · SOC 2 / ISO 27001 / HIPAA · cyber insurance driving mandatory compliance</span></div>
      <div><span class="ta">→</span><span class="tk">ESG / ENVIRO &nbsp;&nbsp;&nbsp;</span><span class="tv">$1.1B → $3.4B by 2028 · CSRD / SEC climate rules · every mid-market company in scope</span></div>
      <div><span class="ta">→</span><span class="tk">HEALTHCARE RCM &nbsp;</span><span class="tv">$63B market · 15% CAGR · medical billing / coding compliance / denial mgmt · deeply manual</span></div>
      <div><span class="ta">→</span><span class="tk">FOOD SAFETY &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">&gt;$5B · HACCP / FDA 21 CFR / SQF · every food manufacturer in scope · recurring audit cycles</span></div>
      <div style="margin-top:10px;"><span class="ta">→</span><span class="tk">SMB ADVISORY &nbsp;&nbsp;&nbsp;</span><span class="tv">$340B+ TAM · 400M SMBs · &lt;1% with professional advisory access · diagnostic engine = brand flywheel</span></div>
      <div><span class="ta">→</span><span class="tk">MICRO GLOBAL &nbsp;&nbsp;&nbsp;</span><span class="tv">25M+ micro-retailers · Phase 2 WhatsApp/Telegram-first · India / LatAm / Philippines</span></div>
    </div>
  </div>
</section>

<!-- ─── § 07 BUSINESS MODEL ─────────────── -->
<section id="s07">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">07 <span>· BUSINESS MODEL</span></div>
    <h2 class="fi d1">Programs pay the bills. <br><span class="it">SMB builds the brand.</span></h2>
    <div class="rule fi line d2"></div>
    <p class="lead fi d2">Both engines run simultaneously. Program agents generate enterprise-grade revenue from day one. The SMB platform builds brand at scale, cheaply. Together they compound into a data flywheel that makes eevolvv irreplaceable inside every client.</p>

    <div class="g3 fi d3" style="margin-top:48px;">
      <div class="card" style="border-top:3px solid var(--ink);">
        <div class="card-lbl">ENGINE 01 · PROGRAM AGENTS · REVENUE NOW</div>
        <div class="card-val">$2K<span style="font-size:16px;font-weight:400;opacity:.45;">–10K/mo</span></div>
        <p style="margin-top:14px;font-size:14px;opacity:.6;line-height:1.7;">AI agents deployed for QA, finance audit, IT compliance, ESG, healthcare RCM, food safety, HR compliance. Replaces $50K–$500K/yr in consultant labor per client. Motivated buyers sign fast — they have regulatory deadlines.</p>
        <div style="margin-top:16px;font-family:var(--font-mono);font-size:10px;color:var(--accent);letter-spacing:.12em;">3 clients → $50K+ MRR</div>
      </div>
      <div class="card" style="border-top:3px solid var(--accent);">
        <div class="card-lbl">ENGINE 02 · CORE SMB · BRAND + SCALE</div>
        <div class="card-val">$299<span style="font-size:16px;font-weight:400;opacity:.45;">/mo</span></div>
        <p style="margin-top:14px;font-size:14px;opacity:.6;line-height:1.7;">SMBs $0.5M–$10M revenue. Full diagnostic, Evolution Report, ongoing AI advisory, quarterly reviews. Low CAC through organic diagnostic funnel. Builds brand recognition and data flywheel while program agents carry the revenue.</p>
        <div style="margin-top:16px;font-family:var(--font-mono);font-size:10px;color:var(--accent);letter-spacing:.12em;">High-volume · inbound-driven · compounds</div>
      </div>
      <div class="card" style="border-top:3px solid rgba(20,20,19,.18);">
        <div class="card-lbl">ENGINE 03 · MICRO GLOBAL · PHASE 2</div>
        <div class="card-val">$29<span style="font-size:16px;font-weight:400;opacity:.45;">–49/mo</span></div>
        <p style="margin-top:14px;font-size:14px;opacity:.6;line-height:1.7;">Corner stores, kirana, sari-sari, bodegas. WhatsApp/Telegram-first. 25M+ micro-retailers globally who have never accessed professional advisory. The long-range vision — volume at scale in emerging markets.</p>
        <div style="margin-top:16px;font-family:var(--font-mono);font-size:10px;opacity:.45;letter-spacing:.12em;">Phase 2 · Q4 2027+</div>
      </div>
    </div>

    <div class="fi d5" style="margin-top:28px;padding:26px;border:1px solid var(--rule);border-left:3px solid var(--accent);">
      <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:14px;text-transform:uppercase;">The Forever Customer Model</div>
      <p style="font-size:15px;opacity:.65;line-height:1.75;">Program agents aren't one-time builds — they run monthly, quarterly, annually. Every cycle the AI ingests more data, tightens its model of the business, and becomes harder to remove. Context compounds. Switching cost rises. eevolvv becomes the institutional memory of the program — and eventually, the company.</p>
    </div>
  </div>
</section>

<!-- ─── § 08 GO-TO-MARKET ───────────────── -->
<section id="s08" class="dk">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">08 <span>· GO-TO-MARKET + MARKETING STRATEGY</span></div>
    <h2 class="fi d1">Three engines. <br><span class="it">One compounding flywheel.</span></h2>
    <div class="rule fi line d2"></div>

    <div class="fi d2" style="margin-top:44px;">
      <div class="tl-item">
        <div class="tl-ph">ENGINE 01<br>NOW → Q4 '26</div>
        <div>
          <h3>Enterprise Program Agents — Direct Revenue</h3>
          <p style="margin-top:10px;font-size:14px;opacity:.6;line-height:1.75;">Founder-led outbound to QA, compliance, and financial audit buyers at companies $5M–$50M. These are pragmatic, ROI-driven buyers with regulatory deadlines — they don't need convincing, they need a solution. Target: 3–5 signed program agent contracts generating $50K+ MRR. This is the path to profit.</p>
          <div style="margin-top:14px;font-family:var(--font-mono);font-size:11px;color:var(--accent);letter-spacing:.1em;">→ QA programs · finance audit · IT compliance · ESG · healthcare RCM · food safety · HR compliance</div>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-ph">ENGINE 02<br>NOW → Q3 '27</div>
        <div>
          <h3>SMB Diagnostic Funnel — Brand at Zero CAC</h3>
          <p style="margin-top:10px;font-size:14px;opacity:.6;line-height:1.75;">eevolvv.com diagnostic engine runs 24/7. Free AI diagnostic converts to $299/mo Core subscriptions. Four acquisition channels running simultaneously:</p>
          <div class="channel-subgrid">
            <div style="padding:16px;border:1px solid rgba(250,247,240,.12);border-left:2px solid var(--accent);">
              <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:8px;">SEO</div>
              <p style="font-size:13px;opacity:.65;line-height:1.65;">Transformation + AI automation keywords. Long-tail business pain queries — "ghost work," "AI operations," "business audit AI." Content written to be found, not performed.</p>
            </div>
            <div style="padding:16px;border:1px solid rgba(250,247,240,.12);border-left:2px solid var(--accent);">
              <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:8px;">FOUNDER CONTENT</div>
              <p style="font-size:13px;opacity:.65;line-height:1.65;">Founder-led LinkedIn + short-form video. The "ghost work" narrative compounds weekly. Authentic POV content builds trust faster than any ad budget.</p>
            </div>
            <div style="padding:16px;border:1px solid rgba(250,247,240,.12);border-left:2px solid var(--accent);">
              <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:8px;">VOLVV-E · THE MASCOT</div>
              <p style="font-size:13px;opacity:.65;line-height:1.65;">Ghost agent character — pixel-art animated avatar that represents eevolvv's AI agents. Shareable, memorable, brand recognition at zero CAC. The character is the product made visible.</p>
            </div>
            <div style="padding:16px;border:1px solid rgba(250,247,240,.12);border-left:2px solid var(--accent);">
              <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:8px;">NETWORK REFERRAL</div>
              <p style="font-size:13px;opacity:.65;line-height:1.65;">eevolvv/talent consultants refer clients. Every diagnostic generates word-of-mouth. The pipeline builds itself as the diagnostic runs.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-ph">ENGINE 03<br>Q4 '27+</div>
        <div>
          <h3>WhatsApp/Telegram-First Micro Tier</h3>
          <p style="margin-top:10px;font-size:14px;opacity:.6;line-height:1.75;">25M+ micro-retailers globally. No app download. No desktop. Just WhatsApp/Telegram — where everyone already talks to agents. $29–49/mo × massive volume = a new revenue frontier in emerging markets. First-contact AI for businesses conventional software never reached.</p>
          <p style="margin-top:12px;font-size:13px;opacity:.5;line-height:1.75;font-style:italic;">Proof-of-density play: India, LatAm, and the Philippines, where penetration already lives on every phone.</p>
        </div>
      </div>
    </div>

    <div class="term fi d4" style="margin-top:40px;">
      <div class="tc">// marketing_strategy.log — why "ghost work" is a category we can own</div>
      <div><span class="ta">→</span><span class="tk">CATEGORY NAME &nbsp;&nbsp;</span><span class="tv">↳ "Ghost work" — the invisible labor haunting every business · zero prior ownership · we define it</span></div>
      <div><span class="ta">→</span><span class="tk">BRAND TRUTH &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">↳ "A service, not software" — the counter-position to every AI SaaS pitch</span></div>
      <div><span class="ta">→</span><span class="tk">VIRAL MECHANIC &nbsp;</span><span class="tv">↳ diagnostic output is inherently shareable · business owners send reports to each other</span></div>
      <div><span class="ta">→</span><span class="tk">CHARACTER MOAT &nbsp;</span><span class="tv">↳ volvv-e mascot = mascot marketing before the category matures · Duolingo owl · Clippy done right</span></div>
      <div><span class="ta">→</span><span class="tk">CONTENT WEDGE &nbsp;&nbsp;</span><span class="tv">↳ "eevolvvtion" content theme = natural selection applied to business · quote library · infinite variations</span></div>
      <div><span class="ta">→</span><span class="tk">LOW CAC DESIGN &nbsp;</span><span class="tv">↳ inbound diagnostic funnel · organic SEO · word-of-mouth from reports · zero paid required to start</span></div>
    </div>
  </div>
</section>

<!-- ─── § 09 COMPETITIVE ─────────────────── -->
<section id="s09">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">09 <span>· COMPETITIVE LANDSCAPE</span></div>
    <h2 class="fi d1">Nobody else is <br><span class="it">doing exactly this.</span></h2>
    <div class="rule fi line d2"></div>

    <div class="matrix-wrap fi d2">
      <div>
        <div class="ax" style="margin-bottom:8px;text-align:right;">→ HIGH AFFORDABILITY</div>
        <div class="matrix">
          <div class="mc">
            <div class="mc-name">Generic AI</div>
            <div class="mc-desc">ChatGPT, Gemini<br>Cheap · no context</div>
          </div>
          <div class="mc hi">
            <div class="mc-name">eevolvv ✦</div>
            <div class="mc-desc">Affordable + deep context<br>From SMB brand to QA / finance audit</div>
          </div>
          <div class="mc">
            <div class="mc-name">SaaS Tools</div>
            <div class="mc-desc">HubSpot, Salesforce<br>Affordable · no strategy</div>
          </div>
          <div class="mc">
            <div class="mc-name">Consultants</div>
            <div class="mc-desc">McKinsey, BCG<br>Deep context · unaffordable</div>
          </div>
        </div>
        <div class="ax" style="margin-top:8px;">↑ DEEP BUSINESS CONTEXT</div>
      </div>

      <div style="flex:1;min-width:240px;">
        <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;opacity:.35;margin-bottom:18px;text-transform:uppercase;">Why eevolvv wins</div>
        <div class="term">
          <div><span class="ta">→</span><span class="tk">VS McKinsey</span> <span class="tv">↳ 100× cheaper · AI-speed delivery</span></div>
          <div><span class="ta">→</span><span class="tk">VS ChatGPT </span> <span class="tv">↳ Deep context · continuity · accountability</span></div>
          <div><span class="ta">→</span><span class="tk">VS HubSpot </span> <span class="tv">↳ Strategy and execution, not just record-keeping</span></div>
          <div><span class="ta">→</span><span class="tk">VS AI RPA &nbsp; </span> <span class="tv">↳ Full program agents, not point automations</span></div>
          <div><span class="ta">→</span><span class="tk">MOAT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <span class="tv">↳ Context compounds monthly → forever customer</span></div>
          <div><span class="ta">→</span><span class="tk">BUILD MOAT </span> <span class="tv">↳ Ghost Locker pipeline · cannot be replicated off-the-shelf</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ─── § 10 TRACTION ───────────────────── -->
<section id="s10a" class="dk">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">10 <span>· TRACTION</span></div>
    <h2 class="fi d1">Built in public. <br><span class="it">Running in production.</span></h2>
    <div class="rule fi line d2"></div>

    <div class="g4 fi d2" style="margin-top:48px;">
      <div class="card">
        <div class="card-lbl">AI ENGINE</div>
        <div class="card-val">Live</div>
        <div class="card-sub">eevolvv.com diagnostic deployed</div>
      </div>
      <div class="card">
        <div class="card-lbl">INTERNAL OS</div>
        <div class="card-val">11</div>
        <div class="card-sub">Live ops routes in production</div>
      </div>
      <div class="card">
        <div class="card-lbl">INDUSTRIES TRAINED</div>
        <div class="card-val">14</div>
        <div class="card-sub">Context blocks in production</div>
      </div>
      <div class="card">
        <div class="card-lbl">BUILD VELOCITY</div>
        <div class="card-val" style="font-size:28px;">Hours</div>
        <div class="card-sub">Full features ship in hours — not weeks</div>
      </div>
    </div>

    <div class="term fi d3" style="margin-top:40px;">
      <div class="tc">// build_audit.log — Q2 2026 · what we've shipped</div>
      <div><span class="ta">→</span><span class="tk">PRODUCT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">eevolvv.com live · diagnostic engine deployed · Evolution Report in production</span></div>
      <div><span class="ta">→</span><span class="tk">GHOST LOCKER &nbsp;&nbsp;</span><span class="tv">AI agent manufacturing pipeline operational · intake → blueprint → build → eval → lock</span></div>
      <div><span class="ta">→</span><span class="tk">INTERNAL OS &nbsp;&nbsp;&nbsp;</span><span class="tv">full 11-route ops dashboard live · clients · finance · pipeline · agents · investors · tasks</span></div>
      <div><span class="ta">→</span><span class="tk">DESIGN SYSTEM &nbsp;</span><span class="tv">full component library shipped · 13 production components · used across all surfaces</span></div>
      <div><span class="ta">→</span><span class="tk">BRAND &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">volvv-e agent mascot launched · design system shipped · marketing strategy active</span></div>
      <div><span class="ta">→</span><span class="tk">INFRA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">production-stable stack · entity incorporated · banking + payments live · Vercel deployed</span></div>
      <div><span class="ta">→</span><span class="tk">NEXT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tv">enterprise pilot program · finance audit agent · eevolvv/talent expansion · WhatsApp Phase 1</span></div>
    </div>
  </div>
</section>

<!-- ─── § 11 TEAM ────────────────────────── -->
<section id="s11">
  <div class="grid-drift"></div>
  <div class="inner">
    <div class="marker fi">11 <span>· TEAM</span></div>
    <h2 class="fi d1">Built by someone who <br><span class="it">has lived every version of this problem.</span></h2>
    <div class="rule fi line d2"></div>

    <div style="display:flex;gap:48px;flex-wrap:wrap;align-items:flex-start;margin-top:48px;" class="fi d2">
      <div class="founder">
        <div class="founder-photo">
          <img src="/founder-photo.png" width="1024" height="1024" alt="Eduardo Barbosa, Founder &amp; CEO of eevolvv" />
        </div>
        <div class="founder-name">Eduardo Barbosa</div>
        <div class="founder-title">Founder &amp; CEO</div>
        <div class="founder-bio">
          <p>Eduardo served in the U.S. Navy's submarine force — an environment where a single operational failure is irreversible. He left the military and competed professionally in mixed martial arts, a context that strips every decision down to its fundamentals. From there he moved into the civilian technology sector, working across aerospace, brain-computer interfaces, and AI systems.</p>
          <br />
          <p>Every environment taught the same thing: operational infrastructure — the systems behind the people — determines outcomes more reliably than strategy, talent, or capital ever will. The companies that win aren't always the smartest. They're the ones running the cleanest operations.</p>
          <br />
          <p>eevolvv is his answer to that observation. Built on the conviction that the operational advantages available to the Fortune 500 — real-time diagnostics, AI agents, structured execution programs — should be accessible to every business on earth, starting with the ones who need it most.</p>
        </div>
        <div class="founder-tags">
          <span class="founder-tag">U.S. Navy Submarine Veteran</span>
          <span class="founder-tag">Professional Fighter (MMA)</span>
          <span class="founder-tag">Aerospace</span>
          <span class="founder-tag">Brain-Computer Interfaces</span>
          <span class="founder-tag">AI Systems</span>
        </div>
        <div class="founder-email">→ hello@eevolvv.com</div>
      </div>

      <div style="flex:1;min-width:260px;padding-top:4px;">
        <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;opacity:.38;margin-bottom:18px;text-transform:uppercase;">What drives this</div>
        <div class="term">
          <div class="tc">// founder_conviction.log</div>
          <div><span class="ta">→</span><span class="tk">OPERATIONAL BIAS &nbsp;</span> <span class="tv">↳ every environment he's been in: systems > strategy</span></div>
          <div><span class="ta">→</span><span class="tk">HIGH-STAKES REPS &nbsp;</span> <span class="tv">↳ submarines · fighting cages · rockets · neural hardware</span></div>
          <div><span class="ta">→</span><span class="tk">THE INSIGHT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <span class="tv">↳ 400M+ SMBs have never accessed professional advisory</span></div>
          <div><span class="ta">→</span><span class="tk">THE PROOF &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <span class="tv">↳ built the full stack solo · Ghost Locker · OS · diagnostic engine · brand</span></div>
          <div><span class="ta">→</span><span class="tk">THE EDGE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <span class="tv">↳ founder who can ship code + sell + operate simultaneously</span></div>
        </div>

        <div style="margin-top:28px;padding:24px;border:1px solid var(--rule);border-left:3px solid var(--accent);">
          <div style="font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;color:var(--accent);margin-bottom:12px;text-transform:uppercase;">What "solo founder" actually means here</div>
          <p style="font-size:13px;opacity:.6;line-height:1.75;">The entire product — diagnostic engine, Ghost Locker pipeline, Internal OS (11 routes), full design system, brand, marketing strategy, and this deck — was built by one person. Not because we had to. Because the build infrastructure we created makes it possible. That's the demo.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ─── § 12 CTA ─────────────────────────── -->
<section id="s12" style="background:var(--accent);color:var(--paper);">
  <div class="grid-drift" style="background-image:linear-gradient(to right,rgba(250,247,240,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(250,247,240,0.03) 1px,transparent 1px);"></div>
  <div class="inner">
    <div class="marker fi" style="color:rgba(250,247,240,.55);">12 <span>· LET'S CONNECT</span></div>
    <h2 class="fi d1" style="font-size:clamp(44px,8vw,88px);">eevolvving <br>forward, together.</h2>
    <div class="rule fi line d2" style="background:rgba(250,247,240,.45);"></div>
    <p class="lead fi d2" style="color:rgba(250,247,240,.72);max-width:580px;">We're building the infrastructure layer for AI-native business transformation — starting with the programs and businesses that need it most. If you see what we see, or want to understand it better, we'd like to talk.</p>

    <div class="cta-actions fi d3">
      <a href="mailto:hello@eevolvv.com" class="cta-btn">→ &nbsp;hello@eevolvv.com</a>
      <a href="https://calendly.com/hello-eevolvv" target="_blank" rel="noopener noreferrer" class="cta-btn cta-btn--outline">↳ &nbsp;Schedule a conversation</a>
    </div>

    <div class="cta-contact fi d4">
      <div>Eduardo Barbosa · Founder &amp; CEO</div>
      <div>hello@eevolvv.com</div>
      <div style="opacity:.5;margin-top:6px;">eevolvv.com · Q2 2026</div>
    </div>
  </div>
</section>

<footer>
  <div class="fc">© 2026 · EEVOLVV, INC.</div>
  <div class="fc">eevolvving forward, together.</div>
</footer>

<script>
  /* ── volvv-e hero ghost ── */
  (function () {
    const G = [
      [0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1],
      [1,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1],
      [1,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1],
      [1,1,1,1,1,1,3,3,3,3,3,3,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    const S = 20, ns = 'http://www.w3.org/2000/svg';
    const svg = document.getElementById('hero-ghost');
    if (!svg) return;
    G.forEach(function (row, ri) {
      row.forEach(function (cell, ci) {
        if (!cell) return;
        var r = document.createElementNS(ns, 'rect');
        r.setAttribute('x', ci * S);
        r.setAttribute('y', ri * S);
        r.setAttribute('width', S);
        r.setAttribute('height', S);
        r.setAttribute('fill', cell === 1 ? '#141413' : cell === 2 ? '#8C2B1A' : '#8C2B1A');
        if (cell === 2) r.classList.add('ghost-eye');
        svg.appendChild(r);
      });
    });
  })();

  const prefersReducedMotion =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smoothScroll = prefersReducedMotion ? 'auto' : 'smooth';

  const sections = document.querySelectorAll('section');
  const ndots    = document.getElementById('ndots');

  if (ndots && sections.length) {
    sections.forEach((sec) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'nd';
      d.title = sec.id.toUpperCase();
      d.setAttribute('aria-label', 'Go to slide ' + sec.id);
      d.addEventListener('click', () =>
        sec.scrollIntoView({ behavior: smoothScroll, block: 'start' }));
      ndots.appendChild(d);
    });
  }
  /* fade-in observer */
  const fiObs = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('vis'); });
  }, { threshold: 0.10 });
  document.querySelectorAll('.fi').forEach(el => fiObs.observe(el));

  /* active dot observer */
  const dotTray = document.querySelector('.nav-dots-scroll');
  const dotObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const idx = Array.from(sections).indexOf(en.target);
        const dots = document.querySelectorAll('.nd');
        dots.forEach((d, i) => d.classList.toggle('on', i === idx));
        const activeDot = dots[idx];
        if (dotTray && activeDot)
          activeDot.scrollIntoView({ behavior: smoothScroll, inline: 'center', block: 'nearest' });
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => dotObs.observe(s));

  /* cover hero scrambler */
  const heroWord = document.querySelector('.cover-ew');
  if (heroWord && !prefersReducedMotion) {
    const originalText = heroWord.getAttribute('data-text') || 'EEVOLVV';
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#\$%&*<>';
    let iterations = 0;
    const scrambleInterval = setInterval(() => {
      let currentText = originalText.split('').map((letter, index) => {
        if (index < iterations) return originalText[index];
        return matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }).join('');
      heroWord.innerText = currentText;
      heroWord.setAttribute('data-text', currentText);
      if (iterations >= originalText.length) {
        clearInterval(scrambleInterval);
        heroWord.innerText = originalText;
        heroWord.setAttribute('data-text', originalText);
        /* glitch loop */
        setInterval(() => {
          const rIdx = Math.floor(Math.random() * originalText.length);
          const nChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          let arr = originalText.split('');
          arr[rIdx] = nChar;
          heroWord.innerText = arr.join('');
          heroWord.setAttribute('data-text', arr.join(''));
          setTimeout(() => {
            heroWord.innerText = originalText;
            heroWord.setAttribute('data-text', originalText);
          }, 150);
        }, 3200);
      }
      iterations += 1/8;
    }, 65);
  }
</script>
</body>
</html>`

export async function GET() {
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
