// ============================================================
// SCORING ENGINE -- v8.0: Clarity & Capacity Assessment (Production Ready)
// Changes from v7:
//   - Section order: S→A→B→C→D→E→F→R→G→BB (E+F before R for correct data flow)
//   - Deleted R0 bridge question (no longer needed)
//   - Removed topPullawayTasks from results (R0 deleted)
//   - Removed getF1SelectionLabels helper (R0 deleted)
//   - 35 questions across 10 sections
//   - Export version bumped to 8.0
// ============================================================

import {
  sections,
  outcomes,
  taskOffloadPriority,
  timeLeakLabels,
  TB_MAX,
  RDY_MAX,
  f1WeightMap,
  F1_TB_CAP,
  type Outcome,
} from './assessmentData';

export type Answers = Record<string, string | string[]>;

// ============================================================
// Qualification status
// ============================================================
export type QualificationStatus =
  | 'QUALIFIED_NOW'
  | 'QUALIFIED_SOON'
  | 'QUALIFIED_FOR_PLAYBOOK'
  | 'NOT_QUALIFIED';

interface ChoiceLookup {
  tb: number | null;
  rdy: number | null;
  tag: string;
  label: string;
}

function buildChoiceLookup(): Record<string, ChoiceLookup> {
  const lookup: Record<string, ChoiceLookup> = {};
  for (const section of sections) {
    for (const q of section.questions) {
      for (const c of q.choices) {
        lookup[c.id] = { tb: c.tb, rdy: c.rdy, tag: c.tag, label: c.label };
      }
    }
  }
  return lookup;
}

const choiceLookup = buildChoiceLookup();

// ============================================================
// Compute TB_total, RDY_total, and normalized scores
// ============================================================
export function computeScores(answers: Answers) {
  let tbTotal = 0;
  let rdyTotal = 0;

  for (const section of sections) {
    for (const q of section.questions) {
      if (!q.scored) continue;

      const answer = answers[q.qId];
      if (!answer) continue;

      // F1: weighted multi-select scoring
      if (q.qId === 'F1' && Array.isArray(answer)) {
        let weightedSum = 0;
        for (const choiceId of answer) {
          weightedSum += f1WeightMap[choiceId] || 1;
        }
        tbTotal += Math.min(F1_TB_CAP, weightedSum);
        // RDY = 0 for F1
        continue;
      }

      // Standard single-select scored question
      if (typeof answer === 'string') {
        const choice = choiceLookup[answer];
        if (choice) {
          if (choice.tb !== null) tbTotal += choice.tb;
          if (choice.rdy !== null) rdyTotal += choice.rdy;
        }
      }
    }
  }

  const timeBuybackScore = Math.round((tbTotal / TB_MAX) * 100);
  const avaReadinessScore = Math.round((rdyTotal / RDY_MAX) * 100);

  return { tbTotal, rdyTotal, timeBuybackScore, avaReadinessScore };
}

// ============================================================
// Buy Back Rate -- uses BB1 (monthly take-home pay)
// ============================================================
export function computeBuyBackRate(answers: Answers): {
  monthlyTakeHomeMidpoint: number;
  annualEstimate: number;
  hourlyRate: number;
  buyBackRate: number;
} {
  const bb1 = answers['BB1'] as string;
  let monthlyTakeHomeMidpoint: number;

  switch (bb1) {
    case 'BB1_1': monthlyTakeHomeMidpoint = 1500; break;   // $0-$3k
    case 'BB1_2': monthlyTakeHomeMidpoint = 4500; break;   // $3k-$6k
    case 'BB1_3': monthlyTakeHomeMidpoint = 8000; break;   // $6k-$10k
    case 'BB1_4': monthlyTakeHomeMidpoint = 12500; break;  // $10k+ (conservative)
    default: monthlyTakeHomeMidpoint = 1500;
  }

  const annualEstimate = monthlyTakeHomeMidpoint * 12;
  const hourlyRate = annualEstimate / 2000;
  const buyBackRate = hourlyRate / 4;

  return {
    monthlyTakeHomeMidpoint,
    annualEstimate,
    hourlyRate: Math.round(hourlyRate),
    buyBackRate: Math.round(buyBackRate),
  };
}

