import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Page not found</h2>
        <p className="text-slate-600">The page you’re looking for doesn’t exist.</p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
