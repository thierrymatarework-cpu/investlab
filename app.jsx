import { useState, useEffect, useRef } from "react";

const FOX = "https://raw.githubusercontent.com/thierrymatarework-cpu/investlab/main/fox.jpeg";
const CUR = { EUR: { s: "€", r: 1 }, USD: { s: "$", r: 1.08 }, CHF: { s: "Fr.", r: 0.96 }, GBP: { s: "£", r: 0.86 } };
const f = (n, d = 2) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

const KENN = {
  KGV: "Kurs-Gewinn-Verhältnis. Kurs ÷ Gewinn/Aktie. Niedrig = günstig. DAX-Schnitt ~15.",
  KBV: "Kurs-Buchwert. Unter 1.0 = Aktie kostet weniger als Substanzwert.",
  DIV: "Dividendenrendite. Jährliche Ausschüttung ÷ Kurs in %.",
  RSI: "Relative Strength Index (0-100). Unter 30 = überverkauft. Über 70 = überkauft.",
  BETA: "Volatilität vs. DAX. >1 = volatiler, <1 = defensiver.",
  ROE: "Return on Equity. Eigenkapitalrendite in %.",
  MARGE: "Operative Gewinnmarge in %.",
  "DIV/A": "Dividende pro Aktie in Euro.",
};

const SG = { strong_buy: ["STRONG BUY", "#16A34A", "#F0FDF4"], buy: ["BUY", "#16A34A", "#F0FDF4"], hold: ["HOLD", "#CA8A04", "#FEFCE8"] };

const D = [
  { s: "ALV", n: "Allianz SE", se: "Versicherung", p: 312.8, c: 1.34, pe: 11.2, pb: 1.9, dv: 4.8, da: 17.1, rsi: 55, sc: 91, sg: "strong_buy", beta: 0.88, tg: 348, an: [18, 5, 1], roe: 17.2, mg: 8.7,
    de: "Rekordergebnis 2025. Dividende 17,10 EUR. Rückkauf 2,5 Mrd. Solvency 206%. AI in Schadenabwicklung senkt Combined Ratio um 2pp.",
    ri: ["AGI/Pimco Netto-Abflüsse Q4", "Iran: Rückversicherungs-Exposure", "Ausblick 2026 ohne Wachstumssprung"], ca: ["Dividende 17,10 + Rückkauf 2,5 Mrd", "Solvency 206%", "AI Schadenabwicklung"],
    nw: [{ d: "18.03.2026", h: "Allianz: Ausblick bremst Kurs trotz Rekordergebnis", tx: "Die Allianz prognostiziert für 2026 ein operatives Ergebnis von 17,4 Mrd ±1 Mrd — auf Rekordniveau, aber ohne den erhofften Wachstumssprung. Dividende steigt auf 17,10 EUR. Rückkauf 2,5 Mrd startet März.", src: "finanzen.net" }, { d: "12.03.2026", h: "Allianz größter DAX-Dividendenzahler mit 6,5 Mrd", tx: "Gesamtausschüttung 6,5 Mrd an Aktionäre. Ausschüttungsquote 60%. Versicherer lösen Autobranche als dividendenstärksten Sektor ab.", src: "Handelsblatt" }],
    ev: [{ d: "08.05.2026", e: "Hauptversammlung + Dividende" }, { d: "15.05.2026", e: "Ex-Dividende" }] },
  { s: "BMW", n: "BMW AG", se: "Automobil", p: 82.35, c: -2.49, pe: 6.8, pb: 0.8, dv: 5.4, da: 4.4, rsi: 28, sc: 88, sg: "strong_buy", beta: 1.28, tg: 105, an: [14, 9, 3], roe: 12.8, mg: 7.6,
    de: "EBIT -11,5%. China-Schwäche (33% Umsatz). Dividende steigt überraschend auf 4,40 EUR — Signal des Vertrauens. RSI 28 = extreme Überverkauft-Situation. Goldman Sachs: Buy, Ziel 105. Cash 25 Mrd. BofA: Underperform, Ziel 85.",
    ri: ["China 33% Umsatz, rückläufig", "US-Zölle belasten Marge -1,25pp", "Automarge nur 4-6%", "Neue Klasse muss Erfolg werden"], ca: ["RSI 28 = historisches Kaufsignal", "Cash 25 Mrd deckt Transformation", "Neue Klasse ab 2026", "Werk South Carolina schützt vor US-Zöllen"],
    nw: [{ d: "20.03.2026", h: "BMW: 4-Wochen-Tief markiert — RSI bei 28", tx: "BMW markiert ein neues 4-Wochen-Tief. RSI bei 28 — historisch folgte in 5/5 Fällen eine Erholung von Ø18% in 6 Monaten. Technisch bearish, fundamental ein Value-Signal.", src: "finanzen.net" }, { d: "13.03.2026", h: "EBIT -11,5% — Dividende steigt überraschend auf 4,40 EUR", tx: "Gewinn 7,45 Mrd (-3%). Umsatz 133,5 Mrd (-6,3%). Dividende auf 4,40 EUR erhöht. Automarge 2026: 4-6%. Zölle belasten mit 1,25pp.", src: "dpa-AFX" }, { d: "23.02.2026", h: "Goldman Sachs: BMW bleibt Buy — Kursziel auf 105 gesenkt", tx: "Goldman senkt Ziel von 112 auf 105 aufgrund niedrigerer Margen, bestätigt Buy. Upside +27%. BofA: Underperform, Ziel 85.", src: "Goldman Sachs Research" }],
    ev: [{ d: "13.05.2026", e: "Hauptversammlung München" }, { d: "Mai 2026", e: "Dividende 4,40 EUR" }, { d: "Q2 2026", e: "Neue Klasse Auslieferungen" }] },
  { s: "MBG", n: "Mercedes-Benz", se: "Automobil", p: 56.2, c: -1.49, pe: 5.8, pb: 0.7, dv: 6.4, da: 3.5, rsi: 32, sc: 86, sg: "strong_buy", beta: 1.32, tg: 72, an: [15, 8, 2], roe: 14.5, mg: 8.8,
    de: "Handelt unter Buchwert (KBV 0,7). Dividende 3,50 EUR. Rückkauf 3 Mrd. Luxury-Strategie Maybach/AMG.",
    ri: ["Dividendenkürzung", "US-Zölle 15% NA-Umsatz", "China-Überkapazitäten"], ca: ["KBV 0,7 = unter Substanzwert", "Rückkauf 3 Mrd", "Luxury-Mix steigt"],
    nw: [{ d: "18.03.2026", h: "Mercedes: Dividende sinkt — Rendite bleibt 6,4%", tx: "Dividende 3,50 EUR. Bei aktuellem Kurs 6,4% Rendite. Rückkauf 3 Mrd angekündigt.", src: "themarket.ch" }],
    ev: [{ d: "Mai 2026", e: "HV + Dividende" }] },
  { s: "VOW3", n: "Volkswagen Vz.", se: "Automobil", p: 91.4, c: -1.88, pe: 3.8, pb: 0.4, dv: 5.8, da: 5.26, rsi: 34, sc: 82, sg: "strong_buy", beta: 1.22, tg: 130, an: [11, 12, 4], roe: 8.2, mg: 2.8,
    de: "Gewinn -44%. CEO Blume: 'Geschäftsmodell funktioniert so nicht mehr.' 50k Stellen weg bis 2030. KGV 3,8 und KBV 0,4 historisch beispiellos.",
    ri: ["Gewinn -44% strukturell", "50k Stellenabbau", "Governance Porsche SE"], ca: ["KGV 3,8 = niedrigstes DAX", "Restrukturierung spart 4 Mrd/Jahr", "Div 5,8% trotz Kürzung"],
    nw: [{ d: "10.03.2026", h: "VW: Gewinn -44% — Radikalumbau angekündigt", tx: "Ergebnis 6,9 Mrd. 50.000 Stellen fallen bis 2030. Betriebsbedingte Kündigungen ausgeschlossen.", src: "DAS INVESTMENT" }],
    ev: [{ d: "Mai 2026", e: "Hauptversammlung" }] },
  { s: "SAP", n: "SAP SE", se: "Software", p: 248.6, c: 0.95, pe: 35.2, pb: 5.1, dv: 0.8, da: 2.0, rsi: 62, sc: 72, sg: "hold", beta: 0.92, tg: 260, an: [22, 6, 0], roe: 15.8, mg: 18.2,
    de: "Europas wertvollstes Unternehmen. Cloud +25%. KGV 35 anspruchsvoll. 0 Sell-Ratings.",
    ri: ["KGV 35 = wenig Spielraum", "Cloud-Wettbewerb", "Marge langsam"], ca: ["Cloud +25%", "AI Business Suite", "ERP-Marktführer"],
    nw: [{ d: "20.03.2026", h: "SAP: Schwergewicht belastet DAX bei Korrektur", tx: "Als gewichtigster DAX-Wert trägt SAP Korrekturen überproportional.", src: "finanzen.net" }],
    ev: [{ d: "Apr 2026", e: "Q1 Quartalszahlen" }] },
  { s: "SIE", n: "Siemens AG", se: "Industrie", p: 198.45, c: -0.6, pe: 18.4, pb: 2.8, dv: 2.6, da: 5.2, rsi: 44, sc: 84, sg: "buy", beta: 1.05, tg: 218, an: [16, 7, 1], roe: 14.2, mg: 11,
    de: "Digital Industries +12%. Automation-Superzyklus.", ri: ["Konjunktur", "China", "Komplexität"], ca: ["Digital +12%", "Automation", "Spin-offs"],
    nw: [{ d: "20.03.2026", h: "Siemens: Zykliker unter Druck", tx: "Korrektur belastet. Fundamentaldaten intakt.", src: "stock3" }], ev: [] },
  { s: "DTE", n: "Dt. Telekom", se: "Telco", p: 32.15, c: 1.32, pe: 14.6, pb: 2.2, dv: 3.4, da: 1.1, rsi: 58, sc: 79, sg: "buy", beta: 0.65, tg: 36, an: [19, 4, 0], roe: 11.5, mg: 8,
    de: "T-Mobile US Wachstum. Beta 0,65 = defensivster DAX-Wert.", ri: ["Schulden", "Regulierung", "5G-Kosten"], ca: ["T-Mobile US", "Beta 0,65", "Div steigt seit 5J"],
    nw: [{ d: "20.03.2026", h: "Telekom: Stärke im DAX-Sturm", tx: "Steigt bei -2% DAX. Rotation in Defensive.", src: "ad-hoc-news.de" }], ev: [{ d: "Mai 2026", e: "HV + Dividende" }] },
  { s: "RHM", n: "Rheinmetall", se: "Rüstung", p: 1285, c: 2.59, pe: 42.1, pb: 9.5, dv: 0.9, da: 11.5, rsi: 74, sc: 55, sg: "hold", beta: 1.55, tg: 1350, an: [9, 6, 3], roe: 22.5, mg: 13.8,
    de: "Div +42%. Kurs 3x. KGV 42 ambitioniert. NATO-Aufträge.", ri: ["KGV 42", "Politik/Frieden", "Kapazität"], ca: ["NATO-Aufträge", "Aufrüstung EU", "Rekord-Backlog"],
    nw: [{ d: "20.03.2026", h: "Iran-Krieg treibt Rüstungsaktien", tx: "Geopolitik stützt Sektor. Bewertung bereits hoch.", src: "finanzen.net" }], ev: [{ d: "Mai 2026", e: "Hauptversammlung" }] },
];

