// The invented example family. Every screen in r1 reads from here through src/lib/loaders.ts.
// Margaret "Maggie" Ellis is not a real person.
import type { AgentStep, AskTomorrow, DayFlowStep, HerWords, CalendarItem, CallSettings, DayPoint, HealthCardData, Medicine, MetricSeries, Person, Reminder, Task, WeekNote } from './types';

/** When her daily call is planned (getCallSettings().time), and when today's call actually began (getToday().callTime). */
export const PLANNED_CALL_TIME = '9:00 AM';
export const CALL_TIME = '9:04 AM';
export const TODAY = { iso: '2026-11-24', long: 'Tuesday, November 24', short: 'Tue Nov 24', callTime: CALL_TIME, callMinutes: 6 };

export const parent: Person = { id: 'maggie', name: 'Margaret Ellis', short: 'Maggie', initials: 'ME', relation: 'Mom', role: 'parent' };
export const family: Person[] = [
  { id: 'sara', name: 'Sara Ellis', short: 'Sara', initials: 'SE', relation: 'Daughter', role: 'main-caregiver' },
  { id: 'daniel', name: 'Daniel Ellis', short: 'Daniel', initials: 'DE', relation: 'Son', role: 'family' },
  { id: 'priya', name: 'Priya Ellis', short: 'Priya', initials: 'PE', relation: 'Granddaughter', role: 'family' },
];
export const viewer = family[0];

export const report = {
  headline: 'A quiet morning, but the short nights are adding up.',
  said: 'She was up three times in the night again. Her knee is the same. She is low on milk, eggs and bread, and would like a ride to the eye doctor on Thursday.',
  changed: 'Sleep has been about two hours under her usual for four nights.',
  mightDo: 'You might ask what is waking her at night. If it continues this week, it is worth mentioning to her doctor.',
  quote: 'I was up three times again.',
  feeling: 6, feelingUsual: 7,
  // Added for the Today page.
  overall: 'One thing to watch: her sleep',
  overallTone: 'changed' as 'changed' | 'check' | 'little' | 'usual',
  stayedSame: 'Her meals, drinks and knee are as usual. No falls.',
  quotes: [
    { text: 'A bit tired, but I\'m all right.', about: 'When Ion asked how she was feeling' },
    { text: 'I was up three times again.', about: 'About last night' },
    { text: 'I could ice forty buns before the kettle boiled.', about: 'Today\'s story question, about her first job' },
  ],
  suggestions: [
    { text: 'You might ask her what is waking her at night.', why: 'Four short nights in a row.', href: '/app/ask/', link: 'Add it to tomorrow\'s call' },
    { text: 'If the short nights go on this week, you might mention them to her doctor.', why: 'The doctor-visit page puts the last 30 days on one sheet.', href: '/app/trends/doctor-visit/', link: 'Open the doctor-visit page' },
    { text: 'You might gently ask about Monday evening\'s pills.', why: 'She gave two different answers. Both are kept.', href: '/app/medicines/', link: 'See her medicines' },
  ],
};

/** Her own words from recent calls, per measure. Used on Trends and the doctor-visit page. */
export const herWords: HerWords[] = [
  { metric: 'sleep', date: '2026-11-24', day: 'Tue Nov 24', text: 'I was up three times again.' },
  { metric: 'sleep', date: '2026-11-23', day: 'Mon Nov 23', text: 'I keep waking up, and then I just lie there.' },
  { metric: 'sleep', date: '2026-11-21', day: 'Sat Nov 21', text: 'Not a great night. I was awake before five.' },
  { metric: 'feeling', date: '2026-11-24', day: 'Tue Nov 24', text: 'A bit tired, but I\'m all right.' },
  { metric: 'pain', date: '2026-11-24', day: 'Tue Nov 24', text: 'The knee is the same, nothing new.' },
  { metric: 'pain', date: '2026-11-07', day: 'Sat Nov 7', text: 'My knee is grumbling after that long walk.' },
  { metric: 'meals', date: '2026-11-24', day: 'Tue Nov 24', text: 'Soup and toast for dinner. I\'m low on milk, eggs and bread.' },
  { metric: 'fluids', date: '2026-11-24', day: 'Tue Nov 24', text: 'Plenty of tea, as always, and a glass of water with lunch.' },
  { metric: 'medicines', date: '2026-11-24', day: 'Tue Nov 24', text: 'Yes, I took the evening ones last night.' },
  { metric: 'medicines', date: '2026-11-23', day: 'Mon Nov 23', text: 'I think I\'ll leave the evening ones tonight. I\'m tired.', source: 'evening reminder' },
  { metric: 'falls', date: '2026-11-24', day: 'Tue Nov 24', text: 'No falls. I hold the rail on the stairs.' },
  { metric: 'falls', date: '2026-10-03', day: 'Sat Oct 3', text: 'I caught my foot on the back step, but I\'m fine. Nothing hurt.' },
  { metric: 'out', date: '2026-11-21', day: 'Sat Nov 21', text: 'Daniel took me for a drive along the river.' },
  { metric: 'out', date: '2026-11-22', day: 'Sun Nov 22', text: 'Too cold to go out today.' },
];

