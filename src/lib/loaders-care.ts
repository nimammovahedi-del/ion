// Loaders for the care screens. Like src/lib/loaders.ts, pages call these and never import example data directly.
// In r2 these read the signed-in family's data.
import * as care from '@/data/example-care';
import type { Ability, AgendaDay, AgendaItem, AlsoLink, CareTask, CircleMember, DoseDay, MedicineGroup, Place } from '@/data/types-care';
import { getAskTomorrow, getCalendar, getCallSettings, getFamily, getHerWords, getMedicines, getMetric, getParent, getTasks, getToday, lastDays } from './loaders';

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
  const [base, meds, questions] = await Promise.all([getTasks(), getMedicines(), getAskTomorrow()]);
  const words = care.taskWords;
  const fromBase = base.map((t) => ({ ...t, ...(words[t.id] ?? { origin: t.from, doing: 'take care of it', approveLabel: 'Approve' }) }));
  return [...fromBase, ...care.extraTasks].map((t) => {
    // A task about a medicine shows the family's own label, word for word.
    const med = meds.find((m) => m.id === care.taskMedicines[t.id]);
    if (med) {
      const due = care.refillDates[med.id];
      const left = med.refillDaysLeft !== undefined ? ` About ${med.refillDaysLeft} days left${due ? `, refill due ${due}` : ''}.` : '';
      return { ...t, detail: `\u201C${med.label}\u201D, one of her ${med.when} pills.${left}` };
    }
    // A task that is a question for tomorrow's call uses the question's own words.
    const q = questions.find((x) => x.id === care.taskQuestions[t.id]);
    if (q) return { ...t, title: q.text.replace(/\.$/, '') };
    return t;
  });
}

const PLACE_LABEL: Record<Place, string> = {
  tasks: 'Also in Tasks', calendar: 'On the calendar', reminders: 'In Reminders', medicines: 'On Medicines', ask: 'In Ask tomorrow', services: 'In Services',
};
/**
 * Small links from one copy of a thing to its other copies. Call the returned function with the page you are on and the item's id there.
 * The anchors match the ids the care pages put on their items.
 */
export async function getAlso(): Promise<(place: Place, id: string) => AlsoLink[]> {
  const cal = [...(await getCalendar()), ...care.extraCalendar];
  const href = (place: Place, id: string) => {
    if (place === 'tasks') return `/app/tasks/#task-${id}`;
    if (place === 'calendar') return `/app/calendar/#day-${cal.find((c) => c.id === id)?.date ?? ''}`;
    if (place === 'reminders') return `/app/reminders/#rem-${id}`;
    if (place === 'medicines') return `/app/medicines/#med-${id}`;
    if (place === 'ask') return `/app/ask/#q-${id}`;
    return `/app/services/#${id}`;
  };
  return (place, id) => {
    const thing = care.sameThings.find((t) => t[place] === id);
    if (!thing) return [];
    return (Object.keys(thing) as Place[]).filter((p) => p !== place).map((p) => ({ place: p, label: PLACE_LABEL[p], href: href(p, thing[p] as string) }));
  };
}

const DAY = 86400000;
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', { timeZone: 'UTC', ...o });

/** The next `n` days from today, each with the daily call and the calendar items on that day. */
export async function getAgenda(n = 14): Promise<AgendaDay[]> {
  const [today, cal, settings, meds] = await Promise.all([getToday(), getCalendar(), getCallSettings(), getMedicines()]);
  const start = new Date(`${today.iso}T00:00:00Z`).getTime();
  const all = [...cal, ...care.extraCalendar];
  const callNotes = Object.fromEntries(cal.filter((c) => c.kind === 'call' && c.note).map((c) => [c.date, c.note as string]));
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start + i * DAY);
    const iso = d.toISOString().slice(0, 10);
    const items: AgendaItem[] = all
      .filter((c) => c.date === iso && c.kind !== 'call')
      .map((c) => {
        const med = meds.find((m) => m.id === care.calendarRefills[c.id]);
        const tn = care.calendarTaskNotes[c.id];
        return {
          ...c, mention: care.calendarMentions[c.id], sort: minutesOf(c.time), short: care.calendarShort[c.id] ?? c.title,
          isTask: c.id in care.calendarTasks,
          // A refill shows the family's own label for the medicine, word for word.
          note: tn ? undefined : med ? med.label : c.note,
          noteLink: tn ? { text: tn.text, href: `/app/tasks/#task-${tn.task}`, task: tn.task } : undefined,
        };
      })
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
 * Each morning call asks about last night's pills and this morning's, so the number on a call day covers the evening
 * before and that morning. Same r1 rule as getPillTimesTaken: when it is one of two, the unsure one is the evening.
 * In the example that is Monday evening, where she gave two different answers. This evening has not come up yet.
 */
