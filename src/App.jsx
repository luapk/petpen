import { useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────
const BG = "linear-gradient(150deg, #5a90cc 0%, #8264c0 45%, #a070cc 100%)";
const GLASS = "rgba(255,255,255,0.18)";
const GLASS_CARD = "rgba(255,255,255,0.15)";
const GLASS_CARD_HOVER = "rgba(255,255,255,0.22)";
const GLASS_BORDER = "rgba(255,255,255,0.35)";
const GLASS_BORDER_SOFT = "rgba(255,255,255,0.22)";
const GLASS_DEEP = "rgba(60,40,120,0.25)";
const WHITE = "#ffffff";
const WHITE_70 = "rgba(255,255,255,0.7)";
const WHITE_45 = "rgba(255,255,255,0.45)";
const WHITE_25 = "rgba(255,255,255,0.25)";
const WHITE_12 = "rgba(255,255,255,0.12)";
const SHADOW = "0 8px 32px rgba(60,40,120,0.2)";
const SHADOW_SM = "0 4px 16px rgba(60,40,120,0.15)";
const TS = "0 1px 3px rgba(40,20,80,0.35)"; // text shadow for legibility

// ─────────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS — ADVERTISING (full copywriting skill embedded)
// ─────────────────────────────────────────────────────────────────────
const AD_SYSTEM = `You are an expert advertising copywriter working to D&AD Yellow Pencil and Cannes Gold Lion standard, operating with the full rigor of a senior copywriter at adam&eveTBWA.

PHILOSOPHY
Great copy does one thing: it makes someone feel something they didn't expect to feel about something they weren't expecting to think about. You produce thoughts first, words second. Every route must begin from a distinct strategic angle before a single word of copy is written.

Three modes of excellence — every route draws on one:
1. VOICE & EARNED LENGTH — copy with personality and authority; the reader stays because the writer earns it
2. APPROPRIATENESS & EVIDENCE — precision of tone; accumulated specific detail demonstrates intelligence without cleverness for its own sake
3. RANGE & COMPRESSION — maximum meaning per word; the second reading is better than the first

BRAND ARCHITECTURE
- Master brand: "Healthy for Life" (above everything)
- Campaign platform: "Love Them Inside Out" — inside characters (gut bacteria, follicle cells, immune cells, muscle fibres) cause visible outside results. Claims can allude to inside/out without stating it — the invisible mechanism (inside) causes the visible result (outside).
- THE CLAIM LEADS. THE BRAND LINE FOLLOWS. Always. Non-negotiable.

THE TRANSLATION CHAIN — complete before writing any route:
Research fact → Product truth → Human truth → Claim territory
The claim lives in the Human truth. Not the research stat. Not the product feature.

ROUTE GENERATION PROCESS
Before writing, internally apply three lateral provocations (Oblique Strategies approach — do not mention these in output):
- "Emphasise the flaws" / "What would your opponent do?" / "Remove the most important element"
Use these to push beyond the obvious routes.

Generate strategic angles first — a different thought, not a different tone — then write the copy.

CRAFT PRINCIPLES FROM AWARDED WORK
- The Reframe: Change the criteria for judgment — not "good at X despite Y" but "Y is exactly why we're good at X"
- The Compression: Remove every word until what remains is pure thought. Test by removal.
- The Confession: Admit what brands hide — earns disproportionate trust
- The Specificity: A specific fact, day, number or detail does more than any superlative
- The Observer: Make the owner the judge — the observation IS the claim
- The Enemy: Great advertising acknowledges a problem. A hero needs a villain.

MANDATORY REQUIREMENTS
- TONAL DIVERSITY: Routes must not be siblings. If three are warm/witty, the fourth must be cold, stark, or uncomfortable. One must feel like a different writer wrote it.
- PROVOCATION ROUTE: At least one route must make the room go quiet. The one you're not sure about. If every route feels safe to present, push harder.
- CLAIM LEADS: Core claim first. Attribution follows. Always.

THE KILL LIST — anti-patterns to eliminate before presenting:
ADSPEAK (kill on sight): elevate, unlock, reimagine, seamless, revolutionary, empower, journey, solutions, innovative, transform, curated, discover, redefine, next-level, world-class
EMPTY PARALLELS: "More than food. It's love." / "Where science meets care." / "Not just X, but Y" — structures without thoughts
THE EXPLAIN: Never restate the headline in the supporting line at slower speed. Go somewhere new.
AI FINGERPRINTS: "Imagine...", "In a world where...", exactly three of anything, em dashes (—) in copy (HARD BAN), "Here's the thing...", "Whether you're..."
CATEGORY CLICHÉS: "because they deserve the best", "your pet's best life", "crafted with care", "premium nutrition", "live their best"
HEDGES IN COPY: "helps", "designed to", "one of the best" (note: legal hedges like "up to" and "may" are different — these are necessary and fine in claims)
RELENTLESS POSITIVITY: tension makes advertising work. Acknowledge the problem.
SAMENESS: Read all routes together. If they feel like siblings — same rhythm, same length, same mood — kill at least two and rewrite from different emotional starting points.

SELF-CRITIQUE PASS — run every route through these before presenting:
1. Swap Test: Replace the brand name. Does it still work? If yes, kill it.
2. Pub Test: Would a human actually say this? If it sounds like "advertising", not ready.
3. So What Test: Say "so what?" after the headline. Is the answer compelling?
4. Second Read Test: Is it better the second time? If fully consumed in one pass, push deeper.
5. Specificity Test: Any word that applies to any pet food brand? Replace with something only IAMS can say.
6. Earn Test: Can any word be removed without loss? Remove it.

OUTPUT — return this exact JSON only. No preamble, no markdown, no explanation:
{"mode":"advertising","claims":[{"route_label":"The [strategic angle name] — 3-5 words describing the thought","core_claim":"The headline. Ideally 6 words or less. No em dashes. This leads everything.","supporting_line":"One sentence. Goes somewhere the headline does not — never restates it.","attribution":"IAMS [specific relevant product]","rationale":"Names the strategic MOVE and why it works for this brief. Does NOT paraphrase the headline. Explains the technique."}]}`

// ─────────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS — PACK CLAIMS
// ─────────────────────────────────────────────────────────────────────
const PACK_SYSTEM = `You are an expert in translating scientific research into hard-hitting, legally defensible product claims for pet food packaging, roundels, shelf and CRM. You work for adam&eveTBWA on IAMS.

BRAND ARCHITECTURE
- Master brand: "Healthy for Life"
- Campaign platform: "Love Them Inside Out"  
- THE CLAIM LEADS. THE PRODUCT NAME FOLLOWS. Source and legal go in small print.

PACK CLAIM PRINCIPLES — each route should use one of these primarily:
1. THE NAMED SYSTEM: Give the mechanism a proprietary name — implies clinical rigour without requiring proof. ("PROACTIVE 5", "ActivBiome+"). Memorable, ownable, defensible.
2. THE TIME-FRAME: Specific days or weeks make claims feel earned and testable. "By Day 10" beats "fast results" every time. "Within 10 weeks" beats "quickly".
3. THE SOFT NUMBER: "Up to 2.5 years" / "over 70%" — specific enough to believe, soft enough to defend. "Up to" and "may" are legal strengths, not weaknesses.
4. THE OBSERVER: "You will notice" — making the owner the judge creates evidence no competitor can challenge. The observation IS the proof.
5. THE STAT ALONE: Sometimes the research fact IS the claim. State it. Don't dress it up. Confidence in the number is the entire argument.

FORMAT REQUIREMENTS: 
- Core claim: 6-8 words MAX — lives in a roundel, on pack, at shelf
- Warm enough to be IAMS — not a pharmaceutical insert
- Rational first, emotional second
- No em dashes in claims

LEGAL NERVOUSNESS SCORING — assess how much the legal team will sweat on this claim (score 1-5):
1 = 😴 Legal Is Napping — "This one's watertight. They barely need to look up."
2 = 🙂 One Raised Eyebrow — "Defensible. Might get one minor amendment."  
3 = 😬 The Concerned Email — "They'll write three paragraphs. Most will be wrong. Stay calm."
4 = 😰 Clear Your Calendar — "This one's starting a meeting. Bring the evidence."
5 = 😱 Code Red — "Compliance, medical review, and a strongly worded letter from someone called Derek."

Scoring criteria: Hard numbers without qualifiers = high score. "Up to" + research attribution = lower score. Named systems with no specific claim = lowest. Observer claims = lowest.

ANTI-PATTERNS TO AVOID:
- Vague benefits: "supports overall health and wellbeing"
- Ingredient lists as claims: "contains omega-3 fatty acids"
- Hedge overload: "may help support potential improvement in"
- Category boilerplate: "premium nutrition for your pet"

OUTPUT — return this exact JSON only. No preamble, no markdown, no explanation:
{"mode":"pack","claims":[{"route_label":"The [approach name]","core_claim":"Short. Specific. 6-8 words max. THIS LEADS. No em dashes.","attribution":"IAMS [relevant product]","source_note":"Small print attribution (e.g. 'Based on Waltham Petcare Science Institute research')","legal_nervousness":{"score":3,"label":"😬 The Concerned Email","explanation":"Why specifically — what element makes legal nervous, and what would fix it."},"rationale":"Which pack principle this uses and why this framing beats the alternatives."}]}`

// ─────────────────────────────────────────────────────────────────────
// RIFF PROMPT
// ─────────────────────────────────────────────────────────────────────
const RIFF_SYSTEM = `You are a D&AD-standard advertising copywriter. A creative director likes a claim but wants to explore variations before committing.

Generate 3 riff variations on the provided claim. Each riff must:
- Keep the same core strategic insight and angle
- Change at least one specific element meaningfully: a word choice, the entry point, the structure, the rhythm, the tension
- Feel like a sibling to the original — recognizably related but definitively distinct
- NOT be a synonym swap — the change must alter how the claim works, not just what it says
- Pass the same anti-pattern checks: no em dashes, no adspeak, no empty parallels, no AI fingerprints

OUTPUT — return this exact JSON only. No preamble, no markdown:
{"riffs":[{"core_claim":"...","supporting_line":"...","change_note":"What changed and the craft reason — one sentence max"}]}`

// ─────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Gut Health","Coat & Skin","Weight Management","Longevity",
  "Energy & Vitality","Dental Health","Immune Support","Joint Health","Kidney Health"
];
const PRODUCT_MAP = {
  "Gut Health":"IAMS PROACTIVE 5","Coat & Skin":"IAMS Healthy Skin & Coat",
  "Weight Management":"IAMS Healthy Weight","Longevity":"IAMS Senior Plus",
  "Energy & Vitality":"IAMS Active","Dental Health":"IAMS Dental Care",
  "Immune Support":"IAMS Immunity","Joint Health":"IAMS Joint Care","Kidney Health":"IAMS Kidney Care"
};

