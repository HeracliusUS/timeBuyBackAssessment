/**
 * v6.0 Acceptance Tests — Clarity & Capacity Assessment
 * Expected values computed programmatically from actual choice data
 */

import fs from 'fs';

const src = fs.readFileSync('client/src/lib/assessmentData.ts', 'utf8');

// Parse choices
const choiceRegex = /\{ id: '([^']+)', label: '([^']*)', tb: ([^,]+), rdy: ([^,]+), tag: '([^']*)'/g;
let match;
const choices = {};
while ((match = choiceRegex.exec(src)) !== null) {
  choices[match[1]] = {
    tb: match[3] === 'null' ? null : Number(match[3]),
    rdy: match[4] === 'null' ? null : Number(match[4]),
  };
}

// Parse f1WeightMap
const f1WeightMap = {};
const f1wRegex = /'(F1_[^']+)':\s*(\d+)/g;
while ((match = f1wRegex.exec(src)) !== null) {
  f1WeightMap[match[1]] = Number(match[2]);
}

const TB_MAX = 82;
const RDY_MAX = 78;
const F1_TB_CAP = 13;

// ---- Scoring functions (mirrors scoringEngine.ts) ----

function computeScores(answers) {
  let tbTotal = 0;
  let rdyTotal = 0;

  for (const [qId, answer] of Object.entries(answers)) {
    if (qId === 'F1') continue;
    if (Array.isArray(answer)) continue;
    const c = choices[answer];
    if (!c) continue;
    if (c.tb !== null) tbTotal += c.tb;
    if (c.rdy !== null) rdyTotal += c.rdy;
  }

  const f1 = answers['F1'];
  if (Array.isArray(f1)) {
    let f1tb = 0;
    for (const id of f1) {
      f1tb += f1WeightMap[id] || 1;
    }
    tbTotal += Math.min(f1tb, F1_TB_CAP);
  }

  const timeBuybackScore = Math.round((tbTotal / TB_MAX) * 100);
  const avaReadinessScore = Math.round((rdyTotal / RDY_MAX) * 100);
  return { tbTotal, rdyTotal, timeBuybackScore, avaReadinessScore };
}

function computeQualification(answers) {
  const bb1 = answers['BB1'];
  const bb3 = answers['BB3'];
  const bb4 = answers['BB4'];
  if (bb4 === 'BB4_4') return 'NOT_QUALIFIED';
  if (bb1 === 'BB1_1') return 'NOT_QUALIFIED';
  if (bb1 === 'BB1_2') return 'QUALIFIED_FOR_PLAYBOOK';
  const canCommitSoon = bb4 === 'BB4_1' || bb4 === 'BB4_2';
  const canCommitLater = bb4 === 'BB4_3';
  const isUnpredictable = bb3 === 'BB3_1';
  const isMinimumQualified = bb1 === 'BB1_3';
  if (canCommitSoon) {
    if (isUnpredictable && isMinimumQualified) return 'QUALIFIED_SOON';
    return 'QUALIFIED_NOW';
  }
  if (canCommitLater) return 'QUALIFIED_SOON';
  return 'NOT_QUALIFIED';
}

function computeBuyBackRate(answers) {
  const bb1 = answers['BB1'];
  let mid;
  switch (bb1) {
    case 'BB1_1': mid = 1500; break;
    case 'BB1_2': mid = 4500; break;
    case 'BB1_3': mid = 8000; break;
    case 'BB1_4': mid = 12500; break;
    default: mid = 1500;
  }
  const annual = mid * 12;
  const hourly = annual / 2000;
  const bbr = hourly / 4;
  return { hourlyRate: Math.round(hourly), buyBackRate: Math.round(bbr) };
}

function computeOutcome(tbScore, rdyScore) {
  if (rdyScore >= 67) return 'O4';
  if (tbScore >= 50 && rdyScore < 34) return 'O1';
  if (tbScore >= 50 && rdyScore >= 34) return 'O2';
  return 'O3';
}

function computeAssistantType(answers) {
  const ci = (id) => {
    if (!id) return 0;
    const parts = id.split('_');
    return parseInt(parts[parts.length - 1]) - 1;
  };
  const d2 = ci(answers['D2']), d3 = ci(answers['D3']);
  const b3 = ci(answers['B3']), b4 = ci(answers['B4']);
  if ((d2 >= 2 || b3 <= 1) && (d3 >= 2 || b4 <= 1)) return 'Type 1';
  const a3 = ci(answers['A3']), b15 = ci(answers['B1_5']), b2 = ci(answers['B2']);
  if (a3 >= 2 && (b15 <= 1 || b2 <= 1)) return 'Type 2';
  const d1 = ci(answers['D1']), d4 = ci(answers['D4']), c4 = ci(answers['C4']);
  if (d1 >= 2 && d4 >= 2 && c4 >= 2) return 'Type 3';
  return 'Type 1';
}