// ============================================================
// Qualification logic
// ============================================================
export function computeQualification(answers: Answers): QualificationStatus {
  const bb1 = answers['BB1'] as string;
  const bb3 = answers['BB3'] as string;
  const bb4 = answers['BB4'] as string;

  if (bb4 === 'BB4_4') return 'NOT_QUALIFIED';
  if (bb1 === 'BB1_1') return 'NOT_QUALIFIED';
  if (bb1 === 'BB1_2') return 'QUALIFIED_FOR_PLAYBOOK';

  const canCommitSoon = bb4 === 'BB4_1' || bb4 === 'BB4_2';
  const canCommitLater = bb4 === 'BB4_3';
  const isUnpredictable = bb3 === 'BB3_1';
  const isMinimumQualified = bb1 === 'BB1_3';

  if (canCommitSoon) {
    if (isUnpredictable && isMinimumQualified) {
      return 'QUALIFIED_SOON';
    }
    return 'QUALIFIED_NOW';
  }

  if (canCommitLater) {
    return 'QUALIFIED_SOON';
  }

  return 'NOT_QUALIFIED';
}

// ============================================================
// Top Offload Tasks (ordered by priority)
// ============================================================
export function computeTopOffloadTasks(answers: Answers): string[] {
  const f1Selections = answers['F1'];
  if (!Array.isArray(f1Selections)) return [];

  const priorityOrder = Object.keys(taskOffloadPriority);
  const ordered = priorityOrder.filter((id) => f1Selections.includes(id));
  return ordered.map((id) => taskOffloadPriority[id]);
}

// ============================================================
// Autonomy Preference
// ============================================================
export function computeAutonomyPreference(answers: Answers): string {
  const d1 = answers['D1'] as string;
  const d4 = answers['D4'] as string;

  if (d1 === 'D1_1' || d4 === 'D4_1' || d4 === 'D4_2') return 'Approval-heavy';
  if (d1 === 'D1_3' || d4 === 'D4_3') return 'Guardrails-based';
  return 'Proactive partner';
}

// ============================================================
// Communication Cadence
// ============================================================
export function computeCommCadence(answers: Answers): string {
  const d5 = answers['D5'] as string;
  switch (d5) {
    case 'D5_1': return 'Real-time';
    case 'D5_2': return 'Daily check-ins';
    case 'D5_3': return 'Daily async';
    case 'D5_4': return 'Weekly review';
    default: return 'Daily async';
  }
}

// ============================================================
// Time Leaks (top 3 from B + A questions)
// v7: B1_5→B2, old B2→B3, old B3→B4, old B4→B5
// ============================================================
export function computeTimeLeaks(answers: Answers): string[] {
  const leakQuestions = ['B4', 'B5', 'B2', 'B3', 'A4', 'A2', 'A5'];
  const leaks: { qId: string; tb: number }[] = [];

  for (const qId of leakQuestions) {
    const answer = answers[qId] as string;
    if (!answer) continue;
    const choice = choiceLookup[answer];
    if (choice && choice.tb !== null && choice.tb >= 2) {
      leaks.push({ qId, tb: choice.tb });
    }
  }

  leaks.sort((a, b) => b.tb - a.tb);
  return leaks.slice(0, 3).map((l) => timeLeakLabels[l.qId]);
}

