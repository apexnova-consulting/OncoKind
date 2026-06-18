import { NewCaseWorkflow } from '@/components/prior-auth/NewCaseWorkflow';

type CaseType = 'prior_auth' | 'step_therapy' | 'continued_stay';

const VALID_TYPES: CaseType[] = ['prior_auth', 'step_therapy', 'continued_stay'];

export default function NewPriorAuthPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const raw = searchParams.type;
  const caseType: CaseType | undefined = VALID_TYPES.includes(raw as CaseType)
    ? (raw as CaseType)
    : undefined;

  return <NewCaseWorkflow initialCaseType={caseType} />;
}
