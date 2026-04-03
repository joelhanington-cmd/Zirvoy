import { useState } from "react";
import Head from "next/head";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  espresso:   "#1C1410",
  bark:       "#2E1F14",
  terracotta: "#C4622D",
  terra2:     "#D4784A",
  sand:       "#F2E8D9",
  sandLight:  "#FAF6F0",
  parchment:  "#EDE0CC",
  ink:        "#1C1410",
  muted:      "#8A7968",
  border:     "#E0D4C0",
  white:      "#FFFFFF",
  gold:       "#C9943A",
};

const fmt = (n) => Number(n).toLocaleString("en-GB");

// ── ZIRVOY MARK SVG ───────────────────────────────────────────────────────────
function ZirvoyMark({ size = 32, color = C.terracotta }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.8" />
      <line x1="6" y1="20" x2="34" y2="20" stroke={color} strokeWidth="1.4" />
      <line x1="26" y1="9" x2="14" y2="31" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.2" fill={color} />
    </svg>
  );
}

function ZirvoyLogo({ light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <ZirvoyMark size={28} color={light ? C.sand : C.terracotta} />
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.6rem",
        fontWeight: 600,
        color: light ? C.sand : C.espresso,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        lineHeight: 1,
      }}>Zirvoy</span>
    </div>
  );
}

