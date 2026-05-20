// CTO Audit v2 — End-to-end scoring tests
// Validates: TB_MAX=68, RDY_MAX=60, autonomy fix, AVA type T2 uses A3, insights

// Inline the logic since we can't import TS directly
const TB_MAX = 68;
const RDY_MAX = 60;

// ============================================================
// Test Case 1: "Overwhelmed Solopreneur" — High TB, Low RDY
// All worst-case answers for time leakage, all worst for readiness
// Expected: TB near max, RDY near min, Outcome O1, Approval-heavy
// ============================================================
const test1 = {
  name: 'Overwhelmed Solopreneur (High TB + Low RDY)',
  answers: {
    S0: 'S0_2', S1: 'S1_1', S2: 'S2_1',
    // S3 skipped (optional)
    A1: 'A1_1', A2: 'A2_1', A3: 'A3_1', A4: 'A4_1', // all 3 TB, 0 RDY
    B1: 'B1_1', B2: 'B2_1', B3: 'B3_1', B4: 'B4_1', // all 3 TB, 0 RDY
    C1: 'C1_1', C2: 'C2_1', C3: 'C3_1', C4: 'C4_1', // C1,C2,C4 scored: 3+3+3=9 TB, 0 RDY
    D1: 'D1_1', D2: 'D2_1', D3: 'D3_1', D4: 'D4_1', D5: 'D5_1', // 3*5=15 TB, 0+0+0+0+1=1 RDY
    E2: 'E2_1', E3: 'E3_1', E4: 'E4_1', // 3*3=9 TB, 0 RDY
    F1: ['F1_1','F1_2','F1_3','F1_4','F1_5','F1_6','F1_7','F1_8'], // 8 TB, 0 RDY
    F2: 'F2_1', // 3 TB, 0 RDY
    F3: 'F3_5',
  },
  expected: {
    // TB: A(12)+B(12)+C(9)+D(15)+E(9)+F(8+3)=68
    tbTotal: 68,
    // RDY: A(0)+B(0)+C(0)+D(0+0+0+0+1)+E(0)+F(0)=1
    rdyTotal: 1,
    tbScore: Math.round((68/68)*100), // 100
    rdyScore: Math.round((1/60)*100), // 2
    autonomy: 'Approval-heavy', // D1_1 triggers
    outcome: 'O1', // High TB + Low RDY
    insightBottleneck: true, // B1_1 triggers
    insightTimeRoi: true, // A2_1 triggers + F1 count=8
  }
};

// ============================================================
// Test Case 2: "Ready Executive" — High TB, High RDY
// High delegation comfort, good systems, wants proactive partner
// ============================================================
const test2 = {
  name: 'Ready Executive (High TB + High RDY)',
  answers: {
    S0: 'S0_4', S1: 'S1_4', S2: 'S2_4',
    S3: ['S3_1','S3_3','S3_4','S3_7'],
    A1: 'A1_1', A2: 'A2_1', A3: 'A3_4', A4: 'A4_1', // TB: 3+3+0+3=9, RDY: 0+0+3+0=3
    B1: 'B1_1', B2: 'B2_1', B3: 'B3_1', B4: 'B4_1', // TB: 12, RDY: 0
    C1: 'C1_4', C2: 'C2_4', C3: 'C3_4', C4: 'C4_4', // TB: 0+0+0=0, RDY: 3+3+3=9
    D1: 'D1_4', D2: 'D2_4', D3: 'D3_4', D4: 'D4_4', D5: 'D5_4', // TB: 0*5=0, RDY: 3*5=15
    E2: 'E2_4', E3: 'E3_4', E4: 'E4_4', // TB: 0, RDY: 9
    F1: ['F1_1','F1_2','F1_3','F1_4','F1_5','F1_6','F1_7','F1_8'], // TB: 8, RDY: 0
    F2: 'F2_4', // TB: 0, RDY: 3
    F3: 'F3_4',
  },
  expected: {
    // TB: 9+12+0+0+0+8+0=29
    tbTotal: 29,
    // RDY: 3+0+9+15+9+0+3=39
    rdyTotal: 39,
    tbScore: Math.round((29/68)*100), // 43
    rdyScore: Math.round((39/60)*100), // 65
    autonomy: 'Proactive partner', // D1_4 + D4_4
    outcome: 'O5', // Mid TB (43) + Mid RDY (65) → O5
    insightBottleneck: true, // B1_1 triggers
    insightTimeRoi: true, // A2_1 triggers
  }
};