/** Starting questions for the doctor-visit page. The family adds their own on the printed sheet. */
export const doctorQuestions: string[] = [
  'She has slept about two hours less than usual for four nights, and says she wakes up often. What should we keep an eye on?',
  'She sometimes is not sure whether she took her evening pills. Is there a simple way to help her keep track?',
  'Her right knee has been at about 4 out of 10 for months. Is there anything that might make walking easier?',
];

export const healthCards: HealthCardData[] = [
  { id: 'sleep', title: 'Sleep', icon: 'moon', value: '5.5', unit: 'hours', caption: 'Last night · her usual is 7.5', status: 'changed', statusLabel: 'Changed',
    sources: [{ label: 'Tue call', kind: 'call' }, { label: '3 earlier calls', kind: 'earlier-calls' }], from: 'From today\'s call and the three before it',
    evidence: 'She said, "I was up three times again." This is the fourth short night in a row.' },
  { id: 'medicines', title: 'Medicines', icon: 'pill', value: 'Two answers', caption: 'Morning: she said yes. Last night: two different answers.', status: 'check', statusLabel: 'Check',
    sources: [{ label: 'Tue call', kind: 'call' }, { label: 'Mon evening reminder', kind: 'call' }], from: 'From today\'s call and Monday\'s evening reminder',
    evidence: 'Today she said she took her morning pills.',
    disagreement: 'Today she said she took last night\'s pills. On Monday\'s evening reminder she said she would skip them. Both answers are kept so you can ask her.' },
  { id: 'feeling', title: 'Feeling', icon: 'heart', value: '6', unit: 'out of 10', caption: 'Her own score · her usual is 7', status: 'little', statusLabel: 'A little lower',
    sources: [{ label: 'Tue call', kind: 'call' }], from: 'From today\'s call',
    evidence: 'She said, "A bit tired, but I\'m all right." One point under her usual, which fits the short nights.' },
  { id: 'meals', title: 'Meals', icon: 'bowl', value: '3', unit: 'meals', caption: 'Yesterday · tea and water through the day', status: 'usual', statusLabel: 'As usual',
    sources: [{ label: 'Tue call', kind: 'call' }], from: 'From today\'s call',
    evidence: 'Dinner was soup and toast. She is low on milk, eggs and bread.' },
  { id: 'pain', title: 'Pain', icon: 'spark', value: '4', unit: 'out of 10', caption: 'Right knee · same as last week', status: 'usual', statusLabel: 'As usual',
    sources: [{ label: 'Tue call', kind: 'call' }, { label: 'Last week', kind: 'earlier-calls' }], from: 'From today\'s call and last week\'s calls',
    evidence: 'She said, "The knee is the same, nothing new."' },
  { id: 'falls', title: 'Falls', icon: 'walk', value: 'None', caption: 'Since Monday\'s call', status: 'usual', statusLabel: 'As usual',
    sources: [{ label: 'Tue call', kind: 'call' }], from: 'From today\'s call',
    evidence: 'She said, "No falls. I hold the rail on the stairs."' },
];

