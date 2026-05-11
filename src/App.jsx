import { useState, useCallback } from "react";

// ───────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ───────────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS — ADVERTISING (full copywriting skill embedded)
// ───────────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS — PACK CLAIMS
// ───────────────────────────────────────────────────────────────────
const PACK_SYSTEM = `You are an expert in translating scientific research into hard-hitting, legally defensible product claims for pet food packaging, roundels, shelf and CRM. You work for adam&eveTBWA on IAMS.

BRAND ARCHITECTURE
- Master brand: "Healthy for Life"
- Campaign platform: "Love Them Inside Out"
- THE CLAIM LEADS. THE PRODUCT NAME FOLLOWS. Source and legal go in small print.

THE GOLD STANDARD — what the best pack claims have in common:
Every great pack claim is something the owner can see, smell, notice or measure themselves. Not an internal process. Not an ingredient action. The observable outcome IS the claim.
Use the language the owner would use — not the lab report. "Optimal poop in 10 days" beats "improved fecal consistency". "Fresh breath from day one" beats "reduced oral malodor". "Less shedding in 4 weeks" beats "supports dermal keratin production".
Reduction framing often lands harder than improvement framing: "25% less waste", "noticeable reduction in shedding", "less itching" feels more honest than "improved digestion", "better coat", "enhanced comfort".
Hyper-specific symptoms signal research, not generic copy: "night-time pacing", "tear staining", "plaque buildup", "stool odor" — name the exact thing the owner is already worried about.

PACK CLAIM PRINCIPLES — each route should use one primarily:
1. THE NAMED SYSTEM: Give the mechanism a proprietary name — implies clinical rigour without requiring proof. ("PROACTIVE 5", "ActivBiome+"). Memorable, ownable, defensible.
2. THE TIME-FRAME: Specific days or weeks make claims feel earned and testable. "Optimal poop in 10 days" beats "fast results". Use category-appropriate windows (see below).
3. THE SOFT NUMBER: "Up to 2.5 years" / "over 70%" / "25% less waste" — specific enough to believe, soft enough to defend. "Up to" and "may" are legal strengths, not weaknesses. When you have a hard number, lead with it confidently.
4. THE OBSERVER: "You will notice" — making the owner the judge creates evidence no competitor can challenge. The observation IS the proof.
5. THE STAT ALONE: Sometimes the research fact IS the claim. State it plain. Confidence in the number is the entire argument.
6. THE DAY ONE: When a benefit is genuinely immediate, say so. "Fresh breath starting at day one" is more powerful than any 30-day claim for dental. Only use when the research supports it.

CATEGORY-APPROPRIATE TIMEFRAMES — match the biology:
- Gut/Digestive: 7–10 days ("optimal poop in 10 days", "balanced microbiome in 7 days")
- Skin/Coat: 14–21 days ("shinier coat in 21 days", "less shedding in 4 weeks")
- Mobility/Energy: 28–30 days ("visible improvement in mobility in 30 days")
- Behavioural/Calm: 4–6 weeks ("calmer demeanor in 6 weeks")
- Weight: 60 days ("effective weight loss in 60 days")
- Dental: Day 1 or immediate ("fresh breath from day one", "reduces plaque by 40%")
If the research gives a different timeframe, use it exactly. Never round up.

FORMAT REQUIREMENTS:
- Core claim: 6-8 words MAX — lives in a roundel, on pack, at shelf
- Use owner language, not clinical language
- Rational first, emotional second
- No em dashes in claims

LEGAL NERVOUSNESS SCORING — assess how much the legal team will sweat on this claim (score 1-5):
1 = 😴 Legal Is Napping — "This one's watertight. They barely need to look up."
2 = 🙂 One Raised Eyebrow — "Defensible. Might get one minor amendment."
3 = 😬 The Concerned Email — "They'll write three paragraphs. Most will be wrong. Stay calm."
4 = 😰 Clear Your Calendar — "This one's starting a meeting. Bring the evidence."
5 = 😱 Code Red — "Compliance, medical review, and a strongly worded letter from someone called Derek."

Scoring criteria: Hard numbers without qualifiers = higher score. "Up to" + research attribution = lower score. Named systems with no specific claim = lowest. Observer claims = lowest. Immediate (Day 1) claims = score depends on category — dental Day 1 is well-precedented (lower), energy Day 1 would raise flags (higher).

ANTI-PATTERNS TO AVOID:
- Vague benefits: "supports overall health and wellbeing"
- Ingredient lists as claims: "contains omega-3 fatty acids"
- Hedge overload: "may help support potential improvement in"
- Category boilerplate: "premium nutrition for your pet"
- Lab language in consumer copy: "fecal consistency", "dermal keratin", "oral malodor"
- Generic improvement framing: "better digestion", "improved coat", "enhanced wellbeing" — name the specific thing the owner will notice

OUTPUT — return this exact JSON only. No preamble, no markdown, no explanation:
{"mode":"pack","claims":[{"route_label":"The [approach name]","core_claim":"Short. Specific. 6-8 words max. Owner language. No em dashes.","attribution":"IAMS [relevant product]","source_note":"Small print attribution (e.g. 'Based on Waltham Petcare Science Institute research')","legal_nervousness":{"score":3,"label":"😬 The Concerned Email","explanation":"Why specifically — what element makes legal nervous, and what would fix it."},"rationale":"Which pack principle this uses, why this framing beats the alternatives, and what owner-observable outcome it names."}]}`

