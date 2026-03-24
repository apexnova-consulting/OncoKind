'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  isPro: boolean;
  reportTitle?: string;
  reportSummary?: string;
  reportQuestions?: string[];
  reportFindings?: string[];
};

function toDateTimeLocal(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const dt = new Date(`${date}T${time}:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function toGoogleCalendarDate(dt: Date): string {
  return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICS(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function buildIcsContent({
  title,
  start,
  end,
  description,
}: {
  title: string;
  start: Date;
  end: Date;
  description: string;
}): string {
  const uid = `oncokind-${Date.now()}@oncokind.com`;
  const dtStamp = toGoogleCalendarDate(new Date());
  const dtStart = toGoogleCalendarDate(start);
  const dtEnd = toGoogleCalendarDate(end);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OncoKind//Doctor Prep Sheet//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function DoctorPrepSheet({
  isPro,
  reportTitle,
  reportSummary,
  reportQuestions,
  reportFindings,
}: Props) {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [reminderMsg, setReminderMsg] = useState<string | null>(null);
  const [extraTrialQuestions, setExtraTrialQuestions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('oncokind_prep_extra_questions') ?? '[]');
      setExtraTrialQuestions(Array.isArray(stored) ? stored.filter((x) => typeof x === 'string') : []);
    } catch {
      setExtraTrialQuestions([]);
    }
  }, []);

  if (!isPro) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="font-medium text-slate-800">Download Doctor Prep Sheet</p>
        <p className="text-sm text-slate-600 mt-1">
          Upgrade to Pro to download a one-page prep sheet for your oncologist visit.
        </p>
        <Button className="mt-3" asChild>
          <a href="/dashboard/billing">Upgrade to Pro</a>
        </Button>
      </div>
    );
  }

  const suggestedQuestions = (() => {
    const fromReport = reportQuestions ?? [];
    const defaults = [
      'What treatment options should we prioritize first?',
      'How do my biomarkers affect treatment choices?',
      'Are there clinical trials we should discuss right now?',
      'What should we monitor before the next appointment?',
      'What decisions do we need to make in the next two weeks?',
    ];
    return [...fromReport, ...extraTrialQuestions, ...defaults].slice(0, 8);
  })();

  const topBiomarkers = (() => {
    return (reportFindings ?? []).slice(0, 3).map((f) => `- ${f} (plain-language note: discuss how this may affect treatment options).`);
  })();

  function printablePrepSheetHtml() {
    const qHtml = suggestedQuestions.map((q) => `<li>${q}</li>`).join('');
    const bHtml = (topBiomarkers.length > 0 ? topBiomarkers : ['- No biomarkers were extracted from this report.'])
      .map((b) => `<li>${b.replace(/^- /, '')}</li>`)
      .join('');
    const findingsHtml = (reportFindings ?? []).length
      ? (reportFindings ?? []).map((f) => `<li>${f}</li>`).join('')
      : '<li>No additional key findings were extracted.</li>';

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>OncoKind Doctor Prep Sheet</title>
  <style>
    body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; line-height: 1.5; }
    .logo { font-weight: 700; color: #0284c7; margin-bottom: 4px; }
    .title { font-size: 24px; margin: 0 0 8px; }
    .muted { color: #475569; font-size: 14px; margin-bottom: 18px; }
    h2 { margin-top: 20px; font-size: 16px; }
    .box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; background: #f8fafc; }
    ul { padding-left: 18px; }
    .notes { min-height: 120px; border: 1px dashed #94a3b8; border-radius: 8px; padding: 10px; color: #334155; }
    .disclaimer { margin-top: 24px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="logo">OncoKind</div>
  <h1 class="title">Doctor Prep Sheet</h1>
  <div class="muted">${reportTitle ?? 'Pathology report'} • Generated ${new Date().toLocaleDateString()}</div>

  <div class="box">
    <h2>Cancer Profile Summary</h2>
    <p>${reportSummary ?? 'No summary available.'}</p>
  </div>

  <h2>Top Biomarkers Explained in Plain Language</h2>
  <ul>${bHtml}</ul>

  <h2>Key Findings</h2>
  <ul>${findingsHtml}</ul>

  <h2>Suggested Questions for the Oncologist</h2>
  <ul>${qHtml}</ul>

  <h2>Notes</h2>
  <div class="notes">${notes || 'Use this space to capture questions, instructions, and next steps during the appointment.'}</div>

  <div class="disclaimer">OncoKind provides informational guidance only and is not a substitute for professional medical advice.</div>
</body>
</html>`;
  }

  function openPrintablePrepSheet() {
    const html = printablePrepSheetHtml();
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  function getCalendarPayload() {
    const start = toDateTimeLocal(appointmentDate, appointmentTime);
    if (!start) return null;
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    const description = [
      'OncoKind Doctor Prep Appointment',
      '',
      `Summary: ${reportSummary ?? 'No summary available.'}`,
      '',
      'Top Questions:',
      ...suggestedQuestions.slice(0, 3).map((q, i) => `${i + 1}. ${q}`),
    ].join('\n');
    return { start, end, description };
  }

  function openGoogleCalendar() {
    const payload = getCalendarPayload();
    if (!payload) {
      setReminderMsg('Please enter appointment date and time first.');
      return;
    }
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Oncology Appointment (Doctor Prep)',
      dates: `${toGoogleCalendarDate(payload.start)}/${toGoogleCalendarDate(payload.end)}`,
      details: payload.description,
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  }

  function downloadIcs() {
    const payload = getCalendarPayload();
    if (!payload) {
      setReminderMsg('Please enter appointment date and time first.');
      return;
    }
    const ics = buildIcsContent({
      title: 'Oncology Appointment (Doctor Prep)',
      start: payload.start,
      end: payload.end,
      description: payload.description,
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oncokind-doctor-prep.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function enableReminders() {
    const payload = getCalendarPayload();
    if (!payload) {
      setReminderMsg('Please enter appointment date and time first.');
      return;
    }
    if (!('Notification' in window)) {
      setReminderMsg('This browser does not support notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      setReminderMsg('Notifications are not enabled. You can still use calendar invites.');
      return;
    }

    const now = Date.now();
    const twentyFourHours = payload.start.getTime() - 24 * 60 * 60 * 1000 - now;
    const twoHours = payload.start.getTime() - 2 * 60 * 60 * 1000 - now;
    if (twentyFourHours > 0) {
      window.setTimeout(() => {
        new Notification('OncoKind reminder: appointment in 24 hours', {
          body: 'Review your doctor prep sheet and questions.',
        });
      }, twentyFourHours);
    }
    if (twoHours > 0) {
      window.setTimeout(() => {
        new Notification('OncoKind reminder: appointment in 2 hours', {
          body: 'Bring your prep sheet and note your top priorities.',
        });
      }, twoHours);
    }
    setReminderMsg('Reminders are set for this browser session (24h and 2h before).');
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-medium text-slate-800">Doctor Prep Sheet</p>
      <p className="mt-1 text-sm text-slate-600">
        Generate a printable prep sheet and add your oncology appointment to calendar.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-slate-700">
          Appointment date
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-700">
          Appointment time
          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-700">
          Duration (minutes)
          <input
            type="number"
            min={15}
            step={15}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value) || 45)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="mt-3 block text-sm text-slate-700">
        Notes for your visit
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          placeholder="Add your own concerns and priorities for the visit..."
        />
      </label>

      {extraTrialQuestions.length > 0 && (
        <div className="mt-3 rounded-md border border-sky-200 bg-sky-50/50 p-3">
          <p className="text-sm font-medium text-primary">Questions added from Clinical Trials</p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {extraTrialQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={openPrintablePrepSheet}>Open Prep Sheet (Save as PDF)</Button>
        <Button variant="outline" onClick={openGoogleCalendar}>Add to Google Calendar</Button>
        <Button variant="outline" onClick={downloadIcs}>Download .ics (Apple Calendar)</Button>
        <Button variant="outline" onClick={enableReminders}>Enable 24h + 2h reminders</Button>
      </div>
      {reminderMsg && <p className="mt-2 text-sm text-slate-600">{reminderMsg}</p>}
    </div>
  );
}