export const tasks: Task[] = [
  { id: 'ride', title: 'Ride to the eye doctor', detail: 'Thursday, Nov 26 at 2:00 PM. She asked for a ride on today\'s call.', icon: 'car', from: 'Tue call', due: 'Thu Nov 26', status: 'needs-you',
    actions: [{ label: 'Approve ride', kind: 'primary' }, { label: 'I\'ll drive', kind: 'secondary' }] },
  { id: 'groceries', title: 'Groceries: milk, eggs, bread', detail: 'She is running low. Added from today\'s food question.', icon: 'cart', from: 'Tue call', status: 'needs-you',
    actions: [{ label: 'Open shopping list', kind: 'primary' }, { label: 'Daniel will shop', kind: 'secondary' }] },
  { id: 'refill', title: 'Call the pharmacy about a refill', detail: 'Small white pill: about 6 days left. Refill due Monday.', icon: 'pill', from: 'Medicine list', due: 'Mon Nov 30', status: 'needs-you',
    actions: [{ label: 'Open refill', kind: 'primary' }, { label: 'Done already', kind: 'secondary' }] },
  { id: 'heating', title: 'Check the heating before the cold week', detail: 'Daniel offered on Sunday. He will look on Saturday.', icon: 'home', from: 'Family note', due: 'Sat Nov 28', status: 'in-progress', assignee: 'Daniel', actions: [] },
  { id: 'glasses', title: 'Pick up her new reading glasses', detail: 'Collected by Sara on Friday.', icon: 'check', from: 'Call, Nov 18', status: 'done', assignee: 'Sara', actions: [] },
];

export const steps: AgentStep[] = [
  { n: 1, title: 'Call', result: `Called Maggie at ${CALL_TIME} and talked for 6 minutes.`, time: CALL_TIME, status: 'done' },
  { n: 2, title: 'Report', result: 'Wrote today\'s report and compared it with her usual.', time: '9:05 AM', status: 'done' },
  { n: 3, title: 'Tasks', result: 'Made a list of three things to do.', time: '9:05 AM', status: 'done' },
  { n: 4, title: 'Ride for Thursday', result: 'She needs to get to the eye doctor at 2:00 PM.', time: '9:05 AM', status: 'needs-you', progress: 66,
    substeps: [
      { label: 'She asked for a ride on the call', done: true },
      { label: 'Thursday 2:00 PM added to the calendar', done: true },
      { label: 'Waiting for someone to approve the ride or say they will drive', done: false, code: 'ride.request · Thu 2:00 PM' },
    ] },
  { n: 5, title: 'Evening reminder', result: 'Will remind her about her evening pills at 6:00 PM.', time: '6:00 PM', status: 'waiting' },
];

export const calendar: CalendarItem[] = [
  { id: 'c1', date: '2026-11-24', day: 'Tue Nov 24', time: PLANNED_CALL_TIME, title: 'Daily call', kind: 'call', note: 'Done, 6 minutes' },
  { id: 'c2', date: '2026-11-25', day: 'Wed Nov 25', time: PLANNED_CALL_TIME, title: 'Daily call', kind: 'call' },
  { id: 'c3', date: '2026-11-26', day: 'Thu Nov 26', time: '2:00 PM', title: 'Eye doctor', kind: 'appointment', note: 'Ride not yet set' },
  { id: 'c4', date: '2026-11-28', day: 'Sat Nov 28', title: 'Priya visits', kind: 'visit', note: 'All day' },
  { id: 'c5', date: '2026-11-28', day: 'Sat Nov 28', time: '10:00 AM', title: 'Daniel checks the heating', kind: 'visit' },
  { id: 'c6', date: '2026-11-30', day: 'Mon Nov 30', title: 'Refill due', kind: 'refill', note: 'Small white pill' },
  { id: 'c7', date: '2026-12-03', day: 'Thu Dec 3', time: '11:30 AM', title: 'Hair appointment', kind: 'appointment' },
];

// Labels are the family's own words. I-on never names or suggests a medicine.
export const medicines: Medicine[] = [
  { id: 'm1', label: 'Small white pill', when: 'morning', count: 1, takenToday: true, refillDaysLeft: 6 },
  { id: 'm2', label: 'Yellow pill', when: 'morning', count: 1, takenToday: true },
  { id: 'm3', label: 'Orange chewable', when: 'morning', count: 1, takenToday: true },
  { id: 'm4', label: 'Pink evening pill', when: 'evening', count: 1, takenToday: null, note: 'Yesterday: two different answers' },
  { id: 'm5', label: 'Large white tablet', when: 'evening', count: 1, takenToday: null, note: 'Yesterday: two different answers' },
];

