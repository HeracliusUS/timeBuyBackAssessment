/*
 * Design: JustAskAVA.com brand — navy, blue, light blue, green CTA
 * Progressive disclosure, one section at a time
 * v8: F1 category grouping, R0 deleted
 * Section order: S→A→B→C→D→E→F→R→G→BB
 */

import { useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { f1Categories } from '@/lib/assessmentData';
import type { Choice } from '@/lib/assessmentData';

const sectionIcons: Record<string, string> = {
  S: '\u{1F4CB}',
  BB: '\u{1F4B0}',
  A: '\u{23F0}',
  B: '\u{1F6A7}',
  C: '\u{1F91D}',
  D: '\u{1F3AF}',
  R: '\u{2705}',
  E: '\u{1F527}',
  F: '\u{1F4BC}',
  G: '\u{1F916}',
};

export default function AssessmentForm() {
  const {
    currentSection,
    currentSectionIndex,
    totalSections,
    progress,
    answers,
    setAnswer,
    toggleMultiSelect,
    canAdvance,
    goNext,
    goPrev,
  } = useAssessment();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSectionIndex]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top progress bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/60">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">
              Section {currentSectionIndex + 1} of {totalSections}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-navy rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            />
          </div>
          {/* Section dots */}
          <div className="flex gap-2 mt-3 justify-center">
            {Array.from({ length: totalSections }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  i < currentSectionIndex
                    ? 'bg-brand-navy'
                    : i === currentSectionIndex
                      ? 'bg-brand-blue w-6'
                      : 'bg-border'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section content */}
      <div className="flex-1 container py-8 lg:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="max-w-2xl mx-auto"
          >
            {/* Section header */}
            <div className="mb-10">
              <span className="text-3xl mb-3 block">{sectionIcons[currentSection.id] || ''}</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-navy mb-3">
                {currentSection.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentSection.subtitle}
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-10">
              {currentSection.questions.map((q, qIdx) => {
                // Determine if this is the F1 question (needs category grouping)
                const isF1 = q.qId === 'F1';
                const effectiveChoices: Choice[] = q.choices;

                return (
                  <motion.div
                    key={q.qId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIdx * 0.08, duration: 0.4 }}
                    className="relative"
                  >
                    <label className="block text-base sm:text-lg font-medium text-foreground mb-4 leading-snug">
                      <span className="text-brand-blue font-serif font-semibold mr-2">
                        {q.qId}.
                      </span>
                      {q.questionText}
                      {q.questionType === 'multi_select' && q.maxSelect && (
                        <span className="text-sm text-muted-foreground font-normal ml-1">
                          (select up to {q.maxSelect})
                        </span>
                      )}
                    </label>

                    {/* F1: Render choices grouped by category */}
                    {isF1 ? (
                      <div className="space-y-6">
                        {f1Categories.map((cat) => {
                          const catChoices = effectiveChoices.filter((c: Choice) =>
                            cat.choiceIds.includes(c.id)
                          );
                          if (catChoices.length === 0) return null;
                          return (
                            <div key={cat.label}>
                              <div className="mb-2.5">
                                <h4 className="text-sm font-semibold text-brand-navy uppercase tracking-wide">
                                  {cat.label}
                                </h4>
                                <p className="text-xs text-muted-foreground">{cat.description}</p>
                              </div>
                              <div className="space-y-2">
                                {catChoices.map((choice) => {
                                  const currentAnswer = answers[q.qId];
                                  const isSelected =
                                    Array.isArray(currentAnswer) && currentAnswer.includes(choice.id);

                                  return (
                                    <button
                                      key={choice.id}
                                      type="button"
                                      onClick={() =>
                                        toggleMultiSelect(q.qId, choice.id, q.maxSelect)
                                      }
                                      className={cn(
                                        'w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 group',
                                        isSelected
                                          ? 'border-brand-blue bg-brand-blue/5 shadow-sm'
                                          : 'border-border bg-white hover:border-brand-light-blue/60 hover:bg-brand-sky/30'
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={cn(
                                            'flex-shrink-0 w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200',
                                            isSelected
                                              ? 'border-brand-blue bg-brand-blue'
                                              : 'border-muted-foreground/40 group-hover:border-brand-light-blue'
                                          )}
                                        >
                                          {isSelected && (
                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                          )}
                                        </div>
                                        <span
                                          className={cn(
                                            'text-sm sm:text-base transition-colors',
                                            isSelected
                                              ? 'text-foreground font-medium'
                                              : 'text-foreground/70'
                                          )}
                                        >
                                          {choice.label}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Standard choice rendering */
                      <div className="space-y-2.5">
                        {effectiveChoices.map((choice) => {
                          const isMulti = q.questionType === 'multi_select';
                          const currentAnswer = answers[q.qId];
                          const isSelected = isMulti
                            ? Array.isArray(currentAnswer) && currentAnswer.includes(choice.id)
                            : currentAnswer === choice.id;

                          return (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() => {
                                if (isMulti) {
                                  toggleMultiSelect(q.qId, choice.id, q.maxSelect);
                                } else {
                                  setAnswer(q.qId, choice.id);
                                }
                              }}
                              className={cn(
                                'w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 group',
                                isSelected
                                  ? 'border-brand-blue bg-brand-blue/5 shadow-sm'
                                  : 'border-border bg-white hover:border-brand-light-blue/60 hover:bg-brand-sky/30'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    'flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all duration-200',
                                    isMulti ? 'rounded-md' : 'rounded-full',
                                    isSelected
                                      ? 'border-brand-blue bg-brand-blue'
                                      : 'border-muted-foreground/40 group-hover:border-brand-light-blue'
                                  )}
                                >
                                  {isSelected && (
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    'text-sm sm:text-base transition-colors',
                                    isSelected
                                      ? 'text-foreground font-medium'
                                      : 'text-foreground/70'
                                  )}
                                >
                                  {choice.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/60">
        <div className="container py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goPrev}
              disabled={currentSectionIndex === 0}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={goNext}
              disabled={!canAdvance}
              className={cn(
                'px-8 py-5 rounded-xl font-medium transition-all duration-300',
                canAdvance
                  ? 'bg-brand-green hover:bg-brand-green-light text-white shadow-md shadow-brand-green/15 hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-border text-muted-foreground cursor-not-allowed'
              )}
            >
              {currentSectionIndex === totalSections - 1 ? (
                <>
                  See My Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