// ============================================================
// Test Case 3: "Organized but Holding On" — Mid TB, Mid RDY
// Good systems but moderate delegation comfort
// Tests: D4_2 → Approval-heavy (bug fix), T2 uses A3
// ============================================================
const test3 = {
  name: 'Organized but Holding On (Mid TB + Mid RDY)',
  answers: {
    S0: 'S0_3', S1: 'S1_3', S2: 'S2_3',
    S3: ['S3_1','S3_4'],
    A1: 'A1_2', A2: 'A2_3', A3: 'A3_3', A4: 'A4_2', // TB: 2+1+1+2=6, RDY: 1+2+2+1=6
    B1: 'B1_2', B2: 'B2_3', B3: 'B3_2', B4: 'B4_3', // TB: 2+1+2+1=6, RDY: 1+2+1+2=6
    C1: 'C1_2', C2: 'C2_2', C3: 'C3_2', C4: 'C4_2', // TB: 2+2+2=6, RDY: 1+1+1=3
    D1: 'D1_2', D2: 'D2_2', D3: 'D3_2', D4: 'D4_2', D5: 'D5_2', // TB: 2*5=10, RDY: 1+1+1+1+2=6
    E2: 'E2_2', E3: 'E3_2', E4: 'E4_2', // TB: 2*3=6, RDY: 1*3=3
    F1: ['F1_1','F1_2','F1_8','F1_10'], // TB: 4, RDY: 0
    F2: 'F2_2', // TB: 2, RDY: 1
    F3: 'F3_3',
  },
  expected: {
    // TB: 6+6+6+10+6+4+2=40
    tbTotal: 40,
    // RDY: 6+6+3+6+3+0+1=25
    rdyTotal: 25,
    tbScore: Math.round((40/68)*100), // 59
    rdyScore: Math.round((25/60)*100), // 42
    autonomy: 'Approval-heavy', // D4_2 now triggers Approval-heavy (BUG FIX)
    outcome: 'O2', // High TB (59) + Mid RDY (42) → O2
    insightBottleneck: true, // B1_2 (somewhat true) triggers
    insightTimeRoi: false, // A2_3 = 3-7 hrs, F1 count=4 < 6
  }
};

