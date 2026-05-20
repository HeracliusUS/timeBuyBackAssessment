/*
 * Design: JustAskAVA.com brand -- Internal team summary
 * v7: Clarity & Capacity Assessment
 * - B1_5→B2, old B2→B3, B3→B4, B4→B5
 * - BB5 deleted (F3 covers reclaimed-time-use)
 * - Section order: S→A→B→C→D→R→E→F→G→BB
 */

import { useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, Printer } from 'lucide-react';
import { generateExportJSON, generateExportCSVRow, type Answers } from '@/lib/scoringEngine';

export default function InternalProfile() {
  const { results, answers, setView } = useAssessment();

  if (!results) return null;

  const {
    timeBuybackScore,
    avaReadinessScore,
    autonomyPreference,
    commCadence,
    assistantType,
    outcome,
    topOffloadTasks,
    timeLeaks,
    insights,
    stage,
    teamSize,
    tools,
    timeBackUse,
    supportBlocker,
    accessTimeline,
    sopMaturity,
    qualificationStatus,
    buyBackRate,
    hourlyRate,
    monthlyTakeHome,
    cashflowStability,
    commitTimeline,
    responseSpeed,
    accessComfort,
    delegationSystemHelp,
    burnoutLevel,
    aiAdoption,
    aiFeeling,
    adminDelayedDecision,
  } = results;

  const handlePrint = () => window.print();

  const handleDownloadJSON = () => {
    const data = generateExportJSON(answers as Answers, results);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assistant-match-profile.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csv = generateExportCSVRow(answers as Answers, results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assistant-match-profile.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const qualStatusLabel: string = {
    QUALIFIED_NOW: 'Qualified Now',
    QUALIFIED_SOON: 'Qualified Soon',
    QUALIFIED_FOR_PLAYBOOK: 'Playbook Path',
    NOT_QUALIFIED: 'Not Qualified',
  }[qualificationStatus];

  const qualStatusColor: string = {
    QUALIFIED_NOW: 'text-brand-green',
    QUALIFIED_SOON: 'text-brand-blue',
    QUALIFIED_FOR_PLAYBOOK: 'text-amber-600',
    NOT_QUALIFIED: 'text-muted-foreground',
  }[qualificationStatus];

  const ScoreBar = ({ score, color, label }: { score: number; color: string; label: string }) => (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="font-serif text-xl font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' as const }}
        />
      </div>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2 border-b border-border/60 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Header */}
      <div className="bg-brand-navy text-white print:bg-white print:text-foreground">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-light-blue/70 uppercase tracking-wider mb-1 print:text-muted-foreground">
                Internal Document
              </p>
              <h1 className="font-serif text-2xl font-semibold">Assistant Match Profile</h1>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setView('results'); window.scrollTo({ top: 0 }); }}
                className="text-brand-light-blue/70 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 print:py-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Investment Readiness */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
              Investment Readiness
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <div className="flex justify-between py-2 border-b border-border/60 last:border-0">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`text-sm font-bold ${qualStatusColor}`}>{qualStatusLabel}</span>
              </div>
              <InfoRow label="Monthly Take-Home" value={monthlyTakeHome || '\u2014'} />
              <InfoRow label="Cashflow Stability" value={cashflowStability || '\u2014'} />
              <InfoRow label="Commit Timeline" value={commitTimeline || '\u2014'} />
              <InfoRow label="Buy Back Rate" value={`$${buyBackRate}/hr`} />
              <InfoRow label="Hourly Rate (est.)" value={`$${hourlyRate}/hr`} />

            </div>
          </div>

          {/* Snapshot */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
              Client Snapshot
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <InfoRow label="Business Stage" value={stage || '\u2014'} />
              <InfoRow label="Team Size" value={teamSize || '\u2014'} />
              <InfoRow label="Tools" value={tools.length > 0 ? tools.join(', ') : '\u2014'} />
              <InfoRow label="Burnout Level" value={burnoutLevel || '\u2014'} />
            </div>
          </div>

          {/* Scores */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
              Assessment Scores
            </h2>
            <ScoreBar score={timeBuybackScore} color="#262262" label="Time Buyback Score" />
            <ScoreBar score={avaReadinessScore} color="#3561FF" label="Readiness Score" />
            <div className="grid sm:grid-cols-2 gap-x-8 mt-4">
              <InfoRow label="Autonomy Preference" value={autonomyPreference} />
              <InfoRow label="Communication Cadence" value={commCadence} />
            </div>
          </div>

          {/* Readiness Predictors */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
              Readiness Predictors
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <InfoRow label="Response Speed (R1)" value={responseSpeed || '\u2014'} />
              <InfoRow label="Access Comfort (R2)" value={accessComfort || '\u2014'} />
              <InfoRow label="System Help Willingness (R4)" value={delegationSystemHelp || '\u2014'} />
              <InfoRow label="Admin Delayed Decisions (B2)" value={adminDelayedDecision || '\u2014'} />
            </div>

          </div>

          {/* AI Readiness (NEW in v5) */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
              AI Readiness
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <InfoRow label="Current AI Use (G1)" value={aiAdoption || '\u2014'} />
              <InfoRow label="AI Feeling (G2)" value={aiFeeling || '\u2014'} />
            </div>
          </div>

          {/* Bottlenecks */}
          {timeLeaks.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
                Biggest Bottlenecks
              </h2>
              <ul className="space-y-2">
                {timeLeaks.map((leak, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                    <span className="text-brand-blue font-bold">{i + 1}.</span>
                    {leak}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Insight Triggers */}
          {(insights.bottleneckMoment || insights.timeRoiReality || insights.aiOpportunity) && (
            <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
                Insight Triggers
              </h2>
              <div className="space-y-2">
                <InfoRow label="Bottleneck Moment" value={insights.bottleneckMoment ? 'Triggered' : 'Not triggered'} />
                <InfoRow label="Time ROI Reality" value={insights.timeRoiReality ? 'Triggered' : 'Not triggered'} />
                <InfoRow label="AI Opportunity" value={insights.aiOpportunity ? 'Triggered' : 'Not triggered'} />
              </div>
            </div>
          )}

          {/* Delegation Friction */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
              Delegation Friction
            </h2>
            <InfoRow label="Primary Blocker" value={supportBlocker || '\u2014'} />
          </div>

          {/* Tasks to Offload */}
          {topOffloadTasks.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
              <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
                Task Categories to Offload (ranked)
              </h2>
              <ol className="space-y-1.5">
                {topOffloadTasks.map((task, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded bg-brand-navy/10 text-brand-navy text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{task}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tools & Access Readiness */}
          <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm print:shadow-none print:border print:rounded-none">
            <h2 className="font-serif text-lg font-semibold text-brand-navy mb-4 pb-2 border-b border-border">
              Tools & Access Readiness
            </h2>
            <InfoRow label="Access Timeline" value={accessTimeline || '\u2014'} />
            <InfoRow label="SOP Maturity" value={sopMaturity || '\u2014'} />
            <InfoRow label="Tools in Use" value={tools.length > 0 ? tools.join(', ') : '\u2014'} />
          </div>

          {/* Recommended Placement */}
          <div className="bg-brand-navy rounded-2xl p-6 text-white shadow-lg print:bg-white print:text-foreground print:border print:rounded-none print:shadow-none">
            <h2 className="font-serif text-lg font-semibold mb-4 pb-2 border-b border-white/20 print:border-border">
              Recommended Placement
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1 print:text-muted-foreground">Assistant Type</p>
                <p className="font-serif text-base font-semibold">{assistantType.type}: {assistantType.label}</p>
              </div>
              <div>
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1 print:text-muted-foreground">Onboarding Style</p>
                <p className="font-serif text-base font-semibold">{outcome.onboardingStyle}</p>
              </div>
              <div>
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1 print:text-muted-foreground">Archetype</p>
                <p className="font-serif text-base font-semibold">{outcome.archetype}</p>
              </div>
              <div>
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1 print:text-muted-foreground">Time Back Goal</p>
                <p className="font-serif text-base font-semibold">{timeBackUse || '\u2014'}</p>
              </div>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-3 print:hidden">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="border-border text-foreground/70 hover:bg-secondary/50 rounded-xl"
            >
              <Printer className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