// ============================================================
// Assistant Type Rules
// v7: B1_5→B2, old B2→B3, old B3→B4, old B4→B5
// ============================================================
export function computeAssistantType(answers: Answers): { type: string; label: string } {
  const d2 = answers['D2'] as string;
  const d3 = answers['D3'] as string;
  const a3 = answers['A3'] as string;
  const d1 = answers['D1'] as string;
  const d4 = answers['D4'] as string;
  const c4 = answers['C4'] as string;

  // v7 IDs: B4 = inbox command center, B5 = calendar runs you
  // B2 = admin delayed decision (was B1_5), B3 = needs owner finish (was B2)
  const b4 = answers['B4'] as string;  // inbox command center
  const b5 = answers['B5'] as string;  // calendar runs you
  const b2 = answers['B2'] as string;  // admin delayed decision (was B1_5)
  const b3 = answers['B3'] as string;  // needs owner finish (was old B2)

  const choiceIndex = (id: string): number => {
    if (!id) return 0;
    const parts = id.split('_');
    return parseInt(parts[parts.length - 1]) - 1;
  };

  // T1: Inbox + Calendar Gatekeeper
  // Email trigger: D2 index >= 2 OR B3 (needs owner finish) index <= 1
  // Calendar trigger: D3 index >= 2 OR B5 (calendar runs you) index <= 1
  const d2Idx = choiceIndex(d2);
  const d3Idx = choiceIndex(d3);
  const b3Idx = choiceIndex(b3);
  const b5Idx = choiceIndex(b5);
  const t1Email = d2Idx >= 2 || b3Idx <= 1;
  const t1Cal = d3Idx >= 2 || b5Idx <= 1;
  if (t1Email && t1Cal) {
    return { type: 'Type 1', label: 'Inbox + Calendar Gatekeeper' };
  }

  // T2: Ops + Follow-through Coordinator
  // Systems trigger: A3 (context switches) index >= 2
  // Bottleneck trigger: B2 (admin delayed decision, was B1_5) index <= 1 OR B4 (inbox command center) index <= 1
  const a3Idx = choiceIndex(a3);
  const b2Idx = choiceIndex(b2);
  const b4Idx = choiceIndex(b4);
  const t2Systems = a3Idx >= 2;
  const t2Bottleneck = b2Idx <= 1 || b4Idx <= 1;
  if (t2Systems && t2Bottleneck) {
    return { type: 'Type 2', label: 'Operations + Follow-through Coordinator' };
  }

  // T3: Executive Partner
  const d1Idx = choiceIndex(d1);
  const d4Idx = choiceIndex(d4);
  const c4Idx = choiceIndex(c4);
  if (d1Idx >= 2 && d4Idx >= 2 && c4Idx >= 2) {
    return { type: 'Type 3', label: 'Executive Partner' };
  }

  // Default to Type 1
  return { type: 'Type 1', label: 'Inbox + Calendar Gatekeeper' };
}

// ============================================================
// Insight triggers
// v7: B1_5→B2, old B2→B3
// ============================================================
export interface Insights {
  bottleneckMoment: string | null;
  timeRoiReality: string | null;
  aiOpportunity: string | null;
}

export function computeInsights(answers: Answers): Insights {
  const b2 = answers['B2'] as string;  // was B1_5 in v6
  const b3 = answers['B3'] as string;  // was old B2 in v6
  const a2 = answers['A2'] as string;
  const f1 = answers['F1'];
  const g1 = answers['G1'] as string;
  const g2 = answers['G2'] as string;

  // Bottleneck Moment — v7: B2 (was B1_5) and B3 (was old B2)
  let bottleneckMoment: string | null = null;
  const b2Triggers = b2 === 'B2_1' || b2 === 'B2_2';
  const b3Triggers = b3 === 'B3_1' || b3 === 'B3_2';
  if (b2Triggers || b3Triggers) {
    bottleneckMoment =
      "Admin and coordination tasks are actively slowing down your most important decisions. That's not a personality flaw \u2014 it's a systems gap. A trained Executive Assistant fixes this by becoming the second brain that keeps work moving with guardrails and escalation rules.";
  }

  // Time ROI Reality
  let timeRoiReality: string | null = null;
  const a2Triggers = a2 === 'A2_1' || a2 === 'A2_2';
  const f1Count = Array.isArray(f1) ? f1.length : 0;
  if (a2Triggers || f1Count >= 6) {
    timeRoiReality =
      "You're paying founder-level time for admin-level tasks. The fastest win is offloading the top 3 categories you selected \u2014 that alone could buy back 8\u201312 hours every week.";
  }

  // AI Opportunity
  let aiOpportunity: string | null = null;
  const lowAiAdoption = g1 === 'G1_1' || g1 === 'G1_2';
  const openToAi = g2 === 'G2_3' || g2 === 'G2_4';
  if (lowAiAdoption && openToAi) {
    aiOpportunity =
      "You're open to AI but haven't fully integrated it yet \u2014 that's a huge opportunity. Your Executive Assistant can set up AI-powered workflows (email templates, scheduling automation, document generation) that multiply their impact. Think of it as getting a human + AI team for the price of one.";
  }

  return { bottleneckMoment, timeRoiReality, aiOpportunity };
}

// ============================================================
// Outcome determination -- 4 outcomes
// ============================================================
export function computeOutcome(
  timeBuybackScore: number,
  avaReadinessScore: number
): Outcome {
  if (avaReadinessScore >= 67) return outcomes[3]; // O4 - The Architect
  if (timeBuybackScore >= 50 && avaReadinessScore < 34) return outcomes[0]; // O1 - The Builder
  if (timeBuybackScore >= 50 && avaReadinessScore >= 34) return outcomes[1]; // O2 - The Amplifier
  return outcomes[2]; // O3 - The Optimizer
}

