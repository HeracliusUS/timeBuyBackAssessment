// ============================================================
// ASSESSMENT DATA — v8.0: "The Just Ask AVA Clarity & Capacity Assessment"
// Changes from v7:
//   - Section order: S → A → B → C → D → E → F → R → G → BB (E+F before R)
//   - Deleted R0 bridge question (no longer needed with correct section order)
//   - 35 questions across 10 sections (was 36 in v7)
// ============================================================

export interface Choice {
  id: string;
  label: string;
  tb: number | null;
  rdy: number | null;
  tag: string;
}

export interface Question {
  section: string;
  order: number;
  qId: string;
  fieldKey: string;
  questionText: string;
  questionType: 'single_select' | 'multi_select';
  required: boolean;
  maxSelect?: number;
  scored: boolean;
  tbScoring: string;
  rdyScoring: string;
  notes: string;
  choices: Choice[];
  dynamicChoices?: boolean;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  questions: Question[];
}

export interface Outcome {
  id: string;
  name: string;
  archetype: string;
  recommendedAssistantType: string;
  onboardingStyle: string;
  endingKey: string;
  headline: string;
  body: string;
  firstWeekWins: string[];
  ctaLabel: string;
}

// TB_MAX = A(15)+B(12)+C(9)+D(15)+E(9)+F(16)+G(6) = 82
// RDY_MAX = A(15)+B(12)+C(9)+D(15)+E(9)+F(3)+R(9)+G(6) = 78
export const TB_MAX = 82;
export const RDY_MAX = 78;

export const f1WeightMap: Record<string, number> = {
  'F1_A1': 2, 'F1_A2': 2, 'F1_A3': 1, 'F1_A4': 1,
  'F1_O1': 1, 'F1_O2': 1, 'F1_O3': 1, 'F1_O4': 1,
  'F1_S1': 1, 'F1_S2': 1, 'F1_S3': 1, 'F1_S4': 1, 'F1_S5': 1,
};

export const F1_TB_CAP = 13;

export const f1Categories = [
  {
    label: 'Administrative Support',
    description: 'Day-to-day tasks that keep the business running',
    choiceIds: ['F1_A1', 'F1_A2', 'F1_A3', 'F1_A4'],
  },
  {
    label: 'Operational Support',
    description: 'Coordination and execution that drive follow-through',
    choiceIds: ['F1_O1', 'F1_O2', 'F1_O3', 'F1_O4'],
  },
  {
    label: 'Strategic Support',
    description: 'Higher-leverage work that scales your business',
    choiceIds: ['F1_S1', 'F1_S2', 'F1_S3', 'F1_S4', 'F1_S5'],
  },
];

