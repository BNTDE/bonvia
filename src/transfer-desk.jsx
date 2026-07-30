import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  PlaneLanding, PlaneTakeoff, Check, Users, Search, Plus, X, Phone, Navigation,
  FileText, Settings, RefreshCw, MessageSquare, Pencil, Wallet, CarFront, CalendarDays,
  Download, Copy, LayoutList, Truck, ChevronLeft, ChevronRight, AlertTriangle,
  Wand2, Trash2
} from "lucide-react";

// DEMO — remove this import together with src/demo-data.js when you go live.
import { makeDemoTransfers, makeDemoFormData, DEMO_CONF } from "./demo-data.js";

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.td, .td * { box-sizing: border-box; }
.td {
  --ink:#101B33; --ink2:#3D4A66; --ink3:#7A869F;
  --paper:#EDEFF4; --card:#FFFFFF; --rule:#D7DCE6; --rule2:#E8EBF1;
  --signal:#EFA00B; --signal-wash:#FFF7E4;
  --go:#0E7A58; --go-wash:#E7F5F0;
  --hand:#5A4FCF; --hand-wash:#EEECFC;
  --done:#8A94A8; --stop:#B4342B; --stop-wash:#FBEBEA;
  --sans:'Archivo','Segoe UI',system-ui,sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,'Courier New',monospace;
  font-family:var(--sans); background:var(--paper); color:var(--ink);
  min-height:100vh; font-size:14px; line-height:1.45; -webkit-font-smoothing:antialiased;
}
.td button { font-family:inherit; cursor:pointer; }
.td a { color:inherit; }
.td input, .td textarea, .td select { font-family:inherit; font-size:14px; }
.td :focus-visible { outline:2px solid var(--ink); outline-offset:2px; }

.eyebrow { font-size:10.5px; letter-spacing:.16em; text-transform:uppercase; font-weight:600; }
.mono { font-family:var(--mono); font-variant-numeric:tabular-nums; }

