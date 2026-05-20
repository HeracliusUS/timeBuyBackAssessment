# v7.0 Update — Final Optimization

## Step 1: Restructure Assessment Flow
- [ ] 1a. Move BB section from position 2 to position 10 (after G, before results). New order: S → A → B → C → D → R → E → F → G → BB
- [ ] 1b. Delete BB5 ("If you reclaimed 10 hours/week...") — F3 covers this

## Step 2: Refine and Consolidate Questions
- [ ] 2a. Rename B1_5 → B2 (admin tasks delaying decisions) for logical flow
- [ ] 2b. Remove F1 maxSelect: 8 constraint — allow all selections, scoring cap still applies
- [ ] 2c. Add R0 implementation note: must dynamically display only F1-selected tasks; omit if not feasible

## Step 3: Code Changes
- [ ] 3a. Update assessmentData.ts: section order, BB5 deletion, B2 rename, F1 maxSelect removal
- [ ] 3b. Update scoringEngine.ts: adjust for BB5 removal, B2 rename
- [ ] 3c. Update AssessmentForm: section icons for new order
- [ ] 3d. Update InternalProfile: B2 field name, BB5 removal
- [ ] 3e. Recalculate TB_MAX and RDY_MAX after BB5 removal

## Step 4: Verify
- [ ] 4a. Run TypeScript check — zero errors
- [ ] 4b. Run acceptance tests — all pass
- [ ] 4c. Rewrite master reference document as v7.0
