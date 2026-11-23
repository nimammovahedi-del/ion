// Extra example data for the care screens. It adds to src/data/example.ts and never contradicts it.
// The family is invented. Today in the example is Tuesday, November 24, 2026.
import type { AskedQuestion, CareTask, Hearing, PlannedService } from './types-care';
import type { CalendarItem } from './types';

/** Words for each task in src/data/example.ts, keyed by task id. */
export const taskWords: Record<string, Pick<CareTask, 'origin' | 'doing' | 'approveLabel' | 'ionAfter' | 'doneNote'>> = {
  ride: { origin: 'She asked on today\'s call.', doing: 'sort out the ride', approveLabel: 'Approve ride',
    ionAfter: 'Once someone says yes, Ion will tell her on tomorrow\'s call who is driving.' },
  groceries: { origin: 'She said she is running low on today\'s call.', doing: 'bring the groceries', approveLabel: 'Approve shopping',
    ionAfter: 'Ion will tell her on tomorrow\'s call who is bringing them.' },
  refill: { origin: 'From the medicine list: about 6 days left.', doing: 'call the pharmacy', approveLabel: 'Approve refill call',
    ionAfter: 'Ion will let her know on the call once the refill is sorted.' },
  heating: { origin: 'Daniel offered in a family note on Sunday.', doing: 'check the heating', approveLabel: 'Approve' },
  glasses: { origin: 'She asked on the call on November 18.', doing: 'pick them up', approveLabel: 'Approve', doneNote: 'Done on Friday, Nov 20.' },
  nights: { origin: 'From today\'s report.', doing: 'ask on the call', approveLabel: 'Approve' },
};

/** One task that is not in example.ts: it ties today's report to the Ask tomorrow queue. */
export const extraTasks: CareTask[] = [
  { id: 'nights', title: 'Find out what is waking her at night', detail: 'Sara added it to tomorrow\'s questions. Ion will ask on Wednesday\'s call and add her answer to the report.',
    icon: 'moon', from: 'Tue report', due: 'Wed Nov 25', status: 'in-progress', assignee: 'Ion', actions: [], ...{ origin: 'From today\'s report.', doing: 'ask on the call', approveLabel: 'Approve' } },
];

/** What Ion will say about each calendar item, keyed by calendar id. */
export const calendarMentions: Record<string, string> = {
  c3: 'Ion will remind her on Wednesday and Thursday morning calls.',
  c4: 'Ion will mention it on Friday morning\'s call.',
  c5: 'Ion will mention it on Friday morning\'s call.',
  c6: 'Ion will ask on Monday\'s call whether she has enough left.',
  c7: 'Ion will remind her on Thursday morning\'s call.',
  c8: 'Ion will mention it on Wednesday morning\'s call.',
};

export const extraCalendar: CalendarItem[] = [
  { id: 'c8', date: '2026-12-02', day: 'Wed Dec 2', time: '2:00 PM', title: 'Coffee with her friend June', kind: 'visit', note: 'June is driving' },
  { id: 'c9', date: '2026-12-05', day: 'Sat Dec 5', time: '12:30 PM', title: 'Lunch at Daniel\'s', kind: 'visit', note: 'Daniel collects her at noon' },
];

/** Refill dates the family has entered, keyed by medicine id. */
export const refillDates: Record<string, string> = { m1: 'Mon Nov 30' };

/** Questions already asked, newest first, with her answers. */
export const askedQuestions: AskedQuestion[] = [
  { id: 'h1', text: 'Ask how the new reading glasses are working.', by: 'Sara', date: 'Mon Nov 23',
    summary: 'She said they are much better and she is reading the paper again.', quote: 'I can read the small print without squinting now.' },
  { id: 'a3', text: 'Ask whether the new slippers fit.', by: 'Daniel', date: 'Sun Nov 22',
    summary: 'She said they fit well and she wears them all day.', quote: 'Snug as anything. I\'ve hardly taken them off.' },
  { id: 'h2', text: 'Ask if she would like Priya to visit on Saturday.', by: 'Priya', date: 'Sat Nov 21',
    summary: 'She said yes, and asked Priya to bring the photos from the summer.', quote: 'Oh yes. Tell her to bring the photos.' },
  { id: 'h3', text: 'Ask whether she would like a second rail by the back step.', by: 'Daniel', date: 'Fri Nov 20',
    summary: 'She said she would rather not talk about it today. Ion thanked her and moved on.', quote: 'Not today, love. Ask me another time.', declined: true },
];

/** The question Ion asked to start each story, keyed by story id. */
export const storyQuestions: Record<string, string> = {
  s1: 'What was your very first job?',
  s2: 'Tell me about a garden you loved.',
  s3: 'How did you meet Arthur?',
  s4: 'What do you remember about Sara\'s first day of school?',
};
export const nextStoryQuestion = 'What music did you love to dance to?';

export const hearing: Record<string, Hearing> = { sara: 'daily', daniel: 'changes', priya: 'daily' };
export const joined: Record<string, string> = { sara: 'Set up I-on in October', daniel: 'Joined in October', priya: 'Joined in November' };

export const plannedServices: PlannedService[] = [
  { id: 'rides', title: 'Rides', icon: 'car', plan: 'When she asks for a ride, I-on would book one for the time she needs, after you say yes.',
    today: 'I-on writes down where and when from her words. Someone in the family drives or books the ride.' },
  { id: 'groceries', title: 'Grocery delivery', icon: 'cart', plan: 'When she says she is low on something, I-on would put a delivery list together for you to check and approve.',
    today: 'I-on keeps the shopping list from the call. Someone in the family does the shop.' },
  { id: 'refills', title: 'Pharmacy refills', icon: 'pill', plan: 'When the supply on your list runs low, I-on would ask the pharmacy to get the refill ready. It would never choose or change a medicine.',
    today: 'I-on shows the days left and puts the refill date in the calendar. Someone in the family calls the pharmacy.' },
  { id: 'handyman', title: 'A handyman', icon: 'home', plan: 'For small jobs around the house, like a dripping tap or a stiff door, I-on would find a time that suits her.',
    today: 'I-on notes the job when she mentions it and makes a task. Someone in the family arranges the visit.' },
];

/** The ride request I-on wrote from today's call: what "I-on prepares the request" looks like now. */
export const preparedRequest = {
  title: 'Ride request, written from today\'s call',
  lines: [
    ['Who', 'Maggie Ellis'],
    ['When', 'Thursday, November 26. Pick up about 1:15 PM.'],
    ['From', 'Home'],
    ['To', 'The eye doctor, for 2:00 PM'],
    ['Back', 'About 4:00 PM'],
    ['Her words', '"Could someone take me to the eye doctor on Thursday?"'],
  ] as [string, string][],
};