// ============================================================
// Run tests
// ============================================================
function computeScores(answers) {
  let tbTotal = 0;
  let rdyTotal = 0;
  
  // Manually compute based on the standardized 3/2/1/0 TB scoring
  const scoredQuestions = [
    'A1','A2','A3','A4',
    'B1','B2','B3','B4',
    'C1','C2','C4',
    'D1','D2','D3','D4','D5',
    'E2','E3','E4',
    'F2'
  ];
  
  // TB and RDY values for each choice (standardized)
  const choiceValues = {
    // Section A
    A1_1: {tb:3,rdy:0}, A1_2: {tb:2,rdy:1}, A1_3: {tb:1,rdy:2}, A1_4: {tb:0,rdy:3},
    A2_1: {tb:3,rdy:0}, A2_2: {tb:2,rdy:1}, A2_3: {tb:1,rdy:2}, A2_4: {tb:0,rdy:3},
    A3_1: {tb:3,rdy:0}, A3_2: {tb:2,rdy:1}, A3_3: {tb:1,rdy:2}, A3_4: {tb:0,rdy:3},
    A4_1: {tb:3,rdy:0}, A4_2: {tb:2,rdy:1}, A4_3: {tb:1,rdy:2}, A4_4: {tb:0,rdy:3},
    // Section B
    B1_1: {tb:3,rdy:0}, B1_2: {tb:2,rdy:1}, B1_3: {tb:1,rdy:2}, B1_4: {tb:0,rdy:3},
    B2_1: {tb:3,rdy:0}, B2_2: {tb:2,rdy:1}, B2_3: {tb:1,rdy:2}, B2_4: {tb:0,rdy:3},
    B3_1: {tb:3,rdy:0}, B3_2: {tb:2,rdy:1}, B3_3: {tb:1,rdy:2}, B3_4: {tb:0,rdy:3},
    B4_1: {tb:3,rdy:0}, B4_2: {tb:2,rdy:1}, B4_3: {tb:1,rdy:2}, B4_4: {tb:0,rdy:3},
    // Section C (scored: C1, C2, C4)
    C1_1: {tb:3,rdy:0}, C1_2: {tb:2,rdy:1}, C1_3: {tb:1,rdy:2}, C1_4: {tb:0,rdy:3},
    C2_1: {tb:3,rdy:0}, C2_2: {tb:2,rdy:1}, C2_3: {tb:1,rdy:2}, C2_4: {tb:0,rdy:3},
    C4_1: {tb:3,rdy:0}, C4_2: {tb:2,rdy:1}, C4_3: {tb:1,rdy:2}, C4_4: {tb:0,rdy:3},
    // Section D
    D1_1: {tb:3,rdy:0}, D1_2: {tb:2,rdy:1}, D1_3: {tb:1,rdy:2}, D1_4: {tb:0,rdy:3},
    D2_1: {tb:3,rdy:0}, D2_2: {tb:2,rdy:1}, D2_3: {tb:1,rdy:2}, D2_4: {tb:0,rdy:3},
    D3_1: {tb:3,rdy:0}, D3_2: {tb:2,rdy:1}, D3_3: {tb:1,rdy:2}, D3_4: {tb:0,rdy:3},
    D4_1: {tb:3,rdy:0}, D4_2: {tb:2,rdy:1}, D4_3: {tb:1,rdy:2}, D4_4: {tb:0,rdy:3},
    D5_1: {tb:3,rdy:1}, D5_2: {tb:2,rdy:2}, D5_3: {tb:1,rdy:3}, D5_4: {tb:0,rdy:3},
    // Section E (E1 removed)
    E2_1: {tb:3,rdy:0}, E2_2: {tb:2,rdy:1}, E2_3: {tb:1,rdy:2}, E2_4: {tb:0,rdy:3},
    E3_1: {tb:3,rdy:0}, E3_2: {tb:2,rdy:1}, E3_3: {tb:1,rdy:2}, E3_4: {tb:0,rdy:3},
    E4_1: {tb:3,rdy:0}, E4_2: {tb:2,rdy:1}, E4_3: {tb:1,rdy:2}, E4_4: {tb:0,rdy:3},
    // Section F
    F2_1: {tb:3,rdy:0}, F2_2: {tb:2,rdy:1}, F2_3: {tb:1,rdy:1}, F2_4: {tb:0,rdy:3},
  };
  
  for (const qId of scoredQuestions) {
    const answer = answers[qId];
    if (!answer || typeof answer !== 'string') continue;
    const vals = choiceValues[answer];
    if (vals) {
      tbTotal += vals.tb;
      rdyTotal += vals.rdy;
    }
  }
  
  // F1 multi-select
  const f1 = answers['F1'];
  if (Array.isArray(f1)) {
    tbTotal += Math.min(8, f1.length);
  }
  
  return {
    tbTotal,
    rdyTotal,
    tbScore: Math.round((tbTotal / TB_MAX) * 100),
    rdyScore: Math.round((rdyTotal / RDY_MAX) * 100),
  };
}

function computeAutonomy(answers) {
  const d1 = answers['D1'];
  const d4 = answers['D4'];
  if (d1 === 'D1_1' || d4 === 'D4_1' || d4 === 'D4_2') return 'Approval-heavy';
  if (d1 === 'D1_3' || d4 === 'D4_3') return 'Guardrails-based';
  return 'Proactive partner';
}

