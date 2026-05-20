// Quick scoring engine verification test
// Run with: node test-scoring.mjs

// We'll simulate the scoring logic directly since we can't import TS modules

// From assessmentData.ts - TB and RDY point values
const scoringRules = {
  // Section A: Time Awareness
  A1: { 1: { tb: 0 }, 2: { tb: 1 }, 3: { tb: 2 }, 4: { tb: 3 } },
  A2: { 1: { tb: 0 }, 2: { tb: 1 }, 3: { tb: 2 }, 4: { tb: 3 } },
  A3: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  A4: { 1: { tb: 0 }, 2: { tb: 1 }, 3: { tb: 2 }, 4: { tb: 3 } },
  // Section B: Bottleneck Signals
  B1: { 1: { tb: 3 }, 2: { tb: 2 }, 3: { tb: 1 }, 4: { tb: 0 } },
  B2: { 1: { tb: 3 }, 2: { tb: 2 }, 3: { tb: 1 }, 4: { tb: 0 } },
  B3: { 1: { tb: 3 }, 2: { tb: 2 }, 3: { tb: 1 }, 4: { tb: 0 } },
  B4: { 1: { tb: 3 }, 2: { tb: 2 }, 3: { tb: 1 }, 4: { tb: 0 } },
  // Section C: Delegation Readiness
  C1: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  C2: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  C3: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  C4: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  // Section D: Working Style
  D1: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  D2: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  D3: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  D4: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  D5: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  // Section E: Systems & Tools
  E1: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  E2: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  E3: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  E4: { 1: { rdy: 0 }, 2: { rdy: 1 }, 3: { rdy: 2 }, 4: { rdy: 3 } },
  // Section F: Future Vision
  F1: 'multi', // min(8, count)
  F2: { 1: { tb: 0 }, 2: { tb: 1 }, 3: { tb: 2 }, 4: { tb: 3 } },
  F3: null, // not scored
};

const TB_MAX = 32;
const RDY_MAX = 51;

function computeScores(answers) {
  let tbTotal = 0;
  let rdyTotal = 0;

  for (const [qId, answer] of Object.entries(answers)) {
    const rule = scoringRules[qId];
    if (!rule) continue;

    if (qId === 'F1' && Array.isArray(answer)) {
      tbTotal += Math.min(8, answer.length);
      continue;
    }

    if (rule === 'multi' || rule === null) continue;

    const choiceIdx = parseInt(answer.split('_')[1]);
    const points = rule[choiceIdx];
    if (points) {
      if (points.tb !== undefined) tbTotal += points.tb;
      if (points.rdy !== undefined) rdyTotal += points.rdy;
    }
  }

  return {
    tbTotal,
    rdyTotal,
    timeBuybackScore: Math.round((tbTotal / TB_MAX) * 100),
    avaReadinessScore: Math.round((rdyTotal / RDY_MAX) * 100),
  };
}

// Test Case 1: All middle answers (option 3)
const test1 = {
  S0: 'S0_3', S1: 'S1_3', S2: 'S2_3', S3: ['S3_1', 'S3_3'],
  A1: 'A1_3', A2: 'A2_3', A3: 'A3_3', A4: 'A4_3',
  B1: 'B1_3', B2: 'B2_3', B3: 'B3_3', B4: 'B4_3',
  C1: 'C1_3', C2: 'C2_3', C3: 'C3_3', C4: 'C4_3',
  D1: 'D1_3', D2: 'D2_3', D3: 'D3_3', D4: 'D4_3', D5: 'D5_3',
  E1: 'E1_3', E2: 'E2_3', E3: 'E3_3', E4: 'E4_3',
  F1: ['F1_1', 'F1_2', 'F1_3', 'F1_4', 'F1_5'],
  F2: 'F2_3', F3: 'F3_3',
};

const result1 = computeScores(test1);
console.log('Test 1 (all option 3):');
console.log(`  TB: ${result1.tbTotal}/${TB_MAX} = ${result1.timeBuybackScore}%`);
console.log(`  RDY: ${result1.rdyTotal}/${RDY_MAX} = ${result1.avaReadinessScore}%`);

// Expected TB: A1(2)+A2(2)+A4(2) + B1(1)+B2(1)+B3(1)+B4(1) + F1(min(8,5)=5) + F2(2) = 17
// Expected RDY: A3(2) + C1(2)+C2(2)+C3(2)+C4(2) + D1(2)+D2(2)+D3(2)+D4(2)+D5(2) + E1(2)+E2(2)+E3(2)+E4(2) = 28
console.log(`  Expected TB: 17, Got: ${result1.tbTotal}`);
console.log(`  Expected RDY: 28, Got: ${result1.rdyTotal}`);
console.log(`  TB Match: ${result1.tbTotal === 17 ? 'PASS' : 'FAIL'}`);
console.log(`  RDY Match: ${result1.rdyTotal === 28 ? 'PASS' : 'FAIL'}`);

