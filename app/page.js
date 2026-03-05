"use client";
import { useState, useEffect } from "react";

const FEATS = ["Pool","Garage","Fireplace","Modern Kitchen","Home Office","Walk-in Closet","Smart Home","Hardwood Floors","Backyard","Ocean View","New Roof","Solar Panels"];
const PTYPES = ["Single Family Home","Condo","Townhouse","Multi-Family","Luxury Estate"];
const TONES = ["Luxury & Prestigious","Warm & Welcoming","Modern & Minimalist","Family-Friendly","Investment-Focused"];
const FAQS = [
  { q: "How does ListingAI generate the content?", a: "ListingAI uses Claude, Anthropic's AI, to produce MLS descriptions and social posts tailored to your property's features, price point, and tone." },
  { q: "Can I edit the generated content?", a: "Absolutely. Every output is a starting point. Most agents use 90% of the output as-is and make small tweaks." },
  { q: "How many listings can I generate?", a: "Starter: 15 per month. Professional: unlimited. Agency: unlimited across your whole team." },
  { q: "Is there a free trial?", a: "Yes, every new account gets 3 free listings with no credit card required." },
  { q: "Does it work for luxury properties?", a: "Especially for luxury. Select the Luxury and Prestigious tone for high-end evocative copy that matches affluent buyers." },
];