// ── INPUT SCREEN ──────────────────────────────────────────────────────────────
function InputScreen({ onGenerate, loading }) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const suggestions = [
    { label: "Weekend escape", text: "Romantic weekend in Europe, 2 people, budget around £1,000" },
    { label: "Group trip",     text: "5 nights for 4 friends somewhere fun, £700 each" },
    { label: "Honeymoon",      text: "Luxury honeymoon, 7 nights, no budget limit" },
    { label: "City break",     text: "Quick city break for 2, under £600 total" },
  ];

  const handleSubmit = () => {
    if (input.trim() && !loading) onGenerate(input.trim());
  };

  return (
    <div style={{ minHeight: "100vh", background: C.sandLight, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero header */}
      <div style={{ background: C.espresso, padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 2rem) clamp(2.5rem, 6vw, 4rem)", position: "relative", overflow: "hidden" }}>
        {/* Dot texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.bark} 1px, transparent 1px)`, backgroundSize: "22px 22px", opacity: 0.7 }} />
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", border: `1px solid rgba(196,98,45,0.12)` }} />
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", border: `1px solid rgba(196,98,45,0.08)` }} />

        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <ZirvoyLogo light />
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: C.terracotta, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 0.75rem" }}>
            AI Travel Planner
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 6vw, 3.5rem)", fontWeight: 600, color: C.sand, margin: "0 0 1rem", lineHeight: 1.15 }}>
            Tell us where<br />
            <em style={{ color: C.terra2 }}>your heart wants to go.</em>
          </h1>
          <p style={{ color: "rgba(242,232,217,0.5)", fontSize: "clamp(0.85rem, 2vw, 1rem)", margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
            Plain English. Real AI. Full itinerary in seconds.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem clamp(1.25rem, 5vw, 2rem)" }}>

        {/* Input card */}
        <div style={{ background: C.white, borderRadius: 20, padding: "1.5rem", marginBottom: "1.75rem", boxShadow: "0 4px 32px rgba(28,20,16,0.08)", border: `1px solid ${C.border}` }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === "Enter" && e.metaKey && handleSubmit()}
            placeholder='e.g. "5 nights in Europe for 2, budget £1,500, we love good food and history"'
            rows={4}
            style={{
              width: "100%", background: C.sandLight,
              border: `1.5px solid ${focused ? C.terracotta : C.border}`,
              borderRadius: 12, padding: "1rem", fontSize: "0.95rem",
              color: C.ink, resize: "none", outline: "none",
              lineHeight: 1.65, boxSizing: "border-box",
              fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
              caretColor: C.terracotta,
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            style={{
              width: "100%", marginTop: "0.85rem", padding: "1rem 1.25rem",
              background: input.trim() && !loading ? C.terracotta : C.parchment,
              color: input.trim() && !loading ? C.white : C.muted,
              border: "none", borderRadius: 12, fontSize: "0.95rem",
              fontWeight: 600, cursor: input.trim() && !loading ? "pointer" : "default",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
              transition: "background 0.25s", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            {loading ? "Zirvoy is planning your trip…" : "Plan My Trip with Zirvoy"}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: "0.68rem", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.14em", whiteSpace: "nowrap" }}>or try one of these</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Suggestions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem", marginBottom: "3rem" }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => onGenerate(s.text)} disabled={loading}
              style={{ padding: "0.9rem", borderRadius: 14, border: `1px solid ${C.border}`, background: C.white, cursor: loading ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", transition: "box-shadow 0.2s" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, color: C.terracotta, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{s.label}</div>
              <div style={{ fontSize: "0.8rem", color: C.ink, lineHeight: 1.45, fontWeight: 300 }}>{s.text}</div>
            </button>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.72rem", color: C.muted, fontWeight: 300 }}>
          Powered by <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: C.terracotta }}>Zirvoy</span> · Real AI · Free to use
        </p>
      </div>
    </div>
  );
}

// ── LOADING SCREEN ────────────────────────────────────────────────────────────
function LoadingScreen({ input }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Scouting your perfect destination…",
    "Crafting a bespoke itinerary…",
    "Calculating the best budget…",
    "Adding insider knowledge…",
  ];

  useState(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1200);
    return () => clearInterval(t);
  });

  return (
    <div style={{ minHeight: "100vh", background: C.espresso, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.1);opacity:1}}`}</style>
      <div style={{ animation: "pulse 2s ease-in-out infinite", marginBottom: "2rem" }}>
        <ZirvoyMark size={56} color={C.terracotta} />
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontStyle: "italic", color: C.sand, margin: "0 0 1.25rem", textAlign: "center", lineHeight: 1.5, maxWidth: 320 }}>
        "{input}"
      </p>
      <p style={{ fontSize: "0.75rem", color: C.terracotta, letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center" }}>
        {steps[step]}
      </p>
      <div style={{ display: "flex", gap: 6, marginTop: "2rem" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: C.terracotta, opacity: step % 3 === i ? 1 : 0.25, transition: "opacity 0.4s" }} />
        ))}
      </div>
    </div>
  );
}

// ── RESULTS SCREEN ────────────────────────────────────────────────────────────
function ResultsScreen({ trip, onNewTrip, onTryAgain }) {
  const [activeDay, setActiveDay] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const day = trip.itinerary?.[activeDay];

  const breakdownLabels = { flights: "Flights", hotel: "Hotel", food: "Food & Drink", activities: "Activities", misc: "Extras" };

  return (
    <div style={{ minHeight: "100vh", background: C.sandLight, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <div style={{ position: "relative", height: "min(340px, 45vw)", minHeight: 260, overflow: "hidden" }}>
        <img src={trip.photo} alt={trip.destination} onLoad={() => setImgLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.8s", filter: "brightness(0.85)" }} />
        {/* Fallback gradient if image fails */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.bark}, ${C.espresso})`, opacity: imgLoaded ? 0 : 1, transition: "opacity 0.8s" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(28,20,16,0.2) 0%, rgba(28,20,16,0.82) 100%)" }} />

        {/* Logo */}
        <div style={{ position: "absolute", top: "1.25rem", left: "clamp(1.25rem, 5vw, 2rem)" }}>
          <ZirvoyLogo light />
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem clamp(1.25rem, 5vw, 2rem)" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 600, color: C.terra2, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 0.3rem" }}>{trip.country}</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 7vw, 3.2rem)", fontWeight: 600, color: C.sand, margin: "0 0 0.5rem", lineHeight: 1 }}>{trip.destination}</h2>
          <p style={{ fontSize: "clamp(0.8rem, 2vw, 0.9rem)", color: "rgba(242,232,217,0.72)", margin: "0 0 1rem", lineHeight: 1.55, fontWeight: 300, maxWidth: 480 }}>{trip.tagline}</p>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {[`${trip.travellers} travellers`, `${trip.duration} nights`, `£${fmt(trip.budgetTotal)} total`].map(t => (
              <span key={t} style={{ background: "rgba(242,232,217,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(242,232,217,0.2)", padding: "0.28rem 0.75rem", borderRadius: 20, fontSize: "0.72rem", fontWeight: 500, color: C.sand }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.25rem clamp(1.25rem, 5vw, 2rem) 3rem" }}>

        {/* Try again bar */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "0.9rem 1rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 500, color: C.espresso }}>Not quite right?</div>
            <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: 2, fontWeight: 300 }}>Been there or want something different</div>
          </div>
          <button onClick={onTryAgain} style={{ flexShrink: 0, padding: "0.5rem 1.1rem", background: C.espresso, color: C.sand, border: "none", borderRadius: 8, fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Try Again
          </button>
        </div>

        {/* Budget card */}
        <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, padding: "1.35rem", marginBottom: "1rem", boxShadow: "0 2px 16px rgba(28,20,16,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.1rem" }}>
            <div style={{ width: 3, height: 14, background: C.terracotta, borderRadius: 2 }} />
            <p style={{ fontSize: "0.68rem", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>Budget Breakdown</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "1.25rem", marginBottom: "1.25rem", borderBottom: `1px solid ${C.parchment}` }}>
            {[["£" + fmt(trip.budgetTotal), "Total"], ["£" + fmt(trip.budgetPerPerson), "Per person"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.85rem", fontWeight: 600, color: C.espresso }}>{val}</div>
                <div style={{ fontSize: "0.65rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          {Object.entries(trip.breakdown || {}).map(([k, v]) => {
            const pct = Math.round((v / trip.budgetTotal) * 100);
            return (
              <div key={k} style={{ marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.35rem" }}>
                  <span style={{ color: C.ink, fontWeight: 400 }}>{breakdownLabels[k] || k}</span>
                  <span style={{ fontWeight: 600, color: C.espresso }}>£{fmt(v)}</span>
                </div>
                <div style={{ height: 3, background: C.parchment, borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.terracotta}, ${C.gold})`, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Flights + Hotel */}
        <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, padding: "1.35rem", marginBottom: "1rem", boxShadow: "0 2px 16px rgba(28,20,16,0.06)" }}>
          <div style={{ paddingBottom: "1rem", marginBottom: "1rem", borderBottom: `1px solid ${C.parchment}` }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 0.5rem" }}>✈  Flights</p>
            <p style={{ margin: 0, fontSize: "0.88rem", color: C.ink, lineHeight: 1.65, fontWeight: 300 }}>{trip.flights}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.65rem", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 0.5rem" }}>🏨  Where to Stay</p>
            <p style={{ margin: 0, fontSize: "0.88rem", color: C.ink, lineHeight: 1.65, fontWeight: 300 }}>{trip.hotel}</p>
          </div>
        </div>

        {/* Insider tip */}
        <div style={{ background: C.espresso, borderRadius: 18, padding: "1.4rem 1.5rem", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -25, right: -25, width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(196,98,45,0.18)" }} />
          <div style={{ position: "absolute", top: 8, right: 10, opacity: 0.1 }}>
            <ZirvoyMark size={52} color={C.terracotta} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.65rem" }}>
            <div style={{ width: 3, height: 12, background: C.terracotta, borderRadius: 2 }} />
            <p style={{ fontSize: "0.65rem", fontWeight: 600, color: C.terracotta, textTransform: "uppercase", letterSpacing: "0.16em", margin: 0 }}>Zirvoy Insider Tip</p>
          </div>
          <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: C.sand, lineHeight: 1.8, fontStyle: "italic", fontWeight: 400 }}>{trip.tip}</p>
        </div>

        {/* Itinerary */}
        {trip.itinerary?.length > 0 && (
          <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "1.25rem", boxShadow: "0 2px 16px rgba(28,20,16,0.06)" }}>
            <div style={{ padding: "1.35rem 1.35rem 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <div style={{ width: 3, height: 14, background: C.terracotta, borderRadius: 2 }} />
                <p style={{ fontSize: "0.68rem", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>Your Itinerary</p>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "1rem" }}>
                {trip.itinerary.map((d, i) => (
                  <button key={i} onClick={() => setActiveDay(i)}
                    style={{ flexShrink: 0, padding: "0.38rem 1rem", borderRadius: 20, border: `1.5px solid ${activeDay === i ? C.terracotta : C.border}`, background: activeDay === i ? C.terracotta : "transparent", color: activeDay === i ? C.white : C.muted, cursor: "pointer", fontSize: "0.76rem", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                    Day {d.day}
                  </button>
                ))}
              </div>
            </div>
            {day && (
              <div style={{ borderTop: `1px solid ${C.parchment}`, padding: "1.35rem" }}>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", margin: "0 0 1.1rem", fontSize: "1.2rem", fontWeight: 600, color: C.espresso }}>{day.title}</h4>
                {[["Morning", day.morning], ["Afternoon", day.afternoon], ["Evening", day.evening]].map(([label, text]) => (
                  <div key={label} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, fontSize: "0.6rem", fontWeight: 600, color: C.terracotta, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.2rem", minWidth: 64 }}>{label}</span>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: C.ink, lineHeight: 1.65, fontWeight: 300 }}>{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={onNewTrip}
          style={{ width: "100%", padding: "1rem", background: C.terracotta, color: C.white, border: "none", borderRadius: 14, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: "0.75rem", letterSpacing: "0.03em" }}>
          Plan Another Trip
        </button>
        <p style={{ textAlign: "center", fontSize: "0.7rem", color: C.muted, fontWeight: 300, margin: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: C.terracotta }}>Zirvoy</span> · Your world. Planned instantly.
        </p>
      </div>
    </div>
  );
}

// ── REFINE MODAL ──────────────────────────────────────────────────────────────
function RefineModal({ destination, onClose, onRefine, loading }) {
  const [extra, setExtra] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,20,16,0.75)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 640, background: C.sandLight, borderRadius: "22px 22px 0 0", padding: "1.75rem 1.5rem 2.5rem", boxSizing: "border-box" }}>
        <div style={{ width: 36, height: 3.5, background: C.parchment, borderRadius: 2, margin: "0 auto 1.75rem" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: "0.35rem" }}>
          <ZirvoyMark size={16} color={C.terracotta} />
          <p style={{ fontSize: "0.68rem", fontWeight: 600, color: C.terracotta, textTransform: "uppercase", letterSpacing: "0.14em", margin: 0 }}>Try Again</p>
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, color: C.espresso, margin: "0 0 0.4rem" }}>Not feeling {destination}?</h3>
        <p style={{ fontSize: "0.84rem", color: C.muted, margin: "0 0 1.5rem", lineHeight: 1.6, fontWeight: 300 }}>
          Tell Zirvoy more about what you're looking for and it'll try again.
        </p>
        <div style={{ background: C.white, borderRadius: 14, padding: "1.1rem", border: `1px solid ${C.border}`, marginBottom: "0.75rem" }}>
          <textarea
            value={extra}
            onChange={e => setExtra(e.target.value)}
            placeholder="e.g. Prefer somewhere warmer, love hiking and wine, been to Portugal already"
            rows={3}
            style={{ width: "100%", background: C.sandLight, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "0.85rem", fontSize: "0.88rem", color: C.ink, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }}
          />
          <button onClick={() => extra.trim() && onRefine(extra.trim())} disabled={!extra.trim() || loading}
            style={{ width: "100%", marginTop: "0.65rem", padding: "0.9rem", background: extra.trim() && !loading ? C.terracotta : C.parchment, color: extra.trim() && !loading ? C.white : C.muted, border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: extra.trim() && !loading ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "Planning…" : "Refine with Zirvoy"}
          </button>
        </div>
        <button onClick={onClose} style={{ width: "100%", padding: "0.75rem", background: "transparent", color: C.muted, border: "none", fontSize: "0.88rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Keep this trip
        </button>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [screen, setScreen] = useState("input");
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originalRequest, setOriginalRequest] = useState("");
  const [showRefine, setShowRefine] = useState(false);

  const generate = async (request) => {
    setLoading(true);
    setError(null);
    setScreen("loading");
    setShowRefine(false);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const data = await res.json();
      if (!res.ok || !data.trip) throw new Error(data.error || "Something went wrong");
      setTrip(data.trip);
      setScreen("results");
    } catch (err) {
      setError(err.message);
      setScreen("input");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (req) => {
    setOriginalRequest(req);
    generate(req);
  };

  const handleRefine = (extra) => {
    generate(`${originalRequest}. Additional preferences: ${extra}`);
  };

  const handleNewTrip = () => {
    setTrip(null);
    setOriginalRequest("");
    setError(null);
    setScreen("input");
  };

  return (
    <>
      <Head>
        <title>Zirvoy — AI Travel Planner</title>
        <meta name="description" content="Tell Zirvoy where you want to go. Get a full AI-generated trip plan in seconds." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #FAF6F0; }`}</style>
      </Head>

      {error && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#c0392b", color: "#fff", padding: "0.75rem 1.25rem", borderRadius: 10, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", zIndex: 200, maxWidth: "90vw", textAlign: "center" }}>
          {error} — please try again.
        </div>
      )}

      {screen === "loading" && <LoadingScreen input={originalRequest} />}
      {screen === "input"   && <InputScreen onGenerate={handleGenerate} loading={loading} />}
      {screen === "results" && trip && (
        <>
          <ResultsScreen trip={trip} onNewTrip={handleNewTrip} onTryAgain={() => setShowRefine(true)} />
          {showRefine && <RefineModal destination={trip.destination} onClose={() => setShowRefine(false)} onRefine={handleRefine} loading={loading} />}
        </>
      )}
    </>
  );
}