// ============================================================
// Full results computation -- v8
// v8: removed topPullawayTasks (R0 deleted), section order corrected
// ============================================================
export interface AssessmentResults {
  tbTotal: number;
  rdyTotal: number;
  timeBuybackScore: number;
  avaReadinessScore: number;
  topOffloadTasks: string[];
  autonomyPreference: string;
  commCadence: string;
  timeLeaks: string[];
  assistantType: { type: string; label: string };
  outcome: Outcome;
  insights: Insights;
  qualificationStatus: QualificationStatus;
  buyBackRate: number;
  hourlyRate: number;
  monthlyTakeHomeMidpoint: number;
  stage: string;
  teamSize: string;
  tools: string[];
  timeBackUse: string;
  supportBlocker: string;
  accessTimeline: string;
  sopMaturity: string;
  responseSpeed: string;
  accessComfort: string;
  delegationSystemHelp: string;
  monthlyTakeHome: string;
  cashflowStability: string;
  commitTimeline: string;
  burnoutLevel: string;
  aiAdoption: string;
  aiFeeling: string;
  adminDelayedDecision: string; // B2 answer (was B1_5)
}

export function computeAllResults(answers: Answers): AssessmentResults {
  const { tbTotal, rdyTotal, timeBuybackScore, avaReadinessScore } = computeScores(answers);
  const topOffloadTasks = computeTopOffloadTasks(answers);
  const autonomyPreference = computeAutonomyPreference(answers);
  const commCadence = computeCommCadence(answers);
  const timeLeaks = computeTimeLeaks(answers);
  const assistantType = computeAssistantType(answers);
  const outcome = computeOutcome(timeBuybackScore, avaReadinessScore);
  const insights = computeInsights(answers);
  const qualificationStatus = computeQualification(answers);
  const bbRate = computeBuyBackRate(answers);

  const getLabel = (_qId: string, answerId: string | string[]): string => {
    if (Array.isArray(answerId)) return '';
    const choice = choiceLookup[answerId];
    return choice?.label || '';
  };

  const getLabels = (_qId: string, answerIds: string | string[]): string[] => {
    if (!Array.isArray(answerIds)) return [];
    return answerIds.map((id) => choiceLookup[id]?.label || '').filter(Boolean);
  };

  return {
    tbTotal,
    rdyTotal,
    timeBuybackScore,
    avaReadinessScore,
    topOffloadTasks,
    autonomyPreference,
    commCadence,
    timeLeaks,
    assistantType,
    outcome,
    insights,
    qualificationStatus,
    buyBackRate: bbRate.buyBackRate,
    hourlyRate: bbRate.hourlyRate,
    monthlyTakeHomeMidpoint: bbRate.monthlyTakeHomeMidpoint,
    stage: getLabel('S0', answers['S0'] || ''),
    teamSize: getLabel('S1', answers['S1'] || ''),
    tools: getLabels('S3', answers['S3'] || []),
    timeBackUse: getLabel('F3', answers['F3'] || ''),
    supportBlocker: getLabel('C3', answers['C3'] || ''),
    accessTimeline: getLabel('E3', answers['E3'] || ''),
    sopMaturity: getLabel('E4', answers['E4'] || ''),
    responseSpeed: getLabel('R1', answers['R1'] || ''),
    accessComfort: getLabel('R2', answers['R2'] || ''),
    delegationSystemHelp: getLabel('R4', answers['R4'] || ''),
    monthlyTakeHome: getLabel('BB1', answers['BB1'] || ''),
    cashflowStability: getLabel('BB3', answers['BB3'] || ''),
    commitTimeline: getLabel('BB4', answers['BB4'] || ''),
    burnoutLevel: getLabel('A5', answers['A5'] || ''),
    aiAdoption: getLabel('G1', answers['G1'] || ''),
    aiFeeling: getLabel('G2', answers['G2'] || ''),
    adminDelayedDecision: getLabel('B2', answers['B2'] || ''),
  };
}