export async function getMedicineGroups(): Promise<MedicineGroup[]> {
  const [meds, series, today, settings] = await Promise.all([getMedicines(), getMetric('medicines'), getToday(), getCallSettings()]);
  const pts = lastDays(series, 14);
  const wd = (iso: string) => fmt(new Date(`${iso}T00:00:00Z`), { weekday: 'short' });
  const morningDays: DoseDay[] = pts.map((p) => ({ date: p.date, label: p.label, weekday: wd(p.date), answer: p.value === null ? 'no-call' : p.value >= 1 ? 'yes' : 'no' }));
  // The evening of a day is asked about on the next morning's call, so it reads the next day's number.
  const eveningDays: DoseDay[] = pts.map((p, i) => {
    const next = pts[i + 1];
    return {
      date: p.date, label: p.label, weekday: wd(p.date),
      answer: p.date === today.iso || !next ? 'not-yet' : next.value === null ? 'no-call' : next.value >= 2 ? 'yes' : 'two',
    };
  });
  const withRefill = (when: 'morning' | 'evening') => meds.filter((m) => m.when === when).map((m) => ({ ...m, refillOn: care.refillDates[m.id] }));
  return [
    { when: 'morning', title: 'Morning pills', asked: `Asked on the ${settings.time} call`, items: withRefill('morning'), days: morningDays,
      todayLine: 'On today\'s call she said she took her morning pills.' },
    { when: 'evening', title: 'Evening pills', asked: 'Reminder at 6:00 PM. Ion asks the next morning.', items: withRefill('evening'), days: eveningDays,
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

export const getPlannedServices = async () => care.plannedServices;
export async function getPreparedRequest() {
  const parent = await getParent();
  return { ...care.preparedRequest, lines: [['Who', parent.name, 'users'], ...care.preparedRequest.lines] as [string, string, string][] };
}

const SEES: Record<string, string[]> = {
  'main-caregiver': ['The daily report and trends', 'Medicines and reminders', 'Call settings and the family circle'],
  family: ['The daily report and trends', 'Medicines and reminders'],
};
const DOES: Record<string, string[]> = {
  'main-caregiver': ['Approves tasks before I-on acts', 'Takes tasks', 'Changes call settings', 'Invites people'],
  family: ['Takes tasks', 'Adds reminders and questions for Ion'],
};
/** The same rights as SEES and DOES, as short labels with an icon, for the cards on the Family circle page. */
const ABILITIES: Omit<Ability, 'allowed'>[] = [
  { id: 'report', icon: 'today', label: 'Reads the report and trends', mainOnly: false },
  { id: 'medicines', icon: 'pill', label: 'Sees medicines and reminders', mainOnly: false },
  { id: 'tasks', icon: 'tasks', label: 'Takes tasks', mainOnly: false },
  { id: 'ask', icon: 'chat', label: 'Adds reminders and questions', mainOnly: false },
  { id: 'approve', icon: 'check', label: 'Approves tasks', mainOnly: true },
  { id: 'settings', icon: 'settings', label: 'Changes call settings', mainOnly: true },
  { id: 'invite', icon: 'users', label: 'Invites people', mainOnly: true },
];
export async function getCircle(): Promise<CircleMember[]> {
  const fam = await getFamily();
  return fam.map((p) => ({
    ...p, hearing: care.hearing[p.id] ?? 'daily', sees: SEES[p.role] ?? SEES.family, does: DOES[p.role] ?? DOES.family, joined: care.joined[p.id] ?? '',
    abilities: ABILITIES.map((a) => ({ ...a, allowed: !a.mainOnly || p.role === 'main-caregiver' })),
  }));
}