const css = `
  :root {
    --gold: #C9A96E; --gold2: #8a6a3a; --cream: #F5F0E8; --ink: #0C0B09;
    --ink2: #1a1814; --muted: rgba(245,240,232,0.45); --border: rgba(201,169,110,0.18);
    --serif: 'Cormorant Garamond', Georgia, serif; --sans: 'Outfit', sans-serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); background: var(--ink); color: var(--cream); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: var(--ink); } ::-webkit-scrollbar-thumb { background: var(--gold2); border-radius: 2px; }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 22px 56px; transition: background 0.4s, border-bottom 0.4s; }
  .nav.scrolled { background: rgba(12,11,9,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
  .nav-logo { font-family: var(--serif); font-size: 22px; font-weight: 600; color: var(--cream); cursor: pointer; letter-spacing: 0.02em; }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; gap: 36px; }
  .nav-link { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: color 0.2s; text-decoration: none; }
  .nav-link:hover { color: var(--cream); }
  .nav-cta { padding: 10px 24px; border: 1px solid var(--gold); border-radius: 3px; font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); cursor: pointer; background: transparent; transition: all 0.25s; font-family: var(--sans); }
  .nav-cta:hover { background: var(--gold); color: var(--ink); }
  .hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 32px 80px; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 65%), linear-gradient(180deg, #0c0b09 0%, #111009 100%); }
  .hero-grid { position: absolute; inset: 0; opacity: 0.04; background-image: linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%); }
  .hero-tag { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); border: 1px solid rgba(201,169,110,0.3); padding: 7px 18px; border-radius: 2px; margin-bottom: 36px; animation: fadeUp 0.8s ease both; }
  .hero-tag::before { content: ''; width: 20px; height: 1px; background: var(--gold); }
  .hero-h1 { position: relative; z-index: 1; font-family: var(--serif); font-size: clamp(52px, 8vw, 96px); font-weight: 300; line-height: 1.05; color: var(--cream); margin-bottom: 28px; animation: fadeUp 0.8s 0.1s ease both; }
  .hero-h1 em { font-style: italic; color: var(--gold); }
  .hero-h1 strong { font-weight: 600; display: block; }
  .hero-sub { position: relative; z-index: 1; font-size: 16px; font-weight: 300; line-height: 1.7; color: var(--muted); max-width: 480px; margin: 0 auto 48px; animation: fadeUp 0.8s 0.2s ease both; }
  .hero-btns { position: relative; z-index: 1; display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; animation: fadeUp 0.8s 0.3s ease both; }
  .btn-primary { padding: 15px 40px; background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; border-radius: 3px; font-family: var(--sans); font-size: 13px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink); cursor: pointer; transition: opacity 0.2s, transform 0.2s; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-2px); }
  .btn-ghost { padding: 14px 36px; background: transparent; border: 1px solid var(--border); border-radius: 3px; font-family: var(--sans); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { border-color: var(--gold); color: var(--cream); }
  .hero-stats { position: relative; z-index: 1; display: flex; gap: 56px; margin-top: 80px; flex-wrap: wrap; justify-content: center; animation: fadeUp 0.8s 0.4s ease both; }
  .stat-num { font-family: var(--serif); font-size: 40px; font-weight: 300; color: var(--gold); line-height: 1; }
  .stat-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-top: 6px; }
  .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, var(--border), transparent); }
  .section { padding: 120px 56px; }
  .section-inner { max-width: 1160px; margin: 0 auto; }
  .section-tag { font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: block; }
  .section-title { font-family: var(--serif); font-size: clamp(36px, 4vw, 54px); font-weight: 300; line-height: 1.1; color: var(--cream); }
  .section-title em { font-style: italic; color: var(--gold); }
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 72px; }
  .step { padding: 48px 40px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); transition: background 0.3s; }
  .step:hover { background: rgba(201,169,110,0.04); }
  .step-num { font-family: var(--serif); font-size: 64px; font-weight: 300; color: rgba(201,169,110,0.12); line-height: 1; margin-bottom: 24px; }
  .step-title { font-size: 18px; font-weight: 500; color: var(--cream); margin-bottom: 12px; }
  .step-desc { font-size: 14px; font-weight: 300; line-height: 1.7; color: var(--muted); }
  .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 72px; }
  .feature-card { padding: 40px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 4px; transition: border-color 0.3s, background 0.3s; }
  .feature-card:hover { border-color: rgba(201,169,110,0.4); background: rgba(201,169,110,0.03); }
  .feature-icon { width: 44px; height: 44px; background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.2); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 20px; }
  .feature-title { font-size: 17px; font-weight: 500; color: var(--cream); margin-bottom: 10px; }
  .feature-desc { font-size: 14px; font-weight: 300; line-height: 1.7; color: var(--muted); }
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 72px; }
  .testimonial { padding: 36px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 4px; }
  .t-quote { font-family: var(--serif); font-size: 28px; color: var(--gold); margin-bottom: 16px; }
  .t-text { font-size: 14px; font-weight: 300; line-height: 1.75; color: var(--muted); margin-bottom: 24px; }
  .t-author { display: flex; align-items: center; gap: 12px; }
  .t-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--gold2), var(--gold)); display: flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 16px; font-weight: 600; color: var(--ink); }
  .t-name { font-size: 14px; font-weight: 500; color: var(--cream); }
  .t-role { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 72px; align-items: start; }
  .pricing-card { padding: 48px 40px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); position: relative; }
  .pricing-card.featured { background: rgba(201,169,110,0.06); border-color: rgba(201,169,110,0.5); transform: translateY(-8px); }
  .pricing-badge { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--ink); font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; padding: 5px 16px; white-space: nowrap; }
  .pricing-name { font-family: var(--serif); font-size: 22px; color: var(--cream); margin-bottom: 8px; }
  .pricing-price { font-family: var(--serif); font-size: 52px; font-weight: 300; color: var(--cream); line-height: 1; margin-bottom: 4px; }
  .pricing-price span { font-size: 20px; vertical-align: top; margin-top: 10px; display: inline-block; }
  .pricing-period { font-size: 13px; color: var(--muted); margin-bottom: 32px; }
  .pricing-features { list-style: none; margin-bottom: 40px; }
  .pricing-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 300; color: var(--muted); padding: 8px 0; border-bottom: 1px solid rgba(201,169,110,0.07); }
  .pricing-features li::before { content: '\2014'; color: var(--gold); font-size: 12px; }
  .p-btn { width: 100%; padding: 14px; font-family: var(--sans); font-size: 12px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 3px; cursor: pointer; transition: all 0.25s; }
  .p-btn-out { background: transparent; border: 1px solid var(--border); color: var(--muted); }
  .p-btn-out:hover { border-color: var(--gold); color: var(--gold); }
  .p-btn-fill { background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; color: var(--ink); }
  .p-btn-fill:hover { opacity: 0.88; }
  .faq-list { margin-top: 64px; max-width: 720px; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-q { display: flex; align-items: center; justify-content: space-between; padding: 24px 0; cursor: pointer; font-size: 16px; color: var(--cream); transition: color 0.2s; }
  .faq-q:hover { color: var(--gold); }
  .faq-arrow { font-size: 20px; color: var(--gold); transition: transform 0.3s; flex-shrink: 0; }
  .faq-arrow.open { transform: rotate(45deg); }
  .faq-a { font-size: 14px; font-weight: 300; line-height: 1.75; color: var(--muted); max-height: 0; overflow: hidden; transition: max-height 0.35s ease, padding 0.3s; }
  .faq-a.open { max-height: 200px; padding-bottom: 24px; }
  .cta-band { padding: 120px 56px; text-align: center; background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%); border-top: 1px solid var(--border); }
  .cta-band h2 { font-family: var(--serif); font-size: clamp(40px, 5vw, 68px); font-weight: 300; color: var(--cream); margin-bottom: 20px; }
  .cta-band h2 em { font-style: italic; color: var(--gold); }
  .cta-band p { font-size: 15px; font-weight: 300; color: var(--muted); margin-bottom: 48px; }
  .footer { padding: 48px 56px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
  .footer-logo { font-family: var(--serif); font-size: 20px; color: var(--cream); cursor: pointer; }
  .footer-logo span { color: var(--gold); }
  .footer-copy { font-size: 12px; color: var(--muted); }
  .footer-links { display: flex; gap: 28px; }
  .footer-link { font-size: 12px; color: var(--muted); cursor: pointer; transition: color 0.2s; text-decoration: none; }
  .footer-link:hover { color: var(--gold); }
  .app-page { padding-top: 100px; background: var(--ink2); min-height: 100vh; }
  .app-header { text-align: center; padding: 60px 32px 48px; border-bottom: 1px solid var(--border); }
  .app-header h1 { font-family: var(--serif); font-size: clamp(32px, 4vw, 48px); font-weight: 300; color: var(--cream); }
  .app-header h1 em { font-style: italic; color: var(--gold); }
  .app-header p { font-size: 14px; color: var(--muted); margin-top: 10px; }
  .app-wrap { display: grid; grid-template-columns: 400px 1fr; gap: 48px; max-width: 1160px; margin: 0 auto; padding: 48px 56px; align-items: start; }
  .form-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 6px; padding: 36px; position: sticky; top: 120px; }
  .form-title { font-family: var(--serif); font-size: 20px; color: var(--cream); margin-bottom: 6px; }
  .form-sub { font-size: 13px; color: var(--muted); margin-bottom: 28px; line-height: 1.5; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .field input, .field select, .field textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(201,169,110,0.2); border-radius: 4px; padding: 11px 13px; font-family: var(--sans); font-size: 14px; font-weight: 300; color: var(--cream); outline: none; transition: border-color 0.2s; resize: none; }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: rgba(201,169,110,0.5); background: rgba(255,255,255,0.06); }
  .field input::placeholder, .field textarea::placeholder { color: rgba(245,240,232,0.2); }
  .field select option { background: #1a1814; color: var(--cream); }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 6px; }
  .chip { font-size: 12px; color: var(--muted); padding: 5px 11px; border-radius: 2px; border: 1px solid rgba(201,169,110,0.12); background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.15s; user-select: none; }
  .chip:hover { border-color: rgba(201,169,110,0.3); }
  .chip.on { border-color: rgba(201,169,110,0.5); background: rgba(201,169,110,0.1); color: var(--gold); }
  .gen-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, var(--gold), var(--gold2)); border: none; border-radius: 4px; font-family: var(--sans); font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); cursor: pointer; transition: opacity 0.2s, transform 0.15s; margin-top: 10px; }
  .gen-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .gen-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .out-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .out-tabs { display: flex; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); }
  .out-tab { padding: 15px 24px; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
  .out-tab:hover { color: var(--cream); }
  .out-tab.on { color: var(--gold); border-bottom-color: var(--gold); }
  .out-body { padding: 36px; min-height: 380px; display: flex; flex-direction: column; }
  .out-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; opacity: 0.3; }
  .out-empty-icon { font-size: 40px; }
  .out-empty-text { font-family: var(--serif); font-size: 18px; color: var(--muted); }
  .out-loading { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; }
  .dots { display: flex; gap: 8px; }
  .dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; animation: pulse 1.2s infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  .out-loading-txt { font-size: 13px; letter-spacing: 0.1em; color: var(--muted); }
  .out-label { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 14px; }
  .out-text { font-size: 14px; font-weight: 300; line-height: 1.85; color: rgba(245,240,232,0.85); white-space: pre-wrap; flex: 1; }
  .copy-btn { margin-top: 24px; padding: 9px 20px; background: transparent; border: 1px solid rgba(201,169,110,0.25); border-radius: 3px; font-family: var(--sans); font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); cursor: pointer; transition: all 0.2s; align-self: flex-start; }
  .copy-btn:hover { background: rgba(201,169,110,0.1); }
  .trust-row { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 20px; }
  .trust-item { font-size: 12px; color: var(--muted); letter-spacing: 0.06em; }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: none; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  @keyframes pulse { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
  @media (max-width: 900px) {
    .nav { padding: 18px 24px; } .nav-links { display: none; }
    .section { padding: 80px 24px; }
    .steps, .features-grid, .testimonials-grid, .pricing-grid { grid-template-columns: 1fr; }
    .app-wrap { grid-template-columns: 1fr; padding: 32px 24px; }
    .form-card { position: static; }
    .pricing-card.featured { transform: none; }
    .hero-stats { gap: 32px; }
    .footer { flex-direction: column; align-items: flex-start; }
    .cta-band { padding: 80px 24px; }
  }
`;

