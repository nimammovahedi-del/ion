// Copy for the marketing site, kept as data so the pages stay small.
// Figures about ageing and caregiving live here and nowhere else. Each one carries its source.
// Do not add a figure without a source, a year where the source gives one, and a link.
import type { AgentStep } from './types';

export interface SiteSource { name: string; title: string; year?: number; href: string }
export interface Figure { id: string; value: string; label: string; detail?: string; source: SiteSource }

const ACL: SiteSource = {
  name: 'Administration for Community Living',
  title: '2023 Profile of Older Americans',
  year: 2023,
  href: 'https://acl.gov/sites/default/files/Profile%20of%20OA/ACL_ProfileOlderAmericans2023_508.pdf',
};
const CDC: SiteSource = {
  name: 'CDC',
  title: 'Older Adult Falls Data',
  href: 'https://www.cdc.gov/falls/data-research/facts-stats/index.html',
};
const AARP: SiteSource = {
  name: 'AARP and the National Alliance for Caregiving',
  title: 'Caregiving in the US 2025',
  year: 2025,
  href: 'https://www.aarp.org/press/releases/2025-07-24-new-report-reveals-crisis-point-for-americas-63-million-family-caregivers.html',
};

export const FIGURES: Figure[] = [
  { id: 'older', value: '57.8M', label: 'Americans were 65 or older in 2022.', detail: 'That is 17.3% of the population, expected to reach 22% by 2040.', source: ACL },
  { id: 'alone', value: '28%', label: 'of older adults living in the community lived alone in 2023.', detail: 'That is about 16.2 million people. Among women 75 and older it was 42%.', source: ACL },
  { id: 'falls', value: '1 in 4', label: 'More than one in four older adults falls each year.', source: CDC },
  { id: 'carers', value: '63M', label: 'Americans are family caregivers.', detail: 'Nearly one adult in four, about 20 million more than in 2015.', source: AARP },
];

export const sourceLine = (s: SiteSource) => `${s.name}, ${s.title}${s.year && !s.title.includes(String(s.year)) ? `, ${s.year}` : ''}`;

export const WHY_TEXT = [
  'More people are growing old in their own homes, and more of them live alone. Their children often live hours away, with jobs and families of their own, and call when they can.',
  'Small changes are easy to miss from a distance: a few short nights, a skipped meal, a knee that hurts a little more. On a weekly call, "I\'m fine" is the usual answer.',
];

export const COMPARE = {
  without: {
    label: 'Without a daily check-in',
    title: 'You tend to hear about it later, often all at once.',
    points: [
      'A call when there is time, and a short "I\'m fine"',
      'No record of last week to set today beside',
      'Each brother and sister hearing a different story',
    ],
  },
  with: {
    label: 'With I-on',
    title: 'Small changes are noticed over days, while they are still small.',
    points: [
      'The same few questions each morning, in a kind voice',
      'You hear it in her own words, set beside her usual',
      'One clear next step, and one report the whole family shares',
    ],
  },
};

/** The three things the family gets, shown in the hero panel. */
export const GETS = [
  { n: 1, label: 'The call', text: 'A few easy minutes, at the same time each day.' },
  { n: 2, label: 'The report', text: 'Plain words, set beside her own usual.' },
  { n: 3, label: 'The next steps', text: 'A ride, groceries, a refill. You approve.' },
];

/** What Ion asks about. Everyday topics, never a test. */
export const TOPICS = [
  { icon: 'moon', label: 'Sleep', text: 'How the night went' },
  { icon: 'bowl', label: 'Meals and drinks', text: 'What she ate, and enough to drink' },
  { icon: 'walk', label: 'Moving about', text: 'Getting around, and any falls' },
  { icon: 'pill', label: 'Medicines', text: 'Whether the pills were taken, by her own labels' },
  { icon: 'heart', label: 'Mood', text: 'How she is feeling, in her words' },
  { icon: 'spark', label: 'Pain', text: 'Anything aching, and how much' },
  { icon: 'home', label: 'Getting out', text: 'Out of the house, and who she saw' },
  { icon: 'plus', label: 'Anything new', text: 'Something she wants the family to know' },
  { icon: 'book', label: 'One story', text: 'A question about her life, just for fun' },
];

