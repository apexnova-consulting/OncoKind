export function ctpResultsReadyEmail(): { subject: string; html: string } {
  return {
    subject: 'Your Complete the Picture questions are ready',
    html: `<p>Your question list is ready in OncoKind. Educational support, not medical advice.</p><p><a href="https://www.oncokind.com/journey/complete-the-picture">Open Complete the Picture</a></p><p><a href="https://www.oncokind.com/dashboard">Pause emails</a></p>`,
  };
}

export function questionReminderEmail(): { subject: string; html: string } {
  return {
    subject: 'A reminder before the next appointment',
    html: `<p>If it is helpful, review the questions you wanted to ask. Your care team decides what is right for you.</p><p><a href="https://www.oncokind.com/dashboard">Pause emails</a></p>`,
  };
}

export function applicationDeadlineEmail(): { subject: string; html: string } {
  return {
    subject: 'An assistance application date is coming up',
    html: `<p>This is a reminder about an assistance program application you are tracking. Confirm dates on the program site.</p><p><a href="https://www.oncokind.com/dashboard">Pause emails</a></p>`,
  };
}

export function callSummaryEmail(): { subject: string; html: string } {
  return {
    subject: 'Call for me summary',
    html: `<p>A process-call summary is ready. No patient information was included in the call script.</p><p><a href="https://www.oncokind.com/dashboard">Pause emails</a></p>`,
  };
}