// ─────────────────────────────────────────────────────────────────────
// API HELPER
// ─────────────────────────────────────────────────────────────────────
async function callClaude(system, userMsg) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 3500,
      system,
      messages: [{ role: "user", content: userMsg }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.content?.[0]?.text || "";
  return JSON.parse(text.replace(/```json\n?|```/g, "").trim());
}

// ─────────────────────────────────────────────────────────────────────
// GLASS HELPERS
// ─────────────────────────────────────────────────────────────────────
const glassCard = (hover) => ({
  background: hover ? GLASS_CARD_HOVER : GLASS_CARD,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${hover ? GLASS_BORDER : GLASS_BORDER_SOFT}`,
  borderRadius: 20,
  boxShadow: hover ? SHADOW : SHADOW_SM,
  transition: "all 0.25s ease",
});

// ─────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────

function RiffPanel({ riffs, loading }) {
  if (loading) return (
    <div style={{ marginTop: 12, padding: "16px 18px", background: WHITE_12, borderRadius: 12, border: `1px solid ${GLASS_BORDER_SOFT}` }}>
      <span style={{ fontSize: 12, color: WHITE_45, animation: "pulse 1.2s ease infinite" }}>Riffing on this line...</span>
    </div>
  );
  if (!riffs?.length) return null;
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      {riffs.map((r, i) => (
        <div key={i} style={{ padding: "14px 16px", background: WHITE_12, backdropFilter: "blur(12px)", borderRadius: 12, border: `1px solid ${GLASS_BORDER_SOFT}` }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: WHITE, marginBottom: 6, textShadow: TS }}>{r.core_claim}</div>
          {r.supporting_line && <div style={{ fontSize: 13, color: WHITE_70, marginBottom: 8, lineHeight: 1.5, fontWeight: 300 }}>{r.supporting_line}</div>}
          <div style={{ fontSize: 10, color: WHITE_45, fontStyle: "italic", letterSpacing: "0.03em" }}>↳ {r.change_note}</div>
        </div>
      ))}
    </div>
  );
}

function AdClaimCard({ claim, idx, category, research, onCopy, copied }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [riffing, setRiffing] = useState(false);
  const [riffs, setRiffs] = useState(null);
  const [showRiffs, setShowRiffs] = useState(false);
  const id = `ad-${idx}`;
  const full = `${claim.core_claim}\n${claim.supporting_line}\n${claim.attribution}`;

  const handleRiff = async () => {
    setShowRiffs(true);
    if (riffs) return; // already loaded
    setRiffing(true);
    try {
      const userMsg = `Category: ${category}\n\nClaim to riff on:\nRoute: ${claim.route_label}\nHeadline: ${claim.core_claim}\nSupporting: ${claim.supporting_line}\nAttribution: ${claim.attribution}\n\nGenerate 3 riff variations.`;
      const result = await callClaude(RIFF_SYSTEM, userMsg);
      setRiffs(result.riffs);
    } catch { setRiffs([]); }
    setRiffing(false);
  };

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...glassCard(hover), padding: "26px 28px" }}>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{
          width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
          background: WHITE_12, border: `1px solid ${GLASS_BORDER_SOFT}`,
          borderRadius: 6, fontSize: 10, fontWeight: 700, color: WHITE,
          fontFamily: "'Roboto Mono',monospace", flexShrink: 0, textShadow: TS,
        }}>{String(idx + 1).padStart(2, "0")}</span>
        <span style={{ fontSize: 10, color: WHITE_70, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, textShadow: TS }}>
          {claim.route_label}
        </span>
      </div>

      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: WHITE, marginBottom: 10, textShadow: TS }}>{claim.core_claim}</div>
      {claim.supporting_line && (
        <div style={{ fontSize: 14, color: WHITE_70, lineHeight: 1.7, marginBottom: 10, fontWeight: 300, textShadow: TS }}>{claim.supporting_line}</div>
      )}
      <div style={{ fontSize: 11, color: WHITE, fontWeight: 600, letterSpacing: "0.07em", textShadow: TS }}>{claim.attribution}</div>

      <div style={{ height: 1, background: GLASS_BORDER_SOFT, margin: "16px 0" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setOpen(o => !o)} style={pillBtn(false)}>
          {open ? "▲" : "▼"} Rationale
        </button>
        <button onClick={handleRiff} style={pillBtn(showRiffs)}>
          ↻ Riff on this
        </button>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => onCopy(full, id)} style={pillBtn(copied === id)}>
            {copied === id ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 12, padding: "13px 15px", background: GLASS_DEEP, backdropFilter: "blur(10px)", borderRadius: 10, borderLeft: `2px solid ${WHITE_25}`, fontSize: 13, color: WHITE_70, lineHeight: 1.7, fontWeight: 300, textShadow: TS }}>
          {claim.rationale}
        </div>
      )}

      {showRiffs && <RiffPanel riffs={riffs} loading={riffing} />}
    </div>
  );
}

function PackClaimCard({ claim, idx, category, onCopy, copied }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [riffing, setRiffing] = useState(false);
  const [riffs, setRiffs] = useState(null);
  const [showRiffs, setShowRiffs] = useState(false);
  const id = `pk-${idx}`;
  const full = `${claim.core_claim}\n${claim.attribution}\n${claim.source_note}`;
  const ln = claim.legal_nervousness || {};
  const score = ln.score || 1;
  const bars = [1, 2, 3, 4, 5];

  const handleRiff = async () => {
    setShowRiffs(true);
    if (riffs) return;
    setRiffing(true);
    try {
      const userMsg = `Category: ${category}\n\nPack claim to riff on:\nRoute: ${claim.route_label}\nClaim: ${claim.core_claim}\nAttribution: ${claim.attribution}\n\nGenerate 3 riff variations keeping the pack claim format (6-8 words max for core claim). Return same JSON format with supporting_line as the source_note.`;
      const result = await callClaude(RIFF_SYSTEM, userMsg);
      setRiffs(result.riffs);
    } catch { setRiffs([]); }
    setRiffing(false);
  };

  const legalColor = score <= 2 ? "#86efac" : score === 3 ? "#fde68a" : score >= 4 ? "#fca5a5" : WHITE;

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...glassCard(hover), padding: "26px 28px" }}>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{
          width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
          background: WHITE_12, border: `1px solid ${GLASS_BORDER_SOFT}`,
          borderRadius: 6, fontSize: 10, fontWeight: 700, color: WHITE,
          fontFamily: "'Roboto Mono',monospace", flexShrink: 0, textShadow: TS,
        }}>{String(idx + 1).padStart(2, "0")}</span>
        <span style={{ fontSize: 10, color: WHITE_70, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, textShadow: TS }}>
          {claim.route_label}
        </span>
      </div>

      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: WHITE, marginBottom: 10, textShadow: TS }}>{claim.core_claim}</div>
      <div style={{ fontSize: 11, color: WHITE, fontWeight: 600, letterSpacing: "0.07em", marginBottom: 6, textShadow: TS }}>{claim.attribution}</div>
      {claim.source_note && (
        <div style={{ fontSize: 11, color: WHITE_45, fontStyle: "italic", marginBottom: 4, textShadow: TS }}>{claim.source_note}</div>
      )}

      {/* Legal nervousness meter */}
      <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(8px)", borderRadius: 12, border: `1px solid ${GLASS_BORDER_SOFT}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: WHITE_45, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>Legal Nervousness</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: legalColor, textShadow: TS }}>{ln.label || "Unknown"}</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {bars.map(b => (
            <div key={b} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: b <= score ? legalColor : GLASS_BORDER_SOFT,
              transition: "background 0.3s ease",
              boxShadow: b <= score ? `0 0 6px ${legalColor}55` : "none",
            }} />
          ))}
        </div>
        {ln.explanation && (
          <div style={{ fontSize: 11, color: WHITE_70, lineHeight: 1.55, fontWeight: 300, textShadow: TS }}>{ln.explanation}</div>
        )}
      </div>

      <div style={{ height: 1, background: GLASS_BORDER_SOFT, margin: "16px 0" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setOpen(o => !o)} style={pillBtn(false)}>
          {open ? "▲" : "▼"} Rationale
        </button>
        <button onClick={handleRiff} style={pillBtn(showRiffs)}>
          ↻ Riff on this
        </button>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => onCopy(full, id)} style={pillBtn(copied === id)}>
            {copied === id ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 12, padding: "13px 15px", background: GLASS_DEEP, backdropFilter: "blur(10px)", borderRadius: 10, borderLeft: `2px solid ${WHITE_25}`, fontSize: 13, color: WHITE_70, lineHeight: 1.7, fontWeight: 300, textShadow: TS }}>
          {claim.rationale}
        </div>
      )}

      {showRiffs && <RiffPanel riffs={riffs} loading={riffing} />}
    </div>
  );
}

