'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase-client';

export function PathologyTranslationCard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ summary?: string; keyFindings?: string[]; suggestedQuestions?: string[] } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || file.type !== 'application/pdf') {
      setErrorMsg('Please select a PDF file.');
      return;
    }
    setErrorMsg(null);
    setStatus('uploading');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg('Please sign in.');
        setStatus('idle');
        return;
      }
      const path = `${user.id}/${crypto.randomUUID()}.pdf`;
      const { error: uploadErr } = await supabase.storage.from('reports').upload(path, file, { upsert: false });
      if (uploadErr) {
        setErrorMsg('Upload failed. Ensure the reports bucket exists.');
        setStatus('idle');
        return;
      }
      setStatus('processing');
      const res = await fetch('/api/process-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error || 'Processing failed.');
        setStatus('error');
        return;
      }
      setResult(data);
      setStatus('done');
    } catch {
      setErrorMsg('Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pathology Translation</CardTitle>
        <CardDescription>Upload a pathology report PDF for a plain-language summary.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
              setStatus('idle');
              setErrorMsg(null);
            }}
          />
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          <Button type="submit" disabled={status === 'uploading' || status === 'processing'}>
            {status === 'uploading' && 'Uploading…'}
            {status === 'processing' && 'Processing…'}
            {(status === 'idle' || status === 'done' || status === 'error') && 'Translate'}
          </Button>
        </form>
        {result && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
            <p className="text-slate-800">{result.summary}</p>
            {result.keyFindings?.length ? (
              <ul className="list-disc list-inside text-slate-700">
                {result.keyFindings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            ) : null}
            {result.suggestedQuestions?.length ? (
              <div>
                <p className="font-medium text-slate-800 mt-2">Questions for your doctor</p>
                <ul className="list-disc list-inside text-slate-700">
                  {result.suggestedQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