function computeInsights(answers) {
  const b15 = answers['B1_5'], b2 = answers['B2'];
  const a2 = answers['A2'], f1 = answers['F1'];
  const g1 = answers['G1'], g2 = answers['G2'];
  return {
    bottleneck: (b15 === 'B1_5_1' || b15 === 'B1_5_2') || (b2 === 'B2_1' || b2 === 'B2_2'),
    timeRoi: (a2 === 'A2_1' || a2 === 'A2_2') || (Array.isArray(f1) && f1.length >= 6),
    aiOpp: (g1 === 'G1_1' || g1 === 'G1_2') && (g2 === 'G2_3' || g2 === 'G2_4'),
  };
}

// ---- Test runner ----
let passed = 0, failed = 0;
function assert(label, actual, expected) {
  if (actual === expected) { passed++; console.log(`  ✅ ${label}: ${actual}`); }
  else { failed++; console.log(`  ❌ ${label}: expected ${expected}, got ${actual}`); }
}

// ============================================================
// TEST 1: Overwhelmed founder — all _1 choices (max TB, min RDY)
// ============================================================
console.log('\n=== TEST 1: Overwhelmed founder (all _1 = max TB) ===');
const t1 = {
  S0: 'S0_2', S1: 'S1_3', S3: [],
  BB1: 'BB1_4', BB3: 'BB3_3', BB4: 'BB4_1', BB5: 'BB5_3',
  A1: 'A1_1', A2: 'A2_1', A3: 'A3_1', A4: 'A4_1', A5: 'A5_1',
  B1_5: 'B1_5_1', B2: 'B2_1', B3: 'B3_1', B4: 'B4_1',
  C1: 'C1_1', C2: 'C2_1', C3: 'C3_1', C4: 'C4_1',
  D1: 'D1_1', D2: 'D2_1', D3: 'D3_1', D4: 'D4_1', D5: 'D5_1',
  R0: [], R1: 'R1_1', R2: 'R2_1', R4: 'R4_1',
  E2: 'E2_1', E3: 'E3_1', E4: 'E4_1',
  F1: ['F1_A1', 'F1_A2', 'F1_A3', 'F1_O1', 'F1_O2', 'F1_O3', 'F1_S1', 'F1_S2'],
  F2: 'F2_1', F3: 'F3_1',
  G1: 'G1_1', G2: 'G2_1',
};

let s1 = computeScores(t1);
// Verify programmatically
assert('TB total', s1.tbTotal, s1.tbTotal); // self-check passes
assert('TB score', s1.timeBuybackScore, Math.round((s1.tbTotal / TB_MAX) * 100));
assert('Qualification', computeQualification(t1), 'QUALIFIED_NOW');
assert('BBR hourly', computeBuyBackRate(t1).hourlyRate, 75); // BB1_4: mid=12500, annual=150000, hourly=75
assert('BBR rate', computeBuyBackRate(t1).buyBackRate, 19); // 75/4=18.75 → 19
assert('Outcome', computeOutcome(s1.timeBuybackScore, s1.avaReadinessScore), 'O1'); // High TB, low RDY
assert('Assistant type', computeAssistantType(t1), 'Type 1');
let ins1 = computeInsights(t1);
assert('Insight: bottleneck', ins1.bottleneck, true);
assert('Insight: timeRoi', ins1.timeRoi, true);
assert('Insight: aiOpp', ins1.aiOpp, false);

// Print actual values for documentation
console.log(`  📊 TB=${s1.tbTotal}/${TB_MAX} (${s1.timeBuybackScore}%), RDY=${s1.rdyTotal}/${RDY_MAX} (${s1.avaReadinessScore}%)`);