// Test Case 2: All max answers (option 4)
const test2 = {
  S0: 'S0_4', S1: 'S1_4', S2: 'S2_4', S3: ['S3_1'],
  A1: 'A1_4', A2: 'A2_4', A3: 'A3_4', A4: 'A4_4',
  B1: 'B1_4', B2: 'B2_4', B3: 'B3_4', B4: 'B4_4',
  C1: 'C1_4', C2: 'C2_4', C3: 'C3_4', C4: 'C4_4',
  D1: 'D1_4', D2: 'D2_4', D3: 'D3_4', D4: 'D4_4', D5: 'D5_4',
  E1: 'E1_4', E2: 'E2_4', E3: 'E3_4', E4: 'E4_4',
  F1: ['F1_1', 'F1_2', 'F1_3', 'F1_4', 'F1_5', 'F1_6', 'F1_7', 'F1_8', 'F1_9'],
  F2: 'F2_4', F3: 'F3_4',
};

const result2 = computeScores(test2);
console.log('\nTest 2 (all option 4 / max):');
console.log(`  TB: ${result2.tbTotal}/${TB_MAX} = ${result2.timeBuybackScore}%`);
console.log(`  RDY: ${result2.rdyTotal}/${RDY_MAX} = ${result2.avaReadinessScore}%`);

// Expected TB: A1(3)+A2(3)+A4(3) + B1(0)+B2(0)+B3(0)+B4(0) + F1(min(8,9)=8) + F2(3) = 20
// Expected RDY: A3(3) + C1(3)+C2(3)+C3(3)+C4(3) + D1(3)+D2(3)+D3(3)+D4(3)+D5(3) + E1(3)+E2(3)+E3(3)+E4(3) = 42
// Wait, B section option 4 = "Not at all true" = 0 TB
console.log(`  Expected TB: 20, Got: ${result2.tbTotal}`);
console.log(`  Expected RDY: 42, Got: ${result2.rdyTotal}`);
console.log(`  TB Match: ${result2.tbTotal === 20 ? 'PASS' : 'FAIL'}`);
console.log(`  RDY Match: ${result2.rdyTotal === 42 ? 'PASS' : 'FAIL'}`);

// Test Case 3: All min answers (option 1) - minimum scores
const test3 = {
  S0: 'S0_1', S1: 'S1_1', S2: 'S2_1', S3: ['S3_1'],
  A1: 'A1_1', A2: 'A2_1', A3: 'A3_1', A4: 'A4_1',
  B1: 'B1_1', B2: 'B2_1', B3: 'B3_1', B4: 'B4_1',
  C1: 'C1_1', C2: 'C2_1', C3: 'C3_1', C4: 'C4_1',
  D1: 'D1_1', D2: 'D2_1', D3: 'D3_1', D4: 'D4_1', D5: 'D5_1',
  E1: 'E1_1', E2: 'E2_1', E3: 'E3_1', E4: 'E4_1',
  F1: ['F1_1'],
  F2: 'F2_1', F3: 'F3_1',
};

const result3 = computeScores(test3);
console.log('\nTest 3 (all option 1 / min):');
console.log(`  TB: ${result3.tbTotal}/${TB_MAX} = ${result3.timeBuybackScore}%`);
console.log(`  RDY: ${result3.rdyTotal}/${RDY_MAX} = ${result3.avaReadinessScore}%`);

// Expected TB: A1(0)+A2(0)+A4(0) + B1(3)+B2(3)+B3(3)+B4(3) + F1(1) + F2(0) = 13
// Expected RDY: A3(0) + C1(0)+C2(0)+C3(0)+C4(0) + D1(0)+D2(0)+D3(0)+D4(0)+D5(0) + E1(0)+E2(0)+E3(0)+E4(0) = 0
console.log(`  Expected TB: 13, Got: ${result3.tbTotal}`);
console.log(`  Expected RDY: 0, Got: ${result3.rdyTotal}`);
console.log(`  TB Match: ${result3.tbTotal === 13 ? 'PASS' : 'FAIL'}`);
console.log(`  RDY Match: ${result3.rdyTotal === 0 ? 'PASS' : 'FAIL'}`);

console.log('\n=== All tests complete ===');
