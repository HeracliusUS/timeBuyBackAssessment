// ============================================================
// AssessmentContext — v8.0
// - localStorage persistence for answers + sectionIndex
// - hasSavedProgress flag for resume/reset flow on WelcomePage
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { sections, type Section } from '@/lib/assessmentData';
import { computeAllResults, type Answers, type AssessmentResults } from '@/lib/scoringEngine';
import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY_ANSWERS = 'ava_assessment_answers';
const STORAGE_KEY_SECTION = 'ava_assessment_section';

type View = 'welcome' | 'assessment' | 'results' | 'internal';

interface AssessmentContextType {
  view: View;
  setView: (v: View) => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (i: number) => void;
  answers: Answers;
  setAnswer: (qId: string, value: string | string[]) => void;
  toggleMultiSelect: (qId: string, choiceId: string, maxSelect?: number) => void;
  currentSection: Section;
  totalSections: number;
  progress: number;
  canAdvance: boolean;
  goNext: () => void;
  goPrev: () => void;
  results: AssessmentResults | null;
  computeResults: () => void;
  resetAssessment: () => void;
  hasSavedProgress: boolean;
  resumeAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

/**
 * Safely read JSON from localStorage. Returns null on any failure.
 */
function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('welcome');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<AssessmentResults | null>(null);

  // Check for saved progress on mount
  const savedAnswers = loadFromStorage<Answers>(STORAGE_KEY_ANSWERS);
  const savedSection = loadFromStorage<number>(STORAGE_KEY_SECTION);
  const hasSavedProgress =
    savedAnswers !== null &&
    Object.keys(savedAnswers).length > 0 &&
    view === 'welcome';

  // Persist answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    }
  }, [answers]);

  // Persist section index to localStorage whenever it changes
  useEffect(() => {
    if (view === 'assessment') {
      localStorage.setItem(STORAGE_KEY_SECTION, JSON.stringify(currentSectionIndex));
    }
  }, [currentSectionIndex, view]);

  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  const setAnswer = useCallback((qId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const toggleMultiSelect = useCallback((qId: string, choiceId: string, maxSelect?: number) => {
    setAnswers((prev) => {
      const current = (prev[qId] as string[]) || [];
      if (current.includes(choiceId)) {
        return { ...prev, [qId]: current.filter((id) => id !== choiceId) };
      }
      if (maxSelect && current.length >= maxSelect) return prev;
      return { ...prev, [qId]: [...current, choiceId] };
    });
  }, []);

  const canAdvance = currentSection.questions.every((q) => {
    if (!q.required) return true;
    const answer = answers[q.qId];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== '';
  });

  const goNext = useCallback(() => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last section — compute results
      const r = computeAllResults(answers);
      setResults(r);
      trackEvent('see_results_clicked');
      setView('results');
      // Clear saved progress on completion
      localStorage.removeItem(STORAGE_KEY_ANSWERS);
      localStorage.removeItem(STORAGE_KEY_SECTION);
      window.scrollTo({ top: 0 });
    }
  }, [currentSectionIndex, totalSections, answers]);

  const goPrev = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex]);

  const computeResultsFn = useCallback(() => {
    const r = computeAllResults(answers);
    setResults(r);
  }, [answers]);

  /**
   * Resume from saved progress — hydrate answers + section index from localStorage.
   */
  const resumeAssessment = useCallback(() => {
    const stored = loadFromStorage<Answers>(STORAGE_KEY_ANSWERS);
    const storedSection = loadFromStorage<number>(STORAGE_KEY_SECTION);
    if (stored && Object.keys(stored).length > 0) {
      setAnswers(stored);
      setCurrentSectionIndex(
        typeof storedSection === 'number' && storedSection >= 0 && storedSection < sections.length
          ? storedSection
          : 0
      );
    }
    setView('assessment');
    window.scrollTo({ top: 0 });
  }, []);

  /**
   * Full reset — clear state + localStorage.
   */
  const resetAssessment = useCallback(() => {
    setView('welcome');
    setCurrentSectionIndex(0);
    setAnswers({});
    setResults(null);
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_SECTION);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        view,
        setView,
        currentSectionIndex,
        setCurrentSectionIndex,
        answers,
        setAnswer,
        toggleMultiSelect,
        currentSection,
        totalSections,
        progress,
        canAdvance,
        goNext,
        goPrev,
        results,
        computeResults: computeResultsFn,
        resetAssessment,
        hasSavedProgress,
        resumeAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
