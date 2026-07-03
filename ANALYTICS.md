# Analytics — Time Buy-Back Assessment

How the assessment funnel is instrumented for GA4 + Microsoft Clarity.
See the cross-app design in `../MEASUREMENT-PLAN.md`.

## TL;DR

- Reports to the **same** GA4 property as the marketing site — measurement ID `G-1P3RJJ6LKZ` (was `G-9203NHTHWV`, now retired) — so the site → assessment journey is **one cross-domain funnel**.
- **Microsoft Clarity** project `widbz9cmzl`.
- **Consent Mode v2** US-default granted + opt-out banner.
- Tags + consent default load in `client/index.html`; funnel events are fired from the assessment state machine.

## Architecture

```
client/index.html                     gtag + Consent Mode default + cross-domain linker
client/src/lib/analytics.ts           all event helpers, consent, Clarity, abandonment, attribution
client/src/contexts/AssessmentContext.tsx
        fires assessment_started, assessment_step_view, assessment_step_complete (timing),
        assessment_step_back, assessment_completed; registers abandonment tracking
client/src/components/AssessmentForm.tsx   assessment_validation_error (incomplete step)
client/src/components/ResultsPage.tsx      results_viewed, generate_lead, download_results,
        results_cta_click, assessment_retaken + Clarity tags
client/src/components/WelcomePage.tsx      starts the flow (start_assessment_clicked retained)
client/src/App.tsx                         page_landed, Clarity init, consent banner
```

The funnel is a **state machine** (`view` + `currentSectionIndex`), not routed pages. Step events are fired from the context so they're emitted exactly once on each transition — never on re-render. Step timing uses a `stepEnteredAt` ref; total time uses a `startedAt` ref.

## Funnel & section map

10 sections, fired with `step_id` / `step_index` / `step_name`:

`1:S Quick Snapshot · 2:A Your Time Reality · 3:B Bottleneck Patterns · 4:C Letting Go · 5:D Decision Rights · 6:E Access & Systems Readiness · 7:F What You're Paying Yourself To Do · 8:R Success Predictors · 9:G AI & Automation Readiness · 10:BB Investment Readiness`

## Event catalog (this app)

| Event | Fires from | Key params |
|-------|-----------|-----------|
| `page_landed` | `App.tsx` on load | referrer, utm_* |
| `assessment_started` | context (welcome → first section) | resumed, entry_step_id, utm_* |
| `assessment_step_view` | context (each active section) | step_id, step_index, step_name, question_count |
| `assessment_step_complete` | context (`goNext`) | step_id, step_index, step_name, **time_on_step**, answers_count |
| `assessment_step_back` | context (`goPrev`) | from_step_id, to_step_id, from_index, to_index |
| `assessment_validation_error` | `AssessmentForm` (Next while incomplete) | step_id, step_index, missing_count |
| `assessment_abandon` | `analytics.initAbandonmentTracking` (tab hidden, beacon) | last_step_id, last_step_index, furthest_index, answered_count, time_in_assessment |
| `assessment_completed` | context (last section) | total_steps, time_in_assessment, time_buyback_score, readiness_score, qualification_status, outcome_id |
| `results_viewed` | `ResultsPage` mount | time_buyback_score, readiness_score, qualification_status, archetype |
| `generate_lead` | `ResultsPage` email capture success | method:assessment, context, qualification_status, utm_* |
| `download_results` | `ResultsPage` download/print | format, qualification_status |
| `results_cta_click` | `ResultsPage` primary/secondary CTA | cta_id, cta_text, qualification_status, link_url |
| `assessment_retaken` | `ResultsPage` retake | previous_time_buyback_score, previous_readiness_score |

Conversions (mark as **key events** in GA4): `assessment_started`, `assessment_completed`, `generate_lead`. Drop-off and completion rate are derived in GA4's **Funnel Exploration** (`assessment_started` → `assessment_step_complete` ×10 → `assessment_completed`).

## How to add / change a funnel event

All helpers live in `client/src/lib/analytics.ts` and are typed. To add a step-level signal, call the relevant helper from the context transition (so it fires once). Example:
```ts
import { trackStepComplete } from '@/lib/analytics';
trackStepComplete({ step_id, step_index, step_name, time_on_step, answers_count });
```
Keep names snake_case and reuse existing params. Update this catalog and `../MEASUREMENT-PLAN.md` when you add events.

## Consent & Clarity

Consent default (granted, US) is set in `index.html` before `gtag('config')`, honoring a prior `localStorage.jaa_consent` choice. `ConsentBanner` updates consent on choice. Clarity is started from `App.tsx` unless the visitor opted out, and tagged on the results page with `qualification_status` + `assessment_outcome` so you can filter recordings by where users land.

## Cross-domain attribution

`index.html` sets `linker.domains = [justaskava.ai, justaskava.com]` with `accept_incoming:true`, so the `_gl` param from the marketing site is accepted and the GA4 session continues. Forwarded UTMs are captured by `captureAttribution()` (called in `trackPageLanded`) and attached to `generate_lead`. **Recommended:** also include attribution in the Notion lead payload in `ResultsPage` (`getAttribution()`), so the CRM has campaign data.

## Security note (pre-existing, not analytics)

`server/index.ts` contains a hardcoded Notion token + database ID, and the Notion endpoint is hardcoded in `ResultsPage.tsx`. Move these to environment variables before broader release, then rotate the token (it's in git history). Deliberately deferred on 2026-07-03. (Flagged because it sits next to lead capture; the GA4/Clarity IDs are public by design and safe to commit.)

## QA checklist (run after deploy / `pnpm dev`)

Open with `?analytics_debug=1` and GA4 **DebugView**:

- [ ] Land via a link carrying `?utm_source=test&_gl=…` → `page_landed` with utm_source; DebugView shows the **same session** as the marketing site (cross-domain works).
- [ ] Start → `assessment_started` (`resumed:false`); each section shows `assessment_step_view`.
- [ ] Advance a section → `assessment_step_complete` with a realistic `time_on_step`.
- [ ] Back button → `assessment_step_back`.
- [ ] Click "Continue" with a required question blank → `assessment_validation_error` with `missing_count`.
- [ ] Switch tabs / close mid-funnel → `assessment_abandon` (once) with `furthest_index`.
- [ ] Finish → `assessment_completed` with scores + `qualification_status`; `results_viewed` on the results screen.
- [ ] Submit email → `generate_lead{method:assessment}`; download/print → `download_results`.
- [ ] Results CTAs → `results_cta_click`; retake → `assessment_retaken`.
- [ ] Confirm there is **no** traffic to the old `G-9203NHTHWV` stream.
