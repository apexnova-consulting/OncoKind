import { ProgressStrip } from '@/components/care/ProgressStrip';
import { JourneySidebar } from '@/components/care/JourneySidebar';

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ProgressStrip currentStage="diagnosis" completedStages={[]} />
      <div className="flex flex-1">
        <JourneySidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
