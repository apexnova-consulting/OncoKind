'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AppointmentQuestionGenerator() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        setQuestions([
          'What does this result mean for my treatment options?',
          'What are the next steps you recommend?',
          'Are there clinical trials I should consider?',
        ]);
      }
    } catch {
      setQuestions([
        'What does this result mean for my treatment options?',
        'What are the next steps you recommend?',
        'Are there clinical trials I should consider?',
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Question Generator</CardTitle>
        <CardDescription>
          Get suggested questions to ask your oncologist based on a topic.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleGenerate} className="flex gap-2">
          <Input
            placeholder="e.g. biopsy results, treatment side effects"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating…' : 'Generate'}
          </Button>
        </form>
        {questions.length > 0 && (
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
