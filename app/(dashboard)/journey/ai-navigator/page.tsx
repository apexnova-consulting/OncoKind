import { AICareNavigator } from '@/components/care/AICareNavigator';

export default function AINavigatorPage() {
  return (
    <div className="flex h-[calc(100vh-120px)] flex-col p-6">
      <h1 className="font-heading text-2xl font-semibold text-accent">
        AI Care Navigator
      </h1>
      <p className="mt-2 text-slate-600">
        Ask questions about your care journey. We&apos;ll help you prepare for appointments and understand next steps.
      </p>
      <div className="mt-6 flex-1">
        <AICareNavigator />
      </div>
    </div>
  );
}