export default function Home() {
  const [page, setPage] = useState("landing");
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ address: "", price: "", beds: "", baths: "", sqft: "", propertyType: "Single Family Home", tone: "Luxury & Prestigious", neighborhood: "", extras: "" });
  const [feats, setFeats] = useState([]);
  const [tab, setTab] = useState("listing");
  const [outputs, setOutputs] = useState({ listing: "", instagram: "", facebook: "" });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [page]);

  const goApp = () => { setPage("app"); setTimeout(() => window.scrollTo({ top: 0 }), 50); };
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleFeat = f => setFeats(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);
  const scrollTo = id => document.getElementById(id) && document.getElementById(id).scrollIntoView({ behavior: "smooth" });

  const generate = async () => {
    setLoading(true);
    setOutputs({ listing: "", instagram: "", facebook: "" });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, features: feats }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutputs({ listing: data.listing, instagram: data.instagram, facebook: data.facebook });
      setTab("listing");
    } catch (e) {
      setOutputs({ listing: "Error: " + e.message, instagram: "", facebook: "" });
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(outputs[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (page === "landing") return (
    <>
      <style>{css}</style>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="nav-logo">Listing<span>AI</span></div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => scrollTo("how")}>How It Works</span>
          <span className="nav-link" onClick={() => scrollTo("features")}>Features</span>
          <span className="nav-link" onClick={() => scrollTo("pricing")}>Pricing</span>
          <span className="nav-link" onClick={() => scrollTo("faq")}>FAQ</span>
        </div>
        <button className="nav-cta" onClick={goApp}>Try Free</button>
      </nav>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-tag">AI-Powered Real Estate Marketing</div>
        <h1 className="hero-h1">Write Listings That<br /><em>Close Deals</em><strong>In Seconds.</strong></h1>
        <p className="hero-sub">Professional MLS descriptions and social media posts crafted by AI trained on thousands of high-converting listings.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={goApp}>Start Free — No Card Needed</button>
          <button className="btn-ghost" onClick={() => scrollTo("how")}>See How It Works</button>
        </div>
        <div className="hero-stats">
          {[["2,400+","Active Agents"],["18s","Avg. Generation Time"],["94%","Use Output As-Is"],["$0","To Get Started"]].map(([n,l]) => (
            <div key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="how">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">The Process</span>
            <h2 className="section-title">From Details to <em>Done</em><br />in Three Steps</h2>
          </div>
          <div className="steps reveal">
            {[["01","Enter Property Details","Input address, specs, and standout features. Takes under two minutes."],["02","Choose Your Tone","Select from luxury, family-friendly, modern, and more — the AI adapts its voice."],["03","Copy and Publish","Your MLS listing and social posts are ready instantly. Edit, copy, and go live."]].map(([n,t,d]) => (
              <div className="step" key={n}><div className="step-num">{n}</div><div className="step-title">{t}</div><div className="step-desc">{d}</div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="features">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">What You Get</span>
            <h2 className="section-title">Everything an Agent<br /><em>Actually Needs</em></h2>
          </div>
          <div className="features-grid reveal">
            {[["🏠","MLS Listing Copy","Compelling 150-200 word descriptions that highlight what buyers care about."],["📸","Instagram Caption","Scroll-stopping posts with emojis, aspirational copy, and optimized hashtags."],["👥","Facebook Post","Conversational posts designed to generate comments, shares, and DMs from buyers."],["🎨","Tone Control","Switch between luxury, warm, minimal, family-focused, and investment tones."],["⚡","Instant Generation","Under 20 seconds from form to finished copy. No waiting, no rewrites needed."],["📋","One-Click Copy","Copy any output directly to clipboard and paste wherever you need it."]].map(([icon,title,desc]) => (
              <div className="feature-card" key={title}><div className="feature-icon">{icon}</div><div className="feature-title">{title}</div><div className="feature-desc">{desc}</div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">Social Proof</span>
            <h2 className="section-title">Agents Who Switched<br /><em>Do Not Go Back</em></h2>
          </div>
          <div className="testimonials-grid reveal">
            {[["I used to spend 45 minutes on every listing description. Now it is done before I finish my coffee. ListingAI paid for itself the first week.","Sarah M.","Realtor, Miami FL","SM"],["The Instagram captions alone are worth it. My engagement doubled in the first month. Clients are calling me instead of the other way around.","Derek T.","Broker, Austin TX","DT"],["Luxury listings need luxury copy. I was skeptical AI could match my voice. I was wrong. Every output is polished and professional.","Natalie R.","Luxury Specialist, LA","NR"]].map(([text,name,role,init]) => (
              <div className="testimonial" key={name}>
                <div className="t-quote">"</div>
                <div className="t-text">{text}</div>
                <div className="t-author">
                  <div className="t-avatar">{init}</div>
                  <div><div className="t-name">{name}</div><div className="t-role">{role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="pricing">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="section-tag">Pricing</span>
            <h2 className="section-title">Simple. <em>Transparent.</em> Fair.</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 12, fontWeight: 300 }}>Cancel anytime. No contracts. No surprises.</p>
          </div>
          <div className="pricing-grid reveal">
            {[
              { name: "Starter", price: "19", items: ["15 listings per month","MLS + Instagram + Facebook","5 tone options","Email support"], fill: false, featured: false },
              { name: "Professional", price: "39", items: ["Unlimited listings","All output formats","Priority generation","Chat support","Team sharing up to 3"], fill: true, featured: true, badge: "Most Popular" },
              { name: "Agency", price: "99", items: ["Unlimited listings","Unlimited team members","Custom tone profiles","Dedicated support","White-label option"], fill: false, featured: false }
            ].map(p => (
              <div className={"pricing-card" + (p.featured ? " featured" : "")} key={p.name}>
                {p.badge && <div className="pricing-badge">{p.badge}</div>}
                <div className="pricing-name">{p.name}</div>
                <div className="pricing-price"><span>$</span>{p.price}</div>
                <div className="pricing-period">/month, billed monthly</div>
                <ul className="pricing-features">{p.items.map(i => <li key={i}>{i}</li>)}</ul>
                <button className={"p-btn " + (p.fill ? "p-btn-fill" : "p-btn-out")} onClick={goApp}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="faq">
        <div className="section-inner">
          <div className="reveal">
            <span className="section-tag">Questions</span>
            <h2 className="section-title">Everything You<br /><em>Want to Know</em></h2>
          </div>
          <div className="faq-list reveal">
            {FAQS.map((f, i) => (
              <div className="faq-item" key={i}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}<span className={"faq-arrow" + (openFaq === i ? " open" : "")}>+</span>
                </div>
                <div className={"faq-a" + (openFaq === i ? " open" : "")}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-band">
        <h2>Your Next Listing Is<br /><em>18 Seconds Away</em></h2>
        <p>Join 2,400+ agents who have stopped staring at blank pages.</p>
        <button className="btn-primary" onClick={goApp}>Try ListingAI Free</button>
      </div>

      <footer className="footer">
        <div className="footer-logo">Listing<span>AI</span></div>
        <div className="footer-copy">ListingAI 2026. All rights reserved.</div>
        <div className="footer-links">
          <span className="footer-link">Privacy</span>
          <span className="footer-link">Terms</span>
          <span className="footer-link">Support</span>
        </div>
      </footer>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <nav className="nav scrolled">
        <div className="nav-logo" onClick={() => setPage("landing")}>Listing<span>AI</span></div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => setPage("landing")}>Back to Home</span>
        </div>
        <button className="nav-cta" onClick={() => setPage("landing")}>Home</button>
      </nav>

      <div className="app-page">
        <div className="app-header">
          <h1>Generate Your <em>Perfect Listing</em></h1>
          <p>Fill in the details and let AI handle the writing.</p>
        </div>
        <div className="app-wrap">
          <div className="form-card">
            <div className="form-title">Property Details</div>
            <div className="form-sub">More detail means better output.</div>
            <div className="field"><label>Address</label><input placeholder="123 Oak Ave, Miami FL 33101" value={form.address} onChange={e => upd("address", e.target.value)} /></div>
            <div className="row2">
              <div className="field"><label>List Price</label><input placeholder="850,000" value={form.price} onChange={e => upd("price", e.target.value)} /></div>
              <div className="field"><label>Property Type</label><select value={form.propertyType} onChange={e => upd("propertyType", e.target.value)}>{PTYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            </div>
            <div className="row2">
              <div className="field"><label>Beds</label><input placeholder="4" value={form.beds} onChange={e => upd("beds", e.target.value)} /></div>
              <div className="field"><label>Baths</label><input placeholder="3" value={form.baths} onChange={e => upd("baths", e.target.value)} /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Sq Ft</label><input placeholder="2,400" value={form.sqft} onChange={e => upd("sqft", e.target.value)} /></div>
              <div className="field"><label>Neighborhood</label><input placeholder="Coral Gables" value={form.neighborhood} onChange={e => upd("neighborhood", e.target.value)} /></div>
            </div>
            <div className="field"><label>Tone</label><select value={form.tone} onChange={e => upd("tone", e.target.value)}>{TONES.map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="field">
              <label>Key Features</label>
              <div className="chips">{FEATS.map(f => <div key={f} className={"chip" + (feats.includes(f) ? " on" : "")} onClick={() => toggleFeat(f)}>{feats.includes(f) ? "✓ " : "+ "}{f}</div>)}</div>
            </div>
            <div className="field"><label>Extra Notes</label><textarea rows={3} placeholder="New kitchen, motivated seller, top school district..." value={form.extras} onChange={e => upd("extras", e.target.value)} /></div>
            <button className="gen-btn" onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Listing + Social Posts"}</button>
          </div>

          <div>
            <div className="out-card">
              <div className="out-tabs">
                {[["listing","🏠 MLS Listing"],["instagram","📸 Instagram"],["facebook","👥 Facebook"]].map(([k,l]) => (
                  <div key={k} className={"out-tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</div>
                ))}
              </div>
              <div className="out-body">
                {loading ? (
                  <div className="out-loading">
                    <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                    <div className="out-loading-txt">Crafting your listing...</div>
                  </div>
                ) : outputs.listing ? (
                  <>
                    <div className="out-label">{tab === "listing" ? "MLS Description" : tab === "instagram" ? "Instagram Caption" : "Facebook Post"}</div>
                    <div className="out-text">{outputs[tab] || "Not generated — please regenerate."}</div>
                    <button className="copy-btn" onClick={copy}>{copied ? "Copied!" : "Copy to Clipboard"}</button>
                  </>
                ) : (
                  <div className="out-empty">
                    <div className="out-empty-icon">✦</div>
                    <div className="out-empty-text">Your listing will appear here</div>
                  </div>
                )}
              </div>
            </div>
            <div className="trust-row">
              {["✦ Instant generation","✦ MLS + 2 social formats","✦ One-click copy"].map(t => <div className="trust-item" key={t}>{t}</div>)}
            </div>
          </div>
        </div>

        <div className="cta-band" style={{ padding: "80px 56px" }}>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>Love what you see?<br /><em>Upgrade for unlimited listings.</em></h2>
          <p>Professional plan — $39/month. Cancel anytime.</p>
          <button className="btn-primary">Upgrade to Pro</button>
        </div>

        <footer className="footer">
          <div className="footer-logo" onClick={() => setPage("landing")}>Listing<span>AI</span></div>
          <div className="footer-copy">ListingAI 2026. All rights reserved.</div>
          <div className="footer-links">
            <span className="footer-link" onClick={() => setPage("landing")}>Home</span>
            <span className="footer-link">Privacy</span>
            <span className="footer-link">Support</span>
          </div>
        </footer>
      </div>
    </>
  );
}