export const reminders: Reminder[] = [
  { id: 'r1', kind: 'medicine', text: 'Time for your evening pills, Maggie.', when: 'Every day, 6:00 PM', spokenBy: 'evening-reminder', setBy: 'Sara', active: true },
  { id: 'r2', kind: 'medicine', text: 'Have you taken your morning pills?', when: `Every day, on the ${PLANNED_CALL_TIME} call`, spokenBy: 'call', setBy: 'Sara', active: true },
  { id: 'r3', kind: 'appointment', text: 'You have the eye doctor on Thursday at 2:00 PM.', when: 'Wed and Thu, on the call', spokenBy: 'call', setBy: 'I-on, from the calendar', active: true },
  { id: 'r4', kind: 'other', text: 'Priya is visiting on Saturday.', when: 'Fri, on the call', spokenBy: 'call', setBy: 'Priya', active: true },
  { id: 'r5', kind: 'other', text: 'Put the bins out tonight.', when: 'Every Wednesday, 6:00 PM', spokenBy: 'evening-reminder', setBy: 'Daniel', active: false },
];

export const askTomorrow: AskTomorrow[] = [
  { id: 'a1', text: 'Ask what is waking her up at night.', by: 'Sara', status: 'queued' },
  { id: 'a2', text: 'Ask if she wants the big-print library books again.', by: 'Priya', status: 'queued' },
  { id: 'a3', text: 'Ask whether the new slippers fit.', by: 'Daniel', status: 'asked', answer: 'She said they fit well and she wears them all day.' },
];

export const callSettings: CallSettings = {
  time: PLANNED_CALL_TIME, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], voice: 'Ion, calm and unhurried', retry: 'If she does not answer, try again at 9:20 and 10:00, then tell Sara.',
  topics: [
    { id: 'sleep', label: 'Sleep', on: true, fixed: true },
    { id: 'meals', label: 'Meals and drinks', on: true, fixed: true },
    { id: 'pain', label: 'Pain', on: true, fixed: true },
    { id: 'medicines', label: 'Medicines', on: true, fixed: true },
    { id: 'falls', label: 'Falls', on: true, fixed: true },
    { id: 'out', label: 'Getting out and seeing people', on: true },
    { id: 'food', label: 'Food in the house', on: true },
    { id: 'mood', label: 'Mood and worries', on: true },
    { id: 'story', label: 'A story question', on: true },
  ],
};

export const weekNotes: WeekNote[] = [
  { week: 'Nov 18 to 24', changed: ['Sleep fell to about 5.5 hours for four nights, Nov 21 to 24.', 'Monday evening\'s pills (Nov 23) have two different answers from her.'],
    little: ['Her feeling score is one point under her usual.', 'She went out on three days, a little less often than usual.'], steady: ['Meals, drinks and pain are as usual.', 'No falls.'] },
  { week: 'Nov 11 to 17', changed: ['Nothing changed this week.'], steady: ['Sleep about 7.5 hours.', 'She said she took all her pills.', 'Out on four days, including church.'] },
  { week: 'Nov 4 to 10', changed: ['Knee pain rose to 5 for two days after the long walk, then settled.'], steady: ['Sleep and meals as usual.', 'She said she took all her pills.'] },
];

// ---- 90 days of invented daily answers, oldest first, ending today. Deterministic, so every build matches. ----
function rng(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
function days(n: number): { date: string; label: string }[] {
  const end = new Date(Date.UTC(2026, 10, 24));
  const out: { date: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86400000);
    out.push({ date: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) });
  }
  return out;
}
const D = days(90);
function series(seed: number, base: number, spread: number, step: number, lo: number, hi: number, tail: number[] = [], bumps: Record<number, number> = {}): DayPoint[] {
  const r = rng(seed);
  return D.map((d, i) => {
    let v = base + Math.round(((r() - 0.5) * 2 * spread) / step) * step;
    if (bumps[i] !== undefined) v = bumps[i];
    const t = i - (D.length - tail.length);
    if (t >= 0) v = tail[t];
    // about one call in thirty is missed
    const missed = t < 0 && r() < 0.035;
    return { ...d, value: missed ? null : Math.min(hi, Math.max(lo, v)) };
  });
}
const SLEEP_TAIL = [7.5, 7, 8, 7.5, 7, 7.5, 8, 7, 7.5, 7.5, 6, 5.5, 5, 5.5];
// Pain is pinned by hand so the chart and the words agree: steady at 4, a 3 now and then,
// and 5 on exactly two days, November 7 and 8, after the long walk. Keys count days from the start of the 90.
const PAIN_DAYS: Record<number, number> = { 6: 3, 19: 3, 27: 3, 33: 3, 41: 3, 50: 3, 58: 3, 63: 3, 72: 5, 73: 5 };
/** Evenings where she gave two different answers about her pills. Any other doubtful pill time is "she said no, or was not sure". */
export const pillTwoAnswers: string[] = ['2026-11-23'];