const EVENTS = [
  { d: "24.03.", e: "Handelsstart nach Korrekturwoche", cat: "Markt" }, { d: "Apr 2026", e: "EZB Zinsentscheid", cat: "Makro" },
  { d: "Apr 2026", e: "SAP Q1 Quartalszahlen", cat: "Earnings" }, { d: "Mai 2026", e: "BMW HV + Dividende 4,40", cat: "Dividende" },
  { d: "Mai 2026", e: "Allianz HV + Div 17,10", cat: "Dividende" }, { d: "Mai 2026", e: "Mercedes HV + Div 3,50", cat: "Dividende" },
  { d: "Q2 2026", e: "VW Restrukturierungsupdate", cat: "Corporate" }, { d: "Q2 2026", e: "NATO Auftragsvergabe", cat: "Rüstung" },
];

const QS = [
  { q: "Wie lange investierst du?", o: ["Noch nie", "< 1 Jahr", "1–3 Jahre", "3–10 Jahre", "10+ Jahre"], m: "Willkommen! Lass uns starten." },
  { q: "Dein Hauptziel?", o: ["Vermögen aufbauen", "Altersvorsorge", "Passive Einnahmen", "Kurzfristige Gewinne"], m: "Jeder hat andere Ziele." },
  { q: "Wie lange investieren?", o: ["< 1 Jahr", "1–5 Jahre", "5–10 Jahre", "10+ Jahre"], m: "Zeit ist dein Verbündeter." },
  { q: "Monatliches Budget?", o: ["< 100 €", "100–500 €", "500–2.000 €", "2.000+ €"], m: "Kleine Beträge wirken über Zeit." },
  { q: "Portfolio –20%. Was tust du?", o: ["Verkaufen", "Abwarten", "Nachkaufen"], m: "Sei ehrlich." },
  { q: "Was bevorzugst du?", o: ["Sichere 4%", "10% mit Risiko", "Hohes Risiko"], m: "Das sagt viel über dich." },
  { q: "Welche Sektoren?", o: ["Tech", "Industrie", "Finanzen", "Auto", "Health", "Alle"], multi: true, m: "Beliebig viele wählen." },
  { q: "Wo investieren?", o: ["DACH", "Europa", "Global", "Emerging"], m: "Fast geschafft!" },
  { q: "Dein Stil?", o: ["Value", "Growth", "Dividenden", "Mix"], m: "Kein Stil ist perfekt." },
  { q: "Update-Frequenz?", o: ["Täglich", "Wöchentlich", "Nur Signale"], m: "Letzte Frage!" },
];
const PROF = {
  c: { n: "Konservativer Anleger", co: "#0066CC", al: [30, 50, 20], ds: "Stabilität und Kapitalerhalt." },
  m: { n: "Ausgewogener Anleger", co: "#16A34A", al: [55, 30, 15], ds: "Balance Wachstum & Sicherheit." },
  g: { n: "Wachstumsorientiert", co: "#9333EA", al: [75, 15, 10], ds: "Fokus Kapitalzuwachs." },
  a: { n: "Aggressiver Anleger", co: "#DC2626", al: [90, 5, 5], ds: "Maximales Wachstum." },
};
const AL = ["Aktien", "Anleihen", "Cash"];