/* ---- top bar ---- */
.topbar { background:var(--ink); color:#fff; position:sticky; top:0; z-index:40; }
.topbar-in { max-width:1080px; margin:0 auto; padding:12px 18px; display:flex; align-items:center; gap:12px; }
.brand { display:flex; flex-direction:column; line-height:1.05; margin-right:auto; min-width:0; }
.brand b { font-size:18px; font-weight:700; letter-spacing:-.015em; }
.brand span { color:#93A0BC; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pill-alert { display:flex; align-items:center; gap:6px; background:var(--signal); color:#241900;
  padding:6px 11px; border-radius:999px; font-weight:600; font-size:12.5px; border:none; white-space:nowrap; }
.pill-alert b { font-family:var(--mono); }
.who { display:flex; align-items:center; gap:7px; background:#1E2B48; border:1px solid #2E3D5F;
  color:#D5DCEC; padding:6px 10px; border-radius:8px; font-size:12.5px; white-space:nowrap; }
.who i { width:7px; height:7px; border-radius:99px; background:#4ADE9B; font-style:normal; }
.icon-btn { background:transparent; border:1px solid #2E3D5F; color:#B9C4DA; width:36px; height:36px;
  border-radius:9px; display:grid; place-items:center; flex-shrink:0; }
.icon-btn:hover { background:#1E2B48; color:#fff; }

/* ---- tabs ---- */
.tabs { border-bottom:1px solid var(--rule); background:var(--card); position:sticky; top:60px; z-index:30; }
.tabs-in { max-width:1080px; margin:0 auto; padding:0 18px; display:flex; gap:2px; }
.tab { background:none; border:none; padding:13px 14px; color:var(--ink3); font-weight:600; font-size:13px;
  border-bottom:2px solid transparent; display:flex; align-items:center; gap:7px; }
.tab.on { color:var(--ink); border-bottom-color:var(--signal); }
.tab-badge { font-family:var(--mono); font-size:11px; background:var(--signal); color:#241900;
  border-radius:99px; padding:1px 6px; }

/* ---- bottom nav (phone) ---- */
.bnav { display:none; }

.wrap { max-width:1080px; margin:0 auto; padding:20px 18px 100px; }

/* ---- controls ---- */
.controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:16px; }
.search { flex:1; min-width:180px; display:flex; align-items:center; gap:8px; background:var(--card);
  border:1px solid var(--rule); border-radius:9px; padding:0 11px; height:42px; }
.search input { border:none; outline:none; background:none; width:100%; }
.chips { display:flex; gap:6px; flex-wrap:nowrap; overflow-x:auto; scrollbar-width:none; padding-bottom:2px; }
.chips::-webkit-scrollbar { display:none; }
.chip { background:var(--card); border:1px solid var(--rule); border-radius:99px; padding:8px 13px;
  font-size:12.5px; font-weight:500; color:var(--ink2); white-space:nowrap; flex-shrink:0; }
.chip.on { background:var(--ink); border-color:var(--ink); color:#fff; }
.chip .n { font-family:var(--mono); opacity:.65; margin-left:5px; }

.btn { border-radius:9px; border:1px solid var(--rule); background:var(--card); color:var(--ink);
  padding:10px 14px; font-weight:600; font-size:13px; display:inline-flex; align-items:center;
  justify-content:center; gap:7px; min-height:40px; }
.btn:hover { border-color:var(--ink3); }
.btn-primary { background:var(--ink); border-color:var(--ink); color:#fff; }
.btn-primary:hover { background:#1B2A4A; }
.btn-go { background:var(--go); border-color:var(--go); color:#fff; }
.btn-hand { background:var(--hand-wash); border-color:#C9C3F6; color:var(--hand); }
.btn-sm { padding:7px 11px; font-size:12.5px; border-radius:8px; min-height:36px; }
.btn-ghost { background:transparent; border-color:transparent; color:var(--ink3); }
.btn-ghost:hover { color:var(--ink); background:#E3E7EF; }
.btn-big { width:100%; min-height:50px; font-size:15px; }

/* ---- banner ---- */
.banner { display:flex; gap:12px; align-items:center; background:var(--signal-wash);
  border:1px solid #F2D79A; border-left:4px solid var(--signal); border-radius:10px;
  padding:13px 16px; margin-bottom:16px; }
.banner b { display:block; font-size:14px; }
.banner p { margin:1px 0 0; font-size:12.5px; color:#7A5A0B; }

/* ---- day band ---- */
.band { display:flex; align-items:center; gap:12px; margin:24px 0 10px; }
.band:first-child { margin-top:2px; }
.band .d { font-family:var(--mono); font-size:11.5px; font-weight:600; letter-spacing:.2em;
  color:var(--ink2); white-space:nowrap; }
.band .line { flex:1; height:1px; background:var(--rule); }
.band .cnt { font-family:var(--mono); font-size:11px; color:var(--ink3); letter-spacing:.1em; }
.band.today .d { color:var(--ink); }
.band .tag { font-size:9.5px; letter-spacing:.14em; font-weight:700; background:var(--ink);
  color:#fff; padding:2px 7px; border-radius:4px; }

/* ---- transfer row ---- */
.row { display:flex; background:var(--card); border:1px solid var(--rule2); border-left:4px solid var(--done);
  border-radius:11px; margin-bottom:9px; overflow:hidden; }
.row.s-pending  { border-left-color:var(--signal); background:linear-gradient(90deg,var(--signal-wash),#fff 190px); }
.row.s-accepted { border-left-color:var(--go); }
.row.s-external { border-left-color:var(--hand); }
.row.s-done     { border-left-color:#C9CFDB; opacity:.85; }
.row.s-cancelled{ border-left-color:var(--stop); opacity:.6; }
.row.overdue    { border-left-color:var(--stop); background:linear-gradient(90deg,var(--stop-wash),#fff 190px); }

.spine { width:104px; flex-shrink:0; padding:14px 0 14px 15px; border-right:1px dashed var(--rule2); }
.spine .t { font-family:var(--mono); font-size:21px; font-weight:600; letter-spacing:-.02em; }
.spine .dir { display:flex; align-items:center; gap:5px; font-size:10px; letter-spacing:.13em;
  font-weight:700; color:var(--ink3); margin-top:3px; }
.spine .pk { font-family:var(--mono); font-size:11px; color:var(--ink3); margin-top:9px; line-height:1.3; }
.spine .pk b { color:var(--ink2); font-weight:600; display:block; }

.body { flex:1; padding:14px 16px; min-width:0; }
.line1 { display:flex; align-items:baseline; gap:9px; flex-wrap:wrap; }
.line1 .nm { font-size:16px; font-weight:600; letter-spacing:-.01em; }
.fl { font-family:var(--mono); font-size:12.5px; font-weight:600; background:#EEF1F6;
  border-radius:5px; padding:2px 7px; letter-spacing:.04em; }
.apt { font-family:var(--mono); font-size:12.5px; color:var(--ink2); }
.pax { display:inline-flex; align-items:center; gap:4px; font-size:12px; color:var(--ink3); }
.route { margin:7px 0 0; font-size:13.5px; color:var(--ink2); display:flex; align-items:center;
  gap:7px; flex-wrap:wrap; }
.route .arw { color:var(--ink3); font-family:var(--mono); }
.note-line { margin:6px 0 0; font-size:12.5px; color:var(--ink3); font-style:italic; }
.cost-tag { display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:12px;
  font-weight:600; background:var(--hand-wash); color:var(--hand); border-radius:5px; padding:2px 7px; }

.status { display:flex; align-items:center; gap:7px; margin-top:10px; font-size:12px; flex-wrap:wrap; }
.dot { width:8px; height:8px; border-radius:99px; flex-shrink:0; }
.status .lb { font-weight:600; letter-spacing:.1em; font-size:10.5px; }
.status .by { color:var(--ink3); }
.tagline { display:inline-block; font-size:9.5px; font-weight:700; letter-spacing:.14em;
  padding:2px 6px; border-radius:4px; }
.t-new { background:var(--ink); color:#fff; }
.t-over { background:var(--stop); color:#fff; }

.acts { display:flex; gap:7px; flex-wrap:wrap; margin-top:12px; align-items:center; }
.confirm-box { margin-top:11px; background:#F7F8FB; border:1px solid var(--rule2); border-radius:9px; padding:11px; }
.confirm-box label { display:block; font-size:12px; color:var(--ink2); margin-bottom:6px; font-weight:500; }
.confirm-box .r { display:flex; gap:7px; flex-wrap:wrap; }
.confirm-box input { flex:1; min-width:140px; height:40px; border:1px solid var(--rule); border-radius:7px; padding:0 10px; }

.thread { margin-top:11px; border-top:1px solid var(--rule2); padding-top:10px; }
.msg { display:flex; gap:8px; font-size:12.5px; padding:4px 0; }
.msg .m-by { font-weight:600; white-space:nowrap; }
.msg .m-at { font-family:var(--mono); font-size:10.5px; color:var(--ink3); margin-left:auto; white-space:nowrap; }
.msg-in { display:flex; gap:7px; margin-top:8px; }
.msg-in input { flex:1; height:40px; border:1px solid var(--rule); border-radius:7px; padding:0 10px; }

/* ---- driver view ---- */
.dhead { display:flex; gap:8px; margin-bottom:14px; }
.drow { background:var(--card); border:1px solid var(--rule2); border-left:5px solid var(--go);
  border-radius:13px; padding:16px; margin-bottom:11px; }
.drow.soon { border-left-color:var(--signal); box-shadow:0 2px 14px rgba(239,160,11,.18); }
.drow.ext { border-left-color:var(--hand); }
.dtop { display:flex; align-items:flex-start; gap:12px; }
.dtime { font-family:var(--mono); font-size:30px; font-weight:600; letter-spacing:-.03em; line-height:1; }
.dtime small { display:block; font-family:var(--sans); font-size:10px; letter-spacing:.14em;
  font-weight:700; color:var(--ink3); margin-top:5px; }
.dwho { flex:1; min-width:0; }
.dwho .n { font-size:18px; font-weight:600; letter-spacing:-.01em; }
.dwho .f2 { margin-top:3px; display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
.dleg { display:flex; align-items:center; gap:10px; margin-top:13px; padding:11px 12px;
  background:#F7F8FB; border-radius:9px; font-size:14px; }
.dleg .lb { font-size:9.5px; letter-spacing:.14em; font-weight:700; color:var(--ink3); width:42px; flex-shrink:0; }
.dleg a { margin-left:auto; color:var(--ink2); }
.dacts { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:13px; }
.dacts .full { grid-column:1 / -1; }
.dnote { margin-top:11px; font-size:13px; background:var(--signal-wash); border-radius:8px; padding:10px 12px; }

/* ---- form ---- */
.sheet { background:var(--card); border:1px solid var(--rule); border-radius:13px; padding:20px; }
.sheet h2 { margin:0 0 3px; font-size:17px; letter-spacing:-.01em; }
.sheet .sub { margin:0 0 18px; color:var(--ink3); font-size:13px; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
.f { display:flex; flex-direction:column; gap:5px; }
.f.wide { grid-column:1 / -1; }
.f label { font-size:11px; letter-spacing:.1em; text-transform:uppercase; font-weight:600; color:var(--ink2); }
.f input, .f textarea, .f select { border:1px solid var(--rule); border-radius:8px; padding:11px;
  background:#fff; outline:none; width:100%; }
.f input:focus, .f textarea:focus, .f select:focus { border-color:var(--ink); }
.f .hint { font-size:11.5px; color:var(--ink3); }
.f input.mono, .f select.mono { font-family:var(--mono); }
.seg { display:flex; border:1px solid var(--rule); border-radius:8px; overflow:hidden; }
.seg button { flex:1; background:#fff; border:none; padding:12px 8px; font-weight:600; font-size:13px;
  color:var(--ink2); display:flex; align-items:center; justify-content:center; gap:7px; min-height:46px; }
.seg button.on { background:var(--ink); color:#fff; }
.time24 { display:flex; align-items:center; gap:8px; }
.time24 select { flex:1; text-align:center; font-family:var(--mono); font-size:16px;
  font-weight:600; letter-spacing:.04em; }
.time24 .sep { font-family:var(--mono); font-size:17px; font-weight:600; color:var(--ink3); }
.form-foot { display:flex; gap:9px; justify-content:flex-end; margin-top:20px;
  border-top:1px solid var(--rule2); padding-top:16px; }
.err { background:var(--stop-wash); border:1px solid #EBC3C0; color:var(--stop);
  border-radius:8px; padding:10px 12px; font-size:12.5px; margin-bottom:14px; }

/* ---- report ---- */
.repmode { display:flex; gap:6px; margin-bottom:14px; }
.weeknav { display:flex; align-items:center; gap:9px; margin-bottom:16px; flex-wrap:wrap; }
.weeknav .lbl { font-family:var(--mono); font-size:13px; font-weight:600; letter-spacing:.04em; }
.tiles { display:grid; grid-template-columns:repeat(5,1fr); gap:9px; margin-bottom:18px; }
.tile { background:var(--card); border:1px solid var(--rule2); border-radius:10px; padding:13px 14px; }
.tile .n { font-family:var(--mono); font-size:25px; font-weight:600; letter-spacing:-.03em; line-height:1.1; }
.tile .k { font-size:10.5px; letter-spacing:.11em; text-transform:uppercase; color:var(--ink3);
  font-weight:600; margin-top:3px; }
.tbl-wrap { background:var(--card); border:1px solid var(--rule2); border-radius:11px; overflow:auto; }
table.rep { width:100%; border-collapse:collapse; font-size:12.5px; min-width:820px; }
table.rep th { text-align:left; font-size:10px; letter-spacing:.12em; text-transform:uppercase;
  color:var(--ink3); padding:10px 12px; border-bottom:1px solid var(--rule); white-space:nowrap; }
table.rep td { padding:10px 12px; border-bottom:1px solid var(--rule2); vertical-align:top; }
table.rep tr:last-child td { border-bottom:none; }
table.rep .m { font-family:var(--mono); white-space:nowrap; }
.rcard { background:var(--card); border:1px solid var(--rule2); border-radius:10px; padding:13px;
  margin-bottom:8px; }
.rcard .h { display:flex; align-items:baseline; gap:9px; }
.rcard .h .dt { font-family:var(--mono); font-size:13px; font-weight:600; }
.rcard .h .nm { font-weight:600; }
.rcard .l { margin-top:5px; font-size:12.5px; color:var(--ink2); }
.rcard .l span { color:var(--ink3); }
.sec-h { display:flex; align-items:center; gap:10px; margin:24px 0 11px; }
.sec-h h3 { margin:0; font-size:13px; letter-spacing:.02em; }
.sec-h .line { flex:1; height:1px; background:var(--rule); }

/* ---- calendar ---- */
.cal { background:var(--card); border:1px solid var(--rule2); border-radius:12px; overflow:hidden; }
.cal-head { display:grid; grid-template-columns:repeat(7,1fr); border-bottom:1px solid var(--rule);
  background:#F7F8FB; }
.cal-head span { padding:9px 4px; text-align:center; font-size:9.5px; letter-spacing:.14em;
  font-weight:700; color:var(--ink3); }
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); }
.cal-cell { border:none; border-right:1px solid var(--rule2); border-bottom:1px solid var(--rule2);
  min-height:106px; padding:6px 6px 7px; background:#fff; display:flex; flex-direction:column;
  gap:3px; align-items:stretch; text-align:left; font-family:inherit; }
.cal-cell:nth-child(7n) { border-right:none; }
.cal-cell.out { background:#F9FAFC; cursor:default; }
.cal-cell.sel { background:#EDF1F8; box-shadow:inset 0 0 0 2px var(--ink); }
.cal-cell .dn { font-family:var(--mono); font-size:12.5px; font-weight:600; color:var(--ink2);
  align-self:flex-start; }
.cal-cell.today .dn { background:var(--ink); color:#fff; border-radius:5px; padding:1px 5px; }
.cal-ev { display:flex; gap:5px; align-items:center; font-size:10.5px; line-height:1.35;
  background:#F1F3F8; border-radius:4px; padding:2px 5px; overflow:hidden; }
.cal-ev .b { width:3px; align-self:stretch; border-radius:2px; flex-shrink:0; min-height:13px; }
.cal-ev .tm { font-family:var(--mono); font-weight:600; flex-shrink:0; }
.cal-ev .nm { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; color:var(--ink2); }
.cal-more { font-size:9.5px; color:var(--ink3); font-weight:600; letter-spacing:.06em; }
.cal-dots { display:flex; gap:3px; flex-wrap:wrap; justify-content:center; margin-top:2px; }
.cal-dots i { width:6px; height:6px; border-radius:99px; }
.cal-legend { display:flex; gap:16px; flex-wrap:wrap; margin:13px 2px 20px; font-size:11.5px;
  color:var(--ink2); }
.cal-legend span { display:inline-flex; align-items:center; gap:6px; }
.cal-legend i { width:9px; height:9px; border-radius:99px; }
.daypanel { margin-top:22px; }

.empty { text-align:center; padding:48px 20px; color:var(--ink3); }
.empty b { display:block; color:var(--ink); font-size:15px; margin-bottom:5px; }

.taglist { display:flex; gap:7px; flex-wrap:wrap; margin-top:9px; }
.tagx { display:inline-flex; align-items:center; gap:6px; background:#F1F3F8; border:1px solid var(--rule2);
  border-radius:7px; padding:6px 9px; font-size:12.5px; font-family:var(--mono); }
.tagx button { background:none; border:none; color:var(--ink3); display:grid; place-items:center; padding:0; }
.tagx button:hover { color:var(--stop); }

.modal-bg { position:fixed; inset:0; background:rgba(16,27,51,.5); display:grid; place-items:center;
  padding:16px; z-index:60; }
.modal { background:var(--card); border-radius:13px; padding:20px; max-width:620px; width:100%;
  max-height:86vh; overflow:auto; }
.modal h3 { margin:0 0 10px; font-size:16px; }
.codebox { font-family:var(--mono); font-size:11px; width:100%; height:220px; border:1px solid var(--rule);
  border-radius:8px; padding:11px; white-space:pre; overflow:auto; background:#F7F8FB; }

.toast { position:fixed; left:50%; transform:translateX(-50%); bottom:86px; background:var(--ink);
  color:#fff; padding:12px 18px; border-radius:10px; font-size:13px; font-weight:500; z-index:70;
  box-shadow:0 8px 24px rgba(16,27,51,.28); max-width:90vw; text-align:center; }

.note-box { background:#F7F8FB; border:1px solid var(--rule2); border-radius:9px; padding:13px 15px;
  font-size:12.5px; color:var(--ink2); line-height:1.55; }
.note-box b { color:var(--ink); }

.fab { display:none; }

/* ================= PHONE ================= */
@media (max-width:760px) {
  .td input, .td textarea, .td select { font-size:16px; }   /* stops iOS zooming on focus */
  .grid { grid-template-columns:1fr; }
  .tiles { grid-template-columns:repeat(2,1fr); }
  .topbar-in { padding:10px 14px; gap:9px; }
  .brand b { font-size:16px; }
  .brand span { display:none; }
  .who { padding:6px 9px; }
  .wrap { padding:14px 13px 92px; }
  .tabs { display:none; }

  .bnav { display:flex; position:fixed; bottom:0; left:0; right:0; background:var(--card);
    border-top:1px solid var(--rule); z-index:50; padding-bottom:env(safe-area-inset-bottom); }
  .bnav button { flex:1; background:none; border:none; padding:9px 4px 11px; color:var(--ink3);
    display:flex; flex-direction:column; align-items:center; gap:4px; font-size:10.5px; font-weight:600;
    position:relative; min-height:54px; }
  .bnav button.on { color:var(--ink); }
  .bnav button.on::before { content:''; position:absolute; top:0; left:22%; right:22%; height:2.5px;
    background:var(--signal); border-radius:0 0 3px 3px; }
  .bnav .bdot { position:absolute; top:6px; right:50%; margin-right:-20px; background:var(--signal);
    color:#241900; font-family:var(--mono); font-size:9.5px; font-weight:700; border-radius:99px;
    padding:0 5px; line-height:15px; }

  .row { flex-direction:column; }
  .row.s-pending, .row.overdue { background:var(--card); }
  .row.s-pending .spine { background:var(--signal-wash); }
  .row.overdue .spine { background:var(--stop-wash); }
  .spine { width:100%; border-right:none; border-bottom:1px dashed var(--rule2);
    padding:11px 14px; display:flex; align-items:center; gap:12px; }
  .spine .t { font-size:19px; }
  .spine .dir { margin-top:0; }
  .spine .pk { margin-top:0; margin-left:auto; text-align:right; }
  .spine .pk b { display:inline; margin-right:5px; }
  .body { padding:13px 14px; }
  .acts { gap:6px; }
  .acts .btn { flex:1 1 46%; }
  .acts .btn-ghost { flex:0 0 auto; }
  .form-foot { flex-direction:column-reverse; }
  .form-foot .btn { width:100%; }
  .controls .btn-primary { display:none; }
  .fab { display:flex; position:fixed; right:15px; bottom:70px; z-index:45; width:54px; height:54px;
    border-radius:50%; border:none; background:var(--ink); color:#fff; align-items:center;
    justify-content:center; box-shadow:0 6px 18px rgba(16,27,51,.34); }
  .weeknav .lbl { flex:1; text-align:center; }
  .dtime { font-size:26px; }
  .dacts { grid-template-columns:1fr; }
  .cal-cell { min-height:56px; padding:5px 3px; align-items:center; gap:2px; }
  .cal-cell .dn { align-self:center; font-size:12px; }
  .cal-head span { font-size:9px; letter-spacing:.06em; }
  .cal-legend { gap:11px; font-size:11px; }
}
@media (max-width:400px) { .tiles { grid-template-columns:1fr 1fr; } .who span { display:none; } }
@media (prefers-reduced-motion:reduce) { .td * { transition:none !important; animation:none !important; } }
`;

/* ------------------------------------------------------------------ */
/*  Constants + helpers                                                */
/* ------------------------------------------------------------------ */

const DATA_KEY = "transferdesk:board:v1";
const CONF_KEY = "transferdesk:config:v1";
const ME_KEY = "transferdesk:me:v1";

const STATUS = {
  pending:   { short: "WAITING",   label: "Waiting for logistics", color: "var(--signal)" },
  accepted:  { short: "IN-HOUSE",  label: "Our helper is on it",   color: "var(--go)" },
  external:  { short: "OUTSIDE",   label: "Outside service",       color: "var(--hand)" },
  done:      { short: "COMPLETED", label: "Completed",             color: "var(--done)" },
  cancelled: { short: "CANCELLED", label: "Cancelled",             color: "var(--stop)" },
};

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const CURRENCIES = ["EUR", "USD", "GBP", "RON", "CHF", "PLN", "AED", "TRY"];
const SYMBOL = { EUR: "€", USD: "$", GBP: "£", RON: "lei", CHF: "CHF", PLN: "zł", AED: "AED", TRY: "₺" };

const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => isoDate(new Date());
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const dtOf = (t) => {
  if (!t.date) return null;
  const d = new Date(`${t.date}T${t.time || "00:00"}:00`);
  return isNaN(d.getTime()) ? null : d;
};
const bandLabel = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d.getTime()) ? iso : `${DAYS[d.getDay()]} ${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
const shortDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d.getTime()) ? iso : `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
};
const euDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return "";
  return `${DAYS[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
const stamp = (ms) => {
  const d = new Date(ms);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
function startOfWeek(d) {
  const x = new Date(d); x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d, n) => { const x = new Date(d); x.setDate(1); x.setMonth(x.getMonth() + n); return x; };
function shiftTime(date, time, minutes) {
  if (!date || !time) return "";
  const d = new Date(`${date}T${time}:00`);
  if (isNaN(d.getTime())) return "";
  d.setMinutes(d.getMinutes() + minutes);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const money = (v, cur) => {
  const n = Number(v) || 0;
  const s = SYMBOL[cur] || cur || "";
  const val = n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
  return s.length > 1 ? `${val} ${s}` : `${s}${val}`;
};
const isExternal = (t) => t.status === "external" || t.wasExternal;

function usePhone() {
  const [p, setP] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 760 : false));
  useEffect(() => {
    const mq = window.matchMedia("(max-width:760px)");
    const on = (e) => setP(e.matches);
    setP(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on));
  }, []);
  return p;
}

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */

const DEFAULT_CONF = { airports: [], services: [], currency: "EUR" };

async function readBoard() {
  try {
    const r = await window.storage.get(DATA_KEY, true);
    if (!r || !r.value) return [];
    const p = JSON.parse(r.value);
    return Array.isArray(p) ? p : [];
  } catch { return []; }
}
const writeBoard = (items) => window.storage.set(DATA_KEY, JSON.stringify(items), true);

async function mutateBoard(fn) {
  const latest = await readBoard();
  const next = fn(latest);
  await writeBoard(next);
  return next;
}
async function readConf() {
  try {
    const r = await window.storage.get(CONF_KEY, true);
    return r && r.value ? { ...DEFAULT_CONF, ...JSON.parse(r.value) } : { ...DEFAULT_CONF };
  } catch { return { ...DEFAULT_CONF }; }
}
const writeConf = (c) => window.storage.set(CONF_KEY, JSON.stringify(c), true);

async function readMe() {
  try {
    const r = await window.storage.get(ME_KEY, false);
    return r && r.value ? JSON.parse(r.value) : null;
  } catch { return null; }
}
const writeMe = (m) => { try { return window.storage.set(ME_KEY, JSON.stringify(m), false); } catch { return null; } };

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function Seg({ value, onChange, options }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} className={value === o.v ? "on" : ""} onClick={() => onChange(o.v)}>
          {o.icon}{o.label}
        </button>
      ))}
    </div>
  );
}
function Field({ label, hint, wide, children }) {
  return (
    <div className={"f" + (wide ? " wide" : "")}>
      <label>{label}</label>
      {children}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i));

/** Two plain dropdowns, so the clock reads 00:00–23:59 on every browser and phone. */
function Time24({ value, onChange }) {
  const [h = "", m = ""] = (value || "").split(":");
  return (
    <div className="time24">
      <select value={h} onChange={(e) => onChange(`${e.target.value}:${m || "00"}`)} aria-label="Hour">
        <option value="" disabled>--</option>
        {HOURS.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      <span className="sep">:</span>
      <select value={m} onChange={(e) => onChange(`${h || "00"}:${e.target.value}`)} aria-label="Minute">
        <option value="" disabled>--</option>
        {MINUTES.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
    </div>
  );
}

const mapsHref = (q) => `https://maps.google.com/?q=${encodeURIComponent(q)}`;

/* ------------------------------------------------------------------ */
/*  Transfer row (HR + Logistics)                                      */
/* ------------------------------------------------------------------ */

function TransferRow({ t, me, conf, onAct, isNew }) {
  const [mode, setMode] = useState(null);   // accept | external | cost
  const [handler, setHandler] = useState("");
  const [cost, setCost] = useState(t.cost || "");
  const [showThread, setShowThread] = useState(false);
  const [msg, setMsg] = useState("");

  const s = STATUS[t.status] || STATUS.pending;
  const when = dtOf(t);
  const overdue = t.status === "pending" && when && when.getTime() < Date.now();
  const arriving = t.direction === "arrival";
  const notes = t.thread || [];

  const confirm = (status) => {
    const who = handler.trim();
    onAct(t.id, { status, handler: who || (status === "external" ? "Outside service" : me.name) },
      status === "accepted"
        ? `${me.name} confirmed — ${who || "handled in-house"}`
        : `${me.name} sent this out${who ? " — " + who : ""}`,
      status === "external" && who ? { service: who } : null);
    setMode(null); setHandler("");
  };
  const saveCost = () => {
    onAct(t.id, { cost: cost === "" ? null : Number(cost) }, `${me.name} logged ${money(cost, conf.currency)}`);
    setMode(null);
  };
  const send = () => { if (msg.trim()) { onAct(t.id, null, msg.trim()); setMsg(""); } };

  return (
    <div className={`row s-${t.status}${overdue ? " overdue" : ""}`}>
      <div className="spine">
        <div>
          <div className="t mono">{t.time || "--:--"}</div>
          <div className="dir">
            {arriving ? <PlaneLanding size={13} /> : <PlaneTakeoff size={13} />}
            {arriving ? "LANDS" : "DEPARTS"}
          </div>
        </div>
        {t.pickupTime ? <div className="pk"><b>PICK UP</b>{t.pickupTime}</div> : null}
      </div>

      <div className="body">
        <div className="line1">
          <span className="nm">{t.passenger || "Unnamed passenger"}</span>
          {t.flightNo ? <span className="fl">{t.flightNo.toUpperCase()}</span> : null}
          {t.airport ? <span className="apt">{t.airport.toUpperCase()}</span> : null}
          {t.pax > 1 ? <span className="pax"><Users size={12} />{t.pax}</span> : null}
          {isNew ? <span className="tagline t-new">NEW</span> : null}
          {overdue ? <span className="tagline t-over">NOT PICKED UP</span> : null}
        </div>

        <div className="route">
          <span>{t.from || (arriving ? t.airport || "Airport" : "—")}</span>
          <span className="arw">→</span>
          <span>{t.to || (arriving ? "—" : t.airport || "Airport")}</span>
          {t.phone ? <a className="mono" href={`tel:${t.phone}`} style={{ fontSize: 12, color: "var(--ink3)" }}>· {t.phone}</a> : null}
          {t.cost != null && t.cost !== "" ? (
            <span className="cost-tag"><Wallet size={11} />{money(t.cost, conf.currency)}</span>
          ) : null}
        </div>

        {t.notes ? <p className="note-line">{t.notes}</p> : null}

        <div className="status">
          <span className="dot" style={{ background: s.color }} />
          <span className="lb" style={{ color: s.color }}>{s.short}</span>
          <span className="by">
            {t.status === "pending" && `posted by ${t.createdBy} · ${stamp(t.createdAt)}`}
            {(t.status === "accepted" || t.status === "external") && t.handler}
            {t.status === "done" && `${t.handler || "—"} · closed ${t.doneAt ? stamp(t.doneAt) : ""}`}
            {t.status === "cancelled" && "cancelled"}
          </span>
        </div>

        {mode === "cost" ? (
          <div className="confirm-box">
            <label>What did this run cost? ({conf.currency})</label>
            <div className="r">
              <input autoFocus className="mono" type="number" min="0" step="0.01" value={cost}
                placeholder="0" onChange={(e) => setCost(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveCost()} />
              <button className="btn btn-sm btn-primary" onClick={saveCost}><Check size={14} />Save</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setMode(null)}>Back</button>
            </div>
          </div>
        ) : mode ? (
          <div className="confirm-box">
            <label>{mode === "accept" ? "Who is driving? (leave blank if it's you)" : "Which outside service?"}</label>
            <div className="r">
              <input autoFocus value={handler} list={mode === "external" ? "td-services" : undefined}
                placeholder={mode === "accept" ? "e.g. Ahmed — van 2" : "e.g. City Cabs"}
                onChange={(e) => setHandler(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirm(mode === "accept" ? "accepted" : "external")} />
              <button className={"btn btn-sm " + (mode === "accept" ? "btn-go" : "btn-hand")}
                onClick={() => confirm(mode === "accept" ? "accepted" : "external")}>
                <Check size={14} />{mode === "accept" ? "Confirm" : "Send it out"}
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setMode(null)}>Back</button>
            </div>
          </div>
        ) : (
          <div className="acts">
            {t.status === "pending" && (
              <>
                <button className="btn btn-sm btn-go" onClick={() => setMode("accept")}>
                  <Check size={14} />We'll handle it
                </button>
                <button className="btn btn-sm btn-hand" onClick={() => setMode("external")}>
                  <Truck size={14} />Outside service
                </button>
              </>
            )}
            {(t.status === "accepted" || t.status === "external") && (
              <button className="btn btn-sm btn-primary"
                onClick={() => onAct(t.id, { status: "done" }, `${me.name} marked this completed`)}>
                <Check size={14} />Mark completed
              </button>
            )}
            {isExternal(t) && t.status !== "cancelled" && (
              <button className="btn btn-sm" onClick={() => setMode("cost")}>
                <Wallet size={14} />{t.cost != null && t.cost !== "" ? "Edit cost" : "Add cost"}
              </button>
            )}
            {t.status === "done" && (
              <button className="btn btn-sm btn-ghost"
                onClick={() => onAct(t.id, { status: isExternal(t) ? "external" : "accepted" }, `${me.name} reopened this`)}>
                <RefreshCw size={13} />Reopen
              </button>
            )}
            <button className="btn btn-sm btn-ghost" onClick={() => setShowThread((v) => !v)}>
              <MessageSquare size={13} />Notes{notes.length ? ` (${notes.length})` : ""}
            </button>
            {t.status !== "done" && t.status !== "cancelled" && (
              <button className="btn btn-sm btn-ghost"
                onClick={() => onAct(t.id, { status: "cancelled" }, `${me.name} cancelled this transfer`)}>
                <X size={13} />Cancel
              </button>
            )}
            <button className="btn btn-sm btn-ghost" onClick={() => onAct(t.id, "__edit__")}>
              <Pencil size={13} />Edit
            </button>
          </div>
        )}

        {showThread && (
          <div className="thread">
            {notes.length === 0 && (
              <div style={{ fontSize: 12.5, color: "var(--ink3)" }}>
                No notes yet. Anything the driver should know goes here.
              </div>
            )}
            {notes.map((n, i) => (
              <div className="msg" key={i}>
                <span className="m-by">{n.by}</span><span>{n.text}</span>
                <span className="m-at">{stamp(n.at)}</span>
              </div>
            ))}
            <div className="msg-in">
              <input value={msg} placeholder="Add a note…" onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()} />
              <button className="btn btn-sm" onClick={send}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Driver view                                                        */
/* ------------------------------------------------------------------ */

function DriverCard({ t, me, onAct }) {
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const arriving = t.direction === "arrival";
  const when = dtOf(t);
  const soon = when && when.getTime() - Date.now() < 1000 * 60 * 60 * 4 && when.getTime() > Date.now() - 1000 * 60 * 60 * 6;
  const from = t.from || (arriving ? t.airport || "Airport" : "");
  const to = t.to || (arriving ? "" : t.airport || "Airport");
  const notes = t.thread || [];
  const ping = (text) => onAct(t.id, null, `${me.name}: ${text}`);

  return (
    <div className={"drow" + (soon ? " soon" : "") + (isExternal(t) ? " ext" : "")}>
      <div className="dtop">
        <div>
          <div className="dtime mono">{t.pickupTime || t.time || "--:--"}</div>
          <small>{t.pickupTime ? "PICK UP" : arriving ? "LANDS" : "DEPARTS"}</small>
        </div>
        <div className="dwho">
          <div className="n">{t.passenger}</div>
          <div className="f2">
            {t.flightNo ? <span className="fl">{t.flightNo.toUpperCase()}</span> : null}
            <span className="apt">{(t.airport || "").toUpperCase()}</span>
            <span className="pax">
              {arriving ? <PlaneLanding size={12} /> : <PlaneTakeoff size={12} />}
              {t.pax > 1 ? `${t.pax} people` : "1 person"}
            </span>
          </div>
        </div>
      </div>

      {from ? (
        <div className="dleg">
          <span className="lb">FROM</span><span>{from}</span>
          <a href={mapsHref(from)} target="_blank" rel="noreferrer" aria-label="Open in maps"><Navigation size={17} /></a>
        </div>
      ) : null}
      {to ? (
        <div className="dleg">
          <span className="lb">TO</span><span>{to}</span>
          <a href={mapsHref(to)} target="_blank" rel="noreferrer" aria-label="Open in maps"><Navigation size={17} /></a>
        </div>
      ) : null}

      {t.notes ? <div className="dnote">{t.notes}</div> : null}

      <div className="dacts">
        {t.phone ? (
          <a className="btn" href={`tel:${t.phone}`}><Phone size={15} />Call passenger</a>
        ) : (
          <button className="btn" onClick={() => ping("On my way")}><CarFront size={15} />On my way</button>
        )}
        <button className="btn" onClick={() => ping("Passenger picked up")}><Check size={15} />Picked up</button>
        <button className="btn btn-go full"
          onClick={() => onAct(t.id, { status: "done" }, `${me.name} completed this run`)}>
          <Check size={16} />Finish this run
        </button>
        <button className="btn btn-ghost full" onClick={() => setOpen((v) => !v)}>
          <MessageSquare size={14} />Notes{notes.length ? ` (${notes.length})` : ""}
        </button>
      </div>

      {open && (
        <div className="thread">
          {notes.map((n, i) => (
            <div className="msg" key={i}>
              <span className="m-by">{n.by}</span><span>{n.text}</span>
              <span className="m-at">{stamp(n.at)}</span>
            </div>
          ))}
          <div className="msg-in">
            <input value={msg} placeholder="Message the office…" onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && msg.trim() && (onAct(t.id, null, msg.trim()), setMsg(""))} />
            <button className="btn btn-sm" onClick={() => { if (msg.trim()) { onAct(t.id, null, msg.trim()); setMsg(""); } }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DriverBoard({ items, me, onAct }) {
  const [scope, setScope] = useState("mine");
  const live = items.filter((t) => t.status === "accepted" || t.status === "external");
  const nm = (me.name || "").toLowerCase();
  const mine = live.filter((t) => (t.handler || "").toLowerCase().includes(nm) && nm);
  const list = (scope === "mine" ? mine : live)
    .sort((a, b) => (a.date + (a.pickupTime || a.time || "")).localeCompare(b.date + (b.pickupTime || b.time || "")));

  const byDay = [];
  list.forEach((t) => {
    const last = byDay[byDay.length - 1];
    if (last && last[0] === t.date) last[1].push(t);
    else byDay.push([t.date, [t]]);
  });

  return (
    <>
      <div className="dhead">
        <Seg value={scope} onChange={setScope}
          options={[{ v: "mine", label: `My runs (${mine.length})` }, { v: "all", label: `All runs (${live.length})` }]} />
      </div>
      {byDay.length === 0 ? (
        <div className="empty">
          <b>{scope === "mine" ? "Nothing assigned to you." : "No runs booked."}</b>
          {scope === "mine" ? "Tap “All runs” to see what the team has on." : "The office will post them here."}
        </div>
      ) : (
        byDay.map(([date, l]) => (
          <div key={date}>
            <div className={"band" + (date === todayISO() ? " today" : "")}>
              <span className="d">{bandLabel(date)}</span>
              {date === todayISO() && <span className="tag eyebrow">TODAY</span>}
              <span className="line" />
              <span className="cnt">{l.length}</span>
            </div>
            {l.map((t) => <DriverCard key={t.id} t={t} me={me} onAct={onAct} />)}
          </div>
        ))
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Month calendar                                                     */
/* ------------------------------------------------------------------ */

const WEEK_HEAD = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function MonthCalendar({ rows, renderDay, emptyText }) {
  const phone = usePhone();
  const [month, setMonth] = useState(() => {
    const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d;
  });
  const [sel, setSel] = useState(todayISO());

  const byDate = useMemo(() => {
    const m = new Map();
    rows.forEach((t) => {
      if (!m.has(t.date)) m.set(t.date, []);
      m.get(t.date).push(t);
    });
    m.forEach((l) => l.sort((a, b) =>
      (a.pickupTime || a.time || "").localeCompare(b.pickupTime || b.time || "")));
    return m;
  }, [rows]);

  const key = isoDate(month).slice(0, 7);
  const offset = (month.getDay() + 6) % 7;                                  // Monday-first
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(`${key}-${pad(d)}`);
  while (cells.length % 7) cells.push(null);

  const monthRows = rows.filter((t) => t.date.slice(0, 7) === key);
  const pickups = monthRows.filter((t) => t.direction === "arrival").length;
  const selRows = byDate.get(sel) || [];

  return (
    <>
      <div className="weeknav">
        <button className="btn btn-sm" onClick={() => setMonth(addMonths(month, -1))} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <span className="lbl">{MONTHS[month.getMonth()]} {month.getFullYear()}</span>
        <button className="btn btn-sm" onClick={() => setMonth(addMonths(month, 1))} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
        <button className="btn btn-sm btn-ghost" onClick={() => {
          const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0);
          setMonth(d); setSel(todayISO());
        }}>Today</button>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="tile"><div className="n">{monthRows.length}</div><div className="k">Runs this month</div></div>
        <div className="tile"><div className="n">{pickups}</div><div className="k">Airport pick-ups</div></div>
        <div className="tile"><div className="n">{monthRows.length - pickups}</div><div className="k">Airport drop-offs</div></div>
      </div>

      <div className="cal">
        <div className="cal-head">{WEEK_HEAD.map((d) => <span key={d}>{d}</span>)}</div>
        <div className="cal-grid">
          {cells.map((date, i) => {
            if (!date) return <div className="cal-cell out" key={`b${i}`} />;
            const list = byDate.get(date) || [];
            const cls = "cal-cell" + (date === todayISO() ? " today" : "") + (date === sel ? " sel" : "");
            return (
              <button className={cls} key={date} onClick={() => setSel(date)}>
                <span className="dn">{Number(date.slice(8))}</span>
                {phone ? (
                  <div className="cal-dots">
                    {list.slice(0, 6).map((t) => (
                      <i key={t.id} style={{ background: (STATUS[t.status] || {}).color }} />
                    ))}
                  </div>
                ) : (
                  <>
                    {list.slice(0, 3).map((t) => (
                      <span className="cal-ev" key={t.id}>
                        <span className="b" style={{ background: (STATUS[t.status] || {}).color }} />
                        <span className="tm">{t.pickupTime || t.time || "--:--"}</span>
                        <span className="nm">{t.passenger}</span>
                      </span>
                    ))}
                    {list.length > 3 && <span className="cal-more">+{list.length - 3} MORE</span>}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="cal-legend">
        {["pending", "accepted", "external", "done"].map((k) => (
          <span key={k}>
            <i style={{ background: STATUS[k].color }} />{STATUS[k].label}
          </span>
        ))}
      </div>

      <div className="daypanel">
        <div className="sec-h">
          <h3>{bandLabel(sel)}</h3>
          <div className="line" />
          <span className="cnt mono" style={{ fontSize: 11, color: "var(--ink3)" }}>
            {selRows.length} {selRows.length === 1 ? "RUN" : "RUNS"}
          </span>
        </div>
        {selRows.length === 0
          ? <div className="note-box">{emptyText}</div>
          : renderDay(selRows)}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  New / edit transfer                                                */
/* ------------------------------------------------------------------ */

const BLANK = {
  direction: "arrival", passenger: "", pax: 1, flightNo: "", airport: "",
  date: todayISO(), time: "", pickupTime: "", from: "", to: "", phone: "", notes: "",
};

function TransferForm({ initial, lead, conf, onSave, onCancel }) {
  const [f, setF] = useState(() => ({ ...BLANK, ...(initial || {}) }));
  const [err, setErr] = useState("");
  const touched = useRef(Boolean(initial && initial.pickupTime));
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (touched.current || !f.time || !f.date) return;
    const sug = shiftTime(f.date, f.time, f.direction === "departure" ? -Math.abs(lead) : 30);
    if (sug) setF((p) => ({ ...p, pickupTime: sug }));
  }, [f.time, f.date, f.direction, lead]);

  const save = () => {
    if (!f.passenger.trim()) return setErr("Add the passenger's name so the driver knows who to look for.");
    if (!f.date) return setErr("Pick the flight date.");
    if (!f.time) return setErr("Add the flight time — it drives the pick-up time.");
    setErr("");
    onSave({
      ...f, passenger: f.passenger.trim(), pax: Math.max(1, parseInt(f.pax, 10) || 1),
      flightNo: f.flightNo.trim(), airport: f.airport.trim(),
    });
  };

  const arriving = f.direction === "arrival";
  return (
    <div className="sheet">
      <h2>{initial ? "Edit transfer" : "New airport transfer"}</h2>
      <p className="sub">Logistics sees this the moment you post it.</p>

      {/* DEMO — delete this block when you go live. */}
      {!initial && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          border: "1px dashed var(--rule)", borderRadius: 10, background: "#F7F8FB",
          padding: "10px 13px", marginBottom: 16,
        }}>
          <span className="eyebrow" style={{ color: "var(--ink3)" }}>DEMO</span>
          <span style={{ fontSize: 12.5, color: "var(--ink2)", marginRight: "auto" }}>
            Fill every field with a sample flight, then post it as normal.
          </span>
          <button className="btn btn-sm" onClick={() => {
            touched.current = true;          // keep the sample pick-up time
            setF({ ...BLANK, ...makeDemoFormData() });
            setErr("");
          }}>
            <Wand2 size={14} />Fill in a sample flight
          </button>
        </div>
      )}

      {err ? <div className="err">{err}</div> : null}

      <div className="grid">
        <div className="f wide">
          <label>Direction</label>
          <Seg value={f.direction} onChange={(v) => set("direction", v)}
            options={[
              { v: "arrival", label: "Arriving", icon: <PlaneLanding size={15} /> },
              { v: "departure", label: "Leaving", icon: <PlaneTakeoff size={15} /> },
            ]} />
        </div>

        <Field label="Passenger">
          <input value={f.passenger} onChange={(e) => set("passenger", e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="People travelling">
          <input className="mono" type="number" min="1" value={f.pax} onChange={(e) => set("pax", e.target.value)} />
        </Field>

        <Field label="Flight number">
          <input className="mono" value={f.flightNo} onChange={(e) => set("flightNo", e.target.value)} placeholder="TK1854" />
        </Field>
        <Field label="Airport / terminal" hint={conf.airports.length ? "Start typing — your usual ones are saved." : "The first one you type gets remembered."}>
          <input className="mono" list="td-airports" value={f.airport}
            onChange={(e) => set("airport", e.target.value)} placeholder="OTP T1" />
        </Field>

        <Field label="Flight date" hint={euDate(f.date) || "Day / month / year"}>
          <input className="mono" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
        <Field label={arriving ? "Lands at (24h)" : "Departs at (24h)"}>
          <Time24 value={f.time} onChange={(v) => set("time", v)} />
        </Field>

        <Field label="Pick up at (24h)"
          hint={arriving ? "Suggested: 30 min after landing" : `Suggested: ${(lead / 60).toFixed(1)} h before the flight`}>
          <Time24 value={f.pickupTime} onChange={(v) => { touched.current = true; set("pickupTime", v); }} />
        </Field>
        <Field label="Passenger phone">
          <input className="mono" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+40 …" />
        </Field>

        <Field label="From">
          <input value={f.from} onChange={(e) => set("from", e.target.value)}
            placeholder={arriving ? "Airport arrivals hall" : "Hotel / office / home address"} />
        </Field>
        <Field label="To">
          <input value={f.to} onChange={(e) => set("to", e.target.value)}
            placeholder={arriving ? "Hotel / office / home address" : "Airport departures"} />
        </Field>

        <Field label="Anything else" wide hint="Luggage, child seat, second stop, cost centre — whatever the driver needs.">
          <textarea rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>

      <div className="form-foot">
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>
          <Check size={15} />{initial ? "Save changes" : "Post to logistics"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reports                                                            */
/* ------------------------------------------------------------------ */

const cols = (cur) => [
  ["Flight date", (t) => t.date],
  ["Flight time", (t) => t.time],
  ["Direction", (t) => (t.direction === "arrival" ? "Arrival" : "Departure")],
  ["Flight no", (t) => t.flightNo],
  ["Airport", (t) => t.airport],
  ["Passenger", (t) => t.passenger],
  ["People", (t) => t.pax],
  ["Pick up at", (t) => t.pickupTime],
  ["From", (t) => t.from],
  ["To", (t) => t.to],
  ["Phone", (t) => t.phone],
  ["Handled by", (t) => t.handler || ""],
  ["Type", (t) => (isExternal(t) ? "Outside service" : "In-house")],
  [`Cost (${cur})`, (t) => (t.cost == null || t.cost === "" ? "" : t.cost)],
  ["Status", (t) => (STATUS[t.status] || {}).short || t.status],
  ["Posted by", (t) => t.createdBy],
  ["Posted at", (t) => (t.createdAt ? new Date(t.createdAt).toISOString().slice(0, 16).replace("T", " ") : "")],
  ["Completed at", (t) => (t.doneAt ? new Date(t.doneAt).toISOString().slice(0, 16).replace("T", " ") : "")],
  ["Notes", (t) => t.notes],
];

function toCSV(rows, cur) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const c = cols(cur);
  return c.map((x) => esc(x[0])).join(",") + "\n" +
    rows.map((t) => c.map((x) => esc(x[1](t))).join(",")).join("\n");
}

function Exporter({ rows, cur, name, onToast }) {
  const [open, setOpen] = useState(false);
  const csv = toCSV(rows, cur);
  const download = () => {
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
      a.download = `${name}.csv`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      onToast("Report downloaded");
    } catch { setOpen(true); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(csv); onToast("Copied — paste into Excel"); }
    catch { setOpen(true); }
  };
  return (
    <>
      <button className="btn btn-sm" onClick={copy}><Copy size={14} />Copy</button>
      <button className="btn btn-sm btn-primary" onClick={download}><Download size={14} />CSV</button>
      {open && (
        <div className="modal-bg" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Copy this into a spreadsheet</h3>
            <textarea className="codebox" readOnly value={csv} onFocus={(e) => e.target.select()} />
            <div className="form-foot"><button className="btn btn-primary" onClick={() => setOpen(false)}>Done</button></div>
          </div>
        </div>
      )}
    </>
  );
}

function Report({ items, conf, onToast }) {
  const phone = usePhone();
  const [mode, setMode] = useState("week");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; });
  const cur = conf.currency;

  /* ---------- weekly ---------- */
  const weekEnd = addDays(weekStart, 6);
  const inWeek = useMemo(() => {
    const a = isoDate(weekStart), b = isoDate(weekEnd);
    return items.filter((t) => t.date >= a && t.date <= b && t.status !== "cancelled")
      .sort((x, y) => (x.date + (x.time || "")).localeCompare(y.date + (y.time || "")));
  }, [items, weekStart]);
  const done = inWeek.filter((t) => t.status === "done");
  const open = inWeek.filter((t) => t.status !== "done");
  const ext = done.filter(isExternal);
  const weekLabel = `${pad(weekStart.getDate())} ${MONTHS[weekStart.getMonth()]} – ${pad(weekEnd.getDate())} ${MONTHS[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  /* ---------- monthly ---------- */
  const monthRows = useMemo(() => {
    const a = isoDate(month), b = isoDate(addDays(addMonths(month, 1), -1));
    return items.filter((t) => t.date >= a && t.date <= b && t.status !== "cancelled")
      .sort((x, y) => (x.date + (x.time || "")).localeCompare(y.date + (y.time || "")));
  }, [items, month]);
  const paid = monthRows.filter((t) => t.cost != null && t.cost !== "");
  const spend = paid.reduce((s, t) => s + Number(t.cost || 0), 0);
  const extMonth = monthRows.filter(isExternal);
  const missing = extMonth.filter((t) => t.cost == null || t.cost === "");
  const byService = useMemo(() => {
    const m = new Map();
    paid.forEach((t) => {
      const k = isExternal(t) ? (t.handler || "Outside service") : "In-house";
      const e = m.get(k) || { runs: 0, total: 0 };
      e.runs += 1; e.total += Number(t.cost || 0);
      m.set(k, e);
    });
    return [...m.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [paid]);
  const monthLabel = `${MONTHS[month.getMonth()]} ${month.getFullYear()}`;

  const RunList = ({ rows }) =>
    phone ? (
      <div>
        {rows.map((t) => (
          <div className="rcard" key={t.id}>
            <div className="h">
              <span className="dt">{shortDate(t.date)} {t.time}</span>
              <span className="nm">{t.passenger}</span>
            </div>
            <div className="l">
              <span>{t.direction === "arrival" ? "ARR" : "DEP"} · {(t.flightNo || "—").toUpperCase()} · {(t.airport || "—").toUpperCase()}</span>
            </div>
            <div className="l">{(t.from || "—")} → {(t.to || "—")}</div>
            <div className="l">
              <span>By </span>{t.handler || "—"}
              {t.cost != null && t.cost !== "" ? <span className="cost-tag" style={{ marginLeft: 8 }}>{money(t.cost, cur)}</span> : null}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="tbl-wrap">
        <table className="rep">
          <thead>
            <tr><th>Date</th><th>Time</th><th>Dir</th><th>Flight</th><th>Airport</th>
              <th>Passenger</th><th>Pax</th><th>Route</th><th>Handled by</th><th>Cost</th><th>Closed</th></tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td className="m">{shortDate(t.date)}</td>
                <td className="m">{t.time}</td>
                <td className="m">{t.direction === "arrival" ? "ARR" : "DEP"}</td>
                <td className="m">{(t.flightNo || "—").toUpperCase()}</td>
                <td className="m">{(t.airport || "—").toUpperCase()}</td>
                <td>{t.passenger}</td>
                <td className="m">{t.pax}</td>
                <td>{(t.from || "—") + " → " + (t.to || "—")}</td>
                <td>{t.handler || "—"}</td>
                <td className="m">{t.cost != null && t.cost !== "" ? money(t.cost, cur) : "—"}</td>
                <td className="m">{t.doneAt ? stamp(t.doneAt) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return (
    <>
      <div className="repmode">
        <button className={"chip" + (mode === "week" ? " on" : "")} onClick={() => setMode("week")}>Weekly runs</button>
        <button className={"chip" + (mode === "month" ? " on" : "")} onClick={() => setMode("month")}>Monthly costs</button>
      </div>

      {mode === "week" ? (
        <>
          <div className="weeknav">
            <button className="btn btn-sm" onClick={() => setWeekStart(addDays(weekStart, -7))}><ChevronLeft size={16} /></button>
            <span className="lbl">{weekLabel}</span>
            <button className="btn btn-sm" onClick={() => setWeekStart(addDays(weekStart, 7))}><ChevronRight size={16} /></button>
            <button className="btn btn-sm btn-ghost" onClick={() => setWeekStart(startOfWeek(new Date()))}>This week</button>
            <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
              <Exporter rows={done.length ? done : inWeek} cur={cur} name={`transfers-${isoDate(weekStart)}`} onToast={onToast} />
            </div>
          </div>

          <div className="tiles">
            <div className="tile"><div className="n">{done.length}</div><div className="k">Completed</div></div>
            <div className="tile"><div className="n">{done.length - ext.length}</div><div className="k">In-house</div></div>
            <div className="tile"><div className="n">{ext.length}</div><div className="k">Outside</div></div>
            <div className="tile"><div className="n">{done.filter((t) => t.direction === "arrival").length}</div><div className="k">Arrivals</div></div>
            <div className="tile"><div className="n">{done.reduce((s, t) => s + (Number(t.pax) || 1), 0)}</div><div className="k">People</div></div>
          </div>

          <div className="sec-h"><h3>Completed transfers</h3><div className="line" /></div>
          {done.length === 0
            ? <div className="note-box">Nothing closed off this week yet. Runs land here once someone marks them completed.</div>
            : <RunList rows={done} />}

          {open.length > 0 && (
            <>
              <div className="sec-h"><h3 style={{ color: "var(--stop)" }}>Still open from this week</h3><div className="line" /></div>
              <RunList rows={open} />
            </>
          )}
        </>
      ) : (
        <>
          <div className="weeknav">
            <button className="btn btn-sm" onClick={() => setMonth(addMonths(month, -1))}><ChevronLeft size={16} /></button>
            <span className="lbl">{monthLabel}</span>
            <button className="btn btn-sm" onClick={() => setMonth(addMonths(month, 1))}><ChevronRight size={16} /></button>
            <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
              <Exporter rows={monthRows} cur={cur} name={`transfers-${isoDate(month).slice(0, 7)}`} onToast={onToast} />
            </div>
          </div>

          <div className="tiles">
            <div className="tile"><div className="n">{money(spend, cur)}</div><div className="k">Spent</div></div>
            <div className="tile"><div className="n">{extMonth.length}</div><div className="k">Outside runs</div></div>
            <div className="tile"><div className="n">{monthRows.length - extMonth.length}</div><div className="k">In-house runs</div></div>
            <div className="tile"><div className="n">{paid.length ? money(spend / paid.length, cur) : "—"}</div><div className="k">Avg / run</div></div>
            <div className="tile"><div className="n">{missing.length}</div><div className="k">No cost yet</div></div>
          </div>

          <div className="sec-h"><h3>By service</h3><div className="line" /></div>
          {byService.length === 0 ? (
            <div className="note-box">
              No costs logged for {monthLabel}. Open a transfer that went to an outside service and tap
              <b> Add cost</b> — the totals build themselves from there.
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="rep" style={{ minWidth: 0 }}>
                <thead><tr><th>Service</th><th>Runs</th><th>Total</th><th>Average</th></tr></thead>
                <tbody>
                  {byService.map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td className="m">{v.runs}</td>
                      <td className="m" style={{ fontWeight: 600 }}>{money(v.total, cur)}</td>
                      <td className="m">{money(v.total / v.runs, cur)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {missing.length > 0 && (
            <>
              <div className="sec-h"><h3 style={{ color: "var(--signal)" }}>Waiting for a cost</h3><div className="line" /></div>
              <RunList rows={missing} />
            </>
          )}
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

function ListEditor({ label, hint, placeholder, values, onChange }) {
  const [v, setV] = useState("");
  const add = () => {
    const s = v.trim();
    if (!s || values.some((x) => x.toLowerCase() === s.toLowerCase())) return setV("");
    onChange([...values, s]); setV("");
  };
  return (
    <div className="f wide">
      <label>{label}</label>
      <div style={{ display: "flex", gap: 7 }}>
        <input value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="btn" onClick={add}><Plus size={15} />Add</button>
      </div>
      {hint ? <div className="hint">{hint}</div> : null}
      <div className="taglist">
        {values.length === 0 && <span className="hint">Nothing saved yet.</span>}
        {values.map((x) => (
          <span className="tagx" key={x}>
            {x}
            <button onClick={() => onChange(values.filter((y) => y !== x))} aria-label={`Remove ${x}`}>
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ me, setMe, conf, setConf, items, reload, onToast }) {
  const [restore, setRestore] = useState("");
  const [show, setShow] = useState(false);

  const backup = () => {
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify({ board: items, conf }, null, 2)], { type: "application/json" }));
      a.download = `transfer-desk-backup-${todayISO()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      onToast("Backup saved");
    } catch { onToast("Couldn't save the file here"); }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="sheet">
        <h2>You</h2>
        <p className="sub">Your name shows next to everything you post, confirm or drive.</p>
        <div className="grid">
          <Field label="Your name" wide>
            <input value={me.name} onChange={(e) => setMe({ ...me, name: e.target.value })} />
          </Field>
          <div className="f wide">
            <label>Your desk</label>
            <Seg value={me.role} onChange={(v) => setMe({ ...me, role: v })}
              options={[{ v: "hr", label: "HR" }, { v: "logistics", label: "Logistics" }, { v: "driver", label: "Driver" }]} />
          </div>
          <Field label="Head start before departures" hint="Used to suggest the pick-up time on outbound flights.">
            <select className="mono" value={me.lead} onChange={(e) => setMe({ ...me, lead: Number(e.target.value) })}>
              {[90, 120, 150, 180, 210, 240].map((m) => (
                <option key={m} value={m}>{m} min ({(m / 60).toFixed(1)} h)</option>
              ))}
            </select>
          </Field>
          <Field label="Currency" hint="Shared by the whole team.">
            <select className="mono" value={conf.currency} onChange={(e) => setConf({ ...conf, currency: e.target.value })}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c} — {SYMBOL[c]}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="sheet">
        <h2>Your usual places</h2>
        <p className="sub">These fill the suggestion lists. New ones get added automatically as you use them.</p>
        <div className="grid">
          <ListEditor label="Airports & terminals" placeholder="OTP T1"
            hint="Type it once and it's on the list for everyone."
            values={conf.airports} onChange={(v) => setConf({ ...conf, airports: v })} />
          <ListEditor label="Outside services" placeholder="City Cabs"
            hint="Shows up when logistics delegates a run."
            values={conf.services} onChange={(v) => setConf({ ...conf, services: v })} />
        </div>
      </div>

      <div className="sheet">
        <h2>Your data</h2>
        <p className="sub">Everything lives in this app. Nothing is emailed or sent anywhere else.</p>
        <div className="note-box" style={{ marginBottom: 15 }}>
          The board is <b>shared with everyone who opens this app</b> — that's how HR, logistics and the
          drivers see the same list. Keep the link inside the team, and take a backup now and then so you
          hold your own copy of the history.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn" onClick={backup}><Download size={14} />Download a backup</button>
          <button className="btn" onClick={() => setShow(true)}><RefreshCw size={14} />Restore from backup</button>
          <button className="btn" onClick={reload}><RefreshCw size={14} />Refresh the board</button>
        </div>
        <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--ink3)" }}>{items.length} transfers on record.</div>
      </div>

      {show && (
        <div className="modal-bg" onClick={() => setShow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Restore from a backup</h3>
            <p style={{ fontSize: 12.5, color: "var(--ink3)", marginTop: 0 }}>
              Paste the contents of a backup file. This replaces the board for everyone.
            </p>
            <textarea className="codebox" value={restore} onChange={(e) => setRestore(e.target.value)} placeholder="{ … }" />
            <div className="form-foot">
              <button className="btn" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={async () => {
                try {
                  const p = JSON.parse(restore);
                  const board = Array.isArray(p) ? p : p.board;
                  if (!Array.isArray(board)) throw new Error();
                  await writeBoard(board);
                  if (p.conf) { await writeConf({ ...DEFAULT_CONF, ...p.conf }); setConf({ ...DEFAULT_CONF, ...p.conf }); }
                  await reload(); setShow(false); setRestore(""); onToast("Board restored");
                } catch { onToast("That doesn't look like a backup file"); }
              }}>Replace the board</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/*  DEMO BAR — TEMPORARY. Delete this whole block when you go live.     */
/* ==================================================================== */

function DemoBar({ count, onSeed, onClear }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      border: "1px dashed var(--rule)", borderRadius: 10, background: "#F7F8FB",
      padding: "10px 13px", marginBottom: 16,
    }}>
      <span className="eyebrow" style={{ color: "var(--ink3)" }}>DEMO</span>
      <span style={{ fontSize: 12.5, color: "var(--ink2)", marginRight: "auto" }}>
        Test data for trying the app out — remove before real use.
      </span>
      <button className="btn btn-sm" onClick={onSeed}>
        <Wand2 size={14} />Fill with sample transfers
      </button>
      {count > 0 && (
        confirming ? (
          <>
            <button className="btn btn-sm" style={{ borderColor: "var(--stop)", color: "var(--stop)" }}
              onClick={() => { setConfirming(false); onClear(); }}>
              Delete all {count}?
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setConfirming(false)}>Keep</button>
          </>
        ) : (
          <button className="btn btn-sm btn-ghost" onClick={() => setConfirming(true)}>
            <Trash2 size={13} />Clear board
          </button>
        )
      )}
    </div>
  );
}

/* ==================== END DEMO BAR ==================================== */

/* ------------------------------------------------------------------ */
/*  Sign-in gate                                                       */
/* ------------------------------------------------------------------ */

/** The parent shows this screen while `me.name` is empty, so the typed name
 *  is held here as a draft. Writing it straight to `me` would satisfy the
 *  parent's condition on the first keystroke and unmount the form mid-word. */
function SignInGate({ initial, onStart }) {
  const [draft, setDraft] = useState(initial);
  const ready = draft.name.trim().length > 0;
  const start = () => { if (ready) onStart({ ...draft, name: draft.name.trim() }); };
  const returning = Boolean((initial.name || "").trim());

  return (
    <div className="td" lang="en-GB">
      <style>{CSS}</style>
      <div className="wrap" style={{ maxWidth: 460, paddingTop: 50 }}>
        <div className="sheet">
          <div className="eyebrow" style={{ color: "var(--ink3)" }}>Transfer Desk</div>
          <h2 style={{ marginTop: 6, fontSize: 21 }}>Who's at the desk?</h2>
          <p className="sub">
            {returning
              ? "Pick the desk you're on today, then open the board."
              : "Your name goes on every transfer you post, confirm or drive."}
          </p>
          <div className="grid">
            <Field label="Your name" wide>
              <input autoFocus value={draft.name} placeholder="e.g. Elena"
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && start()} />
            </Field>
            <div className="f wide">
              <label>Your desk</label>
              <Seg value={draft.role} onChange={(v) => setDraft((d) => ({ ...d, role: v }))}
                options={[{ v: "hr", label: "HR" }, { v: "logistics", label: "Logistics" }, { v: "driver", label: "Driver" }]} />
              <div className="hint">
                {draft.role === "hr" && "You post the flights."}
                {draft.role === "logistics" && "You decide who drives, or send it to an outside service."}
                {draft.role === "driver" && "You get a short list of just your runs."}
              </div>
            </div>
          </div>
          <div className="form-foot">
            <button className="btn btn-primary btn-big" onClick={start} disabled={!ready}>
              {returning ? "Open the board" : "Start"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function TransferDesk() {
  const [me, setMeState] = useState(null);
  const [conf, setConfState] = useState(DEFAULT_CONF);
  const [booting, setBooting] = useState(true);
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("board");
  const [filter, setFilter] = useState("open");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const [seen, setSeen] = useState(Date.now());
  // Always ask which desk you're on at the start of a session. The name is
  // remembered, so this is a one-tap confirmation rather than a login.
  const [identified, setIdentified] = useState(false);
  const timer = useRef(null);
  const phone = usePhone();

  const say = useCallback((m) => {
    setToast(m); clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  }, []);
  const reload = useCallback(async () => setItems(await readBoard()), []);

  useEffect(() => {
    (async () => {
      const saved = await readMe();
      setMeState(saved || { name: "", role: "hr", lead: 150 });
      setConfState(await readConf());
      await reload();
      setBooting(false);
    })();
  }, [reload]);

  useEffect(() => {
    if (booting) return;
    const id = setInterval(reload, 12000);
    return () => clearInterval(id);
  }, [booting, reload]);

  const setMe = (n) => { setMeState(n); writeMe(n); };
  const setConf = (c) => { setConfState(c); writeConf(c); };

  /* ---- DEMO: delete these two together with the DemoBar block ---- */
  const seedDemo = async () => {
    const rows = makeDemoTransfers(me.name || "Elena");
    await writeBoard(rows);
    const nextConf = { ...conf, ...DEMO_CONF };
    await writeConf(nextConf);
    setConfState(nextConf);
    await reload();
    say(`Loaded ${rows.length} sample transfers`);
  };
  const clearBoard = async () => {
    await writeBoard([]);
    await reload();
    say("Board cleared");
  };
  /* ---- END DEMO ---- */

  const learn = useCallback((patch) => {
    setConfState((c) => {
      let next = c, changed = false;
      if (patch.airport) {
        const a = patch.airport.trim();
        if (a && !c.airports.some((x) => x.toLowerCase() === a.toLowerCase())) {
          next = { ...next, airports: [...next.airports, a] }; changed = true;
        }
      }
      if (patch.service) {
        const s = patch.service.trim();
        if (s && !c.services.some((x) => x.toLowerCase() === s.toLowerCase())) {
          next = { ...next, services: [...next.services, s] }; changed = true;
        }
      }
      if (changed) writeConf(next);
      return next;
    });
  }, []);

  const saveTransfer = async (data) => {
    const isEdit = editing && editing !== "new";
    await mutateBoard((list) => isEdit
      ? list.map((t) => (t.id === editing.id ? { ...t, ...data, updatedAt: Date.now() } : t))
      : [...list, { ...data, id: uid(), status: "pending", handler: "", createdBy: me.name || "HR", createdAt: Date.now(), thread: [] }]);
    learn({ airport: data.airport });
    await reload();
    setEditing(null); setTab("board");
    say(isEdit ? "Transfer updated" : "Posted — logistics can see it now");
  };

  const act = async (id, patch, note, extra) => {
    if (patch === "__edit__") {
      const t = items.find((x) => x.id === id);
      if (t) { setEditing(t); setTab("new"); }
      return;
    }
    if (extra) learn(extra);
    await mutateBoard((list) => list.map((t) => {
      if (t.id !== id) return t;
      const next = { ...t };
      if (patch) {
        Object.assign(next, patch);
        if (patch.status === "external") next.wasExternal = true;
        if (patch.status === "done") next.doneAt = Date.now();
        if (patch.status && patch.status !== "done") next.doneAt = null;
      }
      if (note) next.thread = [...(t.thread || []), { by: me.name || "Someone", text: note, at: Date.now() }];
      next.updatedAt = Date.now();
      return next;
    }));
    await reload();
    if (patch && patch.status === "accepted") say("Confirmed — HR can see it's covered");
    else if (patch && patch.status === "external") say("Marked for an outside service");
    else if (patch && patch.status === "done") say("Closed — it's in this week's report");
    else if (patch && "cost" in patch) say("Cost saved");
    else if (note) say("Note added");
  };

  const pending = useMemo(() => items.filter((t) => t.status === "pending"), [items]);
  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    let out = items.filter((t) =>
      filter === "open" ? ["pending", "accepted", "external"].includes(t.status)
        : filter === "all" ? true : t.status === filter);
    if (term) out = out.filter((t) =>
      [t.passenger, t.flightNo, t.airport, t.from, t.to, t.handler, t.notes, t.phone]
        .filter(Boolean).join(" ").toLowerCase().includes(term));
    return out.sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")));
  }, [items, filter, q]);

  const byDay = useMemo(() => {
    const out = [];
    visible.forEach((t) => {
      const last = out[out.length - 1];
      if (last && last[0] === t.date) last[1].push(t); else out.push([t.date, [t]]);
    });
    return out;
  }, [visible]);

  /* ---------- gates ---------- */
  if (booting) {
    return <div className="td"><style>{CSS}</style><div className="wrap"><div className="empty">Opening the board…</div></div></div>;
  }

  if (!identified) {
    return (
      <SignInGate
        initial={me}
        onStart={(m) => { setMe(m); setIdentified(true); }}
      />
    );
  }

  const isDriver = me.role === "driver";
  const TABS = isDriver
    ? [
      { k: "board", label: "My runs", icon: <CarFront size={17} /> },
      { k: "calendar", label: "Month", icon: <CalendarDays size={17} /> },
      { k: "settings", label: "Settings", icon: <Settings size={17} /> },
    ]
    : [
      { k: "board", label: "Board", icon: <LayoutList size={17} /> },
      { k: "calendar", label: "Month", icon: <CalendarDays size={17} /> },
      { k: "new", label: editing && editing !== "new" ? "Edit" : "New", icon: <Plus size={17} /> },
      { k: "report", label: "Reports", icon: <FileText size={17} /> },
      { k: "settings", label: "Settings", icon: <Settings size={17} /> },
    ];
  // On a phone the + button covers "New", so it stays out of the bottom bar.
  const NAV = phone ? TABS.filter((t) => t.k !== "new") : TABS;

  const calRows = isDriver
    ? items.filter((t) => ["accepted", "external", "done"].includes(t.status))
    : items.filter((t) => t.status !== "cancelled");

  return (
    <div className="td" lang="en-GB">
      <style>{CSS}</style>
      <datalist id="td-airports">{conf.airports.map((a) => <option key={a} value={a} />)}</datalist>
      <datalist id="td-services">{conf.services.map((a) => <option key={a} value={a} />)}</datalist>

      <div className="topbar">
        <div className="topbar-in">
          <div className="brand">
            <b>Transfer Desk</b>
            <span className="eyebrow">HR → Logistics · airport runs</span>
          </div>
          {!isDriver && pending.length > 0 && (
            <button className="pill-alert" onClick={() => { setTab("board"); setFilter("pending"); }}>
              <AlertTriangle size={14} /><b>{pending.length}</b> {phone ? "" : "waiting"}
            </button>
          )}
          <span className="who"><i /><span>{me.name}</span></span>
          <button className="icon-btn" title="Refresh" onClick={() => { reload(); setSeen(Date.now()); say("Board refreshed"); }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="tabs">
        <div className="tabs-in">
          {TABS.map((t) => (
            <button key={t.k} className={"tab" + (tab === t.k ? " on" : "")}
              onClick={() => { if (t.k !== "new") setEditing(null); setTab(t.k); }}>
              {t.icon}{t.label}
              {t.k === "board" && !isDriver && pending.length > 0 && <span className="tab-badge">{pending.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap">
        {/* DEMO — delete this line when you go live. */}
        <DemoBar count={items.length} onSeed={seedDemo} onClear={clearBoard} />

        {tab === "board" && isDriver && <DriverBoard items={items} me={me} onAct={act} />}

        {tab === "board" && !isDriver && (
          <>
            {me.role === "logistics" && pending.length > 0 && (
              <div className="banner">
                <AlertTriangle size={19} color="#B07800" />
                <div>
                  <b>{pending.length} transfer{pending.length > 1 ? "s" : ""} need a decision</b>
                  <p>Take it in-house, or hand it to an outside service.</p>
                </div>
              </div>
            )}

            <div className="controls">
              <div className="search">
                <Search size={16} color="#7A869F" />
                <input value={q} placeholder="Search name, flight, airport…" onChange={(e) => setQ(e.target.value)} />
                {q && <button className="btn btn-sm btn-ghost" onClick={() => setQ("")}><X size={14} /></button>}
              </div>
              <div className="chips">
                {[
                  { k: "open", l: "Live", n: items.filter((t) => ["pending", "accepted", "external"].includes(t.status)).length },
                  { k: "pending", l: "Waiting", n: pending.length },
                  { k: "accepted", l: "In-house", n: items.filter((t) => t.status === "accepted").length },
                  { k: "external", l: "Outside", n: items.filter((t) => t.status === "external").length },
                  { k: "done", l: "Done", n: items.filter((t) => t.status === "done").length },
                  { k: "all", l: "All", n: items.length },
                ].map((c) => (
                  <button key={c.k} className={"chip" + (filter === c.k ? " on" : "")} onClick={() => setFilter(c.k)}>
                    {c.l}<span className="n">{c.n}</span>
                  </button>
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => { setEditing("new"); setTab("new"); }}>
                <Plus size={15} />New transfer
              </button>
            </div>

            {byDay.length === 0 ? (
              <div className="empty">
                <b>{q ? "Nothing matches that." : "The board is clear."}</b>
                {q ? "Try a shorter search." : "Post a flight and logistics will see it here."}
              </div>
            ) : byDay.map(([date, list]) => (
              <div key={date}>
                <div className={"band" + (date === todayISO() ? " today" : "")}>
                  <span className="d">{bandLabel(date)}</span>
                  {date === todayISO() && <span className="tag eyebrow">TODAY</span>}
                  <span className="line" />
                  <span className="cnt">{list.length}</span>
                </div>
                {list.map((t) => (
                  <TransferRow key={t.id} t={t} me={me} conf={conf} onAct={act}
                    isNew={t.status === "pending" && t.createdAt > seen - 60000 && t.createdBy !== me.name} />
                ))}
              </div>
            ))}
          </>
        )}

        {tab === "calendar" && (
          <MonthCalendar
            rows={calRows}
            emptyText={isDriver
              ? "No runs booked for this day."
              : "Nothing on this day. Pick another, or post a transfer from the board."}
            renderDay={(rows) => rows.map((t) => (
              isDriver
                ? <DriverCard key={t.id} t={t} me={me} onAct={act} />
                : <TransferRow key={t.id} t={t} me={me} conf={conf} onAct={act} isNew={false} />
            ))}
          />
        )}

        {tab === "new" && (
          <TransferForm initial={editing && editing !== "new" ? editing : null} lead={me.lead || 150}
            conf={conf} onSave={saveTransfer} onCancel={() => { setEditing(null); setTab("board"); }} />
        )}
        {tab === "report" && <Report items={items} conf={conf} onToast={say} />}
        {tab === "settings" && (
          <SettingsView me={me} setMe={setMe} conf={conf} setConf={setConf}
            items={items} reload={reload} onToast={say} />
        )}
      </div>

      {!isDriver && (tab === "board" || tab === "calendar") && (
        <button className="fab" aria-label="New transfer" onClick={() => { setEditing("new"); setTab("new"); }}>
          <Plus size={26} />
        </button>
      )}

      <div className="bnav">
        {NAV.map((t) => (
          <button key={t.k} className={tab === t.k ? "on" : ""}
            onClick={() => { if (t.k !== "new") setEditing(null); setTab(t.k); }}>
            {t.icon}{t.label}
            {t.k === "board" && !isDriver && pending.length > 0 && <span className="bdot">{pending.length}</span>}
          </button>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