// ============================================================
// Export helpers -- v8
// ============================================================
export function generateExportJSON(answers: Answers, results: AssessmentResults) {
  return {
    meta: {
      assessmentVersion: '8.0',
      completedAt: new Date().toISOString(),
    },
    rawAnswers: answers,
    scores: {
      tbTotal: results.tbTotal,
      rdyTotal: results.rdyTotal,
      tbMax: TB_MAX,
      rdyMax: RDY_MAX,
      timeBuybackScore: results.timeBuybackScore,
      avaReadinessScore: results.avaReadinessScore,
    },
    qualification: {
      qualificationStatus: results.qualificationStatus,
      buyBackRate: results.buyBackRate,
      hourlyRate: results.hourlyRate,
      monthlyTakeHomeMidpoint: results.monthlyTakeHomeMidpoint,
      monthlyTakeHome: results.monthlyTakeHome,
      cashflowStability: results.cashflowStability,
      commitTimeline: results.commitTimeline,
    },
    derivedOutputs: {
      autonomyPreference: results.autonomyPreference,
      commCadence: results.commCadence,
      topOffloadTasks: results.topOffloadTasks,
      timeLeaks: results.timeLeaks,
      insights: results.insights,
    },
    readinessPredictors: {
      responseSpeed: results.responseSpeed,
      accessComfort: results.accessComfort,
      delegationSystemHelp: results.delegationSystemHelp,
    },
    aiReadiness: {
      aiAdoption: results.aiAdoption,
      aiFeeling: results.aiFeeling,
    },
    burnout: {
      burnoutLevel: results.burnoutLevel,
    },
    recommendation: {
      assistantType: results.assistantType,
      archetype: results.outcome.archetype,
      outcomeId: results.outcome.id,
      outcomeName: results.outcome.name,
      onboardingStyle: results.outcome.onboardingStyle,
      endingKey: results.outcome.endingKey,
    },
    snapshot: {
      stage: results.stage,
      teamSize: results.teamSize,
      tools: results.tools,
      timeBackUse: results.timeBackUse,
      supportBlocker: results.supportBlocker,
      accessTimeline: results.accessTimeline,
      sopMaturity: results.sopMaturity,
      adminDelayedDecision: results.adminDelayedDecision,
    },
  };
}

export function generateExportCSVRow(answers: Answers, results: AssessmentResults): string {
  const headers = [
    'version', 'completed_at', 'qualification_status', 'buy_back_rate', 'hourly_rate',
    'monthly_take_home', 'cashflow_stability', 'commit_timeline',
    'stage', 'team_size', 'tools',
    'tb_total', 'rdy_total', 'time_buyback_score', 'assistant_readiness_score',
    'autonomy_preference', 'comm_cadence',
    'response_speed', 'access_comfort', 'delegation_system_help',
    'burnout_level', 'ai_adoption', 'ai_feeling',
    'admin_delayed_decision',
    'assistant_type', 'archetype', 'outcome_id', 'onboarding_style',
    'top_offload_tasks', 'time_leaks', 'support_blocker',
    'access_timeline', 'sop_maturity', 'time_back_use',
    'insight_bottleneck', 'insight_time_roi', 'insight_ai_opportunity',
  ];

  const values = [
    '8.0',
    new Date().toISOString(),
    results.qualificationStatus,
    `$${results.buyBackRate}/hr`,
    `$${results.hourlyRate}/hr`,
    results.monthlyTakeHome,
    results.cashflowStability,
    results.commitTimeline,
    results.stage,
    results.teamSize,
    results.tools.join('; '),
    results.tbTotal.toString(),
    results.rdyTotal.toString(),
    results.timeBuybackScore.toString(),
    results.avaReadinessScore.toString(),
    results.autonomyPreference,
    results.commCadence,
    results.responseSpeed,
    results.accessComfort,
    results.delegationSystemHelp,
    results.burnoutLevel,
    results.aiAdoption,
    results.aiFeeling,
    results.adminDelayedDecision,
    `${results.assistantType.type}: ${results.assistantType.label}`,
    results.outcome.archetype,
    results.outcome.id,
    results.outcome.onboardingStyle,
    results.topOffloadTasks.join('; '),
    results.timeLeaks.join('; '),
    results.supportBlocker,
    results.accessTimeline,
    results.sopMaturity,
    results.timeBackUse,
    results.insights.bottleneckMoment ? 'Yes' : 'No',
    results.insights.timeRoiReality ? 'Yes' : 'No',
    results.insights.aiOpportunity ? 'Yes' : 'No',
  ];

  const escapeCsv = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return headers.map(escapeCsv).join(',') + '\n' + values.map(escapeCsv).join(',');
}
