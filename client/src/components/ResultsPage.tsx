/*
 * Design: JustAskAVA.com brand -- navy, blue, light blue, green CTA
 * v8: Clarity & Capacity Assessment (Production Ready)
 * - External terminology: "Executive Assistant" / "Assistant"
 * - 4 outcomes: The Builder, The Amplifier, The Optimizer, The Architect
 * - QUALIFIED_FOR_PLAYBOOK status
 * - AI Opportunity insight block
 * - Readiness tiers: Guided Partnership / Collaborative Partnership / Strategic Partnership
 * - Hourly rate comparison narrative (Your Time vs Assistant Cost)
 * - Print button on Results page
 * - Lead capture on download
 */

import { useState, useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ClipboardList,
  Eye,
  ShieldAlert,
  TrendingUp,
  Target,
  Lightbulb,
  Clock,
  DollarSign,
  X,
  Mail,
  Bot,
  Sparkles,
  Printer,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import ScoreRing from './ScoreRing';
import { generateExportJSON, generateExportCSVRow, type Answers, type QualificationStatus } from '@/lib/scoringEngine';
import {
  trackResultsViewed,
  trackLead,
  trackDownloadResults,
  trackResultsCtaClick,
  trackAssessmentRetaken,
  clarityTag,
} from '@/lib/analytics';

const RESULTS_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/d4PlRtWykV7og00LcTCFEV/sandbox/U7FGakhGmVAmzeN42yTKFY-img-2_1771081697000_na1fn_cmVzdWx0cy1jZWxlYnJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZDRQbFJ0V3lrVjdvZzAwTGNUQ0ZFVi9zYW5kYm94L1U3Rkdha2hHbVZBbXplTjQyeVRLRlktaW1nLTJfMTc3MTA4MTY5NzAwMF9uYTFmbl9jbVZ6ZFd4MGN5MWpaV3hsWW5KaGRHbHZiZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QlbGmvB2UDLZy8muKGdg2~m5T7HWesuBX432FnV3tkkLpoDkeOvydTXDTXP5K6YXbFI4LkpmAHPSp-uhZU6S7MX~OPAKry6ak1KSb3BAnMmu5vxk7gamK95BvqwJ43FhJzWWCQYpEvCjqqSYvkBKZQxg1amDXbGyqsGar7aHoJGy9wrJHUQFVstin2GhVI5~cekAQpNA2U8qoVMone6b~Ja438~kRJJnoWEEJus3I8lBm1q9aWE8w1goR9Gv6YY7w1hYUY63lyeYE5I1yq2SFXE4HkKm2giee4CwfPMRg6vqN2ntAMJVN1hlqh6ApZFAxOVB4SUEJHKzmaOM0jXbJA__';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

/* --- Tier helpers --- */

function getTimeBuybackTier(score: number): { label: string; oneLiner: string } {
  if (score <= 24) return { label: 'Protected', oneLiner: 'Your time is fairly protected right now.' };
  if (score <= 49) return { label: 'Leaky', oneLiner: 'You have clear wins available by delegating.' };
  if (score <= 74) return { label: 'Heavy Load', oneLiner: 'Admin + follow-through are eating CEO time.' };
  return { label: 'Overloaded', oneLiner: "You're functioning as the bottleneck \u2014 support is urgent." };
}

function getReadinessTier(score: number): { label: string; oneLiner: string } {
  if (score <= 33) return { label: 'Guided Partnership', oneLiner: "You'll do best with guardrails + tighter check-ins at first." };
  if (score <= 66) return { label: 'Collaborative Partnership', oneLiner: "You're ready with structure and routines." };
  return { label: 'Strategic Partnership', oneLiner: "You're ready for an assistant to run workflows with minimal oversight." };
}

function getEstimatedHours(score: number): string {
  if (score <= 24) return '~2\u20135 hours/week';
  if (score <= 49) return '~5\u201310 hours/week';
  if (score <= 74) return '~10\u201315 hours/week';
  return '~15\u201325+ hours/week';
}

/* --- Combo copy (2x3 = 6 combos) --- */

type ComboData = {
  headline: string;
  bullets: string[];
  first7Days: string[];
};

function getComboData(tbScore: number, rdyScore: number): ComboData {
  const highTB = tbScore >= 50;
  const rdyTier = rdyScore <= 33 ? 'guided' : rdyScore <= 66 ? 'collaborative' : 'strategic';

  if (highTB && rdyTier === 'guided') {
    return {
      headline: 'Big time savings available \u2014 start with a structured ramp.',
      bullets: [
        "You're carrying more admin and follow-through than you should.",
        'Delegation will feel easier once guardrails are in place.',
        "We'll remove daily friction first, then increase autonomy.",
      ],
      first7Days: [
        'Inbox triage + drafting + escalation rules',
        'Calendar guardrails + buffers + scheduling rules',
        'One trusted task system so nothing lives in your head',
      ],
    };
  }
  if (highTB && rdyTier === 'collaborative') {
    return {
      headline: 'You have the systems \u2014 now hand off the execution.',
      bullets: [
        "Your workflows exist but you're still the one running them.",
        'An Executive Assistant can take ownership of recurring processes immediately.',
        'Focus shifts from doing to reviewing within the first week.',
      ],
      first7Days: [
        'Hand off inbox + calendar management with existing SOPs',
        'Delegate recurring follow-ups and project check-ins',
        'Set up a daily async update rhythm (not more meetings)',
      ],
    };
  }
  if (highTB && rdyTier === 'strategic') {
    return {
      headline: "You're ready for a true operator \u2014 let's move fast.",
      bullets: [
        "You've already built the muscle for delegation.",
        'Your assistant can run full workflows from day one with light oversight.',
        'The ROI here is immediate and compounding.',
      ],
      first7Days: [
        'Full inbox + calendar ownership with decision-making authority',
        'Project management handoff with autonomous follow-through',
        'Proactive workflow improvements \u2014 your assistant suggests, you approve',
      ],
    };
  }
  if (!highTB && rdyTier === 'guided') {
    return {
      headline: 'Your time is mostly protected \u2014 a small ramp unlocks big gains.',
      bullets: [
        "You don't have a crisis, but there are pockets of wasted time.",
        'Starting small with clear guardrails builds trust quickly.',
        'Even 5 hours back per week changes what you can focus on.',
      ],
      first7Days: [
        'Identify your top 3 recurring time drains together',
        'Set up inbox filters and scheduling rules',
        'One weekly check-in to build the delegation habit',
      ],
    };
  }
  if (!highTB && rdyTier === 'collaborative') {
    return {
      headline: 'Solid foundation \u2014 targeted delegation will sharpen your edge.',
      bullets: [
        "You're not drowning, but you're doing work that doesn't need you.",
        'Your systems are ready for someone else to operate.',
        'Delegation here is about leverage, not survival.',
      ],
      first7Days: [
        'Audit your calendar for tasks below your pay grade',
        'Hand off scheduling + follow-ups with existing tools',
        "Create a \"don't touch\" list \u2014 tasks your assistant owns fully",
      ],
    };
  }
  return {
    headline: "You're delegation-ready \u2014 even small handoffs will compound.",
    bullets: [
      'Your readiness is high, which means onboarding will be fast.',
      'Even modest time savings multiply when the handoff is clean.',
      'Your assistant can start proactively from the first week.',
    ],
    first7Days: [
      'Immediate ownership of scheduling + inbox with autonomy',
      'Proactive project follow-ups without daily check-ins',
      'Weekly strategy sync instead of daily task reviews',
    ],
  };
}

/* --- Task reason helper --- */

function getTaskReason(task: string): string {
  const lower = task.toLowerCase();
  if (lower.includes('inbox') || lower.includes('email'))
    return 'Stops your day from being run by reactions.';
  if (lower.includes('calendar') || lower.includes('scheduling'))
    return 'Protects deep work and reduces context switching.';
  if (lower.includes('project') || lower.includes('follow') || lower.includes('workflow'))
    return 'Prevents dropped balls and reduces bottlenecks.';
  if (lower.includes('social') || lower.includes('content'))
    return 'Frees creative energy for strategy, not posting.';
  if (lower.includes('crm') || lower.includes('client') || lower.includes('onboard'))
    return 'Keeps client experience consistent without your daily input.';
  if (lower.includes('research') || lower.includes('data'))
    return 'Gets you answers faster without the rabbit holes.';
  if (lower.includes('travel') || lower.includes('expense'))
    return 'Removes low-value admin that adds up fast.';
  return 'This is a high-leverage handoff that protects your focus.';
}

/* --- Qualification card copy --- */

function getQualificationCopy(status: QualificationStatus) {
  switch (status) {
    case 'QUALIFIED_NOW':
      return {
        tagline: "You're in a position to buy back time with full-time support.",
        bullets: [
          'Your results suggest the ROI is there if you offload the top tasks below.',
          "We'll start with inbox/calendar/follow-through and build guardrails fast.",
        ],
        primaryCta: 'Design Your Support Plan',
        primaryHref: 'https://scheduler.zoom.us/eric-lee-usher',
        secondaryCta: null as string | null,
        showEmailCapture: false,
        tagColor: 'bg-brand-green/15 text-brand-green border-brand-green/30',
        tagText: 'Qualified',
      };
    case 'QUALIFIED_SOON':
      return {
        tagline: "You're close \u2014 a short runway makes this a smooth decision.",
        bullets: [
          'Use the next 30\u201390 days to stabilize cashflow + prep delegation.',
          "We'll share a readiness plan so you can hire confidently.",
        ],
        primaryCta: 'Get the Readiness Plan',
        primaryHref: null as string | null,
        secondaryCta: 'Book a Quick Fit Check' as string | null,
        showEmailCapture: true,
        tagColor: 'bg-brand-light-blue/15 text-brand-blue border-brand-light-blue/30',
        tagText: 'Almost There',
      };
    case 'QUALIFIED_FOR_PLAYBOOK':
      return {
        tagline: "You're not quite ready for full-time support \u2014 but you can start building the foundation now.",
        bullets: [
          'Your take-home suggests part-time or project-based support is the right starting point.',
          "We'll send you a delegation playbook so you can start reclaiming time immediately.",
          'When your revenue grows, you\'ll be ready to hire with confidence.',
        ],
        primaryCta: 'Get the Delegation Playbook (Free)',
        primaryHref: null as string | null,
        secondaryCta: 'Book a Quick Fit Check' as string | null,
        showEmailCapture: true,
        tagColor: 'bg-amber-100 text-amber-700 border-amber-300',
        tagText: 'Playbook Path',
      };
    case 'NOT_QUALIFIED':
      return {
        tagline: "Right now, full-time support may add stress instead of relief \u2014 and we don't want that.",
        bullets: [
          'Your fastest win is reclaiming time without committing to $2,500/month yet.',
          'Use these resources to increase margin + build delegation foundations.',
        ],
        primaryCta: 'Get the Buy Back Resources Pack (Free)',
        primaryHref: null as string | null,
        secondaryCta: 'Retake the Assessment Later' as string | null,
        showEmailCapture: true,
        tagColor: 'bg-secondary text-muted-foreground border-border',
        tagText: 'Building Toward It',
      };
  }
}

/* --- Email Capture Modal --- */

function EmailCaptureModal({
  isOpen,
  onClose,
  qualificationStatus,
  timeBuybackScore,
  avaReadinessScore,
  context,
}: {
  isOpen: boolean;
  onClose: () => void;
  qualificationStatus: QualificationStatus;
  timeBuybackScore: number;
  avaReadinessScore: number;
  context: 'qualification' | 'download';
}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;

  const captureData = { email, firstName: firstName || "N/A" };

  try {
    setSubmitted(true);
    
    // Direct live endpoint
    const endpoint = "https://seashell-app-dklvx.ondigitalocean.app/api/notion-save";

    console.log("Sending to:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(captureData),
    });

    if (response.ok) {
      localStorage.setItem("ava_last_capture", JSON.stringify(captureData));
      trackLead({ context, qualification_status: qualificationStatus });
    } else {
      console.error("Server Error:", response.status, response.statusText);
    }

  } catch (error) {
    console.error("Error submitting lead to Notion:", error);
  }
};
  
  const getModalTitle = () => {
    if (context === 'download') return 'Get Your Results';
    if (qualificationStatus === 'QUALIFIED_FOR_PLAYBOOK') return 'Get Your Delegation Playbook';
    if (qualificationStatus === 'NOT_QUALIFIED') return 'Get Your Free Resources Pack';
    return 'Get Your Readiness Plan';
  };

  const getModalDesc = () => {
    if (context === 'download') return "Enter your email and we'll send your full results summary. You can also download them right after.";
    if (qualificationStatus === 'QUALIFIED_FOR_PLAYBOOK')
      return "We'll send you a step-by-step delegation playbook to start reclaiming time now \u2014 and a plan to grow into full-time support.";
    if (qualificationStatus === 'NOT_QUALIFIED')
      return "We'll send you a curated pack of resources to help you increase margin and build delegation foundations.";
    return "We'll send you a step-by-step readiness plan to stabilize cashflow and prep for full-time support.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full border border-border"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-brand-blue" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-navy">
                {getModalTitle()}
              </h3>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {getModalDesc()}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-brand-blue focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  First name <span className="text-muted-foreground text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-foreground placeholder:text-muted-foreground/50 focus:border-brand-blue focus:outline-none transition-colors"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-light text-white py-5 rounded-xl font-medium shadow-md shadow-brand-green/15 transition-all duration-300"
              >
                Send It to Me
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-brand-green/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-brand-green" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-brand-navy mb-2">
              You're all set!
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {context === 'download'
                ? "Check your inbox \u2014 your results are on the way. You can also download them below."
                : "We'll send the resources + a simple plan to help you move forward."}
            </p>
            <Button
              onClick={onClose}
              variant="outline"
              className="mt-6 rounded-xl border-border text-foreground/70 hover:bg-secondary/50"
            >
              Close
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ===================================================
   MAIN COMPONENT
   =================================================== */

export default function ResultsPage() {
  const { results, answers, setView, resetAssessment } = useAssessment();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalContext, setEmailModalContext] = useState<'qualification' | 'download'>('qualification');

  // Analytics: results viewed (+ tag Clarity recordings by qualification/outcome).
  useEffect(() => {
    if (!results) return;
    trackResultsViewed({
      time_buyback_score: results.timeBuybackScore,
      readiness_score: results.avaReadinessScore,
      qualification_status: results.qualificationStatus,
      archetype: results.outcome.archetype,
    });
    clarityTag('qualification_status', results.qualificationStatus);
    clarityTag('assessment_outcome', results.outcome.id);
  }, [results]);

  if (!results) return null;

  const {
    timeBuybackScore,
    avaReadinessScore,
    outcome,
    assistantType,
    topOffloadTasks,
    timeLeaks,
    autonomyPreference,
    commCadence,
    timeBackUse,
    insights,
    qualificationStatus,
    buyBackRate,
    hourlyRate,
  } = results;

  const tbTier = getTimeBuybackTier(timeBuybackScore);
  const rdyTier = getReadinessTier(avaReadinessScore);
  const estimatedHours = getEstimatedHours(timeBuybackScore);
  const combo = getComboData(timeBuybackScore, avaReadinessScore);
  const top3Tasks = topOffloadTasks.slice(0, 3);
  const qualCopy = getQualificationCopy(qualificationStatus);

  const handleDownloadJSON = () => {
    const data = generateExportJSON(answers as Answers, results);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clarity-capacity-assessment-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csv = generateExportCSVRow(answers as Answers, results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clarity-capacity-assessment-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // const handleDownloadWithCapture = (format: 'json' | 'csv') => {
  //   // Check if email already captured
  //   const lastCapture = localStorage.getItem('ava_last_capture');
  //   if (lastCapture) {
  //     // Already captured, download directly
  //     if (format === 'json') handleDownloadJSON();
  //     else handleDownloadCSV();
  //     return;
  //   }
  //   // Show email capture modal first
  //   setEmailModalContext('download');
  //   setShowEmailModal(true);
  // };


const handleDownloadWithCapture = (format: 'pdf' | 'json' | 'csv') => {
  const lastCapture = localStorage.getItem('ava_last_capture');
  if (lastCapture) {
    trackDownloadResults({ format, qualification_status: qualificationStatus });
    if (format === 'pdf') {
      window.print();
    } else if (format === 'json') {
      handleDownloadJSON();
    } else if (format === 'csv') {
      handleDownloadCSV();
    }
  } else {
    setEmailModalContext('download');
    setShowEmailModal(true);
  }
};

  const handlePrimaryCta = () => {
    trackResultsCtaClick({
      cta_id: 'results_primary',
      qualification_status: qualificationStatus,
      link_url: qualCopy.primaryHref,
    });
    if (qualCopy.primaryHref) {
      window.open(qualCopy.primaryHref, '_blank');
    } else {
      setEmailModalContext('qualification');
      setShowEmailModal(true);
    }
  };

  const handleSecondaryCta = () => {
    const isRetake =
      qualificationStatus === 'NOT_QUALIFIED' && !!qualCopy.secondaryCta?.includes('Retake');
    trackResultsCtaClick({
      cta_id: isRetake ? 'results_retake' : 'results_secondary',
      cta_text: qualCopy.secondaryCta,
      qualification_status: qualificationStatus,
    });
    if (isRetake) {
      trackAssessmentRetaken({
        previous_time_buyback_score: timeBuybackScore,
        previous_readiness_score: avaReadinessScore,
      });
      resetAssessment();
    } else {
      window.open('https://scheduler.zoom.us/eric-lee-usher', '_blank');
    }
  };

  let cardIndex = 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ===================================================
          HERO -- scores + tiers + hours (above the fold)
          =================================================== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src={RESULTS_IMG} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 container py-10 sm:py-14 lg:py-16">
          {/* Compact header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-8"
          >
            <p className="text-brand-blue font-medium text-sm tracking-wide uppercase mb-2">
              Your Results
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-navy leading-tight">
              Here's what we found
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-snug mt-2">
              Clarity, not judgment &mdash; here's where your time is going and how ready you are to hand things off.
            </p>
            {/* Archetype badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-brand-navy/8 border border-brand-navy/15"
            >
              <Sparkles className="w-4 h-4 text-brand-blue" />
              <span className="text-sm font-semibold text-brand-navy">
                Your archetype: {outcome.archetype}
              </span>
            </motion.div>
          </motion.div>

          {/* Score rings + tier labels */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 mb-4"
          >
            {/* Time Buyback ring + tier */}
            <div className="flex flex-col items-center">
              <ScoreRing
                score={timeBuybackScore}
                label="Time Buyback Score"
                color="#262262"
                bgColor="#E8F4FD"
                delay={0.3}
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-brand-navy">
                  {timeBuybackScore}/100 &middot; {tbTier.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">{tbTier.oneLiner}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Higher = more time you can reclaim.
                </p>
              </div>
              {/* Estimated hours */}
              <div className="mt-2 flex items-center gap-1.5 bg-brand-navy/8 rounded-lg px-3 py-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-navy" />
                <span className="text-xs font-semibold text-brand-navy">{estimatedHours}</span>
              </div>
            </div>

            {/* Assistant Readiness ring + tier */}
            <div className="flex flex-col items-center">
              <ScoreRing
                score={avaReadinessScore}
                label="Assistant Readiness Score"
                color="#3561FF"
                bgColor="#E8F4FD"
                delay={0.6}
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-brand-blue">
                  {avaReadinessScore}/100 &middot; {rdyTier.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">{rdyTier.oneLiner}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Higher = smoother handoff to your assistant.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick key */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="mt-4 text-center text-[12px] text-muted-foreground"
          >
            <span className="font-semibold text-foreground/60">Quick key:</span>{" "}
            Time Buyback measures <span className="font-semibold text-foreground/60">how much time you can get back</span>.{" "}
            Readiness measures <span className="font-semibold text-foreground/60">how easily you can delegate without stress</span>.
          </motion.p>

          {/* Hours + hourly rate disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="text-center max-w-md mx-auto"
          >
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              Estimated time you can reclaim: <strong className="text-foreground/60">{estimatedHours}</strong>.
              Your effective hourly rate: <strong className="text-foreground/60">${hourlyRate}/hr</strong>.
              Actual results depend on support hours and workflow complexity.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===================================================
          MAIN RESULTS CONTENT
          =================================================== */}
      <div className="container pb-20">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* -- 0. INVESTMENT READINESS CARD -- */}
          <motion.div
            custom={cardIndex++}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-brand-green" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-brand-navy">
                Investment Readiness
              </h2>
              <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full border ${qualCopy.tagColor}`}>
                {qualCopy.tagText}
              </span>
            </div>

            {/* Hourly Rate Comparison */}
            <div className="bg-brand-navy/5 rounded-xl p-5 mb-5 border border-brand-navy/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-center flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Your Time</p>
                  <p className="text-2xl font-serif font-bold text-brand-navy">${hourlyRate}<span className="text-sm font-normal">/hr</span></p>
                </div>
                <div className="text-center px-4">
                  <span className="text-muted-foreground text-sm">vs</span>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Assistant Cost</p>
                  <p className="text-2xl font-serif font-bold text-brand-green">~$15<span className="text-sm font-normal">/hr</span></p>
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 text-center">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {hourlyRate >= 30 ? (
                    <>Every hour your assistant handles a <strong>${hourlyRate}/hr</strong> task, you get that hour back at <strong>~$15/hr</strong>. That&apos;s a <strong>{Math.round(hourlyRate / 15)}:1 return</strong> on every delegated hour.</>
                  ) : (
                    <>A full-time Executive Assistant costs about <strong>$15/hr</strong>. As your revenue grows, the ROI on delegation compounds quickly.</>
                  )}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                Based on your reported take-home of {results.monthlyTakeHome || 'N/A'} &middot; Full-time assistant: $2,500/mo
              </p>
            </div>

            {/* Qualification-specific copy */}
            <p className="font-serif text-lg font-semibold text-brand-navy mb-3 leading-snug">
              {qualCopy.tagline}
            </p>
            <ul className="space-y-2.5 mb-6">
              {qualCopy.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-1" />
                  <span className="text-foreground/70 text-[15px] leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handlePrimaryCta}
                className="bg-brand-green hover:bg-brand-green-light text-white px-6 py-5 text-base font-medium rounded-xl shadow-md shadow-brand-green/15 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
              >
                {qualCopy.primaryCta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              {qualCopy.secondaryCta && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSecondaryCta}
                  className="border-border text-foreground/70 hover:bg-secondary/50 px-6 py-5 text-base rounded-xl"
                >
                  {qualCopy.secondaryCta}
                </Button>
              )}
            </div>
          </motion.div>

          {/* -- 1. What your combination means -- */}
          <motion.div
            custom={cardIndex++}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-brand-navy" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-brand-navy">
                What these scores mean together
              </h2>
            </div>

            <p className="font-serif text-lg sm:text-xl font-semibold text-brand-navy mb-4 leading-snug">
              {combo.headline}
            </p>

            <ul className="space-y-2.5 mb-6">
              {combo.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-1" />
                  <span className="text-foreground/70 text-[15px] leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-secondary/50 rounded-xl px-4 py-3 border border-border/40">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Onboarding Style</p>
                <p className="text-sm font-semibold text-brand-navy">{outcome.onboardingStyle}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl px-4 py-3 border border-border/40">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Recommended Focus</p>
                <p className="text-sm font-semibold text-brand-navy">{assistantType.label}</p>
              </div>
            </div>

            {/* First 7 days */}
            <div className="bg-brand-sky/50 rounded-xl p-4 border border-brand-light-blue/20">
              <p className="text-xs font-semibold text-brand-navy uppercase tracking-wide mb-3">
                Your first 7 days plan
              </p>
              <ol className="space-y-2">
                {combo.first7Days.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-md bg-brand-navy text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-navy leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          {/* -- 2. Start Here: Offload these first (top 3) -- */}
          {top3Tasks.length > 0 && (
            <motion.div
              custom={cardIndex++}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-brand-navy rounded-2xl p-6 sm:p-8 text-white shadow-lg"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Target className="w-5 h-5 text-brand-light-blue" />
                </div>
                <h2 className="font-serif text-xl font-semibold">
                  Start here: offload these first
                </h2>
              </div>
              <div className="space-y-4">
                {top3Tasks.map((task, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-medium text-base">{task}</span>
                    </div>
                    <p className="text-sm text-brand-light-blue/80 ml-10">{getTaskReason(task)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* -- 3. Bottleneck Moment insight -- */}
          {insights.bottleneckMoment && (
            <motion.div
              custom={cardIndex++}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-brand-sky/40 rounded-2xl p-6 sm:p-8 border border-brand-light-blue/30 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/15 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-brand-blue" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-brand-navy">
                  Your Bottleneck Moment
                </h2>
              </div>
              <p className="text-foreground/70 leading-relaxed text-[15px]">
                {insights.bottleneckMoment}
              </p>
            </motion.div>
          )}

          {/* -- 4. Time ROI Reality insight -- */}
          {insights.timeRoiReality && (
            <motion.div
              custom={cardIndex++}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-brand-sky/40 rounded-2xl p-6 sm:p-8 border border-brand-light-blue/30 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-brand-green" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-brand-navy">
                  Your Time ROI Reality
                </h2>
              </div>
              <p className="text-foreground/70 leading-relaxed text-[15px]">
                {insights.timeRoiReality}
              </p>
            </motion.div>
          )}

          {/* -- 4b. AI Opportunity insight (NEW in v5) -- */}
          {insights.aiOpportunity && (
            <motion.div
              custom={cardIndex++}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-gradient-to-br from-brand-sky/60 to-brand-sky/30 rounded-2xl p-6 sm:p-8 border border-brand-light-blue/30 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/15 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-blue" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-brand-navy">
                  Your AI Opportunity
                </h2>
              </div>
              <p className="text-foreground/70 leading-relaxed text-[15px]">
                {insights.aiOpportunity}
              </p>
            </motion.div>
          )}

          {/* -- 5. Time Leaks -- */}
          {timeLeaks.length > 0 && (
            <motion.div
              custom={cardIndex++}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-brand-blue" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-brand-navy">
                  Your biggest time leaks right now
                </h2>
              </div>
              <ul className="space-y-3">
                {timeLeaks.map((leak, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-foreground/70 leading-relaxed">{leak}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* -- 6. Full task offload list (if more than 3) -- */}
          {topOffloadTasks.length > 3 && (
            <motion.div
              custom={cardIndex++}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-navy/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-brand-navy" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-brand-navy">
                  All tasks to offload (ranked)
                </h2>
              </div>
              <ol className="space-y-2.5">
                {topOffloadTasks.map((task, i) => (
                  <li key={i} className="flex items-center gap-3 py-2 px-4 rounded-xl bg-secondary/50 border border-border/40">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-brand-navy font-medium text-sm sm:text-base">{task}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}

          {/* -- 7. Best-Fit Recommendation -- */}
          <motion.div
            custom={cardIndex++}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-brand-navy rounded-2xl p-6 sm:p-8 text-white shadow-lg"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-light-blue" />
              </div>
              <h2 className="font-serif text-xl font-semibold">
                Your best-fit recommendation
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1">Assistant Type</p>
                <p className="font-serif text-lg font-semibold">{assistantType.label}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1">Onboarding Style</p>
                <p className="font-serif text-lg font-semibold">{outcome.onboardingStyle}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1">Autonomy Preference</p>
                <p className="font-serif text-lg font-semibold">{autonomyPreference}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-brand-light-blue/70 uppercase tracking-wide mb-1">Communication Cadence</p>
                <p className="font-serif text-lg font-semibold">{commCadence}</p>
              </div>
            </div>
          </motion.div>

          {/* -- 8. Dynamic Ending -- */}
          <motion.div
            custom={cardIndex++}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-navy mb-4 leading-snug">
              {outcome.headline}
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-6">
              {outcome.body}
            </p>

            <div className="mb-6">
              <p className="text-sm font-medium text-brand-navy uppercase tracking-wide mb-3">
                Your first-week wins (fast relief)
              </p>
              <ul className="space-y-2.5">
                {outcome.firstWeekWins.map((win, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/70 leading-relaxed">{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            {timeBackUse && (
              <p className="text-sm text-muted-foreground italic mb-6">
                You said you'd use your reclaimed time for <strong className="text-foreground/70 not-italic">{timeBackUse}</strong> &mdash;
                that's exactly where your Executive Assistant frees you to focus.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handlePrimaryCta}
                className="bg-brand-green hover:bg-brand-green-light text-white px-8 py-5 text-base font-medium rounded-xl shadow-md shadow-brand-green/15 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
              >
                {qualCopy.primaryCta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* -- 9. Foundational Resource: Buy Back Your Time -- */}
          <motion.div
            custom={cardIndex++}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/60 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-700" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-brand-navy">
                A Foundational Resource for Your Journey
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Book cover placeholder */}
              <div className="flex-shrink-0 w-32 sm:w-36 mx-auto sm:mx-0">
                
            <img 
              src={`${window.location.origin}/TimeBuyBackAssessment/images/book-cover.avif`}
              alt="Buy Back Your Time - Dan Martell"
              className="aspect-[2/3] w-full object-cover" 
            />
              </div>

              <div className="flex-1">
                <p className="text-foreground/80 leading-relaxed mb-4 text-[15px]">
                  Whether you&apos;re just starting to think about delegation or you&apos;re ready for a full-time Executive Assistant,
                  Dan Martell&apos;s <em className="font-medium not-italic text-brand-navy">Buy Back Your Time</em> is the
                  playbook for getting unstuck. It covers the exact frameworks behind this assessment &mdash; the Buyback
                  Principle, the Replacement Ladder, and how to build a team that runs without you.
                </p>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  We recommend it to every business owner who takes this assessment, regardless of where you scored.
                  It&apos;s the foundation everything else builds on.
                </p>
                <a
                  href="https://www.buybackyourtime.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-medium text-sm shadow-md shadow-amber-700/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  Get the Book
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* -- 10. Export + Internal View -- */}
          <motion.div
          custom={cardIndex++}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-secondary/50 rounded-2xl p-6 sm:p-8 border border-border/60"
        >
          <h3 className="font-serif text-lg font-semibold text-brand-navy mb-4">
            Save or share your results
          </h3>
          <div className="flex flex-wrap gap-3">
            {/* Download PDF Button */}

            <Button
              variant="outline"
              onClick={() => {
                trackDownloadResults({ format: 'pdf', qualification_status: qualificationStatus });
                window.print();
              }}
              className="border-border text-foreground/70 hover:bg-secondary/50 rounded-xl"
            >
              <Printer className="w-4 h-4 mr-2" />
              Download PDF
            </Button>

            {/* <Button
              variant="outline"
              onClick={() => handleDownloadWithCapture('pdf')}
              className="border-border text-foreground/70 hover:bg-secondary/50 rounded-xl"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </Button> */}

            {/* View Internal Profile Button */}
            <Button
              variant="outline"
              onClick={() => {
                setView('internal');
                window.scrollTo({ top: 0 });
              }}
              className="border-border text-foreground/70 hover:bg-secondary/50 rounded-xl"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Internal Profile
            </Button>
          </div>
        </motion.div>

          {/* Retake */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                trackAssessmentRetaken({
                  previous_time_buyback_score: timeBuybackScore,
                  previous_readiness_score: avaReadinessScore,
                });
                resetAssessment();
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Retake the assessment
            </button>
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        qualificationStatus={qualificationStatus}
        timeBuybackScore={timeBuybackScore}
        avaReadinessScore={avaReadinessScore}
        context={emailModalContext}
      />
    </div>
  );
}
