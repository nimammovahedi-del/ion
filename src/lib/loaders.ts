// Every page gets its data through these functions and nothing else.
// In r1 they return the example family. In r2 they will read the signed-in family's data,
// so pages will not need to change. Keep them async for that reason.
import * as ex from '@/data/example';
import type { MetricId, MetricSeries } from '@/data/types';

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
export const getStories = async () => ex.stories;
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
 * How often she said she took each pill time over the last n days, from the medicines series.
 * r1 rule: on a day with one of two pill times, it was the evening pills (true for the example family).
 * r2 will read the two pill times separately from the call answers.
 */
export async function getPillTimesTaken(n: number) {
  const m = await getMetric('medicines');
  const pts = lastDays(m, n);
  const answered = pts.filter((p) => p.value !== null);
  return {
    answered: answered.length,
    morning: answered.filter((p) => (p.value as number) >= 1).length,
    evening: answered.filter((p) => (p.value as number) >= 2).length,
  };
}