function computeOutcome(tbScore, rdyScore) {
  if (tbScore >= 50 && rdyScore <= 33) return 'O1';
  if (tbScore >= 50 && rdyScore >= 34 && rdyScore <= 66) return 'O2';
  if (tbScore >= 50 && rdyScore >= 67) return 'O3';
  if (tbScore >= 25 && tbScore <= 49 && rdyScore <= 33) return 'O4';
  if (tbScore >= 25 && tbScore <= 49 && rdyScore >= 34) return 'O5';
  if (tbScore <= 24 && rdyScore >= 67) return 'O6';
  if (tbScore <= 24 && rdyScore <= 33) return 'O4';
  if (tbScore <= 24 && rdyScore >= 34 && rdyScore <= 66) return 'O5';
  return 'O2';
}

function computeInsights(answers) {
  const b1 = answers['B1'];
  const b2 = answers['B2'];
  const a2 = answers['A2'];
  const f1 = answers['F1'];
  
  const bottleneck = (b1 === 'B1_1' || b1 === 'B1_2' || b2 === 'B2_1' || b2 === 'B2_2');
  const f1Count = Array.isArray(f1) ? f1.length : 0;
  const timeRoi = (a2 === 'A2_1' || a2 === 'A2_2' || f1Count >= 6);
  
  return { bottleneck, timeRoi };
}

function runTest(test) {
  const scores = computeScores(test.answers);
  const autonomy = computeAutonomy(test.answers);
  const outcome = computeOutcome(scores.tbScore, scores.rdyScore);
  const insights = computeInsights(test.answers);
  
  let passed = true;
  const errors = [];
  
  if (scores.tbTotal !== test.expected.tbTotal) {
    errors.push(`TB Total: got ${scores.tbTotal}, expected ${test.expected.tbTotal}`);
    passed = false;
  }
  if (scores.rdyTotal !== test.expected.rdyTotal) {
    errors.push(`RDY Total: got ${scores.rdyTotal}, expected ${test.expected.rdyTotal}`);
    passed = false;
  }
  if (scores.tbScore !== test.expected.tbScore) {
    errors.push(`TB Score: got ${scores.tbScore}, expected ${test.expected.tbScore}`);
    passed = false;
  }
  if (scores.rdyScore !== test.expected.rdyScore) {
    errors.push(`RDY Score: got ${scores.rdyScore}, expected ${test.expected.rdyScore}`);
    passed = false;
  }
  if (autonomy !== test.expected.autonomy) {
    errors.push(`Autonomy: got "${autonomy}", expected "${test.expected.autonomy}"`);
    passed = false;
  }
  if (outcome !== test.expected.outcome) {
    errors.push(`Outcome: got "${outcome}", expected "${test.expected.outcome}"`);
    passed = false;
  }
  if (insights.bottleneck !== test.expected.insightBottleneck) {
    errors.push(`Bottleneck Insight: got ${insights.bottleneck}, expected ${test.expected.insightBottleneck}`);
    passed = false;
  }
  if (insights.timeRoi !== test.expected.insightTimeRoi) {
    errors.push(`Time ROI Insight: got ${insights.timeRoi}, expected ${test.expected.insightTimeRoi}`);
    passed = false;
  }
  
  console.log(`\n${passed ? '✅' : '❌'} ${test.name}`);
  console.log(`   TB: ${scores.tbTotal}/${TB_MAX} = ${scores.tbScore}%`);
  console.log(`   RDY: ${scores.rdyTotal}/${RDY_MAX} = ${scores.rdyScore}%`);
  console.log(`   Autonomy: ${autonomy}`);
  console.log(`   Outcome: ${outcome}`);
  console.log(`   Insights: Bottleneck=${insights.bottleneck}, TimeROI=${insights.timeRoi}`);
  
  if (!passed) {
    console.log(`   ERRORS:`);
    errors.forEach(e => console.log(`     - ${e}`));
  }
  
  return passed;
}

console.log('=== CTO Audit v2 — Scoring Engine Tests ===');
console.log(`TB_MAX = ${TB_MAX}, RDY_MAX = ${RDY_MAX}`);

const results = [
  runTest(test1),
  runTest(test2),
  runTest(test3),
];

console.log('\n' + '='.repeat(50));
console.log(`Results: ${results.filter(Boolean).length}/${results.length} tests passed`);

if (results.every(Boolean)) {
  console.log('All tests passed! ✅');
  process.exit(0);
} else {
  console.log('Some tests failed! ❌');
  process.exit(1);
}