export const sections: Section[] = [
  // S: Quick Snapshot
  {
    id: 'S',
    title: 'Quick Snapshot',
    subtitle: 'A few basics so we can personalize your results.',
    questions: [
      {
        section: 'S', order: 1, qId: 'S0', fieldKey: 'stage',
        questionText: 'What stage is your business in right now?',
        questionType: 'single_select', required: true, scored: false,
        tbScoring: '', rdyScoring: '', notes: '',
        choices: [
          { id: 'S0_1', label: 'Pre-revenue', tb: null, rdy: null, tag: 'stage' },
          { id: 'S0_2', label: 'Early revenue (inconsistent)', tb: null, rdy: null, tag: 'stage' },
          { id: 'S0_3', label: 'Stable revenue', tb: null, rdy: null, tag: 'stage' },
          { id: 'S0_4', label: 'Scaling / multiple offers', tb: null, rdy: null, tag: 'stage' },
        ],
      },
      {
        section: 'S', order: 2, qId: 'S1', fieldKey: 'team_size',
        questionText: 'Current team size (including contractors)?',
        questionType: 'single_select', required: true, scored: false,
        tbScoring: '', rdyScoring: '', notes: '',
        choices: [
          { id: 'S1_1', label: 'Just me', tb: null, rdy: null, tag: 'team' },
          { id: 'S1_2', label: '1\u20132 people', tb: null, rdy: null, tag: 'team' },
          { id: 'S1_3', label: '3\u20137 people', tb: null, rdy: null, tag: 'team' },
          { id: 'S1_4', label: '8+', tb: null, rdy: null, tag: 'team' },
        ],
      },
      {
        section: 'S', order: 3, qId: 'S3', fieldKey: 'tools',
        questionText: 'Which tools do you currently use? (optional)',
        questionType: 'multi_select', required: false, maxSelect: 12, scored: false,
        tbScoring: '', rdyScoring: '', notes: 'Optional',
        choices: [
          { id: 'S3_1', label: 'Google Workspace', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_2', label: 'Microsoft 365', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_3', label: 'Slack', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_4', label: 'ClickUp', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_5', label: 'Asana', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_6', label: 'Trello', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_7', label: 'Notion', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_8', label: 'HubSpot', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_9', label: 'Pipedrive', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_10', label: 'Dubsado / HoneyBook', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_11', label: 'QuickBooks / Xero', tb: null, rdy: null, tag: 'tools' },
          { id: 'S3_12', label: 'Other', tb: null, rdy: null, tag: 'tools' },
        ],
      },
    ],
  },

  // A: Your Time Reality
  {
    id: 'A',
    title: 'Your Time Reality',
    subtitle: 'Let\u2019s get honest about where your hours actually go each week.',
    questions: [
      {
        section: 'A', order: 1, qId: 'A1', fieldKey: 'day_busy_not_forward',
        questionText: 'In a typical week, how often do you end the day feeling \u201cbusy\u201d but didn\u2019t move forward?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'A1_1', label: 'Almost every day', tb: 3, rdy: 0, tag: 'time' },
          { id: 'A1_2', label: '3\u20134 days/week', tb: 2, rdy: 1, tag: 'time' },
          { id: 'A1_3', label: '1\u20132 days/week', tb: 1, rdy: 2, tag: 'time' },
          { id: 'A1_4', label: 'Rarely', tb: 0, rdy: 3, tag: 'time' },
        ],
      },
      {
        section: 'A', order: 2, qId: 'A2', fieldKey: 'admin_hours',
        questionText: 'How many hours/week do you spend on admin, scheduling, and follow-ups?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'A2_1', label: '20+ hours', tb: 3, rdy: 0, tag: 'admin' },
          { id: 'A2_2', label: '10\u201320 hours', tb: 2, rdy: 1, tag: 'admin' },
          { id: 'A2_3', label: '5\u201310 hours', tb: 1, rdy: 2, tag: 'admin' },
          { id: 'A2_4', label: 'Under 5 hours', tb: 0, rdy: 3, tag: 'admin' },
        ],
      },
      {
        section: 'A', order: 3, qId: 'A3', fieldKey: 'context_switches',
        questionText: 'How often do you context-switch between \u201cCEO work\u201d and \u201cadmin work\u201d in a day?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'A3_1', label: 'Constantly', tb: 3, rdy: 0, tag: 'switching' },
          { id: 'A3_2', label: 'Several times', tb: 2, rdy: 1, tag: 'switching' },
          { id: 'A3_3', label: 'A few times', tb: 1, rdy: 2, tag: 'switching' },
          { id: 'A3_4', label: 'Rarely \u2014 I have blocks', tb: 0, rdy: 3, tag: 'switching' },
        ],
      },
      {
        section: 'A', order: 4, qId: 'A4', fieldKey: 'interruptions',
        questionText: 'How often are you interrupted by tasks that someone else could handle?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'A4_1', label: 'Multiple times/day', tb: 3, rdy: 0, tag: 'interruptions' },
          { id: 'A4_2', label: 'Daily', tb: 2, rdy: 1, tag: 'interruptions' },
          { id: 'A4_3', label: 'A few times/week', tb: 1, rdy: 2, tag: 'interruptions' },
          { id: 'A4_4', label: 'Rarely', tb: 0, rdy: 3, tag: 'interruptions' },
        ],
      },
      {
        section: 'A', order: 5, qId: 'A5', fieldKey: 'burnout',
        questionText: 'How sustainable does your current workload feel?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice',
        notes: 'Burnout/sustainability indicator',
        choices: [
          { id: 'A5_1', label: 'I\u2019m burning out', tb: 3, rdy: 0, tag: 'burnout' },
          { id: 'A5_2', label: 'It\u2019s heavy but manageable', tb: 2, rdy: 1, tag: 'burnout' },
          { id: 'A5_3', label: 'Mostly sustainable', tb: 1, rdy: 2, tag: 'burnout' },
          { id: 'A5_4', label: 'I have good balance', tb: 0, rdy: 3, tag: 'burnout' },
        ],
      },
    ],
  },

  // B: Bottleneck Patterns (v7: B1_5→B2, B2→B3, B3→B4, B4→B5)
  {
    id: 'B',
    title: 'Bottleneck Patterns',
    subtitle: 'Where you might be the constraint \u2014 not a flaw, just a pattern worth seeing.',
    questions: [
      {
        section: 'B', order: 1, qId: 'B2', fieldKey: 'admin_delayed_decision',
        questionText: 'In the last quarter, have administrative or coordination tasks ever delayed an important decision or initiative?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice',
        notes: 'v7: Was B1_5 in v6. Renamed to B2.',
        choices: [
          { id: 'B2_1', label: 'Yes, frequently', tb: 3, rdy: 0, tag: 'bottleneck' },
          { id: 'B2_2', label: 'Yes, a few times', tb: 2, rdy: 1, tag: 'bottleneck' },
          { id: 'B2_3', label: 'Rarely', tb: 1, rdy: 2, tag: 'bottleneck' },
          { id: 'B2_4', label: 'No', tb: 0, rdy: 3, tag: 'bottleneck' },
        ],
      },
      {
        section: 'B', order: 2, qId: 'B3', fieldKey: 'needs_owner_finish',
        questionText: 'Most tasks \u201cneed you\u201d to finish (approve, check, rewrite, resend).',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'B3_1', label: 'Very true right now', tb: 3, rdy: 0, tag: 'bottleneck' },
          { id: 'B3_2', label: 'Somewhat true', tb: 2, rdy: 1, tag: 'bottleneck' },
          { id: 'B3_3', label: 'Usually not true', tb: 1, rdy: 2, tag: 'bottleneck' },
          { id: 'B3_4', label: 'Rarely true', tb: 0, rdy: 3, tag: 'bottleneck' },
        ],
      },
      {
        section: 'B', order: 3, qId: 'B4', fieldKey: 'inbox_command_center',
        questionText: 'Your business inbox feels like your command center.',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'B4_1', label: 'Very true right now', tb: 3, rdy: 0, tag: 'bottleneck' },
          { id: 'B4_2', label: 'Somewhat true', tb: 2, rdy: 1, tag: 'bottleneck' },
          { id: 'B4_3', label: 'Usually not true', tb: 1, rdy: 2, tag: 'bottleneck' },
          { id: 'B4_4', label: 'Rarely true', tb: 0, rdy: 3, tag: 'bottleneck' },
        ],
      },
      {
        section: 'B', order: 4, qId: 'B5', fieldKey: 'calendar_runs_you',
        questionText: 'Your calendar runs you more than you run it.',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'B5_1', label: 'Very true right now', tb: 3, rdy: 0, tag: 'bottleneck' },
          { id: 'B5_2', label: 'Somewhat true', tb: 2, rdy: 1, tag: 'bottleneck' },
          { id: 'B5_3', label: 'Usually not true', tb: 1, rdy: 2, tag: 'bottleneck' },
          { id: 'B5_4', label: 'Rarely true', tb: 0, rdy: 3, tag: 'bottleneck' },
        ],
      },
    ],
  },

  // C: Letting Go
  {
    id: 'C',
    title: 'Letting Go',
    subtitle: 'Delegation comfort \u2014 where you are today, not where you \u201cshould\u201d be.',
    questions: [
      {
        section: 'C', order: 1, qId: 'C1', fieldKey: 'delegation_truth',
        questionText: 'When you delegate, what\u2019s most true right now?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'C1_1', label: '\u201cIt\u2019s faster if I do it\u201d', tb: 3, rdy: 0, tag: 'delegation' },
          { id: 'C1_2', label: '\u201cI\u2019ll delegate once I have time to explain it\u201d', tb: 2, rdy: 1, tag: 'delegation' },
          { id: 'C1_3', label: '\u201cI\u2019m building the muscle\u201d', tb: 1, rdy: 2, tag: 'delegation' },
          { id: 'C1_4', label: '\u201cDelegation is how we scale\u201d', tb: 0, rdy: 3, tag: 'delegation' },
        ],
      },
      {
        section: 'C', order: 2, qId: 'C2', fieldKey: 'different_style_response',
        questionText: 'When someone handles something differently than you would, you typically\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'C2_1', label: 'Take it back', tb: 3, rdy: 0, tag: 'delegation' },
          { id: 'C2_2', label: 'Fix it quietly', tb: 2, rdy: 1, tag: 'delegation' },
          { id: 'C2_3', label: 'Give feedback and adjust', tb: 1, rdy: 2, tag: 'delegation' },
          { id: 'C2_4', label: 'Let outcomes guide improvements', tb: 0, rdy: 3, tag: 'delegation' },
        ],
      },
      {
        section: 'C', order: 3, qId: 'C3', fieldKey: 'why_support_not_worked',
        questionText: 'Biggest reason support hasn\u2019t worked smoothly (choose one)',
        questionType: 'single_select', required: true, scored: false,
        tbScoring: '', rdyScoring: '', notes: 'Used for onboarding plan',
        choices: [
          { id: 'C3_1', label: 'Trust / confidentiality', tb: null, rdy: null, tag: 'blocker' },
          { id: 'C3_2', label: 'Training someone feels like extra work', tb: null, rdy: null, tag: 'blocker' },
          { id: 'C3_3', label: 'Cost uncertainty / ROI', tb: null, rdy: null, tag: 'blocker' },
          { id: 'C3_4', label: 'Hard to find the right person', tb: null, rdy: null, tag: 'blocker' },
          { id: 'C3_5', label: 'Past support didn\u2019t work out', tb: null, rdy: null, tag: 'blocker' },
        ],
      },
      {
        section: 'C', order: 4, qId: 'C4', fieldKey: 'guardrails_comfort',
        questionText: 'If an Executive Assistant could own recurring tasks with clear guardrails, you\u2019d feel\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'C4_1', label: 'Very uncomfortable', tb: 3, rdy: 0, tag: 'delegation' },
          { id: 'C4_2', label: 'Unsure but open', tb: 2, rdy: 1, tag: 'delegation' },
          { id: 'C4_3', label: 'Comfortable with check-ins', tb: 1, rdy: 2, tag: 'delegation' },
          { id: 'C4_4', label: 'Very comfortable', tb: 0, rdy: 3, tag: 'delegation' },
        ],
      },
    ],
  },

  // D: Decision Rights
  {
    id: 'D',
    title: 'Decision Rights',
    subtitle: 'How much room can your Executive Assistant have to act without waiting on you?',
    questions: [
      {
        section: 'D', order: 1, qId: 'D1', fieldKey: 'decision_preference',
        questionText: 'Which best describes your current preference for decisions?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'D1_1', label: 'I need to approve most things', tb: 3, rdy: 0, tag: 'autonomy' },
          { id: 'D1_2', label: 'Approve important things; others can be handled', tb: 2, rdy: 1, tag: 'autonomy' },
          { id: 'D1_3', label: 'Assistant can decide with rules/guidelines', tb: 1, rdy: 2, tag: 'autonomy' },
          { id: 'D1_4', label: 'Assistant can decide + bring exceptions', tb: 0, rdy: 3, tag: 'autonomy' },
        ],
      },
      {
        section: 'D', order: 2, qId: 'D2', fieldKey: 'email_support_level',
        questionText: 'For email, your ideal support level is\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'D2_1', label: 'I handle it all', tb: 3, rdy: 0, tag: 'email' },
          { id: 'D2_2', label: 'Assistant drafts; I send', tb: 2, rdy: 1, tag: 'email' },
          { id: 'D2_3', label: 'Assistant triages + drafts + flags decisions', tb: 1, rdy: 2, tag: 'email' },
          { id: 'D2_4', label: 'Assistant owns inbox workflows + escalates key items', tb: 0, rdy: 3, tag: 'email' },
        ],
      },
      {
        section: 'D', order: 3, qId: 'D3', fieldKey: 'calendar_support_level',
        questionText: 'For calendar/scheduling, your ideal is\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'D3_1', label: 'I schedule everything', tb: 3, rdy: 0, tag: 'calendar' },
          { id: 'D3_2', label: 'Assistant schedules with my approval', tb: 2, rdy: 1, tag: 'calendar' },
          { id: 'D3_3', label: 'Assistant schedules within rules', tb: 1, rdy: 2, tag: 'calendar' },
          { id: 'D3_4', label: 'Assistant manages calendar strategy (buffers, priorities, prep)', tb: 0, rdy: 3, tag: 'calendar' },
        ],
      },
      {
        section: 'D', order: 4, qId: 'D4', fieldKey: 'assistant_question_preference',
        questionText: 'When your Executive Assistant needs clarity, you prefer they\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'D4_1', label: 'Wait for my answer', tb: 3, rdy: 0, tag: 'autonomy' },
          { id: 'D4_2', label: 'Ask, then proceed', tb: 2, rdy: 1, tag: 'autonomy' },
          { id: 'D4_3', label: 'Suggest options + recommendation', tb: 1, rdy: 2, tag: 'autonomy' },
          { id: 'D4_4', label: 'Decide within guardrails + inform me', tb: 0, rdy: 3, tag: 'autonomy' },
        ],
      },
      {
        section: 'D', order: 5, qId: 'D5', fieldKey: 'comm_cadence',
        questionText: 'Your communication preference is\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'D5_1', label: 'Real-time (lots of pings)', tb: 3, rdy: 1, tag: 'comms' },
          { id: 'D5_2', label: 'A few check-ins per day', tb: 2, rdy: 2, tag: 'comms' },
          { id: 'D5_3', label: 'Daily summary + async', tb: 1, rdy: 3, tag: 'comms' },
          { id: 'D5_4', label: 'Weekly review + async updates', tb: 0, rdy: 3, tag: 'comms' },
        ],
      },
    ],
  },

  // E: Access & Systems Readiness
  {
    id: 'E',
    title: 'Access & Systems Readiness',
    subtitle: 'Can an Executive Assistant actually take the wheel \u2014 or do we need to build the road first?',
    questions: [
      {
        section: 'E', order: 1, qId: 'E2', fieldKey: 'file_org',
        questionText: 'Your files/docs are\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'E2_1', label: 'Scattered', tb: 3, rdy: 0, tag: 'systems' },
          { id: 'E2_2', label: 'Somewhat organized', tb: 2, rdy: 1, tag: 'systems' },
          { id: 'E2_3', label: 'Mostly organized', tb: 1, rdy: 2, tag: 'systems' },
          { id: 'E2_4', label: 'Easy to navigate for someone new', tb: 0, rdy: 3, tag: 'systems' },
        ],
      },
      {
        section: 'E', order: 2, qId: 'E3', fieldKey: 'access_timeline',
        questionText: 'If an Executive Assistant started next week, you could give access to needed tools within\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'E3_1', label: 'Not sure / would take weeks', tb: 3, rdy: 0, tag: 'access' },
          { id: 'E3_2', label: '1\u20132 weeks', tb: 2, rdy: 1, tag: 'access' },
          { id: 'E3_3', label: 'A few days', tb: 1, rdy: 2, tag: 'access' },
          { id: 'E3_4', label: 'Same day', tb: 0, rdy: 3, tag: 'access' },
        ],
      },
      {
        section: 'E', order: 3, qId: 'E4', fieldKey: 'sop_maturity',
        questionText: 'Processes/SOPs right now are\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'E4_1', label: 'Mostly tribal knowledge', tb: 3, rdy: 0, tag: 'sops' },
          { id: 'E4_2', label: 'A few written down', tb: 2, rdy: 1, tag: 'sops' },
          { id: 'E4_3', label: 'Key ones exist', tb: 1, rdy: 2, tag: 'sops' },
          { id: 'E4_4', label: 'We can hand someone a playbook', tb: 0, rdy: 3, tag: 'sops' },
        ],
      },
    ],
  },

  // F: What You’re Paying Yourself to Do (no maxSelect on F1)
  {
    id: 'F',
    title: 'What You\u2019re Paying Yourself to Do',
    subtitle: 'The tasks that fill your week \u2014 grouped by the type of support they represent.',
    questions: [
      {
        section: 'F', order: 1, qId: 'F1', fieldKey: 'owner_tasks_weekly',
        questionText: 'Which tasks do you personally spend time on weekly? (select all that apply)',
        questionType: 'multi_select', required: true, scored: true,
        tbScoring: 'weighted_sum_capped', rdyScoring: 'always_0',
        notes: 'v7: No maxSelect limit. All 13 tasks selectable. Scoring capped at F1_TB_CAP=13.',
        choices: [
          { id: 'F1_A1', label: 'Inbox / email correspondence', tb: null, rdy: null, tag: 'task_admin' },
          { id: 'F1_A2', label: 'Calendar + scheduling', tb: null, rdy: null, tag: 'task_admin' },
          { id: 'F1_A3', label: 'Travel booking', tb: null, rdy: null, tag: 'task_admin' },
          { id: 'F1_A4', label: 'Document prep / management', tb: null, rdy: null, tag: 'task_admin' },
          { id: 'F1_O1', label: 'Project coordination / follow-through', tb: null, rdy: null, tag: 'task_ops' },
          { id: 'F1_O2', label: 'Task / workflow management', tb: null, rdy: null, tag: 'task_ops' },
          { id: 'F1_O3', label: 'Accounting / invoicing admin', tb: null, rdy: null, tag: 'task_ops' },
          { id: 'F1_O4', label: 'Customer support / client communication', tb: null, rdy: null, tag: 'task_ops' },
          { id: 'F1_S1', label: 'Research / data collection', tb: null, rdy: null, tag: 'task_strategic' },
          { id: 'F1_S2', label: 'Social media management', tb: null, rdy: null, tag: 'task_strategic' },
          { id: 'F1_S3', label: 'CRM / pipeline management', tb: null, rdy: null, tag: 'task_strategic' },
          { id: 'F1_S4', label: 'Reporting / KPI tracking', tb: null, rdy: null, tag: 'task_strategic' },
          { id: 'F1_S5', label: 'SOPs / process documentation', tb: null, rdy: null, tag: 'task_strategic' },
        ],
      },
      {
        section: 'F', order: 2, qId: 'F2', fieldKey: 'why_still_doing',
        questionText: 'When you do admin tasks, it\u2019s usually because\u2026',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'F2_1', label: 'No one else can / should', tb: 3, rdy: 0, tag: 'mindset' },
          { id: 'F2_2', label: 'I haven\u2019t had time to hand it off', tb: 2, rdy: 1, tag: 'mindset' },
          { id: 'F2_3', label: 'I\u2019m in between support', tb: 1, rdy: 1, tag: 'mindset' },
          { id: 'F2_4', label: 'I\u2019m ready to focus on higher-value work (and want help)', tb: 0, rdy: 3, tag: 'mindset' },
        ],
      },
      {
        section: 'F', order: 3, qId: 'F3', fieldKey: 'time_back_use',
        questionText: 'If you got 10 hours/week back, you\u2019d use it for\u2026',
        questionType: 'single_select', required: true, scored: false,
        tbScoring: '', rdyScoring: '', notes: 'Used for results narrative. Covers what BB5 used to ask.',
        choices: [
          { id: 'F3_1', label: 'Sales / partnerships', tb: null, rdy: null, tag: 'goal_use' },
          { id: 'F3_2', label: 'Marketing / content', tb: null, rdy: null, tag: 'goal_use' },
          { id: 'F3_3', label: 'Operations / delivery quality', tb: null, rdy: null, tag: 'goal_use' },
          { id: 'F3_4', label: 'Strategy / leadership / team building', tb: null, rdy: null, tag: 'goal_use' },
          { id: 'F3_5', label: 'Personal time / recovery', tb: null, rdy: null, tag: 'goal_use' },
        ],
      },
    ],
  },

  // R: Success Predictors (v8: R0 deleted, placed after F for correct data flow)
  {
    id: 'R',
    title: 'Success Predictors',
    subtitle: 'These help us match you with the right onboarding style and communication rhythm.',
    questions: [
      {
        section: 'R', order: 1, qId: 'R1', fieldKey: 'response_speed',
        questionText: 'When your Executive Assistant asks a question, how quickly can you typically respond?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: '', rdyScoring: 'points_from_choice', notes: 'RDY only',
        choices: [
          { id: 'R1_1', label: 'Same day', tb: 0, rdy: 3, tag: 'readiness' },
          { id: 'R1_2', label: '24–48 hours', tb: 0, rdy: 2, tag: 'readiness' },
          { id: 'R1_3', label: '3–5 days', tb: 0, rdy: 1, tag: 'readiness' },
          { id: 'R1_4', label: 'It varies a lot / inconsistent', tb: 0, rdy: 0, tag: 'readiness' },
        ],
      },
      {
        section: 'R', order: 2, qId: 'R2', fieldKey: 'access_comfort',
        questionText: 'How comfortable are you granting access (email/calendar/tools) with safeguards (password manager, 2FA, role-based access)?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: '', rdyScoring: 'points_from_choice', notes: 'RDY only',
        choices: [
          { id: 'R2_1', label: 'Uncomfortable', tb: 0, rdy: 0, tag: 'readiness' },
          { id: 'R2_2', label: 'Cautious', tb: 0, rdy: 1, tag: 'readiness' },
          { id: 'R2_3', label: 'Comfortable', tb: 0, rdy: 2, tag: 'readiness' },
          { id: 'R2_4', label: 'Very comfortable', tb: 0, rdy: 3, tag: 'readiness' },
        ],
      },
      {
        section: 'R', order: 3, qId: 'R4', fieldKey: 'delegation_system_help',
        questionText: 'Would you like your Executive Assistant to help build your delegation system (guardrails, weekly review, SOPs)?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: '', rdyScoring: 'points_from_choice', notes: 'RDY only',
        choices: [
          { id: 'R4_1', label: 'Yes', tb: 0, rdy: 3, tag: 'readiness' },
          { id: 'R4_2', label: 'Maybe', tb: 0, rdy: 2, tag: 'readiness' },
          { id: 'R4_3', label: 'No', tb: 0, rdy: 0, tag: 'readiness' },
        ],
      },
    ],
  },

  // G: AI & Automation Readiness
  {
    id: 'G',
    title: 'AI & Automation Readiness',
    subtitle: 'Understanding your comfort with AI helps us recommend the right blend of human and automated support.',
    questions: [
      {
        section: 'G', order: 1, qId: 'G1', fieldKey: 'ai_adoption',
        questionText: 'How are you currently using AI tools (ChatGPT, automation, etc.) in your business?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'G1_1', label: 'Not using AI at all', tb: 3, rdy: 0, tag: 'ai' },
          { id: 'G1_2', label: 'Experimenting / occasional use', tb: 2, rdy: 1, tag: 'ai' },
          { id: 'G1_3', label: 'Using it regularly for specific tasks', tb: 1, rdy: 2, tag: 'ai' },
          { id: 'G1_4', label: 'AI is integrated into my workflows', tb: 0, rdy: 3, tag: 'ai' },
        ],
      },
      {
        section: 'G', order: 2, qId: 'G2', fieldKey: 'ai_feeling',
        questionText: 'How do you feel about AI handling parts of your business operations?',
        questionType: 'single_select', required: true, scored: true,
        tbScoring: 'points_from_choice', rdyScoring: 'points_from_choice', notes: '',
        choices: [
          { id: 'G2_1', label: 'Skeptical \u2014 I prefer human-only support', tb: 3, rdy: 0, tag: 'ai_comfort' },
          { id: 'G2_2', label: 'Cautiously curious', tb: 2, rdy: 1, tag: 'ai_comfort' },
          { id: 'G2_3', label: 'Open to it with the right guardrails', tb: 1, rdy: 2, tag: 'ai_comfort' },
          { id: 'G2_4', label: 'Excited \u2014 I want AI + human working together', tb: 0, rdy: 3, tag: 'ai_comfort' },
        ],
      },
    ],
  },

  // BB: Investment Readiness (v7: moved to end, BB5 deleted)
  {
    id: 'BB',
    title: 'Investment Readiness',
    subtitle: 'A few financial questions so we can recommend the right path for you. All answers are confidential.',
    questions: [
      {
        section: 'BB', order: 1, qId: 'BB1', fieldKey: 'monthly_take_home',
        questionText: 'What is your approximate average monthly take-home pay (owner\u2019s draw/salary) from the business?',
        questionType: 'single_select', required: true, scored: false,
        tbScoring: '', rdyScoring: '', notes: 'Used for qualification + Buy Back Rate',
        choices: [
          { id: 'BB1_1', label: '$0\u2013$3k', tb: null, rdy: null, tag: 'income' },
          { id: 'BB1_2', label: '$3k\u2013$6k', tb: null, rdy: null, tag: 'income' },
          { id: 'BB1_3', label: '$6k\u2013$10k', tb: null, rdy: null, tag: 'income' },
          { id: 'BB1_4', label: '$10k+', tb: null, rdy: null, tag: 'income' },
        ],
      },
      {
        section: 'BB', order: 2, qId: 'BB3', fieldKey: 'cashflow_stability',
        questionText: 'Cashflow stability (last 3 months)',
        questionType: 'single_select', required: true, scored: false,
        tbScoring: '', rdyScoring: '', notes: '',
        choices: [
          { id: 'BB3_1', label: 'Unpredictable (varies a lot)', tb: null, rdy: null, tag: 'cashflow' },
          { id: 'BB3_2', label: 'Somewhat predictable', tb: null, rdy: null, tag: 'cashflow' },
          { id: 'BB3_3', label: 'Predictable', tb: null, rdy: null, tag: 'cashflow' },
          { id: 'BB3_4', label: 'Very predictable', tb: null, rdy: null, tag: 'cashflow' },
        ],
      },
      {
        section: 'BB', order: 3, qId: 'BB4', fieldKey: 'commit_timeline',
        questionText: 'How quickly can you comfortably commit to $2,500/month for full-time support?',
        questionType: 'single_select', required: true, scored: false,
        tbScoring: '', rdyScoring: '', notes: '',
        choices: [
          { id: 'BB4_1', label: 'Now', tb: null, rdy: null, tag: 'commit' },
          { id: 'BB4_2', label: 'In 30 days', tb: null, rdy: null, tag: 'commit' },
          { id: 'BB4_3', label: 'In 60\u201390 days', tb: null, rdy: null, tag: 'commit' },
          { id: 'BB4_4', label: 'Not sure', tb: null, rdy: null, tag: 'commit' },
        ],
      },
    ],
  },
];

