# v6.0 Analysis: New vs Already Done

## Already Done in v5 (no changes needed):
- S2 deleted ✅
- BB renamed to "Investment Readiness" ✅
- BB1+BB2 merged to BB1_v2 ✅
- A5 burnout added ✅
- Section G added ✅
- Weighted F1 scoring ✅
- 4 outcomes ✅
- QUALIFIED_FOR_PLAYBOOK ✅
- "Design Your Support Plan" CTA ✅
- AI Opportunity insight ✅
- Lead capture modal on download ✅
- "Executive Assistant" terminology ✅

## NEW in v6 (must implement):
1. **Delete B1** ("Decisions stall when you're unavailable") — currently exists
2. **Add B1.5** — "In the last quarter, have admin/coordination tasks ever delayed an important decision or initiative?" with scoring (Yes frequently: TB:3/RDY:0), (Yes a few times: TB:2/RDY:1), (Rarely: TB:1/RDY:2), (No: TB:0/RDY:3)
3. **Restructure F1** into 3 categories: Administrative Support, Operational Support, Strategic Support
4. **Delete R3** ("How clear are you on what you do NOT want delegated?")
5. **Add R0** — Dynamic bridge question populated from F1 selections, multi_select maxSelect:3, NOT scored
6. **WelcomePage**: Change "5-minute" to "7-minute"

## Audit Fixes (from v5 audit, still pending):
- H1: Tier labels → "Guided Partnership", "Collaborative Partnership", "Strategic Partnership"
- H2: Add hourly rate comparison narrative
- H3: Add Print button to Results page
- M1: Update <title> in index.html
- L1: Add version column to CSV export

## Impact on scoring:
- Removing B1 (max TB:3, RDY:3) → TB_MAX drops by 3, RDY_MAX drops by 3
- Adding B1.5 (max TB:3, RDY:3) → TB_MAX goes back up by 3, RDY_MAX back up by 3
- NET EFFECT on B section: TB_MAX unchanged, RDY_MAX unchanged (same max values)
- Removing R3 (max RDY:3) → RDY_MAX drops by 3
- Adding R0 (NOT scored) → no change
- NET: TB_MAX stays 79, RDY_MAX drops from 81 to 78

## F1 restructure impact:
- Need to define the 3 categories and their items
- Need to update f1WeightMap for new choice IDs
- Need to update taskOffloadPriority for new choice IDs
- F1_TB_CAP may change depending on new structure

## R0 dynamic population:
- R0 choices come from user's F1 selections
- This requires special handling in AssessmentForm — dynamically generate choices
- R0 is NOT scored, so no impact on TB_MAX/RDY_MAX
- Need to handle the case where user hasn't answered F1 yet (R section comes after F)
