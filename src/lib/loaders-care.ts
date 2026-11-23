// Loaders for the care screens. Like src/lib/loaders.ts, pages call these and never import example data directly.
// In r2 these read the signed-in family's data.
import * as care from '@/data/example-care';
import type { AgendaDay, AgendaItem, CareTask, CircleMember, DoseDay, MedicineGroup, StoryEntry } from '@/data/types-care';
import { getAskTomorrow, getCalendar, getCallSettings, getFamily, getHerWords, getMedicines, getMetric, getStories, getTasks, getToday, lastDays } from './loaders';

/** "9:00 AM" or "14:00" to minutes after midnight. Items with no time sort first. */
export function minutesOf(time?: string): number {
  if (!time) return -1;
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return -1;
  let h = Number(m[1]) % 12;
  if (!m[3]) h = Number(m[1]);
  else if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}

export async function getCareTasks(): Promise<CareTask[]> {
  const base = await getTasks();
  const words = care.taskWords;
  const fromBase = base.map((t) => ({ ...t, ...(words[t.id] ?? { origin: t.from, doing: 'take care of it', approveLabel: 'Approve' }) }));
  return [...fromBase, ...care.extraTasks];
}

const DAY = 86400000;
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', { timeZone: 'UTC', ...o });

/** The next `n` days from today, each with the daily call and the calendar items on that day. */
export async function getAgenda(n = 14): Promise<AgendaDay[]> {
  const [today, cal, settings] = await Promise.all([getToday(), getCalendar(), getCallSettings()]);
  const start = new Date(`${today.iso}T00:00:00Z`).getTime();
  const all = [...cal, ...care.extraCalendar];
  const callNotes = Object.fromEntries(cal.filter((c) => c.kind === 'call' && c.note).map((c) => [c.date, c.note as string]));
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start + i * DAY);
    const iso = d.toISOString().slice(0, 10);
    const items: AgendaItem[] = all
      .filter((c) => c.date === iso && c.kind !== 'call')
      .map((c) => ({ ...c, mention: care.calendarMentions[c.id], sort: minutesOf(c.time) }))
      .sort((a, b) => a.sort - b.sort);
    return {
      iso, isToday: i === 0, items,
      label: fmt(d, { weekday: 'long', month: 'long', day: 'numeric' }),
      short: fmt(d, { weekday: 'short', month: 'short', day: 'numeric' }),
      weekday: fmt(d, { weekday: 'short' }), dayNum: fmt(d, { day: 'numeric' }),
      call: { time: settings.time, note: callNotes[iso] },
    };
  });
}

/**
 * Morning and evening groups, each with a 14-day strip built from the medicines series.
 * Same r1 rule as getPillTimesTaken: on a day with one of two pill times, the missing one is the evening.
 * In the example that day is Monday, where she gave two different answers, and today, where the evening has not come yet.
 */
export async function getMedicineGroups(): Promise<MedicineGroup[]> {
  const [meds, series, today] = await Promise.all([getMedicines(), getMetric('medicines'), getToday()]);
  const pts = lastDays(series, 14);
  const wd = (iso: string) => fmt(new Date(`${iso}T00:00:00Z`), { weekday: 'short' });
  const morningDays: DoseDay[] = pts.map((p) => ({ date: p.date, label: p.label, weekday: wd(p.date), answer: p.value === null ? 'no-call' : p.value >= 1 ? 'yes' : 'no' }));
  const eveningDays: DoseDay[] = pts.map((p) => ({
    date: p.date, label: p.label, weekday: wd(p.date),
    answer: p.date === today.iso ? 'not-yet' : p.value === null ? 'no-call' : p.value >= 2 ? 'yes' : 'two',
  }));
  const withRefill = (when: 'morning' | 'evening') => meds.filter((m) => m.when === when).map((m) => ({ ...m, refillOn: care.refillDates[m.id] }));
  return [
    { when: 'morning', title: 'Morning pills', asked: 'Asked on the 9:00 AM call', items: withRefill('morning'), days: morningDays,
      todayLine: 'On today\'s call she said she took her morning pills.' },
    { when: 'evening', title: 'Evening pills', asked: 'Evening reminder at 6:00 PM, asked about on the next morning\'s call', items: withRefill('evening'), days: eveningDays,
      todayLine: 'Tonight\'s pills have not come up yet. Ion will ask on tomorrow\'s call.' },
  ];
}

/** Her two answers about Monday evening, in her words. */
export async function getMedicineAnswers() {
  const words = (await getHerWords()).filter((w) => w.metric === 'medicines');
  return words;
}

export async function getAskQueue() {
  const all = await getAskTomorrow();
  return { queued: all.filter((a) => a.status === 'queued'), asked: care.askedQuestions, limit: 3 };
}

export async function getStoryEntries(): Promise<StoryEntry[]> {
  const s = await getStories();
  return s.map((x) => ({ ...x, question: care.storyQuestions[x.id] ?? 'Tell me a story.' }));
}
export const getNextStoryQuestion = async () => care.nextStoryQuestion;

export const getPlannedServices = async () => care.plannedServices;
export const getPreparedRequest = async () => care.preparedRequest;

const SEES: Record<string, string[]> = {
  'main-caregiver': ['The daily report and trends', 'Medicines, reminders and stories', 'Call settings and the family circle'],
  family: ['The daily report and trends', 'Medicines, reminders and stories'],
};
const DOES: Record<string, string[]> = {
  'main-caregiver': ['Approves tasks before I-on acts', 'Takes tasks', 'Changes call settings', 'Invites people'],
  family: ['Takes tasks', 'Adds reminders and questions for Ion'],
};
export async function getCircle(): Promise<CircleMember[]> {
  const fam = await getFamily();
  return fam.map((p) => ({ ...p, hearing: care.hearing[p.id] ?? 'daily', sees: SEES[p.role] ?? SEES.family, does: DOES[p.role] ?? DOES.family, joined: care.joined[p.id] ?? '' }));
}