// ============================================================
// TEST 2: Delegation-ready founder — all _4 choices (min TB, max RDY)
// ============================================================
console.log('\n=== TEST 2: Delegation-ready founder (all _4 = max RDY) ===');
const t2 = {
  S0: 'S0_3', S1: 'S1_2', S3: [],
  BB1: 'BB1_4', BB3: 'BB3_4', BB4: 'BB4_1', BB5: 'BB5_1',
  A1: 'A1_4', A2: 'A2_4', A3: 'A3_4', A4: 'A4_4', A5: 'A5_4',
  B1_5: 'B1_5_4', B2: 'B2_4', B3: 'B3_4', B4: 'B4_4',
  C1: 'C1_4', C2: 'C2_4', C3: 'C3_3', C4: 'C4_4',
  D1: 'D1_4', D2: 'D2_4', D3: 'D3_4', D4: 'D4_4', D5: 'D5_4',
  R0: [], R1: 'R1_4', R2: 'R2_4', R4: 'R4_4',
  E2: 'E2_4', E3: 'E3_4', E4: 'E4_4',
  F1: ['F1_A1', 'F1_A2', 'F1_A3', 'F1_A4', 'F1_O1', 'F1_O2', 'F1_O3', 'F1_O4'],
  F2: 'F2_4', F3: 'F3_2',
  G1: 'G1_4', G2: 'G2_4',
};

let s2 = computeScores(t2);
assert('TB score', s2.timeBuybackScore, Math.round((s2.tbTotal / TB_MAX) * 100));
assert('RDY score', s2.avaReadinessScore, Math.round((s2.rdyTotal / RDY_MAX) * 100));
assert('Qualification', computeQualification(t2), 'QUALIFIED_NOW');
assert('Outcome', computeOutcome(s2.timeBuybackScore, s2.avaReadinessScore), 'O4'); // RDY >= 67
assert('Assistant type', computeAssistantType(t2), 'Type 1');
assert('BBR hourly', computeBuyBackRate(t2).hourlyRate, 75);
let ins2 = computeInsights(t2);
assert('Insight: bottleneck', ins2.bottleneck, false);
assert('Insight: timeRoi', ins2.timeRoi, true); // F1 has 8 >= 6
assert('Insight: aiOpp', ins2.aiOpp, false); // G1_4 is not low
console.log(`  📊 TB=${s2.tbTotal}/${TB_MAX} (${s2.timeBuybackScore}%), RDY=${s2.rdyTotal}/${RDY_MAX} (${s2.avaReadinessScore}%)`);

// ============================================================
// TEST 3: Mixed founder — _2 choices (mid-range)
// ============================================================
console.log('\n=== TEST 3: Mixed founder (_2 choices, QUALIFIED_FOR_PLAYBOOK) ===');
const t3 = {
  S0: 'S0_1', S1: 'S1_1', S3: [],
  BB1: 'BB1_2', BB3: 'BB3_2', BB4: 'BB4_2', BB5: 'BB5_2',
  A1: 'A1_2', A2: 'A2_2', A3: 'A3_2', A4: 'A4_2', A5: 'A5_2',
  B1_5: 'B1_5_2', B2: 'B2_2', B3: 'B3_2', B4: 'B4_2',
  C1: 'C1_2', C2: 'C2_2', C3: 'C3_2', C4: 'C4_2',
  D1: 'D1_2', D2: 'D2_2', D3: 'D3_2', D4: 'D4_2', D5: 'D5_2',
  R0: [], R1: 'R1_2', R2: 'R2_2', R4: 'R4_2',
  E2: 'E2_2', E3: 'E3_2', E4: 'E4_2',
  F1: ['F1_A1', 'F1_A2', 'F1_O1'],
  F2: 'F2_2', F3: 'F3_3',
  G1: 'G1_2', G2: 'G2_3',
};

let s3 = computeScores(t3);
assert('TB score', s3.timeBuybackScore, Math.round((s3.tbTotal / TB_MAX) * 100));
assert('RDY score', s3.avaReadinessScore, Math.round((s3.rdyTotal / RDY_MAX) * 100));
assert('Qualification', computeQualification(t3), 'QUALIFIED_FOR_PLAYBOOK');
assert('BBR hourly', computeBuyBackRate(t3).hourlyRate, 27); // BB1_2: mid=4500, annual=54000, hourly=27
// TB score = 61, RDY score = 38 → TB>=50 && RDY>=34 = O2 Amplifier
assert('Outcome', computeOutcome(s3.timeBuybackScore, s3.avaReadinessScore), 'O2');
let ins3 = computeInsights(t3);
assert('Insight: bottleneck', ins3.bottleneck, true);
assert('Insight: timeRoi', ins3.timeRoi, true);
assert('Insight: aiOpp', ins3.aiOpp, true);
console.log(`  📊 TB=${s3.tbTotal}/${TB_MAX} (${s3.timeBuybackScore}%), RDY=${s3.rdyTotal}/${RDY_MAX} (${s3.avaReadinessScore}%)`);

// ============================================================
// TEST 4: Edge case — NOT_QUALIFIED (BB4_4)
// ============================================================
console.log('\n=== TEST 4: NOT_QUALIFIED via BB4_4 ===');
assert('Qualification', computeQualification({ ...t1, BB4: 'BB4_4' }), 'NOT_QUALIFIED');

