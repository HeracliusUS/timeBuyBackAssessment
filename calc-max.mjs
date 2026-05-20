import fs from 'fs';

const src = fs.readFileSync('client/src/lib/assessmentData.ts', 'utf8');

// Parse all choices with their tb and rdy values
const choiceRegex = /\{ id: '([^']+)', label: '[^']*', tb: ([^,]+), rdy: ([^,]+), tag:/g;
let match;
const choices = {};
while ((match = choiceRegex.exec(src)) !== null) {
  choices[match[1]] = { tb: match[2] === 'null' ? null : Number(match[2]), rdy: match[3] === 'null' ? null : Number(match[3]) };
}

console.log('Total choices parsed:', Object.keys(choices).length);

// Parse question IDs and scored status - they're on separate lines
const qIdRegex = /qId: '([^']+)'/g;
const scoredRegex = /scored: (true|false)/g;

const qIds = [];
while ((match = qIdRegex.exec(src)) !== null) {
  qIds.push({ qId: match[1], index: match.index });
}

const scoredFlags = [];
while ((match = scoredRegex.exec(src)) !== null) {
  scoredFlags.push({ scored: match[1] === 'true', index: match.index });
}

console.log('Total qIds found:', qIds.length);
console.log('Total scored flags found:', scoredFlags.length);

// Match each qId with its nearest scored flag
const questions = qIds.map((q, i) => ({
  qId: q.qId,
  scored: scoredFlags[i] ? scoredFlags[i].scored : false,
}));

let totalTBMax = 0;
let totalRDYMax = 0;

for (const q of questions) {
  if (!q.scored) {
    console.log(`${q.qId}: UNSCORED`);
    continue;
  }
  if (q.qId === 'F1') {
    console.log(`${q.qId}: WEIGHTED (F1_TB_CAP=13, RDY=0)`);
    continue;
  }

  let maxTB = 0;
  let maxRDY = 0;
  for (const [cId, c] of Object.entries(choices)) {
    if (cId.startsWith(q.qId + '_')) {
      if (c.tb !== null && c.tb > maxTB) maxTB = c.tb;
      if (c.rdy !== null && c.rdy > maxRDY) maxRDY = c.rdy;
    }
  }
  console.log(`${q.qId}: maxTB=${maxTB}, maxRDY=${maxRDY}`);
  totalTBMax += maxTB;
  totalRDYMax += maxRDY;
}

console.log('');
console.log('Non-F1 TB total:', totalTBMax);
console.log('Non-F1 RDY total:', totalRDYMax);
console.log('F1_TB_CAP = 13');
console.log('');
console.log('FINAL TB_MAX =', totalTBMax + 13);
console.log('FINAL RDY_MAX =', totalRDYMax);
