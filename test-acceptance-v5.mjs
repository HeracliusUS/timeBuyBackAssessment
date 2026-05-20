// ============================================================
// v5.0 Acceptance Tests — 3 end-to-end scenarios
// TB_MAX = 79, RDY_MAX = 81
// ============================================================

// Inline the scoring logic for testing (same as scoringEngine.ts)
const TB_MAX = 79;
const RDY_MAX = 81;
const F1_TB_CAP = 10;

const f1WeightMap = {
  F1_1: 2, // Inbox
  F1_2: 2, // Calendar
  F1_3: 1, F1_4: 1, F1_5: 1, F1_6: 1, F1_7: 1, F1_8: 1, F1_9: 1, F1_10: 1,
};

// Choice TB/RDY values (from assessmentData.ts)
const choiceValues = {
  // Section A — Time Reality (5 questions)
  A1_1: { tb: 3, rdy: 0 }, A1_2: { tb: 2, rdy: 1 }, A1_3: { tb: 1, rdy: 2 }, A1_4: { tb: 0, rdy: 3 },
  A2_1: { tb: 3, rdy: 0 }, A2_2: { tb: 2, rdy: 1 }, A2_3: { tb: 1, rdy: 2 }, A2_4: { tb: 0, rdy: 3 },
  A3_1: { tb: 3, rdy: 0 }, A3_2: { tb: 2, rdy: 1 }, A3_3: { tb: 1, rdy: 2 }, A3_4: { tb: 0, rdy: 3 },
  A4_1: { tb: 3, rdy: 0 }, A4_2: { tb: 2, rdy: 1 }, A4_3: { tb: 1, rdy: 2 }, A4_4: { tb: 0, rdy: 3 },
  A5_1: { tb: 3, rdy: 0 }, A5_2: { tb: 2, rdy: 1 }, A5_3: { tb: 1, rdy: 2 }, A5_4: { tb: 0, rdy: 3 },
  // Section B — Bottleneck Patterns (4 questions)
  B1_1: { tb: 3, rdy: 0 }, B1_2: { tb: 2, rdy: 1 }, B1_3: { tb: 1, rdy: 2 }, B1_4: { tb: 0, rdy: 3 },
  B2_1: { tb: 3, rdy: 0 }, B2_2: { tb: 2, rdy: 1 }, B2_3: { tb: 1, rdy: 2 }, B2_4: { tb: 0, rdy: 3 },
  B3_1: { tb: 3, rdy: 0 }, B3_2: { tb: 2, rdy: 1 }, B3_3: { tb: 1, rdy: 2 }, B3_4: { tb: 0, rdy: 3 },
  B4_1: { tb: 3, rdy: 0 }, B4_2: { tb: 2, rdy: 1 }, B4_3: { tb: 1, rdy: 2 }, B4_4: { tb: 0, rdy: 3 },
  // Section C — Letting Go (4 questions, C3 unscored)
  C1_1: { tb: 3, rdy: 0 }, C1_2: { tb: 2, rdy: 1 }, C1_3: { tb: 1, rdy: 2 }, C1_4: { tb: 0, rdy: 3 },
  C2_1: { tb: 3, rdy: 0 }, C2_2: { tb: 2, rdy: 1 }, C2_3: { tb: 1, rdy: 2 }, C2_4: { tb: 0, rdy: 3 },
  C4_1: { tb: 3, rdy: 0 }, C4_2: { tb: 2, rdy: 1 }, C4_3: { tb: 1, rdy: 2 }, C4_4: { tb: 0, rdy: 3 },
  // Section D — Decision Rights (5 questions)
  D1_1: { tb: 3, rdy: 0 }, D1_2: { tb: 2, rdy: 1 }, D1_3: { tb: 1, rdy: 2 }, D1_4: { tb: 0, rdy: 3 },
  D2_1: { tb: 3, rdy: 0 }, D2_2: { tb: 2, rdy: 1 }, D2_3: { tb: 1, rdy: 2 }, D2_4: { tb: 0, rdy: 3 },
  D3_1: { tb: 3, rdy: 0 }, D3_2: { tb: 2, rdy: 1 }, D3_3: { tb: 1, rdy: 2 }, D3_4: { tb: 0, rdy: 3 },
  D4_1: { tb: 3, rdy: 0 }, D4_2: { tb: 2, rdy: 1 }, D4_3: { tb: 1, rdy: 2 }, D4_4: { tb: 0, rdy: 3 },
  D5_1: { tb: 3, rdy: 1 }, D5_2: { tb: 2, rdy: 2 }, D5_3: { tb: 1, rdy: 3 }, D5_4: { tb: 0, rdy: 3 },
  // Section R — Readiness Predictors (4 questions, RDY-only)
  R1_1: { tb: 0, rdy: 3 }, R1_2: { tb: 0, rdy: 2 }, R1_3: { tb: 0, rdy: 1 }, R1_4: { tb: 0, rdy: 0 },
  R2_1: { tb: 0, rdy: 0 }, R2_2: { tb: 0, rdy: 1 }, R2_3: { tb: 0, rdy: 2 }, R2_4: { tb: 0, rdy: 3 },
  R3_1: { tb: 0, rdy: 0 }, R3_2: { tb: 0, rdy: 1 }, R3_3: { tb: 0, rdy: 2 }, R3_4: { tb: 0, rdy: 3 },
  R4_1: { tb: 0, rdy: 3 }, R4_2: { tb: 0, rdy: 2 }, R4_3: { tb: 0, rdy: 0 },
  // Section E — Access & Systems (3 questions)
  E2_1: { tb: 3, rdy: 0 }, E2_2: { tb: 2, rdy: 1 }, E2_3: { tb: 1, rdy: 2 }, E2_4: { tb: 0, rdy: 3 },
  E3_1: { tb: 3, rdy: 0 }, E3_2: { tb: 2, rdy: 1 }, E3_3: { tb: 1, rdy: 2 }, E3_4: { tb: 0, rdy: 3 },
  E4_1: { tb: 3, rdy: 0 }, E4_2: { tb: 2, rdy: 1 }, E4_3: { tb: 1, rdy: 2 }, E4_4: { tb: 0, rdy: 3 },
  // Section F — F2 scored (F1 weighted, F3 unscored)
  F2_1: { tb: 3, rdy: 0 }, F2_2: { tb: 2, rdy: 1 }, F2_3: { tb: 1, rdy: 1 }, F2_4: { tb: 0, rdy: 3 },
  // Section G — AI Readiness (2 questions)
  G1_1: { tb: 3, rdy: 0 }, G1_2: { tb: 2, rdy: 1 }, G1_3: { tb: 1, rdy: 2 }, G1_4: { tb: 0, rdy: 3 },
  G2_1: { tb: 3, rdy: 0 }, G2_2: { tb: 2, rdy: 1 }, G2_3: { tb: 1, rdy: 2 }, G2_4: { tb: 0, rdy: 3 },
};