// Generate chart data
const charts = {};
D.forEach((s) => { const d = [s.p * 0.93]; for (let i = 1; i < 50; i++) d.push(d[i - 1] * (1 + (Math.random() - 0.47) * 0.02)); d.push(s.p); charts[s.s] = d; });

function MiniChart({ data, w = 55, h = 16 }) {
  const mn = Math.min(...data), mx = Math.max(...data), rn = mx - mn || 1;
  const c = data[data.length - 1] >= data[0] ? "#16A34A" : "#DC2626";
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 1 - ((v - mn) / rn) * (h - 2)}`).join(" ");
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" /></svg>;
}

function BigChart({ data, w = 380, h = 120 }) {
  const mn = Math.min(...data), mx = Math.max(...data), rn = mx - mn || 1;
  const c = data[data.length - 1] >= data[0] ? "#16A34A" : "#DC2626";
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - mn) / rn) * (h - 4)}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity="0.07" /><stop offset="100%" stopColor={c} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#cg)" />
      <polyline points={pts} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ScoreRing({ score, size = 30 }) {
  const r = (size - 4) / 2, ci = Math.PI * 2 * r, p = score / 100;
  const c = score >= 80 ? "#16A34A" : score >= 60 ? "#CA8A04" : "#DC2626";
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0F0F2" strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth="3" strokeDasharray={`${ci * p} ${ci * (1 - p)}`} strokeLinecap="round" />
      </svg>
      <span style={{ position: "absolute", fontSize: size * 0.28, fontWeight: 700, fontFamily: "var(--m)", color: c }}>{score}</span>
    </div>
  );
}

function Tip({ label, k }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", cursor: "help" }} onClick={() => setShow(!show)}>
      <span style={{ borderBottom: "1px dotted #AEAEB2" }}>{label}</span>
      {show && <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", background: "#1A1A1F", color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 10, width: 200, lineHeight: 1.5, zIndex: 99, marginBottom: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>{KENN[k] || k}<div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: "#1A1A1F", rotate: "45deg" }} /></div>}
    </span>
  );
}

function Pill({ label, on, onClick }) {
  return <span onClick={onClick} style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "1px solid " + (on ? "#0066CC" : "#E8E8EB"), background: on ? "#0066CC" : "#FFF", color: on ? "#FFF" : "#AEAEB2", margin: "0 3px 4px 0", transition: "all .12s" }}>{label}</span>;
}

export default function App() {
  const [cur, setCur] = useState("EUR");
  const cp = (v) => CUR[cur].s + f(v * CUR[cur].r);
  const pc = (n) => (n >= 0 ? "+" : "") + f(n) + "%";

  const [phase, setPhase] = useState("intro"); // intro, quiz, result, app
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState({});
  const [ms, setMs] = useState([]);
  const [pType, setPType] = useState("m");
  const [tab, setTab] = useState("market");
  const [sel, setSel] = useState(null);
  const [nwO, setNwO] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("alle");
  const [chatH, setChatH] = useState([{ r: "a", t: "MarketLab AI Analyst.\n\nFrag mich:\n· Analysiere Allianz\n· BMW vs Mercedes\n· Unterbewertet\n· Dividende\n· Marktlage\n· Mein Portfolio" }]);
  const [chatIn, setChatIn] = useState("");
  const [showTip, setShowTip] = useState(null);
  const [alertModal, setAlertModal] = useState(false);
  const chatRef = useRef(null);

  const calcP = () => {
    let s = 0;
    if ((ans[0] || 0) >= 3) s += 2; if ((ans[1] || 0) === 3) s += 3; if ((ans[2] || 0) >= 2) s += 2;
    if ((ans[3] || 0) >= 2) s += 1; if ((ans[4] || 0) === 2) s += 3; if ((ans[5] || 0) >= 1) s += 2; if ((ans[8] || 0) === 1) s += 2;
    return s >= 12 ? "a" : s >= 8 ? "g" : s >= 4 ? "m" : "c";
  };
  const pick = (i) => { const na = { ...ans, [qi]: i }; setAns(na); if (qi < QS.length - 1) setQi(qi + 1); else { setAns(na); setPType(calcP()); setPhase("result"); } };
  const tglM = (i) => setMs(ms.includes(i) ? ms.filter((x) => x !== i) : [...ms, i]);
  const nxtM = () => { if (!ms.length) return; setAns({ ...ans, [qi]: ms }); setMs([]); if (qi < QS.length - 1) setQi(qi + 1); else { setPType(calcP()); setPhase("result"); } };

  const filtered = () => {
    let ls = D;
    if (search) { const q = search.toLowerCase(); ls = ls.filter((s) => s.s.toLowerCase().includes(q) || s.n.toLowerCase().includes(q)); }
    if (filter === "gewinner") ls = ls.filter((s) => s.c > 0).sort((a, b) => b.c - a.c);
    else if (filter === "verlierer") ls = ls.filter((s) => s.c < 0).sort((a, b) => a.c - b.c);
    else if (filter === "dividende") ls = [...ls].sort((a, b) => b.dv - a.dv);
    else if (filter === "value") ls = ls.filter((s) => s.pe < 15).sort((a, b) => a.pe - b.pe);
    else if (filter === "strong_buy") ls = ls.filter((s) => s.sg === "strong_buy");
    else if (filter === "score") ls = [...ls].sort((a, b) => b.sc - a.sc);
    return ls;
  };

  const sendChat = () => {
    if (!chatIn.trim()) return;
    const q = chatIn.trim();
    setChatH((h) => [...h, { r: "u", t: q }]);
    setChatIn("");
    setTimeout(() => {
      const ql = q.toLowerCase(); let r = "";
      if (ql.includes("portfolio") || ql.includes("mein")) {
        const pf = [{ sym: "ALV", sh: 15, avg: 295.2 }, { sym: "BMW", sh: 30, avg: 88.5 }, { sym: "DTE", sh: 100, avg: 28.4 }, { sym: "SAP", sh: 8, avg: 220 }]
          .map((x) => { const st = D.find((s) => s.s === x.sym); return { ...x, val: st.p * x.sh, pl: (st.p - x.avg) * x.sh }; });
        const tv = pf.reduce((s, x) => s + x.val, 0), tc = pf.reduce((s, x) => s + x.avg * x.sh, 0);
        r = `PORTFOLIO\n\nWert: ${cp(tv)}\nP&L: ${tv >= tc ? "+" : ""}${cp(tv - tc)}\n\n${pf.map((x) => `${x.sym}: ${x.sh}x = ${cp(x.val)} (${x.pl >= 0 ? "+" : ""}${cp(x.pl)})`).join("\n")}`;
      } else if (ql.includes("allianz") || ql.includes("alv")) r = `ALLIANZ (ALV)\n\n${cp(312.8)} (+1,34%)\nKGV 11,2 | Div 4,8% | Score 91\nDiv: ${cp(17.1)}\n\n**STRONG BUY** | Ziel ${cp(348)}`;
      else if (ql.includes("bmw") && ql.includes("merc")) r = `VERGLEICH\n\n       BMW    MBG\nKGV    6,8    5,8\nDiv    5,4%   6,4%\nRSI    28     32\nBeta   1,28   1,32\n\nMBG = mehr Dividende\nBMW = mehr Cash`;
      else if (ql.includes("markt") || ql.includes("dax")) r = `MARKTLAGE 20.03.2026\n\nDAX 22.380 (-2,0%)\nIran + EZB hawkish\nSupport: 22.000\nRSI DAX: 35 (überverkauft)`;
      else if (ql.includes("unterbewertet")) r = `UNTERBEWERTETE DAX\n\n1. VOW3 KGV 3,8 | KBV 0,4\n2. MBG  KGV 5,8 | KBV 0,7\n3. BMW  KGV 6,8 | KBV 0,8`;
      else if (ql.includes("dividende")) r = `TOP DIVIDENDEN\n\n1. MBG  6,4% (${cp(3.5)})\n2. VW   5,8% (${cp(5.26)})\n3. BMW  5,4% (${cp(4.4)})\n4. ALV  4,8% (${cp(17.1)})`;
      else r = `Frag mich:\n· Analysiere Allianz\n· BMW vs Mercedes\n· Unterbewertet\n· Dividende\n· Marktlage\n· Mein Portfolio`;
      setChatH((h) => [...h, { r: "a", t: r }]);
    }, 400);
  };

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatH]);

  const p = PROF[pType];
  const s = sel ? D.find((x) => x.s === sel) : null;

  // ═══ OVERLAY ═══
  if (phase !== "app") {
    return (
      <div style={{ height: "100%", maxWidth: 430, margin: "0 auto", background: "#F5F5F7", display: "flex", flexDirection: "column", position: "relative", fontFamily: "'DM Sans',-apple-system,sans-serif" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(245,245,247,0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}>
          {phase === "intro" && (
            <div style={{ textAlign: "center", maxWidth: 320 }}>
              <img src={FOX} style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 20px rgba(0,102,204,0.2)", marginBottom: 12 }} />
              <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 16, borderBottomLeftRadius: 4, padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                <b>Hey! Ich bin Finley</b> — dein MarketLab Assistent.<br /><br />
                <b>10 schnelle Fragen</b>, damit ich dir die besten Empfehlungen geben kann.
              </div>
              <button onClick={() => setPhase("quiz")} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", background: "#0066CC", color: "#FFF", cursor: "pointer", marginBottom: 8 }}>Los geht's</button>
              <button onClick={() => setPhase("app")} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 13, fontWeight: 600, border: "1.5px solid #E8E8EB", background: "#FFF", color: "#1A1A1F", cursor: "pointer" }}>Überspringen</button>
            </div>
          )}
          {phase === "quiz" && (() => { const q = QS[qi]; const prog = ((qi + 1) / QS.length) * 100; return (
            <div style={{ maxWidth: 340, width: "100%" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                <img src={FOX} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 16, borderBottomLeftRadius: 4, padding: "10px 14px", fontSize: 13, lineHeight: 1.5, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>{q.m}</div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}>{qi + 1} / {QS.length}</span>
                  {qi > 0 && <span onClick={() => setQi(qi - 1)} style={{ fontSize: 11, fontWeight: 600, color: "#0066CC", cursor: "pointer" }}>Zurück</span>}
                </div>
                <div style={{ height: 4, background: "#E8E8EB", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${prog}%`, background: "linear-gradient(90deg,#0066CC,#4DA3FF)", borderRadius: 2, transition: "width 0.4s" }} /></div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 16, textAlign: "center" }}>{q.q}</div>
              {q.o.map((o, i) => {
                const isSel = q.multi && ms.includes(i);
                return <div key={i} onClick={() => q.multi ? tglM(i) : pick(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", background: isSel ? "#EBF5FF" : "#FFF", border: `1.5px solid ${isSel ? "#0066CC" : "#E8E8EB"}`, borderRadius: 12, marginBottom: 7, cursor: "pointer", fontSize: 14, fontWeight: isSel ? 600 : 500, color: isSel ? "#0066CC" : "#1A1A1F", transition: "all .15s" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, background: isSel ? "#0066CC" : "#FAFAFA", border: `1px solid ${isSel ? "#0066CC" : "#E8E8EB"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: isSel ? "#FFF" : "#AEAEB2", flexShrink: 0 }}>{isSel ? "✓" : String.fromCharCode(65 + i)}</span>{o}
                </div>;
              })}
              {q.multi && <button onClick={nxtM} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", background: ms.length ? "#0066CC" : "#DDD", color: ms.length ? "#FFF" : "#999", cursor: "pointer", marginTop: 4 }}>Weiter</button>}
            </div>
          ); })()}
          {phase === "result" && (
            <div style={{ textAlign: "center", maxWidth: 340 }}>
              <img src={FOX} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }} />
              <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 16, borderBottomLeftRadius: 4, padding: "14px 18px", fontSize: 14, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>Fertig! Hier ist dein Profil:</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: p.co, letterSpacing: 1.2, textTransform: "uppercase" }}>Dein Investorprofil</div>
              <div style={{ fontSize: 24, fontWeight: 800, margin: "4px 0 6px" }}>{p.n}</div>
              <p style={{ fontSize: 13, color: "#6E6E73", lineHeight: 1.5, marginBottom: 16 }}>{p.ds}</p>
              <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 14, textAlign: "left", marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", letterSpacing: 1, marginBottom: 5 }}>ALLOKATION</div>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 1 }}>
                  <div style={{ width: `${p.al[0]}%`, background: p.co }} /><div style={{ width: `${p.al[1]}%`, background: p.co + "50" }} /><div style={{ width: `${p.al[2]}%`, background: "#E8E8EB" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#6E6E73" }}>{AL.map((l, i) => <span key={i}><b style={{ color: i === 0 ? p.co : "#6E6E73" }}>{p.al[i]}%</b> {l}</span>)}</div>
              </div>
              <button onClick={() => setPhase("app")} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", background: "#0066CC", color: "#FFF", cursor: "pointer" }}>Weiter zu MarketLab</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══ MAIN APP ═══
  return (
    <div style={{ height: "100%", maxWidth: 430, margin: "0 auto", background: "#F5F5F7", display: "flex", flexDirection: "column", position: "relative", fontFamily: "'DM Sans',-apple-system,sans-serif", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px 8px", background: "rgba(245,245,247,0.86)", backdropFilter: "blur(20px)", borderBottom: "0.5px solid #E8E8EB", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img src={FOX} style={{ width: 22, height: 22, borderRadius: 5, objectFit: "cover" }} />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.3 }}>MARKETLAB</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", background: "#FAFAFA", borderRadius: 5, border: "1px solid #E8E8EB", overflow: "hidden" }}>
            {Object.keys(CUR).map((k) => <button key={k} onClick={() => setCur(k)} style={{ background: cur === k ? "#1A1A1F" : "transparent", color: cur === k ? "#FFF" : "#D1D1D6", border: "none", padding: "3px 7px", fontSize: 8, fontWeight: 600, cursor: "pointer" }}>{k}</button>)}
          </div>
          <div onClick={() => setTab("profile")} style={{ width: 22, height: 22, borderRadius: "50%", overflow: "hidden", cursor: "pointer" }}><img src={FOX} style={{ width: 22, height: 22, objectFit: "cover" }} /></div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 72 }}>
        {/* ═══ MARKET TAB ═══ */}
        {tab === "market" && !nwO && (
          <div style={{ padding: "8px 14px 16px" }}>
            {/* Indices */}
            <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 10 }}>
              {[{ n: "DAX", v: "22.380", c: "-2,01%", u: 0 }, { n: "STOXX", v: "5.312", c: "-1,64%", u: 0 }, { n: "S&P", v: "5.580", c: "-1,12%", u: 0 }, { n: "BRENT", v: "$86,4", c: "+2,8%", u: 1 }].map((i, idx) => (
                <div key={idx} style={{ flex: "0 0 auto", padding: "7px 12px", borderRadius: 8, background: "#FFF", border: "1px solid #E8E8EB", minWidth: 95 }}>
                  <div style={{ fontSize: 8, fontWeight: 600, color: "#AEAEB2" }}>{i.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--m)" }}>{i.v}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: i.u ? "#16A34A" : "#DC2626" }}>{i.c}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ marginBottom: 8 }}>
              {[["alle", "Alle"], ["gewinner", "Gewinner ↑"], ["verlierer", "Verlierer ↓"], ["dividende", "Dividende"], ["value", "Value"], ["strong_buy", "Strong Buy"], ["score", "Score"]].map(([k, l]) => (
                <Pill key={k} label={l} on={filter === k} onClick={() => setFilter(k)} />
              ))}
            </div>

            {/* Stock list */}
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
              {filtered().map((st) => { const sg = SG[st.sg]; return (
                <div key={st.s} onClick={() => { setSel(st.s); setTab("screener"); }} style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 8, cursor: "pointer", borderBottom: "0.5px solid #E8E8EB" }}>
                  <ScoreRing score={st.sc} size={24} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{st.s} <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 3, color: sg[1], background: sg[2] }}>{sg[0]}</span></div>
                    <div style={{ fontSize: 9, color: "#AEAEB2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{st.n} · KGV {st.pe} · Div {st.dv}%</div>
                  </div>
                  <MiniChart data={charts[st.s]} />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--m)" }}>{cp(st.p)}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: st.c >= 0 ? "#16A34A" : "#DC2626" }}>{pc(st.c)}</div>
                  </div>
                </div>
              ); })}
            </div>

            {/* Events */}
            <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>BEVORSTEHENDE EVENTS</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
              {EVENTS.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 8, borderBottom: "0.5px solid #E8E8EB" }}>
                  <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: ev.cat === "Dividende" ? "#F0FDF4" : ev.cat === "Earnings" ? "#EBF5FF" : ev.cat === "Makro" ? "#FEFCE8" : "#FAFAFA", color: ev.cat === "Dividende" ? "#16A34A" : ev.cat === "Earnings" ? "#0066CC" : ev.cat === "Makro" ? "#CA8A04" : "#6E6E73" }}>{ev.cat}</span>
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 500 }}>{ev.e}</div>
                  <span style={{ fontSize: 9, color: "#AEAEB2", fontFamily: "var(--m)" }}>{ev.d}</span>
                </div>
              ))}
            </div>

            {/* News */}
            <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>NEWS</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden" }}>
              {NEWS.map((n, i) => (
                <div key={i} onClick={() => setNwO(n)} style={{ padding: "10px 14px", borderBottom: "0.5px solid #E8E8EB", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 8, fontFamily: "var(--m)", color: "#D1D1D6" }}>{n.d}</span>
                    <span style={{ fontSize: 8, fontWeight: 600, color: "#AEAEB2" }}>{n.src}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, marginTop: 3 }}>{n.h}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Detail */}
        {tab === "market" && nwO && (
          <div style={{ padding: "8px 14px 16px" }}>
            <div onClick={() => setNwO(null)} style={{ fontSize: 11, fontWeight: 600, color: "#0066CC", cursor: "pointer", marginBottom: 8 }}>← Zurück</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontFamily: "var(--m)", color: "#D1D1D6" }}>{nwO.d}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#0066CC" }}>{nwO.src}</span>
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, margin: "6px 0 14px" }}>{nwO.h}</h2>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", letterSpacing: 1, marginBottom: 6 }}>ZUSAMMENFASSUNG</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "#6E6E73" }}>{nwO.tx}</p>
              <div style={{ marginTop: 14, padding: "10px 14px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #E8E8EB" }}>
                <span style={{ fontSize: 10, color: "#AEAEB2" }}>Quelle: </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#0066CC" }}>{nwO.src}</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SCREENER TAB ═══ */}
        {tab === "screener" && !sel && (
          <div style={{ padding: "8px 14px 16px" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Suchen..." style={{ width: "100%", padding: "8px 12px", border: "1px solid #E8E8EB", borderRadius: 8, fontSize: 13, outline: "none", background: "#FFF", marginBottom: 8 }} />
            <div style={{ marginBottom: 8 }}>{[["alle", "Alle"], ["gewinner", "↑ Steiger"], ["verlierer", "↓ Verlierer"], ["dividende", "Dividende"], ["value", "Value KGV<15"], ["strong_buy", "Strong Buy"], ["score", "Top Score"]].map(([k, l]) => <Pill key={k} label={l} on={filter === k} onClick={() => setFilter(k)} />)}</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden" }}>
              {filtered().map((st) => { const sg = SG[st.sg]; return (
                <div key={st.s} onClick={() => setSel(st.s)} style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 8, cursor: "pointer", borderBottom: "0.5px solid #E8E8EB" }}>
                  <ScoreRing score={st.sc} size={24} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{st.s} <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 3, color: sg[1], background: sg[2] }}>{sg[0]}</span></div><div style={{ fontSize: 9, color: "#AEAEB2" }}>{st.n}</div></div>
                  <MiniChart data={charts[st.s]} /><div style={{ textAlign: "right" }}><div style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--m)" }}>{cp(st.p)}</div><div style={{ fontSize: 9, fontWeight: 600, color: st.c >= 0 ? "#16A34A" : "#DC2626" }}>{pc(st.c)}</div></div>
                </div>
              ); })}
            </div>
          </div>
        )}

        {/* ═══ STOCK DETAIL ═══ */}
        {tab === "screener" && sel && s && (() => { const sg = SG[s.sg]; const up = ((s.tg / s.p - 1) * 100); return (
          <div style={{ padding: "8px 14px 16px" }}>
            <div onClick={() => setSel(null)} style={{ fontSize: 11, fontWeight: 600, color: "#0066CC", cursor: "pointer", marginBottom: 6 }}>← Zurück</div>
            {/* Header */}
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}><ScoreRing score={s.sc} size={38} /><div><div style={{ fontSize: 16, fontWeight: 700 }}>{s.n}</div><div style={{ fontSize: 10, color: "#6E6E73" }}>{s.s} · {s.se}</div></div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--m)", color: s.c >= 0 ? "#16A34A" : "#DC2626" }}>{cp(s.p)}</div><div style={{ fontSize: 11, fontWeight: 600, color: s.c >= 0 ? "#16A34A" : "#DC2626" }}>{pc(s.c)}</div></div>
              </div>
              <div style={{ margin: "10px -2px 0" }}><BigChart data={charts[s.s]} /></div>
            </div>
            {/* Signal */}
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 3, color: sg[1], background: sg[2] }}>{sg[0]}</span><span style={{ fontSize: 10, color: "#6E6E73" }}>Score {s.sc}/100</span></div>
              <span style={{ fontSize: 10, color: "#0066CC", fontWeight: 600 }}>Ziel {cp(s.tg)} ({up >= 0 ? "+" : ""}{f(up, 1)}%)</span>
            </div>
            {/* Kennzahlen with tooltips */}
            <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>KENNZAHLEN <span style={{ fontSize: 8, color: "#D1D1D6", fontWeight: 400, textTransform: "none" }}>(tippe für Info)</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[["KGV", s.pe, s.pe < 15 ? "#16A34A" : "#CA8A04"], ["KBV", f(s.pb, 1), s.pb < 1 ? "#16A34A" : "#1A1A1F"], ["DIV", s.dv + "%", s.dv > 3 ? "#16A34A" : "#1A1A1F"], ["RSI", s.rsi, s.rsi < 30 ? "#16A34A" : "#1A1A1F"], ["BETA", s.beta, "#1A1A1F"], ["ROE", s.roe + "%", "#1A1A1F"], ["MARGE", s.mg + "%", "#1A1A1F"], ["DIV/A", cp(s.da), "#1A1A1F"]].map(([l, v, c]) => (
                <div key={l} style={{ padding: 10, background: "#FAFAFA", borderRadius: 8, border: "1px solid #E8E8EB" }}>
                  <div style={{ fontSize: 8, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase" }}><Tip label={l} k={l} /></div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--m)", marginTop: 2, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            {/* Analyse */}
            <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>ANALYSE</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 14, marginBottom: 8 }}>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: "#6E6E73", marginBottom: 10 }}>{s.de}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                <div style={{ padding: 10, background: "#F0FDF4", borderRadius: 8, borderLeft: "2px solid #16A34A" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: "#16A34A", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>KATALYSATOREN</div>
                  {s.ca.map((c, i) => <div key={i} style={{ fontSize: 10, lineHeight: 1.5, color: "#065F46" }}>· {c}</div>)}
                </div>
                <div style={{ padding: 10, background: "#FEF2F2", borderRadius: 8, borderLeft: "2px solid #DC2626" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>RISIKEN</div>
                  {s.ri.map((r, i) => <div key={i} style={{ fontSize: 10, lineHeight: 1.5, color: "#991B1B" }}>· {r}</div>)}
                </div>
              </div>
            </div>
            {/* Analysten */}
            <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>ANALYSTEN ({s.an[0] + s.an[1] + s.an[2]})</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", height: 5, borderRadius: 3, overflow: "hidden", gap: 1 }}><div style={{ width: `${s.an[0] / (s.an[0] + s.an[1] + s.an[2]) * 100}%`, background: "#16A34A" }} /><div style={{ width: `${s.an[1] / (s.an[0] + s.an[1] + s.an[2]) * 100}%`, background: "#CA8A04" }} /><div style={{ width: `${s.an[2] / (s.an[0] + s.an[1] + s.an[2]) * 100}%`, background: "#DC2626" }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9, color: "#AEAEB2" }}><span>{s.an[0]} Buy</span><span>{s.an[1]} Hold</span><span>{s.an[2]} Sell</span></div>
              <div style={{ fontSize: 10, color: "#6E6E73", marginTop: 6 }}>Kursziel: <b style={{ color: "#0066CC" }}>{cp(s.tg)}</b> ({up >= 0 ? "+" : ""}{f(up, 1)}%)</div>
            </div>
            {/* Risiko */}
            <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>RISIKOBEWERTUNG</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 12, marginBottom: 8 }}>
              {(() => { const lv = s.beta > 1.3 ? 4 : s.beta > 1.1 ? 3 : s.beta > 0.9 ? 2 : 1; const cs = ["#16A34A", "#16A34A", "#F59E0B", "#F97316", "#DC2626"]; const ls = ["LOW", "LOW", "MEDIUM", "ELEVATED", "HIGH"]; return <>
                <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>{[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= lv ? cs[lv - 1] : "#FAFAFA" }} />)}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: cs[lv - 1] }}>{ls[lv - 1]} · Beta {s.beta}</div>
              </>; })()}
              <div style={{ marginTop: 8 }}>{s.ri.map((r, i) => <div key={i} style={{ fontSize: 10, color: "#6E6E73", marginTop: 4, paddingLeft: 6, borderLeft: "2px solid #DC2626" }}>{r}</div>)}</div>
            </div>
            {/* Events */}
            {s.ev && s.ev.length > 0 && <>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>BEVORSTEHENDE EVENTS</div>
              <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
                {s.ev.map((ev, i) => <div key={i} style={{ padding: "10px 14px", borderBottom: "0.5px solid #E8E8EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 11, fontWeight: 500 }}>{ev.e}</span><span style={{ fontSize: 9, color: "#AEAEB2", fontFamily: "var(--m)" }}>{ev.d}</span></div>)}
              </div>
            </>}
            {/* News */}
            <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>NEWS ({s.nw.length})</div>
            <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden" }}>
              {s.nw.map((n, i) => <div key={i} onClick={() => { setNwO(n); setTab("market"); }} style={{ padding: "10px 14px", borderBottom: "0.5px solid #E8E8EB", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 8, fontFamily: "var(--m)", color: "#D1D1D6" }}>{n.d}</span><span style={{ fontSize: 8, color: "#0066CC" }}>{n.src}</span></div>
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, marginTop: 3 }}>{n.h}</div>
                <div style={{ fontSize: 10, color: "#AEAEB2", marginTop: 4, lineHeight: 1.5 }}>{n.tx.slice(0, 120)}...</div>
              </div>)}
            </div>
          </div>
        ); })()}

        {/* ═══ SIGNALS TAB ═══ */}
        {tab === "signals" && (
          <div style={{ padding: "8px 14px 16px" }}>
            <div style={{ fontSize: 10, color: "#6E6E73", marginBottom: 10 }}>Signale für {p.n}</div>
            {D.filter((s) => s.sg === "strong_buy").map((st) => (
              <div key={st.s} onClick={() => { setSel(st.s); setTab("screener"); }} style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, padding: 12, marginBottom: 8, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ScoreRing score={st.sc} size={26} /><div><div style={{ fontSize: 13, fontWeight: 700 }}>{st.s}</div><div style={{ fontSize: 9, color: "#AEAEB2" }}>{st.n}</div></div></div>
                  <span style={{ fontSize: 7, fontWeight: 700, color: "#0066CC", background: "#EBF5FF", padding: "2px 5px", borderRadius: 3 }}>{st.pe < 6 ? "DEEP VALUE" : st.rsi < 35 ? "CONTRARIAN" : "VALUE"}</span>
                </div>
                <BigChart data={charts[st.s]} w={380} h={45} />
                <div style={{ padding: 10, background: "#F0FDF4", borderRadius: 8, borderLeft: "2px solid #16A34A", marginTop: 6 }}>
                  <div style={{ fontSize: 9, color: "#065F46", lineHeight: 1.4 }}>{st.ca[0]}. {st.ca[1]}.</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "#AEAEB2" }}><span>{cp(st.p)}</span><span>Div {st.dv}%</span><span>KGV {st.pe}</span><span>Ziel {cp(st.tg)}</span></div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ ANALYST TAB ═══ */}
        {tab === "analyst" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 115px)" }}>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 12 }}>
              {chatH.map((m, i) => (
                <div key={i} style={{ marginBottom: 10, display: "flex", flexDirection: "column", alignItems: m.r === "a" ? "flex-start" : "flex-end" }}>
                  <div style={{ maxWidth: "82%", padding: "9px 13px", borderRadius: 16, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-line", background: m.r === "a" ? "#FFF" : "#0066CC", color: m.r === "a" ? "#1A1A1F" : "#FFF", border: m.r === "a" ? "0.5px solid #E8E8EB" : "none", borderBottomRightRadius: m.r === "u" ? 3 : 16, borderBottomLeftRadius: m.r === "a" ? 3 : 16 }} dangerouslySetInnerHTML={{ __html: m.t.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, padding: "8px 12px", borderTop: "0.5px solid #E8E8EB", background: "#FFF" }}>
              <input value={chatIn} onChange={(e) => setChatIn(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Frage eingeben..." style={{ flex: 1, padding: "8px 12px", border: "1px solid #E8E8EB", borderRadius: 20, fontSize: 13, outline: "none", background: "#FAFAFA" }} />
              <button onClick={sendChat} style={{ background: "#0066CC", color: "#FFF", border: "none", width: 32, height: 32, borderRadius: "50%", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
            </div>
          </div>
        )}

        {/* ═══ PROFILE TAB ═══ */}
        {tab === "profile" && (() => {
          const pf = [{ sym: "ALV", sh: 15, avg: 295.2 }, { sym: "BMW", sh: 30, avg: 88.5 }, { sym: "DTE", sh: 100, avg: 28.4 }, { sym: "SAP", sh: 8, avg: 220 }]
            .map((x) => { const st = D.find((s) => s.s === x.sym); return { ...x, st, val: st.p * x.sh, pl: (st.p - x.avg) * x.sh }; });
          const tv = pf.reduce((s, x) => s + x.val, 0), tc = pf.reduce((s, x) => s + x.avg * x.sh, 0), tpl = tv - tc;
          const ad = pf.reduce((s, x) => s + (x.st?.da || 0) * x.sh, 0);
          return (
            <div style={{ padding: "8px 14px 16px" }}>
              {/* Profile card */}
              <div style={{ padding: 16, background: `linear-gradient(135deg,#EBF5FF,#FFF)`, border: "1px solid #E8E8EB", borderRadius: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div><div style={{ fontSize: 9, fontWeight: 600, color: p.co, letterSpacing: 1, textTransform: "uppercase" }}>{p.n}</div><div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>Mein Profil</div><p style={{ fontSize: 10, color: "#6E6E73", marginTop: 2 }}>{p.ds}</p></div>
                  <img src={FOX} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                </div>
              </div>
              {/* KPIs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginBottom: 10 }}>
                {[["Wert", cp(tv), "#1A1A1F"], ["Invest.", cp(tc), "#6E6E73"], ["P&L", (tpl >= 0 ? "+" : "") + cp(tpl), tpl >= 0 ? "#16A34A" : "#DC2626"], ["Div/J", cp(ad), "#16A34A"]].map(([l, v, c]) => (
                  <div key={l} style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 8, padding: 7, textAlign: "center" }}>
                    <div style={{ fontSize: 7, fontWeight: 600, color: "#AEAEB2" }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--m)", color: c, marginTop: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Positions */}
              <div style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1, margin: "14px 0 6px" }}>POSITIONEN</div>
              <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
                {pf.map((x) => (
                  <div key={x.sym} onClick={() => { setSel(x.sym); setTab("screener"); }} style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 8, cursor: "pointer", borderBottom: "0.5px solid #E8E8EB" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: x.pl >= 0 ? "#F0FDF4" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: x.pl >= 0 ? "#16A34A" : "#DC2626" }}>{x.sym.slice(0, 2)}</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600 }}>{x.sym} <span style={{ fontSize: 9, color: "#AEAEB2", fontWeight: 400 }}>{x.sh} Stk · EK {cp(x.avg)}</span></div></div>
                    <MiniChart data={charts[x.sym]} w={40} h={12} />
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--m)" }}>{cp(x.val)}</div><div style={{ fontSize: 9, fontWeight: 600, color: x.pl >= 0 ? "#16A34A" : "#DC2626" }}>{x.pl >= 0 ? "+" : ""}{cp(x.pl)}</div></div>
                  </div>
                ))}
                <div style={{ padding: "10px 14px", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#0066CC", cursor: "pointer" }}>+ Position hinzufügen</div>
              </div>
              {/* Alerts */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 6px" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: 1 }}>ALERTS</span>
                <span onClick={() => setAlertModal(true)} style={{ fontSize: 10, fontWeight: 600, color: "#0066CC", cursor: "pointer" }}>+ Alert hinzufügen</span>
              </div>
              <div style={{ background: "#FFF", border: "1px solid #E8E8EB", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
                {[{ t: "BMW RSI unter 30", d: "Kaufsignal", tm: "09:15", rd: 0 }, { t: "ALV Dividende 17,10", d: "Ex-Tag 08.05.", tm: "08:30", rd: 0 }, { t: "DAX unter 22.500", d: "Support erreicht", tm: "07:45", rd: 1 }].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 8, borderBottom: "0.5px solid #E8E8EB", opacity: a.rd ? 0.5 : 1 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: a.rd ? "#D1D1D6" : "#0066CC", marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}><div style={{ fontSize: 10, fontWeight: 600 }}>{a.t}</div><div style={{ fontSize: 9, color: "#6E6E73" }}>{a.d}</div></div>
                    <span style={{ fontSize: 8, fontFamily: "var(--m)", color: "#D1D1D6" }}>{a.tm}</span>
                  </div>
                ))}
              </div>
              {/* Broker Sync */}
              <div style={{ padding: 14, background: "#FAFAFA", border: "1px solid #E8E8EB", borderRadius: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Broker verbinden</div>
                <div style={{ fontSize: 11, color: "#6E6E73", lineHeight: 1.5, marginBottom: 8 }}>Verbinde dein Depot für automatische Portfolio-Synchronisation.</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Trade Republic", "Scalable", "DEGIRO", "ING", "comdirect"].map((b) => <span key={b} style={{ padding: "5px 10px", border: "1px solid #E8E8EB", borderRadius: 6, fontSize: 10, fontWeight: 600, color: "#0066CC", background: "#FFF", cursor: "pointer" }}>{b}</span>)}
                </div>
              </div>
              {/* Premium */}
              <div style={{ padding: 16, background: "linear-gradient(135deg,#EBF5FF,#FFF)", border: "1px solid rgba(0,102,204,0.12)", borderRadius: 12, marginTop: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#0066CC", letterSpacing: 0.8 }}>PREMIUM</div>
                <div style={{ fontSize: 12, fontWeight: 700, margin: "2px 0" }}>AI Portfolio X-Ray</div>
                <div style={{ fontSize: 10, color: "#6E6E73", lineHeight: 1.4, marginBottom: 8 }}>Klumpenrisiken, Korrelationen, Optimierungsvorschläge. Wöchentlicher Report + Alerts.</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ flex: 1, padding: 9, border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "#0066CC", color: "#FFF", cursor: "pointer" }}>Premium 14,99/Mo</button>
                  <button style={{ flex: 1, padding: 9, border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, background: "#1A1A1F", color: "#FFF", cursor: "pointer" }}>Concierge 49,99/Mo</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Tab bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 56, padding: "4px 0 0", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", borderTop: "0.5px solid #E8E8EB", display: "flex", zIndex: 50 }}>
        {[["market", "◎", "Markt"], ["screener", "⊞", "Screener"], ["signals", "△", "Signale"], ["analyst", "▷", "Analyst"], ["profile", "○", "Profil"]].map(([k, i, l]) => (
          <button key={k} onClick={() => { setTab(k); setSel(null); setNwO(null); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, background: "none", border: "none", fontSize: 9, fontWeight: 500, color: tab === k ? "#0066CC" : "#D1D1D6", cursor: "pointer" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{i}</span>{l}
          </button>
        ))}
      </div>

      {/* Alert Modal */}
      {alertModal && (
        <div onClick={() => setAlertModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFF", borderRadius: "18px 18px 0 0", padding: 24, width: "100%", maxHeight: "70%" }}>
            <div style={{ width: 32, height: 4, borderRadius: 2, background: "#E8E8EB", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Alert erstellen</h3>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Aktie</div>
              <select style={{ width: "100%", padding: 10, border: "1px solid #E8E8EB", borderRadius: 8, fontSize: 14 }}>{D.map((s) => <option key={s.s} value={s.s}>{s.s} — {s.n}</option>)}</select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Bedingung</div>
              <select style={{ width: "100%", padding: 10, border: "1px solid #E8E8EB", borderRadius: 8, fontSize: 14 }}>
                <option>Kurs fällt unter...</option><option>Kurs steigt über...</option><option>RSI unter 30</option><option>RSI über 70</option><option>Dividende bestätigt</option><option>Quartalszahlen veröffentlicht</option><option>Analysten-Upgrade</option><option>Analysten-Downgrade</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Schwellwert (optional)</div>
              <input placeholder="z.B. 80.00" style={{ width: "100%", padding: 10, border: "1px solid #E8E8EB", borderRadius: 8, fontSize: 14, outline: "none" }} />
            </div>
            <button onClick={() => setAlertModal(false)} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", background: "#0066CC", color: "#FFF", cursor: "pointer" }}>Alert erstellen</button>
          </div>
        </div>
      )}
    </div>
  );
}
