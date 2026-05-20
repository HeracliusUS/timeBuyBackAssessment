import { useAssessment } from '@/contexts/AssessmentContext';
import WelcomePage from '@/components/WelcomePage';
import AssessmentForm from '@/components/AssessmentForm';
import ResultsPage from '@/components/ResultsPage';
import InternalProfile from '@/components/InternalProfile';

export default function Home() {
  const { view } = useAssessment();

  switch (view) {
    case 'welcome':
      return <WelcomePage />;
    case 'assessment':
      return <AssessmentForm />;
    case 'results':
      return <ResultsPage />;
    case 'internal':
      return <InternalProfile />;
    default:
      return <WelcomePage />;
  }
}