function computeScores(answers) {
  let tbTotal = 0;
  let rdyTotal = 0;

  // Scored single-select questions
  const singleSelectQs = [
    'A1', 'A2', 'A3', 'A4', 'A5',
    'B1', 'B2', 'B3', 'B4',
    'C1', 'C2', 'C4',
    'D1', 'D2', 'D3', 'D4', 'D5',
    'R1', 'R2', 'R3', 'R4',
    'E2', 'E3', 'E4',
    'F2',
    'G1', 'G2',
  ];

  for (const qId of singleSelectQs) {
    const answer = answers[qId];
    if (!answer || typeof answer !== 'string') continue;
    const vals = choiceValues[answer];
    if (vals) {
      tbTotal += vals.tb;
      rdyTotal += vals.rdy;
    }
  }

  // F1 weighted multi-select
  const f1 = answers['F1'];
  if (Array.isArray(f1)) {
    let weightedSum = 0;
    for (const choiceId of f1) {
      weightedSum += f1WeightMap[choiceId] || 1;
    }
    tbTotal += Math.min(F1_TB_CAP, weightedSum);
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
  return { monthlyMid: mid, hourlyRate: Math.round(hourly), buyBackRate: Math.round(bbr) };
}

function computeOutcome(tb, rdy) {
  if (rdy >= 67) return 'The Architect';
  if (tb >= 50 && rdy < 34) return 'The Builder';
  if (tb >= 50 && rdy >= 34) return 'The Amplifier';
  return 'The Optimizer';
}

function computeInsights(answers) {
  const b1 = answers['B1'];
  const b2 = answers['B2'];
  const a2 = answers['A2'];
  const f1 = answers['F1'];
  const g1 = answers['G1'];
  const g2 = answers['G2'];

  const bottleneck = (b1 === 'B1_1' || b1 === 'B1_2') || (b2 === 'B2_1' || b2 === 'B2_2');
  const timeRoi = (a2 === 'A2_1' || a2 === 'A2_2') || (Array.isArray(f1) && f1.length >= 6);
  const aiOpp = (g1 === 'G1_1' || g1 === 'G1_2') && (g2 === 'G2_3' || g2 === 'G2_4');

  return { bottleneck, timeRoi, aiOpp };
}

// ============================================================
// TEST CASES
// ============================================================
let passed = 0;
let failed = 0;

function assert(label, actual, expected) {
  if (actual === expected) {
    console.log(`  ✅ ${label}: ${actual}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}: expected ${expected}, got ${actual}`);
    failed++;
  }
}

// ── Test 1: "The Overwhelmed Founder" ──
// All _1 answers (max TB, min RDY), $10k+ take-home, commit now
// F1 = inbox + calendar + travel + docs + research + social + support (7 items)
console.log('\n═══ Test 1: The Overwhelmed Founder ═══');
const t1 = {
  S0: 'S0_1', S1: 'S1_1',
  BB1: 'BB1_4', BB3: 'BB3_4', BB4: 'BB4_1', BB5: 'BB5_1',
  A1: 'A1_1', A2: 'A2_1', A3: 'A3_1', A4: 'A4_1', A5: 'A5_1',
  B1: 'B1_1', B2: 'B2_1', B3: 'B3_1', B4: 'B4_1',
  C1: 'C1_1', C2: 'C2_1', C3: 'C3_1', C4: 'C4_1',
  D1: 'D1_1', D2: 'D2_1', D3: 'D3_1', D4: 'D4_1', D5: 'D5_1',
  R1: 'R1_4', R2: 'R2_1', R3: 'R3_1', R4: 'R4_3',
  E2: 'E2_1', E3: 'E3_1', E4: 'E4_1',
  F1: ['F1_1', 'F1_2', 'F1_3', 'F1_4', 'F1_5', 'F1_6', 'F1_7'],
  F2: 'F2_1', F3: 'F3_1',
  G1: 'G1_1', G2: 'G2_1',
};

// TB calculation:
// A: 3+3+3+3+3 = 15
// B: 3+3+3+3 = 12
// C: 3+3+3 = 9 (C3 unscored)
// D: 3+3+3+3+3 = 15
// R: 0+0+0+0 = 0
// E: 3+3+3 = 9
// F1: 2+2+1+1+1+1+1 = 9 (capped at 10, so 9), F2: 3 => F total = 12
// G: 3+3 = 6
// TB_total = 15+12+9+15+0+9+12+6 = 78
const t1Scores = computeScores(t1);
console.log(`  Raw TB: ${t1Scores.tbTotal}, Raw RDY: ${t1Scores.rdyTotal}`);
assert('TB total', t1Scores.tbTotal, 78);
assert('RDY total', t1Scores.rdyTotal, 1); // D5_1 gives rdy=1, all others give rdy=0
assert('TB score', t1Scores.timeBuybackScore, Math.round((78/79)*100)); // 99
assert('RDY score', t1Scores.avaReadinessScore, Math.round((1/81)*100)); // 1

assert('Qualification', computeQualification(t1), 'QUALIFIED_NOW');
const t1BBR = computeBuyBackRate(t1);
assert('Hourly rate', t1BBR.hourlyRate, 75); // 12500*12/2000 = 75
assert('Buy Back Rate', t1BBR.buyBackRate, 19); // 75/4 = 18.75 -> 19
assert('Outcome', computeOutcome(t1Scores.timeBuybackScore, t1Scores.avaReadinessScore), 'The Builder');

const t1Insights = computeInsights(t1);
assert('Bottleneck insight', t1Insights.bottleneck, true);
assert('Time ROI insight', t1Insights.timeRoi, true);
assert('AI Opportunity insight', t1Insights.aiOpp, false); // G2_1 = Skeptical, not open

// ── Test 2: "The Ready Delegator" ──
// All _4 answers (min TB, max RDY), $6k-$10k, commit 60-90 days
// F1 = inbox + calendar (2 items)
console.log('\n═══ Test 2: The Ready Delegator ═══');
const t2 = {
  S0: 'S0_3', S1: 'S1_3',
  BB1: 'BB1_3', BB3: 'BB3_3', BB4: 'BB4_3', BB5: 'BB5_4',
  A1: 'A1_4', A2: 'A2_4', A3: 'A3_4', A4: 'A4_4', A5: 'A5_4',
  B1: 'B1_4', B2: 'B2_4', B3: 'B3_4', B4: 'B4_4',
  C1: 'C1_4', C2: 'C2_4', C3: 'C3_4', C4: 'C4_4',
  D1: 'D1_4', D2: 'D2_4', D3: 'D3_4', D4: 'D4_4', D5: 'D5_4',
  R1: 'R1_1', R2: 'R2_4', R3: 'R3_4', R4: 'R4_1',
  E2: 'E2_4', E3: 'E3_4', E4: 'E4_4',
  F1: ['F1_1', 'F1_2'],
  F2: 'F2_4', F3: 'F3_4',
  G1: 'G1_4', G2: 'G2_4',
};

// TB calculation:
// A: 0*5 = 0
// B: 0*4 = 0
// C: 0*3 = 0
// D: 0+0+0+0+0 = 0
// R: 0*4 = 0
// E: 0*3 = 0
// F1: 2+2 = 4 (under cap), F2: 0 => F total = 4
// G: 0+0 = 0
// TB_total = 0+0+0+0+0+0+4+0 = 4
// RDY calculation:
// A: 3*5 = 15
// B: 3*4 = 12
// C: 3*3 = 9
// D: 3+3+3+3+3 = 15
// R: 3+3+3+3 = 12
// E: 3*3 = 9
// F2: 3 => 3
// G: 3+3 = 6
// RDY_total = 15+12+9+15+12+9+3+6 = 81
const t2Scores = computeScores(t2);
console.log(`  Raw TB: ${t2Scores.tbTotal}, Raw RDY: ${t2Scores.rdyTotal}`);
assert('TB total', t2Scores.tbTotal, 4);
assert('RDY total', t2Scores.rdyTotal, 81);
assert('TB score', t2Scores.timeBuybackScore, Math.round((4/79)*100)); // 5
assert('RDY score', t2Scores.avaReadinessScore, Math.round((81/81)*100)); // 100

assert('Qualification', computeQualification(t2), 'QUALIFIED_SOON'); // $6k-$10k + 60-90 days
const t2BBR = computeBuyBackRate(t2);
assert('Hourly rate', t2BBR.hourlyRate, 48); // 8000*12/2000 = 48
assert('Buy Back Rate', t2BBR.buyBackRate, 12); // 48/4 = 12
assert('Outcome', computeOutcome(t2Scores.timeBuybackScore, t2Scores.avaReadinessScore), 'The Architect');

const t2Insights = computeInsights(t2);
assert('Bottleneck insight', t2Insights.bottleneck, false);
assert('Time ROI insight', t2Insights.timeRoi, false);
assert('AI Opportunity insight', t2Insights.aiOpp, false); // G1_4 = integrated, not low adoption

// ── Test 3: "The Playbook Path" ──
// Mixed answers, $3k-$6k take-home (PLAYBOOK), experimenting with AI + open to it
console.log('\n═══ Test 3: The Playbook Path ═══');
const t3 = {
  S0: 'S0_2', S1: 'S1_2',
  BB1: 'BB1_2', BB3: 'BB3_2', BB4: 'BB4_2', BB5: 'BB5_3',
  A1: 'A1_2', A2: 'A2_2', A3: 'A3_2', A4: 'A4_2', A5: 'A5_2',
  B1: 'B1_2', B2: 'B2_2', B3: 'B3_2', B4: 'B4_2',
  C1: 'C1_2', C2: 'C2_2', C3: 'C3_2', C4: 'C4_2',
  D1: 'D1_2', D2: 'D2_2', D3: 'D3_2', D4: 'D4_2', D5: 'D5_2',
  R1: 'R1_2', R2: 'R2_2', R3: 'R3_2', R4: 'R4_2',
  E2: 'E2_2', E3: 'E3_2', E4: 'E4_2',
  F1: ['F1_1', 'F1_2', 'F1_3', 'F1_4'],
  F2: 'F2_2', F3: 'F3_2',
  G1: 'G1_2', G2: 'G2_3',
};

// TB calculation:
// A: 2*5 = 10
// B: 2*4 = 8
// C: 2*3 = 6
// D: 2+2+2+2+2 = 10
// R: 0*4 = 0
// E: 2*3 = 6
// F1: 2+2+1+1 = 6 (under cap), F2: 2 => F total = 8
// G: 2+1 = 3
// TB_total = 10+8+6+10+0+6+8+3 = 51
// RDY calculation:
// A: 1*5 = 5
// B: 1*4 = 4
// C: 1*3 = 3
// D: 1+1+1+1+2 = 6
// R: 2+1+1+2 = 6
// E: 1*3 = 3
// F2: 1 => 1
// G: 1+2 = 3
// RDY_total = 5+4+3+6+6+3+1+3 = 31
const t3Scores = computeScores(t3);
console.log(`  Raw TB: ${t3Scores.tbTotal}, Raw RDY: ${t3Scores.rdyTotal}`);
assert('TB total', t3Scores.tbTotal, 51);
assert('RDY total', t3Scores.rdyTotal, 31);
assert('TB score', t3Scores.timeBuybackScore, Math.round((51/79)*100)); // 65
assert('RDY score', t3Scores.avaReadinessScore, Math.round((31/81)*100)); // 38

assert('Qualification', computeQualification(t3), 'QUALIFIED_FOR_PLAYBOOK');
const t3BBR = computeBuyBackRate(t3);
assert('Hourly rate', t3BBR.hourlyRate, 27); // 4500*12/2000 = 27
assert('Buy Back Rate', t3BBR.buyBackRate, 7); // 27/4 = 6.75 -> 7
assert('Outcome', computeOutcome(t3Scores.timeBuybackScore, t3Scores.avaReadinessScore), 'The Amplifier');

const t3Insights = computeInsights(t3);
assert('Bottleneck insight', t3Insights.bottleneck, true); // B1_2 = Somewhat true
assert('Time ROI insight', t3Insights.timeRoi, true); // A2_2 = 8-14 hours
assert('AI Opportunity insight', t3Insights.aiOpp, true); // G1_2 = Experimenting + G2_3 = Open

// ── Test 4: Edge case — secondary confidence modifier ──
console.log('\n═══ Test 4: Edge Case — Unpredictable + $6k-$10k + Now = QUALIFIED_SOON ═══');
const t4 = { ...t1, BB1: 'BB1_3', BB3: 'BB3_1', BB4: 'BB4_1' };
assert('Qualification (downgraded)', computeQualification(t4), 'QUALIFIED_SOON');

// ── Test 5: Edge case — $0-$3k always NOT_QUALIFIED ──
console.log('\n═══ Test 5: Edge Case — $0-$3k = NOT_QUALIFIED regardless ═══');
const t5 = { ...t1, BB1: 'BB1_1', BB4: 'BB4_1' };
assert('Qualification ($0-$3k)', computeQualification(t5), 'NOT_QUALIFIED');

// ── Test 6: Edge case — BB4 = Not sure always NOT_QUALIFIED ──
console.log('\n═══ Test 6: Edge Case — Not sure timeline = NOT_QUALIFIED ═══');
const t6 = { ...t1, BB1: 'BB1_4', BB4: 'BB4_4' };
assert('Qualification (Not sure)', computeQualification(t6), 'NOT_QUALIFIED');

// ── Summary ──
console.log(`\n${'═'.repeat(50)}`);
console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
if (failed > 0) {
  console.log('⚠️  SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED');
}
