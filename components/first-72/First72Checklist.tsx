'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { First72Task } from '@/content/first-72-hours/v1';
import type { TaskStatus } from '@/lib/first-72-hours';
import { FIRST_72_INTAKE_FIELDS } from '@/content/first-72-hours/v1';

const NOT_SURE = 'I am not sure';

export function First72Checklist({
  tasks,
  buckets,
  topThree,
  paidEnhancements,
  hasReport,
  contentMeta,
}: {
  tasks: First72Task[];
  buckets: Record<string, First72Task[]>;
  topThree: First72Task[];
  paidEnhancements: boolean;
  hasReport: boolean;
  contentMeta: { version: string; clinicalReviewer: string; reviewDate: string };
}) {
  const [status, setStatus] = useState<Record<string, TaskStatus>>({});
  const [intake, setIntake] = useState<Record<string, string>>({});

  const labels: Record<string, string> = {
    today: "Today's top 3",
    day1: 'Day 1',
    day2: 'Day 2',
    day3: 'Day 3',
    week1: 'Week 1',
  };

  const ics = useMemo(() => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OncoKind//First72//EN',
      ...tasks.map((task) =>
        [
          'BEGIN:VEVENT',
          `SUMMARY:${task.title}`,
          `DESCRIPTION:${task.why}`,
          'END:VEVENT',
        ].join('\n')
      ),
      'END:VCALENDAR',
    ];
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\n'))}`;
  }, [tasks]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-text-primary)]">Quick intake</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Under two minutes. Every question can be {NOT_SURE}.
          {hasReport ? ' Cancer type and stage can be filled from your Cancer Profile later.' : ''}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIRST_72_INTAKE_FIELDS.map((field) => (
            <label key={field.id} className="block text-sm">
              <span className="font-medium text-[var(--color-text-primary)]">{field.label}</span>
              <input
                className="mt-1 w-full rounded-md border border-[var(--color-border-subtle)] px-3 py-2"
                value={intake[field.id] ?? ''}
                placeholder={field.options[0]}
                onChange={(e) => setIntake((prev) => ({ ...prev, [field.id]: e.target.value }))}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--brand-gold)] bg-[#FAEEDA] p-6">
        <h2 className="font-semibold text-[var(--color-primary-900)]">{labels.today}</h2>
        <ul className="mt-4 space-y-3">
          {topThree.map((task) => (
            <TaskCard key={task.id} task={task} status={status[task.id]} onStatus={(value) => setStatus((s) => ({ ...s, [task.id]: value }))} />
          ))}
        </ul>
      </section>

      {(['day1', 'day2', 'day3', 'week1'] as const).map((bucket) => (
        <section key={bucket} className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6">
          <h2 className="font-semibold text-[var(--color-text-primary)]">{labels[bucket]}</h2>
          <ul className="mt-4 space-y-3">
            {(buckets[bucket] ?? []).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                status={status[task.id]}
                onStatus={(value) => setStatus((s) => ({ ...s, [task.id]: value }))}
              />
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-dashed border-[var(--color-border)] p-6">
        <h2 className="font-semibold">Caregiver Pro enhancements</h2>
        {paidEnhancements ? (
          <div className="mt-3 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={ics} download="oncokind-first-72-hours.ics">
                Download .ics calendar
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://calendar.google.com" target="_blank" rel="noreferrer">
                Google Calendar
              </a>
            </Button>
            <p className="text-sm text-[var(--color-text-muted)]">
              Apple Calendar: open the .ics file on iPhone or Mac. Email reminders send through Resend when you opt in from Billing.
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Calendar sync, web push, email reminders, and PDF export are on Caregiver Pro.{' '}
            <Link className="underline" href="/pricing?plan=pro">
              View Caregiver Pro
            </Link>
          </p>
        )}
      </section>
      <p className="text-xs text-[var(--color-text-muted)]">
        Content version {contentMeta.version}. Reviewer: {contentMeta.clinicalReviewer}. Review date:{' '}
        {contentMeta.reviewDate}.
      </p>
    </div>
  );
}

function TaskCard({
  task,
  status,
  onStatus,
}: {
  task: First72Task;
  status?: TaskStatus;
  onStatus: (value: TaskStatus) => void;
}) {
  return (
    <li className="rounded-xl border border-[var(--color-border-subtle)] p-4">
      <p className="font-medium text-[var(--color-text-primary)]">{task.title}</p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Why: {task.why}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--color-text-secondary)]">
        {task.how.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {task.script ? (
        <blockquote className="mt-3 rounded-md bg-[var(--bg-subtle)] p-3 text-sm italic">
          {task.script}
        </blockquote>
      ) : null}
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">About {task.minutes} minutes</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant={status === 'done' ? 'default' : 'outline'} onClick={() => onStatus('done')}>
          Done
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onStatus('snoozed')}>
          Snooze
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => onStatus('not_applicable')}>
          Not Applicable
        </Button>
        {task.deepLink ? (
          <Button asChild size="sm" variant="ghost">
            <Link href={task.deepLink}>Open related tool</Link>
          </Button>
        ) : null}
      </div>
    </li>
  );
}