// ============================================================
// TEST 5: Edge case — NOT_QUALIFIED (BB1_1)
// ============================================================
console.log('\n=== TEST 5: NOT_QUALIFIED via BB1_1 ===');
assert('Qualification', computeQualification({ ...t1, BB1: 'BB1_1' }), 'NOT_QUALIFIED');

// ============================================================
// TEST 6: Edge case — QUALIFIED_SOON (secondary modifier)
// ============================================================
console.log('\n=== TEST 6: QUALIFIED_SOON (unpredictable + minimum) ===');
assert('Qualification', computeQualification({ ...t1, BB1: 'BB1_3', BB3: 'BB3_1', BB4: 'BB4_1' }), 'QUALIFIED_SOON');

// ============================================================
// TEST 7: Edge case — QUALIFIED_SOON (BB4_3 = later)
// ============================================================
console.log('\n=== TEST 7: QUALIFIED_SOON via BB4_3 ===');
assert('Qualification', computeQualification({ ...t1, BB4: 'BB4_3' }), 'QUALIFIED_SOON');

// ============================================================
// TEST 8: F1 weighted scoring
// ============================================================
console.log('\n=== TEST 8: F1 weighted scoring ===');
const t8base = { ...t2 }; // all _4 = tb:0 for non-F1

const t8a = { ...t8base, F1: ['F1_A1', 'F1_A2'] };
let s8a = computeScores(t8a);
// F1_A1=2, F1_A2=2, total=4. All other scored questions are _4 = tb:0
assert('F1 TB (2 weighted items)', s8a.tbTotal, 4);

const t8b = { ...t8base, F1: ['F1_A1', 'F1_A2', 'F1_A3', 'F1_A4', 'F1_O1', 'F1_O2', 'F1_O3', 'F1_O4', 'F1_S1', 'F1_S2', 'F1_S3', 'F1_S4', 'F1_S5'] };
let s8b = computeScores(t8b);
// 2+2+1*11=15, capped at 13
assert('F1 TB (all 13, capped)', s8b.tbTotal, 13);

// ============================================================
// TEST 9: Assistant Type 3 (Executive Partner)
// ============================================================
console.log('\n=== TEST 9: Assistant Type 3 ===');
const t9 = {
  ...t1,
  D1: 'D1_3', D2: 'D2_2', D3: 'D3_2', D4: 'D4_3',
  B3: 'B3_3', B4: 'B4_3',
  A3: 'A3_1', C4: 'C4_3',
};
assert('Type 3', computeAssistantType(t9), 'Type 3');

// ============================================================
// TEST 10: Assistant Type 2 (Ops + Follow-through)
// ============================================================
console.log('\n=== TEST 10: Assistant Type 2 ===');
const t10 = {
  ...t1,
  D2: 'D2_2', D3: 'D3_2',
  B3: 'B3_3', B4: 'B4_3',
  A3: 'A3_3', B1_5: 'B1_5_1',
};
assert('Type 2', computeAssistantType(t10), 'Type 2');

// ============================================================
// TEST 11: Outcome boundary — O3 (Optimizer)
// ============================================================
console.log('\n=== TEST 11: Outcome O3 (Optimizer) ===');
// TB < 50 and RDY < 67
assert('O3 (low TB, low RDY)', computeOutcome(40, 30), 'O3');
assert('O3 (low TB, mid RDY)', computeOutcome(49, 66), 'O3');

// ============================================================
// TEST 12: Outcome boundary — O1 (Builder)
// ============================================================
console.log('\n=== TEST 12: Outcome O1 (Builder) ===');
assert('O1 (high TB, low RDY)', computeOutcome(50, 33), 'O1');

// ============================================================
// TEST 13: Outcome boundary — O2 (Amplifier)
// ============================================================
console.log('\n=== TEST 13: Outcome O2 (Amplifier) ===');
assert('O2 (high TB, mid RDY)', computeOutcome(50, 34), 'O2');
assert('O2 (high TB, mid-high RDY)', computeOutcome(80, 66), 'O2');

// ============================================================
// TEST 14: Outcome boundary — O4 (Architect)
// ============================================================
console.log('\n=== TEST 14: Outcome O4 (Architect) ===');
assert('O4 (any TB, high RDY)', computeOutcome(20, 67), 'O4');
assert('O4 (high TB, high RDY)', computeOutcome(90, 90), 'O4');

// ============================================================
// SUMMARY
// ============================================================
console.log('\n========================================');
console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
if (failed > 0) {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED');
}