export const metrics: MetricSeries[] = [
  { id: 'sleep', title: 'Sleep', unit: 'hours', icon: 'moon', usual: 7.5, usualLabel: '7.5 hours', higherIsBetter: true, min: 3, max: 10, points: series(11, 7.5, 0.6, 0.5, 4, 9.5, SLEEP_TAIL), status: 'changed',
    note: 'About two hours under her usual for the last four nights.' },
  { id: 'feeling', title: 'Feeling', unit: 'out of 10', icon: 'heart', usual: 7, usualLabel: '7 out of 10', higherIsBetter: true, min: 0, max: 10, points: series(23, 7, 1, 1, 4, 9, [7, 7, 8, 7, 7, 7, 8, 7, 7, 7, 6, 6, 6, 6]), status: 'little', statusLabel: 'A little lower',
    note: 'One point under her usual since the short nights began.' },
  { id: 'pain', title: 'Pain', unit: 'out of 10', icon: 'spark', usual: 4, usualLabel: '4 out of 10, right knee', higherIsBetter: false, min: 0, max: 10, points: series(37, 4, 0, 1, 2, 7, [4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], PAIN_DAYS), status: 'usual',
    note: 'Steady at 4, the same as last week.' },
  { id: 'meals', title: 'Meals', unit: 'meals a day', icon: 'bowl', usual: 3, usualLabel: '3 meals', higherIsBetter: true, min: 0, max: 4, points: series(41, 3, 0.7, 1, 1, 3, [3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]), status: 'usual',
    note: 'Three meals on most days. Nothing has changed.' },
  { id: 'fluids', title: 'Drinks', unit: 'cups a day', icon: 'bowl', usual: 6, usualLabel: 'about 6 cups', higherIsBetter: true, min: 0, max: 10, points: series(53, 6, 1.2, 1, 3, 9, [6, 6, 7, 6, 5, 6, 6, 6, 7, 6, 6, 6, 5, 6]), status: 'usual',
    note: 'About six cups a day, mostly tea and water.' },
  { id: 'medicines', title: 'Medicines', unit: 'pill times she said yes to since the call before, of 2', icon: 'pill', usual: 2, usualLabel: 'both pill times', higherIsBetter: true, min: 0, max: 2, points: series(67, 2, 0.2, 1, 1, 2, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], { 30: 1, 52: 1 }), status: 'check',
    note: 'Monday evening has two different answers. On the other days this week she said she took her pills.' },
  { id: 'falls', title: 'Falls', unit: 'falls', icon: 'walk', usual: 0, usualLabel: 'none', higherIsBetter: false, min: 0, max: 2, points: series(71, 0, 0, 1, 0, 1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { 37: 1 }), status: 'usual',
    note: 'No falls this week.' },
  { id: 'out', title: 'Getting out', unit: 'times out of the house', icon: 'home', usual: 1, usualLabel: 'out on most days', higherIsBetter: true, min: 0, max: 2, points: series(83, 1, 0.9, 1, 0, 2, [1, 0, 0, 1, 2, 1, 0, 0, 1, 0, 1, 0, 0, 1]), status: 'little', statusLabel: 'A little less',
    note: 'Out on three days this week, a little less than usual.' },
];

/** The same morning as `steps`, told as five short stops for the timeline on Today. */
export const dayFlow: DayFlowStep[] = [
  { id: 'call', icon: 'phone', time: CALL_TIME, title: 'Ion called', text: 'Her daily morning call', status: 'done' },
  { id: 'answer', icon: 'chat', time: CALL_TIME, title: 'She answered', text: 'They talked for 6 minutes', status: 'done' },
  { id: 'report', icon: 'note', time: '9:05 AM', title: 'Report written', text: 'With three things to do', status: 'done' },
  { id: 'ride', icon: 'car', time: '9:05 AM', title: 'Ride for Thursday', text: 'On the calendar. It needs a yes from the family.', status: 'needs-you', doneText: 'The family said yes. It is on the Tasks page.' },
  { id: 'evening', icon: 'bell', time: '6:00 PM', title: 'Evening reminder', text: 'Ion will remind her about her evening pills', status: 'later' },
];
