'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scrubAndProcessPathology } from '@/app/actions/scrubAndProcessPathology';
import { motion, AnimatePresence } from 'framer-motion';

export function JourneyUploadCard({
  reportCount = 0,
  isFree = false,
}: {
  reportCount?: number;
  isFree?: boolean;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    // Free-tier: allow only 1 report
    if (isFree && reportCount >= 1) {
      setError('Limit reached — upgrade to upload more reports.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set('pdf', file);
      const result = await scrubAndProcessPathology(formData);
      if (result.success) {
        router.push(`/journey/diagnosis/${result.reportId}`);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show limit error immediately (synchronously) before async upload
    if (isFree && reportCount >= 1) {
      setError('Limit reached — upgrade to upload more reports.');
      return;
    }
    handleUpload(file);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-8"
    >
      <div className="flex flex-col items-center">
        <FileUp className="h-12 w-12 text-primary" />
        <h2 className="mt-4 font-heading font-semibold text-accent">
          Upload Medical Report
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Pathology reports, imaging notes — we&apos;ll extract key information and explain it in plain language.
        </p>
        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading and processing your report…</span>
          </div>
        )}
        <div className="mt-6 flex flex-col items-center gap-4">
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            disabled={uploading}
            onChange={handleFileChange}
            className="text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
          />
          <Link
            href="/trust"
            className="text-sm font-medium text-[var(--color-primary-700)] underline-offset-4 hover:underline"
          >
            How your report is handled →
          </Link>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
