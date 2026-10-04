import { FIRST_72_TASKS, type First72Task } from '@/content/first-72-hours/v1';
import { stripTypographicDashes } from '@/lib/typography';
import { findUnsafeClinicalLanguage } from '@/lib/safety-language';

export type TaskStatus = 'open' | 'done' | 'snoozed' | 'not_applicable';

export type First72Intake = {
  diagnosis_date?: string;
  cancer_type?: string;
  stage?: string;
  biomarker_status?: string;
  insurance_type?: string;
  work_status?: string;
  zip?: string;
  next_appointment?: string;
};

export function personalizeTasks(intake: First72Intake): First72Task[] {
  return FIRST_72_TASKS.map((task) => {
    let title = task.title;
    if (intake.cancer_type && intake.cancer_type !== 'I am not sure' && task.id === 'biomarker-status') {
      title = `Confirm biomarker testing for ${intake.cancer_type}`;
    }
    return {
      ...task,
      title: stripTypographicDashes(title),
      why: stripTypographicDashes(task.why),
      how: task.how.map(stripTypographicDashes),
      script: task.script ? stripTypographicDashes(task.script) : undefined,
    };
  });
}

export function todaysTopThree(tasks: First72Task[]): First72Task[] {
  return tasks.filter((task) => task.bucket === 'today').slice(0, 3);
}

export function tasksByBucket(tasks: First72Task[]) {
  return {
    today: tasks.filter((t) => t.bucket === 'today'),
    day1: tasks.filter((t) => t.bucket === 'day1'),
    day2: tasks.filter((t) => t.bucket === 'day2'),
    day3: tasks.filter((t) => t.bucket === 'day3'),
    week1: tasks.filter((t) => t.bucket === 'week1'),
  };
}

export function collectFirst72Copy(): string {
  return FIRST_72_TASKS.map((task) =>
    [task.title, task.why, task.how.join(' '), task.script ?? ''].join(' ')
  ).join('\n');
}

export function first72SafetyHits(): string[] {
  return findUnsafeClinicalLanguage(collectFirst72Copy());
}
