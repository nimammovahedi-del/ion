// Every page gets its data through these functions and nothing else.
// In r1 they return the example family. In r2 they will read the signed-in family's data,
// so pages will not need to change. Keep them async for that reason.
import * as ex from '@/data/example';
import type { DayPoint, MetricId, MetricSeries, PillAnswer, PillDay } from '@/data/types';

export const getToday = async () => ex.TODAY;
export const getParent = async () => ex.parent;
export const getFamily = async () => ex.family;
export const getViewer = async () => ex.viewer;
export const getReport = async () => ex.report;
export const getHealthCards = async () => ex.healthCards;
export const getTasks = async () => ex.tasks;
export const getSteps = async () => ex.steps;
export const getCalendar = async () => ex.calendar;
export const getMedicines = async () => ex.medicines;
export const getReminders = async () => ex.reminders;
export const getAskTomorrow = async () => ex.askTomorrow;
export const getCallSettings = async () => ex.callSettings;
export const getWeekNotes = async () => ex.weekNotes;
export const getMetrics = async () => ex.metrics;

export async function getMetric(id: MetricId): Promise<MetricSeries> {
  const m = ex.metrics.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown metric: ${id}`);
  return m;
}

/** Last n days of a series, oldest first. */
export function lastDays(m: MetricSeries, n: number) {
  return m.points.slice(-n);
}

/** Average of the answered days, rounded to one decimal. */
export function average(points: { value: number | null }[]): number | null {
  const v = points.map((p) => p.value).filter((x): x is number => x !== null);
  if (!v.length) return null;
  return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10;
}

export const needsYouCount = async () => ex.tasks.filter((t) => t.status === 'needs-you').length;

// ---- Added for Today and Trends ----
export const getHerWords = async () => ex.herWords;
export const getDoctorQuestions = async () => ex.doctorQuestions;

/**
 * Her pill answers by calendar day, for the days in `pts` (a slice of the medicines series).
 * Each morning call asks about last night's pills and this morning's, so the number on a call day covers the evening
 * before and that morning. The evening of a date is therefore read from the next day's number, and today's evening
 * has not come up yet. r1 rule: when a call day has one of two, the doubtful one is the evening before
 * (true for the example family). r2 will read the two pill times separately from the call answers.
 */
export function pillDays(pts: DayPoint[]): PillDay[] {
  const all = ex.metrics.find((m) => m.id === 'medicines')?.points ?? [];
  return pts.map((p) => {
    const i = all.findIndex((x) => x.date === p.date);
    const next = i >= 0 ? all[i + 1] : undefined;
    const morning: PillAnswer = p.value === null ? 'no-call' : p.value >= 1 ? 'yes' : 'no';
    const evening: PillAnswer = p.date === ex.TODAY.iso || !next ? 'later'
      : next.value === null ? 'no-call'
      : next.value >= 2 ? 'yes'
      : ex.pillTwoAnswers.includes(p.date) ? 'two' : 'no';
    return { date: p.date, label: p.label, morning, evening };
  });
}

/** Counts over a run of pill days: how many mornings and evenings she was asked about, and what she said. */
export function pillCounts(days: PillDay[]) {
  const asked = (xs: PillAnswer[]) => xs.filter((a) => a !== 'no-call' && a !== 'later');
  const m = asked(days.map((d) => d.morning)), e = asked(days.map((d) => d.evening));
  const yes = (xs: PillAnswer[]) => xs.filter((a) => a === 'yes').length;
  return {
    mornings: m.length, morningYes: yes(m),
    evenings: e.length, eveningYes: yes(e),
    two: [...m, ...e].filter((a) => a === 'two').length,
    no: [...m, ...e].filter((a) => a === 'no').length,
    times: m.length + e.length, timesYes: yes(m) + yes(e),
  };
}

/**
 * How often she said yes to each pill time over the last n days.
 * `answered` is the number of mornings she was asked, `eveningsAsked` the number of evenings (tonight is not counted yet).
 */
export async function getPillTimesTaken(n: number) {
  const m = await getMetric('medicines');
  const c = pillCounts(pillDays(lastDays(m, n)));
  return { answered: c.mornings, morning: c.morningYes, evening: c.eveningYes, eveningsAsked: c.evenings, two: c.two, no: c.no };
}

/** The morning as a short timeline for Today: called, she answered, report written, what waits for the family, what comes later. */
export const getDayFlow = async () => ex.dayFlow;