function pillBtn(active) {
  return {
    fontSize: 10, padding: "5px 13px", borderRadius: 20, border: `1px solid ${active ? GLASS_BORDER : GLASS_BORDER_SOFT}`,
    background: active ? GLASS : WHITE_12, color: active ? WHITE : WHITE_70,
    cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Roboto',sans-serif",
    transition: "all 0.2s ease", fontWeight: active ? 600 : 400, backdropFilter: "blur(8px)", textShadow: TS,
  };
}

function SkeletonCard() {
  return (
    <div style={{ ...glassCard(false), padding: "26px 28px" }}>
      {[70, 240, 140, 100].map((w, i) => (
        <div key={i} style={{
          height: i === 1 ? 24 : 12, width: w, borderRadius: 5,
          background: WHITE_12, marginBottom: i === 1 ? 14 : 10,
          animation: `pulse 1.6s ease ${i * 0.12}s infinite`,
        }} />
      ))}
    </div>
  );
}

function SectionHeader({ label, count, onCopyAll, copied }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ fontSize: 10, color: WHITE_45, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, textShadow: TS }}>
        {count} {label}
      </div>
      <button onClick={onCopyAll} style={pillBtn(copied)}>
        {copied ? "✓ All Copied" : "Copy All"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("advertising"); // advertising | pack | both
  const [categories, setCategories] = useState(["Gut Health"]);
  const [research, setResearch] = useState("");
  const [adResults, setAdResults] = useState(null);
  const [packResults, setPackResults] = useState(null);
  const [adLoading, setAdLoading] = useState(false);
  const [packLoading, setPackLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [focused, setFocused] = useState(false);
  const [modeTooltip, setModeTooltip] = useState(null);

  const toggleCategory = (cat) => {
    setCategories(prev => {
      if (prev.includes(cat)) return prev.length === 1 ? prev : prev.filter(c => c !== cat);
      return [...prev, cat];
    });
    setAdResults(null); setPackResults(null);
  };

  const isLoading = adLoading || packLoading;

  const generate = useCallback(async () => {
    if (!research.trim() || isLoading) return;
    setError(null);
    setAdResults(null);
    setPackResults(null);

    const userMsg = `Categories: ${categories.join(', ')}\n\nResearch:\n${research.trim()}`;

    const runAd = async () => {
      setAdLoading(true);
      try {
        const res = await callClaude(AD_SYSTEM, userMsg + "\n\nGenerate 5 advertising headline claim routes.");
        setAdResults(res);
      } catch (e) { setError(e.message); }
      setAdLoading(false);
    };

    const runPack = async () => {
      setPackLoading(true);
      try {
        const res = await callClaude(PACK_SYSTEM, userMsg + "\n\nGenerate 5 pack/roundel claims.");
        setPackResults(res);
      } catch (e) { setError(e.message); }
      setPackLoading(false);
    };

    if (mode === "advertising") await runAd();
    else if (mode === "pack") await runPack();
    else await Promise.all([runAd(), runPack()]);
  }, [mode, categories, research, isLoading]);

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAdAll = () => {
    if (!adResults) return;
    const txt = adResults.claims.map((c, i) => `${String(i+1).padStart(2,"0")}. ${c.route_label}\n${c.core_claim}\n${c.supporting_line}\n${c.attribution}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(txt); setCopied("ad-all"); setTimeout(() => setCopied(null), 2000);
  };

  const copyPackAll = () => {
    if (!packResults) return;
    const txt = packResults.claims.map((c, i) => `${String(i+1).padStart(2,"0")}. ${c.route_label}\n${c.core_claim}\n${c.attribution}\n${c.source_note}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(txt); setCopied("pk-all"); setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => { setAdResults(null); setPackResults(null); setResearch(""); setError(null); };

  const modeButtons = [
    {
      id: "advertising", icon: "⚡", label: "Advertising", desc: "Warm, human, memorable",
      tooltip: "Generates warm, memorable headline claims using a rigorous copywriting framework — tonal diversity, provocation routes, and a self-critique pass. For TV, OOH, digital and social."
    },
    {
      id: "pack", icon: "◉", label: "Pack Claims", desc: "Measurable, defensible",
      tooltip: "Generates short, measurable claims for packaging, roundels and shelf. Each claim includes a Legal Nervousness score — a brutally honest assessment of how your compliance team will react."
    },
    {
      id: "both", icon: "✦", label: "Both", desc: "Full set — runs together",
      tooltip: "Runs both Advertising and Pack generation simultaneously. You get the full creative spectrum — emotional above-the-line claims and rational on-pack copy — in a single pass."
    },
  ];

  const catLabel = categories.length === 1 ? categories[0] : `${categories.length} categories`;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Roboto',sans-serif", color: WHITE }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;900&family=Roboto+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse{0%,100%{opacity:.35}50%{opacity:.7}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        textarea::placeholder{color:rgba(255,255,255,0.3);font-weight:300}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:2px}
        button{font-family:'Roboto',sans-serif}
      `}</style>

      {/* Hero title */}
      <div style={{ textAlign: "center", padding: "52px 24px 36px", userSelect: "none" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(52px, 8vw, 88px)",
          fontWeight: 300, color: WHITE,
          letterSpacing: "-0.04em", lineHeight: 1.05,
          textShadow: "0 2px 20px rgba(40,20,100,0.4)",
        }}>
          PetScribe<span style={{ fontSize: "0.32em", verticalAlign: "super", letterSpacing: 0, fontWeight: 400 }}>®</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: WHITE_45, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, textShadow: TS }}>
          adam&eveTBWA &nbsp;·&nbsp; Writing Tool &nbsp;·&nbsp; v2.0
        </div>
        <div style={{ width: 48, height: 1, background: GLASS_BORDER, margin: "20px auto 0" }} />
      </div>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Mode — with tooltips */}
        <div style={{ fontSize: 10, color: WHITE_45, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 10, textShadow: TS }}>Mode</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {modeButtons.map(m => (
            <div key={m.id} style={{ flex: 1, position: "relative" }}
              onMouseEnter={() => setModeTooltip(m.id)}
              onMouseLeave={() => setModeTooltip(null)}>
              <button onClick={() => { setMode(m.id); setAdResults(null); setPackResults(null); }} style={{
                width: "100%", padding: "12px 14px", borderRadius: 14,
                border: `1px solid ${mode === m.id ? GLASS_BORDER : GLASS_BORDER_SOFT}`,
                background: mode === m.id ? GLASS : WHITE_12,
                backdropFilter: "blur(16px)",
                color: mode === m.id ? WHITE : WHITE_45,
                cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                boxShadow: mode === m.id ? SHADOW_SM : "none",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, textShadow: TS }}>{m.icon} {m.label}</div>
                <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 300 }}>{m.desc}</div>
              </button>
              {modeTooltip === m.id && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 200,
                  width: 220, padding: "11px 14px",
                  background: "rgba(30,18,75,0.92)", backdropFilter: "blur(24px)",
                  border: `1px solid ${GLASS_BORDER_SOFT}`, borderRadius: 10,
                  boxShadow: SHADOW, fontSize: 11, color: WHITE_70, lineHeight: 1.65,
                  fontWeight: 300, pointerEvents: "none",
                }}>
                  {m.tooltip}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Category — multi-select */}
        <div style={{ fontSize: 10, color: WHITE_45, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 10, textShadow: TS }}>
          Category
          <span style={{ marginLeft: 8, color: WHITE_25, fontWeight: 300, letterSpacing: "0.04em", textTransform: "none", fontSize: 9 }}>select one or more</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 28 }}>
          {CATEGORIES.map(cat => {
            const active = categories.includes(cat);
            return (
              <button key={cat} onClick={() => toggleCategory(cat)} style={{
                padding: "6px 14px", borderRadius: 20,
                border: `1px solid ${active ? GLASS_BORDER : GLASS_BORDER_SOFT}`,
                background: active ? GLASS : WHITE_12,
                backdropFilter: "blur(10px)",
                color: active ? WHITE : WHITE_70,
                fontSize: 12, fontWeight: active ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s ease", textShadow: TS,
              }}>{active && <span style={{ marginRight: 4, fontSize: 10 }}>✓</span>}{cat}</button>
            );
          })}
        </div>

        {/* Research input */}
        <div style={{ fontSize: 10, color: WHITE_45, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, marginBottom: 10, textShadow: TS }}>Research Input</div>
        <textarea
          value={research}
          onChange={e => setResearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Paste your research — efficacy data, clinical trial results, ingredient science, time-based stats.\n\nExample: "Overweight dogs may live up to 2.5 years less than dogs at a normal weight. Waltham Petcare Science Institute."`}
          style={{
            width: "100%", minHeight: 148,
            background: focused ? "rgba(255,255,255,0.2)" : GLASS_CARD,
            backdropFilter: "blur(16px)",
            border: `1px solid ${focused ? GLASS_BORDER : GLASS_BORDER_SOFT}`,
            borderRadius: 16, padding: "16px 18px",
            color: WHITE, fontFamily: "'Roboto',sans-serif",
            fontSize: 14, lineHeight: 1.7, resize: "vertical", outline: "none",
            transition: "all 0.2s ease", marginBottom: 18,
            boxShadow: focused ? SHADOW : "none",
          }}
        />

        {/* Generate — no textShadow on button text */}
        <button
          onClick={generate}
          disabled={!research.trim() || isLoading}
          style={{
            width: "100%", padding: "16px 32px",
            background: !research.trim() || isLoading ? WHITE_12 : GLASS,
            backdropFilter: "blur(16px)",
            border: `1px solid ${!research.trim() || isLoading ? GLASS_BORDER_SOFT : GLASS_BORDER}`,
            borderRadius: 14,
            color: !research.trim() || isLoading ? WHITE_25 : WHITE,
            fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: !research.trim() || isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            marginBottom: 36,
            boxShadow: !research.trim() || isLoading ? "none" : SHADOW,
          }}
        >
          {isLoading
            ? <><span style={{ animation: "spin 1s linear infinite", fontSize: 14 }}>◌</span> Generating...</>
            : `Generate${mode === "both" ? " Both Claim Sets" : mode === "advertising" ? " Advertising Claims" : " Pack Claims"}`
          }
        </button>

        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 12, color: "#fca5a5", fontSize: 13, marginBottom: 24 }}>
            {error}
          </div>
        )}

        {/* ADVERTISING RESULTS */}
        {(adLoading || adResults) && (
          <div style={{ animation: "fadeUp 0.4s ease both", marginBottom: mode === "both" ? 40 : 0 }}>
            {mode === "both" && (
              <div style={{ fontSize: 11, color: WHITE_45, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14, textShadow: TS }}>
                ⚡ Advertising Claims
              </div>
            )}
            {adLoading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ animationDelay: `${i*0.1}s` }}><SkeletonCard /></div>)}</div>}
            {adResults && !adLoading && (
              <>
                <SectionHeader label={`advertising routes — ${catLabel}`} count={adResults.claims?.length} onCopyAll={copyAdAll} copied={copied === "ad-all"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {adResults.claims?.map((c, i) => (
                    <div key={i} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                      <AdClaimCard claim={c} idx={i} category={catLabel} research={research} onCopy={copyText} copied={copied} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* PACK RESULTS */}
        {(packLoading || packResults) && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>
            {mode === "both" && (
              <div style={{ fontSize: 11, color: WHITE_45, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14, textShadow: TS }}>
                ◉ Pack Claims
              </div>
            )}
            {packLoading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ animationDelay: `${i*0.1}s` }}><SkeletonCard /></div>)}</div>}
            {packResults && !packLoading && (
              <>
                <SectionHeader label={`pack claims — ${catLabel}`} count={packResults.claims?.length} onCopyAll={copyPackAll} copied={copied === "pk-all"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {packResults.claims?.map((c, i) => (
                    <div key={i} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                      <PackClaimCard claim={c} idx={i} category={catLabel} onCopy={copyText} copied={copied} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Reset */}
        {(adResults || packResults) && !isLoading && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={reset} style={{ fontSize: 10, color: WHITE_45, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", textShadow: TS }}>
              ↺ Reset
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
