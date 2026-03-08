'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, FileText, FlaskConical, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ContextualInfo {
  diagnosis?: string;
  biomarkers?: string[];
  treatmentOptions?: string[];
}

interface AICareNavigatorProps {
  contextualInfo?: ContextualInfo | null;
}

export function AICareNavigator({ contextualInfo }: AICareNavigatorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi. I'm here to help you navigate your care journey. You can ask me about understanding your diagnosis, preparing for appointments, what to ask your doctor, or next steps. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: trimmed }]);
    setLoading(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      const reply = data.answer ?? 'I’m sorry, I couldn’t process that. Please try again.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quickActions = [
    { label: 'Explain my diagnosis', query: 'Can you explain my diagnosis in simple terms?', icon: FileText },
    { label: 'Find clinical trials', query: 'What clinical trials might be relevant for my situation?', icon: FlaskConical },
    { label: 'Questions to ask the doctor', query: 'What questions should I ask my oncologist at my next appointment?', icon: MessageCircle },
  ];

  async function handleQuickAction(query: string) {
    setInput(query);
    setMessages((m) => [...m, { role: 'user', content: query }]);
    setLoading(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();
      const reply = data.answer ?? 'I couldn\'t process that. Please try again.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full gap-6">
      {/* Left: Chat panel */}
      <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-slate-600">Thinking…</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 px-6 py-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.query)}
                disabled={loading}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-slate-200 p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search questions…"
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      {/* Right: Contextual info panel */}
      <div className="hidden w-80 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-lg font-semibold text-accent">Overview</h3>
          <div className="mt-4 space-y-6">
            {contextualInfo?.diagnosis && (
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <FileText className="h-4 w-4 text-success" /> Diagnosis
                </p>
                <p className="mt-2 text-sm text-slate-700">{contextualInfo.diagnosis}</p>
              </div>
            )}
            {contextualInfo?.biomarkers && contextualInfo.biomarkers.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <FlaskConical className="h-4 w-4 text-success" /> Key Biomarkers
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {contextualInfo.biomarkers.map((b) => (
                    <span key={b} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {contextualInfo?.treatmentOptions && contextualInfo.treatmentOptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500">Treatment Options</p>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
                  {contextualInfo.treatmentOptions.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ol>
              </div>
            )}
            {!contextualInfo?.diagnosis && !contextualInfo?.biomarkers?.length && (
              <p className="text-sm text-slate-500">
                Upload a report to see your diagnosis summary and biomarkers here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