// Task offload priority order
export const taskOffloadPriority: Record<string, string> = {
  'F1_A1': 'Inbox / email correspondence',
  'F1_A2': 'Calendar + scheduling',
  'F1_O1': 'Project coordination / follow-through',
  'F1_O2': 'Task / workflow management',
  'F1_O3': 'Accounting / invoicing admin',
  'F1_A4': 'Document prep / management',
  'F1_A3': 'Travel booking',
  'F1_S1': 'Research / data collection',
  'F1_O4': 'Customer support / client communication',
  'F1_S2': 'Social media management',
  'F1_S3': 'CRM / pipeline management',
  'F1_S4': 'Reporting / KPI tracking',
  'F1_S5': 'SOPs / process documentation',
};

// 4 outcomes
export const outcomes: Outcome[] = [
  {
    id: 'O1', name: 'High TB + Low RDY', archetype: 'The Builder',
    recommendedAssistantType: 'Structured Executive Assistant (Inbox/Calendar-first)',
    onboardingStyle: 'Guided Partnership', endingKey: 'ENDING_BUILDER',
    headline: 'You\u2019re building the plane while flying it \u2014 and that takes grit.',
    body: 'You have a lot of time to reclaim, but delegation is still new territory. That\u2019s completely normal. The right move is starting with a structured Executive Assistant who takes over your inbox and calendar first \u2014 giving you quick wins while you build trust at your own pace. No pressure to hand over everything at once.',
    firstWeekWins: ['Inbox triage + priority labeling + response drafting', 'Calendar guardrails + meeting prep + buffers', 'Follow-up tracking so nothing drops'],
    ctaLabel: 'Design Your Support Plan',
  },
  {
    id: 'O2', name: 'High TB + Mid-High RDY', archetype: 'The Amplifier',
    recommendedAssistantType: 'Best-fit Executive Assistant (Inbox/Calendar or Operations)',
    onboardingStyle: 'Collaborative Partnership', endingKey: 'ENDING_AMPLIFIER',
    headline: 'You\u2019re in the sweet spot: big upside and real openness to delegate.',
    body: 'You have significant time to reclaim and enough delegation comfort to move fast. With a guided 30-day ramp, your Executive Assistant will be running key workflows with guardrails \u2014 and you\u2019ll feel the difference within the first week. This is where the magic happens.',
    firstWeekWins: ['Your top admin tasks handed off with a clear handoff plan', 'A shared task system so nothing lives in your head', 'Daily async summaries so you stay informed without micromanaging'],
    ctaLabel: 'Design Your Support Plan',
  },
  {
    id: 'O3', name: 'Mid-Low TB + Any RDY', archetype: 'The Optimizer',
    recommendedAssistantType: 'Operations + Follow-through Executive Assistant',
    onboardingStyle: 'Collaborative Partnership', endingKey: 'ENDING_OPTIMIZER',
    headline: 'You\u2019ve already done the hard work \u2014 now it\u2019s time to optimize.',
    body: 'Your time leaks are manageable, but there\u2019s real opportunity to level up consistency, follow-through, and system quality. An Operations Executive Assistant will immediately reduce dropped balls, context switches, and unclear handoffs \u2014 giving you cleaner weeks and more predictable outcomes.',
    firstWeekWins: ['Follow-up systems activated \u2014 nothing drops', 'Project coordination with clear ownership', 'Workflow handoffs documented and running'],
    ctaLabel: 'Design Your Support Plan',
  },
  {
    id: 'O4', name: 'High RDY (any TB)', archetype: 'The Architect',
    recommendedAssistantType: 'Executive Partner Assistant',
    onboardingStyle: 'Strategic Partnership', endingKey: 'ENDING_ARCHITECT',
    headline: 'You\u2019re ready for a proactive right-hand.',
    body: 'You have the readiness for an Executive Assistant who operates with real initiative. This is the highest-leverage placement \u2014 your assistant won\u2019t just execute tasks, they\u2019ll anticipate needs, manage workflows, and bring you exceptions instead of questions. Think of it as hiring your Chief of Staff.',
    firstWeekWins: ['Decision guardrails established (\u201cIf X, do Y; if Z, escalate\u201d)', 'Weekly CEO review + dashboard-style summary', 'Project follow-through + deadline ownership'],
    ctaLabel: 'Design Your Support Plan',
  },
];

// v7: B1_5 → B2, old B2 → B3, old B3 → B4, old B4 → B5
export const timeLeakLabels: Record<string, string> = {
  B4: 'Inbox is acting like a second job',
  B5: 'Calendar and scheduling are eating your focus time',
  B2: 'Admin tasks are delaying important decisions',
  B3: 'Tasks need you to finish \u2014 approvals are a chokepoint',
  A4: 'Interruptions are fragmenting your deep work',
  A2: 'Admin load is consuming hours that could go to growth',
  A5: 'Your workload sustainability is at risk',
};
