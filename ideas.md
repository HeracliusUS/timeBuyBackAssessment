# Just Ask AVA – Assessment Design Brainstorm

<response>
<idea>

## Idea 1: "Warm Clarity" — Scandinavian Wellness Meets Business Tool

**Design Movement**: Nordic Minimalism crossed with wellness-app warmth (think Headspace meets Linear)

**Core Principles**:
1. Warmth through restraint — generous whitespace, soft edges, muted earth tones
2. Progressive disclosure — one section at a time, never overwhelming
3. Breathing room — the design itself should feel like "buying back time"
4. Tactile feedback — every interaction feels intentional and grounded

**Color Philosophy**: A warm sand/cream base (#FAF7F2) with deep forest green (#1B4332) as the primary action color, soft terracotta (#C4704B) for accents and progress indicators, and charcoal (#2D2D2D) for text. The palette evokes trust, groundedness, and calm authority — not corporate blue or startup purple.

**Layout Paradigm**: Single-column card flow with generous vertical rhythm. Each section is a full "card" that slides into view. The left 30% of the viewport on desktop shows a persistent progress sidebar with organic, flowing shapes. Mobile is a clean vertical scroll with a sticky progress bar.

**Signature Elements**:
1. Organic blob shapes as section dividers (SVG, animated subtly)
2. A "breathing" progress indicator — a circle that gently pulses as you advance
3. Handwritten-style section labels ("Section A — Your Time Reality") using a display script font

**Interaction Philosophy**: Each question appears with a gentle fade-up. Selecting an answer triggers a soft scale + color shift. Transitions between sections use a smooth vertical slide with a slight parallax on the progress sidebar.

**Animation**: Entrance animations are 400ms ease-out fades with 20px upward translate. Progress bar fills with a spring-physics easing. Section transitions use a 500ms crossfade. Results page elements stagger in with 100ms delays.

**Typography System**: Display: "Fraunces" (serif, optical size variable) for headlines and section names. Body: "DM Sans" for all body text, labels, and choices. Monospace accents for scores (e.g., "72/100" in a tabular figure style).

</idea>
<probability>0.07</probability>
<text>Warm, Scandinavian-inspired wellness aesthetic with earth tones, organic shapes, and progressive disclosure.</text>
</response>

<response>
<idea>

## Idea 2: "Executive Clarity" — Editorial Magazine Layout

**Design Movement**: Swiss Editorial Design meets modern SaaS — think Bloomberg Businessweek layout meets Stripe's clarity

**Core Principles**:
1. Information hierarchy through typography scale — large numbers, clear labels, decisive structure
2. Asymmetric grid that creates visual interest without chaos
3. Confidence through precision — clean lines, sharp type, intentional color
4. The assessment feels like a premium editorial experience, not a form

**Color Philosophy**: Pure white (#FFFFFF) background with near-black (#0F1419) text. A single bold accent: warm amber/gold (#D4A853) for progress, highlights, and CTAs. Subtle warm gray (#F5F3EF) for card backgrounds. The gold signals "executive" and "value" without being flashy.

**Layout Paradigm**: Two-column asymmetric grid on desktop — questions occupy 60% left, a contextual sidebar on the right shows progress, section context, and encouraging micro-copy. On mobile, it collapses to a single column with a floating progress indicator. The results page uses a magazine-style layout with large score numbers, pull quotes, and editorial-style recommendation cards.

**Signature Elements**:
1. Oversized score typography (120px+) on the results page with a thin gold underline
2. Thin horizontal rules between questions (editorial dividers)
3. A subtle dot-grid texture on card backgrounds for depth

**Interaction Philosophy**: Choices are presented as clean, full-width radio cards with a left border that fills with gold on selection. Hover states use a subtle background shift. The experience feels like filling out a premium intake form at a high-end consultancy.

**Animation**: Minimal but precise — 200ms ease transitions on selection states. Section changes use a clean slide-left with opacity. Results page numbers count up from 0 with a 1.2s duration. Recommendation cards stagger in with 150ms delays.

**Typography System**: Display: "Instrument Serif" for large headlines and score numbers. Body: "Inter Tight" (not regular Inter) at 16px for body, with generous letter-spacing on labels. All-caps micro-labels in "Inter Tight" at 11px with 2px letter-spacing for section tags.

</idea>
<probability>0.06</probability>
<text>Premium editorial magazine aesthetic with asymmetric grids, gold accents, and Swiss typography precision.</text>
</response>

<response>
<idea>

## Idea 3: "Momentum" — Kinetic Progress-Driven Interface

**Design Movement**: Motion-first design inspired by fitness/health tracking apps (Whoop, Oura) crossed with modern productivity tools (Linear, Raycast)

**Core Principles**:
1. Forward momentum — every interaction propels you forward visually
2. Data as delight — scores and metrics are celebrated, not hidden
3. Dark-on-light with vivid accents — the interface feels alive and energetic
4. Gamification without gimmicks — progress feels rewarding, not childish

**Color Philosophy**: Soft off-white (#FAFAFA) base with a deep navy (#0A1628) for the progress rail and results sections. Vivid teal (#0EA5A0) as the primary accent for progress, selections, and CTAs. Warm coral (#F07167) as a secondary accent for "time leak" indicators. The teal-coral pairing creates energy without aggression.

**Layout Paradigm**: A horizontal "track" metaphor — on desktop, a fixed left rail (120px) shows your journey as a vertical timeline with nodes for each section. The main content area uses a centered single-column (max 640px) for focused question flow. Results page breaks into a dashboard-style grid with score cards, leak indicators, and recommendation panels.

**Signature Elements**:
1. A vertical timeline rail with animated nodes that fill as sections complete
2. Circular progress rings for the two main scores (Time Buyback + AVA Readiness) on the results page
3. "Leak indicators" — small animated bars that visualize where time is being lost

**Interaction Philosophy**: Selecting an answer triggers a satisfying micro-animation — the choice card compresses slightly then settles with a teal border. The timeline node fills with a liquid animation. Auto-advance after selection with a 600ms delay creates a feeling of flow.

**Animation**: Spring-physics on all interactive elements (stiffness: 300, damping: 30). Timeline nodes use a radial fill animation. Score rings on results animate with a 2s ease-in-out sweep. Section transitions use a 400ms slide-up with slight scale (0.98 → 1.0).

**Typography System**: Display: "Space Grotesk" for headlines, scores, and section titles (geometric, modern). Body: "Plus Jakarta Sans" for all body text and choice labels. Score numbers use "Space Grotesk" at 80px+ with tabular figures.

</idea>
<probability>0.05</probability>
<text>Kinetic, progress-driven interface with timeline rail, vivid teal-coral accents, and momentum-based animations.</text>
</response>

---

## Selected Approach: Idea 1 — "Warm Clarity"

I'm going with the **Warm Clarity** approach because it best aligns with the brand's core values:

- **Supportive, non-judgmental tone** → warm earth tones and organic shapes feel safe, not clinical
- **"This is clarity, not a test"** → the breathing room and progressive disclosure reinforce that this is a reflective experience
- **Trust and professionalism** → the Scandinavian restraint signals competence without being cold
- **JustAskAVA's positioning** → warm, human, skilled support — the design should feel like the AVA experience itself

### Design Tokens Summary
- **Background**: Warm cream `#FAF7F2` / `oklch(0.975 0.008 80)`
- **Primary (CTA/Action)**: Deep forest green `#1B4332` / `oklch(0.32 0.06 160)`
- **Accent**: Soft terracotta `#C4704B` / `oklch(0.60 0.12 50)`
- **Text**: Charcoal `#2D2D2D` / `oklch(0.25 0.005 80)`
- **Card BG**: Soft white `#FFFDF9` / `oklch(0.995 0.004 80)`
- **Muted**: Warm gray `#A89F91` / `oklch(0.70 0.02 75)`
- **Fonts**: Fraunces (display/headlines) + DM Sans (body)
- **Radius**: 12px (soft, approachable)
- **Animations**: 400ms ease-out fades, spring-physics progress