/** The day, as the site tells it. Same shape as the app's steps so StepRow can draw it. */
export const DAY_STEPS: AgentStep[] = [
  { n: 1, title: 'Ion calls', result: 'At the time and on the days you set. If she does not pick up, Ion tries again a little later.', time: '9:00 AM', status: 'done' },
  { n: 2, title: 'She answers in her own words', result: 'A few everyday questions at an easy pace. She can skip any of them.', time: '9:01 AM', status: 'done' },
  { n: 3, title: 'The report is written', result: 'In plain words, with each answer compared with her own usual.', time: '9:08 AM', status: 'done' },
  { n: 4, title: 'Next steps wait for you', result: 'Nothing is booked until someone in the family says yes.', time: '9:08 AM', status: 'needs-you', progress: 66,
    substeps: [
      { label: 'She asked for a ride to the eye doctor', done: true },
      { label: 'Thursday 2:00 PM added to the family calendar', done: true },
      { label: 'Waiting for someone to approve the ride or say they will drive', done: false },
    ] },
  { n: 5, title: 'Evening reminder', result: 'Only if you set one. A short, kind call about her evening pills.', time: '6:00 PM', status: 'waiting' },
];

export const CARE_POINTS = [
  { icon: 'shield', title: 'Not an emergency service', text: 'I-on calls once a day. It does not watch, listen or send help between calls. In an emergency, call 911.' },
  { icon: 'chat', title: 'She is asked each time', text: 'Every call starts by asking if she is happy to answer today. If she would rather not, that is fine, and the family is told.' },
  { icon: 'pill', title: 'No medical advice', text: 'Ion never names a medicine and never gives a diagnosis. When something is worth a question, it suggests asking her doctor or pharmacist.' },
  { icon: 'users', title: 'You see what she said', text: 'Reports keep her own words and show where each answer came from. When two answers disagree, you see both.' },
  { icon: 'book', title: 'The family here is invented', text: 'Maggie, her children and every answer on these pages are example data. No real person is shown.' },
  { icon: 'clock', title: 'Still in development', text: 'I-on is being built and is not calling anyone yet. People on the waitlist hear first when that changes.' },
];

export const FAQS = [
  { q: 'What if she does not pick up?',
    a: ['Ion tries again a little later, at times you choose. If she still does not answer, the family is told, so someone can give her a ring.', 'A missed call is not an alarm. I-on cannot know why she did not answer.'] },
  { q: 'What if something sounds wrong on a call?',
    a: ['Anything that sounds different from her usual goes at the top of the report, in plain words, for the family to read.', 'I-on is not an emergency service. It does not send help and does not watch over her between calls. In an emergency, call 911.'] },
  { q: 'Does she need a smartphone or an app?',
    a: ['No. Ion calls an ordinary phone, landline or mobile. There is nothing for her to install, charge or learn. The app is for the family.'] },
  { q: 'Who is the capybara?',
    a: ['That is Ion, the character behind the voice. Capybaras are known for being calm and getting along with everyone, which felt right for a morning call.', 'Ion is not a person and does not pretend to be one.'] },
  { q: 'Can I choose what Ion asks about?',
    a: ['Partly. Sleep, meals, pain, medicines and falls are always on the list. You can turn the other topics on or off, and add a question of your own for tomorrow\'s call.'] },
  { q: 'What does it cost?',
    a: ['The price is not set yet. I-on will be a monthly subscription for the whole family. People on the waitlist will hear the price first, before anyone is asked to pay.'] },
  { q: 'When can we start?',
    a: ['I-on is still in development and we are not promising a date. Join the waitlist and we will write once, when it is ready for families.'] },
  { q: 'What happens to what she says?',
    a: ['Today, nothing, because no calls are being made yet. This site collects only the email address you give on the waitlist, and your answer about who you are looking out for if you choose to give one.', 'The example pages hold invented data. How real call information will be kept and protected will be published before any family starts.'] },
  { q: 'Can my brother or sister see it too?',
    a: ['Yes. The idea is one report for the whole family. You can invite brothers, sisters and grandchildren, and everyone sees the same report and the same next steps. In the example, Maggie\'s son and granddaughter share it with her daughter.'] },
];

export const CARING_FOR = [
  { value: 'parent', label: 'My mom or dad' },
  { value: 'partner', label: 'My partner' },
  { value: 'other-family', label: 'Another family member' },
  { value: 'myself', label: 'Myself' },
  { value: 'professional', label: 'People I care for at work' },
];

export const WAITLIST_MESSAGES: Record<string, string> = {
  ok: 'Thank you. You are on the list. We will write once, when I-on is ready for families.',
  'invalid-email': 'That email address does not look quite right. Please check it and try again.',
  'bad-request': 'Something got lost on the way and your address was not saved. Please try again.',
  server: 'Something went wrong on our side and your address was not saved. Please try again in a few minutes.',
  error: 'Something went wrong and your address was not saved. Please try again in a few minutes.',
};

/** Sections the bottom dock follows, in page order. */
export const DOCK_SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'why', label: 'Why it matters' },
  { id: 'how', label: 'How it works' },
  { id: 'see', label: 'What you see' },
  { id: 'parent', label: 'For your parent' },
  { id: 'care', label: 'Built with care' },
  { id: 'questions', label: 'Questions' },
];