// ───────────────────────────────────────────────────────────────────
// CRITIC PROMPT
// ───────────────────────────────────────────────────────────────────
const CRITIC_SYSTEM = `You are a rigorous quality critic for advertising and pack claims. Score each claim honestly from 1-10. Be strict — most AI-generated claims cluster around 6-7. Reserve 8+ for claims that are genuinely specific, surprising, and IAMS-ownable.

ADVERTISING CLAIM SCORING CRITERIA:
9-10: Genuinely surprising angle, human truth earned not stated, IAMS-specific (swap test: fails without brand name), passes all anti-pattern checks, provokes a reaction
7-8: Solid craft, mostly specific, passes most checks — presentable but with room to push
5-6: Could work for any pet food brand, insight is soft or generic, anti-patterns lurking
1-4: Adspeak, category boilerplate, explains the brief, or fails the translation chain entirely

PACK CLAIM SCORING CRITERIA:
9-10: Owner-observable outcome in everyday language, specific timeframe or number, genuinely useful in a roundel, names something the owner is already worried about
7-8: Good structure, mostly specific, appropriate language, correct timeframe window
5-6: Vague benefit, improvement framing ("better digestion"), or slight lab language present
1-4: Ingredient list, hedge overload, generic boilerplate, or clinical language throughout

Score each claim at the index it appears (0-based). For any claim scoring below 8, note the single most important specific weakness in one sentence.

OUTPUT — return this exact JSON only. No preamble, no markdown, no explanation:
{"scores":[{"idx":0,"score":7,"weakness":"One sentence on the specific weakness — or null if score is 8 or above."}]}`

// ───────────────────────────────────────────────────────────────────
// RIFF PROMPT
// ───────────────────────────────────────────────────────────────────
const RIFF_SYSTEM = `You are a D&AD-standard advertising copywriter. A creative director likes a claim but wants to explore variations before committing.

Generate 3 riff variations on the provided claim. Each riff must:
- Keep the same core strategic insight and angle
- Change at least one specific element meaningfully: a word choice, the entry point, the structure, the rhythm, the tension
- Feel like a sibling to the original — recognizably related but definitively distinct
- NOT be a synonym swap — the change must alter how the claim works, not just what it says
- Pass the same anti-pattern checks: no em dashes, no adspeak, no empty parallels, no AI fingerprints

OUTPUT — return this exact JSON only. No preamble, no markdown:
{"riffs":[{"core_claim":"...","supporting_line":"...","change_note":"What changed and the craft reason — one sentence max"}]}`

// ───────────────────────────────────────────────────────────────────
// DATA
// ───────────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────────
// CRITIC + REFINE PIPELINE
// ───────────────────────────────────────────────────────────────────
async function runCriticAndRefine(claims, systemPrompt, mode, userMsg) {
  try {
    const claimsText = claims.map((c, i) => {
      const body = mode === "advertising"
        ? `Route: ${c.route_label}\nHeadline: ${c.core_claim}\nSupporting: ${c.supporting_line || ""}`
        : `Route: ${c.route_label}\nClaim: ${c.core_claim}\nSource: ${c.source_note || ""}`;
      return `[${i}] ${body}`;
    }).join("\n\n");

    const criticResult = await callClaude(CRITIC_SYSTEM, `Mode: ${mode}\n\nClaims to score:\n${claimsText}`);
    const rawScores = criticResult.scores || [];
    const scoreValues = claims.map((_, i) => {
      const s = rawScores.find(s => s.idx === i);
      return s ? s.score : 7;
    });

    const lowScorers = rawScores.filter(s => s.score < 7);
    if (lowScorers.length === 0) return { scoreValues, updatedClaims: claims };

    const regenMsg = `${userMsg}\n\nIMPROVEMENT PASS: ${lowScorers.length} claim(s) scored below 7 and must be replaced. Address each specific weakness noted. Generate exactly ${lowScorers.length} replacement claim(s). Return the standard JSON format.\n\n${
      lowScorers.map((s, i) => `Replacement ${i + 1} (replacing route: ${claims[s.idx]?.route_label})\nWeakness: ${s.weakness}`).join("\n\n")
    }`;
    const regenResult = await callClaude(systemPrompt, regenMsg);
    const improved = regenResult.claims || [];

    const updatedClaims = [...claims];
    lowScorers.forEach((s, i) => {
      if (improved[i]) updatedClaims[s.idx] = { ...improved[i], _refined: true };
    });

    return { scoreValues, updatedClaims };
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────────
// API HELPER
// ───────────────────────────────────────────────────────────────────
async function callClaude(system, userMsg) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  const cleaned = text.replace(/```json\n?|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}

// ───────────────────────────────────────────────────────────────────
// GLASS HELPERS
// ───────────────────────────────────────────────────────────────────
const glassCard = (hover) => ({
  background: hover ? GLASS_CARD_HOVER : GLASS_CARD,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${hover ? GLASS_BORDER : GLASS_BORDER_SOFT}`,
  borderRadius: 20,
  boxShadow: hover ? SHADOW : SHADOW_SM,
  transition: "all 0.25s ease",
});

// ───────────────────────────────────────────────────────────────────
// COMPONENTS
// ───────────────────────────────────────────────────────────────────

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

function AdClaimCard({ claim, idx, category, research, onCopy, copied, score }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [riffing, setRiffing] = useState(false);
  const [riffs, setRiffs] = useState(null);
  const [showRiffs, setShowRiffs] = useState(false);
  const id = `ad-${idx}`;
  const full = `${claim.core_claim}\n${claim.supporting_line}\n${claim.attribution}`;

  const handleRiff = async () => {
    setShowRiffs(true);
    if (riffs) return;
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
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          {claim._refined && <span style={{ fontSize: 9, color: WHITE_45, letterSpacing: "0.1em", textTransform: "uppercase" }}>✦ refined</span>}
          {score != null && score >= 7 && <span style={{
            fontSize: 10, fontWeight: 700, fontFamily: "'Roboto Mono',monospace",
            color: score >= 8 ? "#86efac" : "#fde68a",
            textShadow: TS,
          }}>{score}/10</span>}
        </div>
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

function PackClaimCard({ claim, idx, category, onCopy, copied, score: qualityScore }) {
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
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          {claim._refined && <span style={{ fontSize: 9, color: WHITE_45, letterSpacing: "0.1em", textTransform: "uppercase" }}>✦ refined</span>}
          {qualityScore != null && qualityScore >= 7 && <span style={{
            fontSize: 10, fontWeight: 700, fontFamily: "'Roboto Mono',monospace",
            color: qualityScore >= 8 ? "#86efac" : "#fde68a",
            textShadow: TS,
          }}>{qualityScore}/10</span>}
        </div>
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

// ───────────────────────────────────────────────────────────────────
// APP
// ───────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("advertising");
  const [categories, setCategories] = useState(["Gut Health"]);
  const [research, setResearch] = useState("");
  const [adResults, setAdResults] = useState(null);
  const [packResults, setPackResults] = useState(null);
  const [adLoading, setAdLoading] = useState(false);
  const [packLoading, setPackLoading] = useState(false);
  const [adRefining, setAdRefining] = useState(false);
  const [packRefining, setPackRefining] = useState(false);
  const [adScores, setAdScores] = useState(null);
  const [packScores, setPackScores] = useState(null);
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
    setAdScores(null);
    setPackScores(null);

    const userMsg = `Categories: ${categories.join(', ')}\n\nResearch:\n${research.trim()}`;

    const runAd = async () => {
      setAdLoading(true);
      try {
        const res = await callClaude(AD_SYSTEM, userMsg + "\n\nGenerate 5 advertising headline claim routes.");
        setAdResults(res);
        setAdLoading(false);
        setAdRefining(true);
        const refined = await runCriticAndRefine(res.claims, AD_SYSTEM, "advertising", userMsg);
        if (refined) {
          setAdScores(refined.scoreValues);
          setAdResults({ ...res, claims: refined.updatedClaims });
        }
      } catch (e) { setError(e.message); setAdLoading(false); }
      setAdRefining(false);
    };

    const runPack = async () => {
      setPackLoading(true);
      try {
        const res = await callClaude(PACK_SYSTEM, userMsg + "\n\nGenerate 5 pack/roundel claims.");
        setPackResults(res);
        setPackLoading(false);
        setPackRefining(true);
        const refined = await runCriticAndRefine(res.claims, PACK_SYSTEM, "pack", userMsg);
        if (refined) {
          setPackScores(refined.scoreValues);
          setPackResults({ ...res, claims: refined.updatedClaims });
        }
      } catch (e) { setError(e.message); setPackLoading(false); }
      setPackRefining(false);
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
    const txt = adResults.claims.map((c, i) => `${String(i+1).padStart(2,"00")}. ${c.route_label}\n${c.core_claim}\n${c.supporting_line}\n${c.attribution}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(txt); setCopied("ad-all"); setTimeout(() => setCopied(null), 2000);
  };

  const copyPackAll = () => {
    if (!packResults) return;
    const txt = packResults.claims.map((c, i) => `${String(i+1).padStart(2,"00")}. ${c.route_label}\n${c.core_claim}\n${c.attribution}\n${c.source_note}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(txt); setCopied("pk-all"); setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => { setAdResults(null); setPackResults(null); setAdScores(null); setPackScores(null); setResearch(""); setError(null); };

  const downloadPDF = () => {
    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const legalEmoji = { 1: "😴", 2: "🙂", 3: "😬", 4: "😰", 5: "😱" };

    const adHtml = adResults?.claims?.map((c, i) => {
      const score = adScores?.[i];
      return `
        <div class="claim">
          <div class="claim-header">
            <span class="idx">${String(i + 1).padStart(2, "0")}</span>
            <span class="route">${c.route_label}</span>
            ${score != null && score >= 7 ? `<span class="score ${score >= 8 ? "green" : "amber"}">${score}/10</span>` : ""}
            ${c._refined ? `<span class="refined">✦ refined</span>` : ""}
          </div>
          <div class="core">${c.core_claim}</div>
          ${c.supporting_line ? `<div class="supporting">${c.supporting_line}</div>` : ""}
          <div class="attribution">${c.attribution}</div>
          <div class="rationale"><strong>Rationale:</strong> ${c.rationale}</div>
        </div>`;
    }).join("") || "";

    const packHtml = packResults?.claims?.map((c, i) => {
      const score = packScores?.[i];
      const ln = c.legal_nervousness || {};
      const lScore = ln.score || 1;
      return `
        <div class="claim">
          <div class="claim-header">
            <span class="idx">${String(i + 1).padStart(2, "0")}</span>
            <span class="route">${c.route_label}</span>
            ${score != null && score >= 7 ? `<span class="score ${score >= 8 ? "green" : "amber"}">${score}/10</span>` : ""}
            ${c._refined ? `<span class="refined">✦ refined</span>` : ""}
          </div>
          <div class="core">${c.core_claim}</div>
          <div class="attribution">${c.attribution}</div>
          ${c.source_note ? `<div class="source">${c.source_note}</div>` : ""}
          <div class="legal-box">
            <span class="legal-label">Legal Nervousness</span>
            <span class="legal-score">${legalEmoji[lScore] || ""} ${ln.label || ""}</span>
            ${ln.explanation ? `<div class="legal-exp">${ln.explanation}</div>` : ""}
          </div>
          <div class="rationale"><strong>Rationale:</strong> ${c.rationale}</div>
        </div>`;
    }).join("") || "";

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>PetScribe® — ${catLabel} — ${date}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;600;700&family=Cormorant+Garamond:wght@300;400&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Roboto',sans-serif;color:#1a1a2e;background:#fff;padding:48px 56px;max-width:800px;margin:0 auto}
      h1{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:48px;letter-spacing:-0.03em;color:#1a1a2e;margin-bottom:4px}
      .meta{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#888;margin-bottom:8px}
      .divider{height:1px;background:#ddd;margin:20px 0 32px}
      .section-title{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;color:#666;margin-bottom:20px;padding-bottom:8px;border-bottom:1px solid #eee}
      .claim{margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid #f0f0f0}
      .claim:last-child{border-bottom:none}
      .claim-header{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap}
      .idx{width:22px;height:22px;display:flex;align-items:center;justify-content:center;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:5px;font-size:9px;font-weight:700;font-family:monospace;flex-shrink:0}
      .route{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#888;font-weight:500}
      .score{font-size:9px;font-weight:700;font-family:monospace;padding:2px 6px;border-radius:4px}
      .score.green{color:#166534;background:#dcfce7}
      .score.amber{color:#92400e;background:#fef3c7}
      .refined{font-size:8px;color:#aaa;letter-spacing:0.1em;text-transform:uppercase}
      .core{font-size:28px;font-weight:700;line-height:1.2;color:#1a1a2e;margin-bottom:10px}
      .supporting{font-size:14px;color:#555;line-height:1.7;margin-bottom:8px;font-weight:300}
      .attribution{font-size:10px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#1a1a2e;margin-bottom:12px}
      .source{font-size:10px;color:#999;font-style:italic;margin-bottom:10px}
      .legal-box{background:#fafafa;border:1px solid #eee;border-radius:8px;padding:10px 12px;margin-bottom:12px}
      .legal-label{font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#aaa;display:block;margin-bottom:4px}
      .legal-score{font-size:11px;font-weight:600;color:#1a1a2e}
      .legal-exp{font-size:11px;color:#666;margin-top:6px;line-height:1.5;font-weight:300}
      .rationale{font-size:11px;color:#777;line-height:1.6;font-weight:300;font-style:italic}
      .section-gap{margin-top:40px}
      @media print{body{padding:32px 40px}h1{font-size:36px}}
    </style></head><body>
    <div class="meta">adam&amp;eveTBWA · PetScribe® · ${date}</div>
    <h1>PetScribe<sup style="font-size:0.3em;vertical-align:super;font-weight:400">®</sup></h1>
    <div class="meta" style="margin-top:6px">Categories: ${categories.join(", ")}</div>
    <div class="divider"></div>
    ${adHtml ? `<div class="section-title">⚡ Advertising Routes</div>${adHtml}` : ""}
    ${packHtml ? `<div class="section-title section-gap">◉ Pack Claims</div>${packHtml}` : ""}
    <script>window.onload=function(){window.print()}<\/script>
    </body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  };

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
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Roboto',sans-serif", color: WHITE, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;900&family=Roboto+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet" />
      <img src="/DOG.png" alt="" style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 1200, pointerEvents: "none", zIndex: 0,
        opacity: 0.18, userSelect: "none",
      }} />
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

      <div style={{ textAlign: "center", padding: "52px 24px 36px", userSelect: "none", position: "relative", zIndex: 1 }}>
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

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 80px", position: "relative", zIndex: 1 }}>

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
                {adRefining && (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span> Scoring and refining...
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {adResults.claims?.map((c, i) => (
                    <div key={i} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                      <AdClaimCard claim={c} idx={i} category={catLabel} research={research} onCopy={copyText} copied={copied} score={adScores?.[i]} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

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
                {packRefining && (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span> Scoring and refining...
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {packResults.claims?.map((c, i) => (
                    <div key={i} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                      <PackClaimCard claim={c} idx={i} category={catLabel} onCopy={copyText} copied={copied} score={packScores?.[i]} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {(adResults || packResults) && !isLoading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 32 }}>
            <button onClick={downloadPDF} style={{ fontSize: 10, color: WHITE_70, background: GLASS_CARD, backdropFilter: "blur(12px)", border: `1px solid ${GLASS_BORDER_SOFT}`, borderRadius: 20, padding: "6px 16px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", textShadow: TS }}>
              ↓ Download PDF
            </button>
            <button onClick={reset} style={{ fontSize: 10, color: WHITE_45, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase", textShadow: TS }}>
              ↺ Reset
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
