// Copy for the marketing site, kept as data so the pages stay small.
// Figures about ageing and caregiving live here and nowhere else. Each one carries its source.
// Do not add a figure without opening the source, and without a year where the source gives one, and a link.

export interface SiteSource { name: string; title: string; year?: number; href: string }

const ACL: SiteSource = {
  name: 'Administration for Community Living',
  title: '2023 Profile of Older Americans',
  year: 2023,
  href: 'https://acl.gov/sites/default/files/Profile%20of%20OA/ACL_ProfileOlderAmericans2023_508.pdf',
};
const CDC: SiteSource = {
  name: 'CDC',
  title: 'Facts About Older Adult Falls',
  href: 'https://www.cdc.gov/falls/data-research/facts-stats/index.html',
};
const AARP: SiteSource = {
  name: 'AARP and the National Alliance for Caregiving',
  title: 'Caregiving in the US 2025',
  year: 2025,
  href: 'https://www.aarp.org/press/releases/2025-07-24-new-report-reveals-crisis-point-for-americas-63-million-family-caregivers.html',
};

export const sourceLine = (s: SiteSource) => `${s.name}, ${s.title}${s.year && !s.title.includes(String(s.year)) ? `, ${s.year}` : ''}`;

/**
 * The four pictures in "Why it matters". Every number below was read in its source on 2026-11-23.
 * The words each source uses are noted beside the number, so a later edit can be checked against them.
 */
export const WHY = {
  // ACL: "People 65+ represented 17.3% of the population in the year 2022. That percentage is expected to grow to 22% by 2040."
  // ACL: "from 43.1 million in 2012 to 57.8 million in 2022", "By 2040, about 78.3 million people will be 65 or older".
  // ACL: "The 85 and older population is projected to more than double from 6.5 million in 2022 to 13.7 million in 2040".
  older: {
    source: ACL,
    title: 'More of us are living longer',
    share: [
      { year: 2022, pct: 17.3, people: '57.8 million people' },
      { year: 2040, pct: 22, people: 'about 78.3 million', expected: true },
    ],
    oldest: [
      { year: 2022, millions: 6.5 },
      { year: 2040, millions: 13.7, expected: true },
    ],
    shareLine: 'of Americans are 65 or older',
    oldestTitle: 'Americans 85 or older',
    oldestLine: 'Expected to more than double.',
  },
  // ACL: "In 2023, about 28% (16.2 million) of all older adults living in the community lived alone", "Among women 75 and older, for example, 42% lived alone."
  alone: {
    source: ACL,
    pct: 28, of: 25, tinted: 7,   // 7 houses in 25 is 28%
    value: '28%',
    label: 'of older adults lived alone in 2023.',
    detail: 'About 16.2 million people living in the community. Among women 75 and older, 42%.',
  },
  // CDC: "more than one out of four older people falls each year, but less than half tell their doctor."
  falls: {
    source: CDC,
    of: 4, tinted: 1,
    value: '1 in 4',
    label: 'More than one in four older adults falls each year.',
    detail: 'Fewer than half tell their doctor.',
  },
  // AARP and NAC: "63 million Americans, nearly 1 in 4 adults", "an increase of 20 million from 2015 to 2025",
  // "Six in 10 family caregivers are employed on top of their family caregiving responsibilities".
  carers: {
    source: AARP,
    of: 10, tinted: 6,
    value: '63 million',
    label: 'Americans are family caregivers. That is nearly one adult in four.',
    detail: 'Six in ten also hold a job.',
  },
};

/** The gap, as a picture: the same two weeks with a call now and then, and with a call each morning. */
export const GAP = {
  title: 'The same two weeks, two ways',
  some: { label: 'A call when there is time', days: [2, 6, 12], said: 'I\'m fine.', note: 'Three calls. Three times, "I\'m fine."' },
  daily: { label: 'A short call every morning', note: 'Fourteen answers, side by side. Here, four shorter nights in a row.' },
  foot: 'Example data. A daily call is a record to look back on. It is not a promise to notice everything.',
};

/** The three things the family gets, shown as pictures in the hero panel. */
export const GETS = [
  { id: 'call', label: 'The call', text: 'A few easy minutes' },
  { id: 'report', label: 'The report', text: 'Plain words, beside her usual' },
  { id: 'steps', label: 'The next steps', text: 'Nothing happens until you say yes' },
];

/** What Ion asks about. Everyday topics, never a test. */
export const TOPICS = [
  { icon: 'moon', label: 'Sleep', text: 'How the night went', tone: 'sky' },
  { icon: 'bowl', label: 'Meals and drinks', text: 'Eating and drinking', tone: 'butter' },
  { icon: 'walk', label: 'Moving about', text: 'And any falls', tone: 'leaf' },
  { icon: 'pill', label: 'Medicines', text: 'Pills, by her own labels', tone: 'acc' },
  { icon: 'heart', label: 'Mood', text: 'In her own words', tone: 'acc' },
  { icon: 'spark', label: 'Pain', text: 'Anything aching', tone: 'butter' },
  { icon: 'home', label: 'Getting out', text: 'And who she saw', tone: 'leaf' },
  { icon: 'plus', label: 'Anything new', text: 'For the family to know', tone: 'sky' },
  { icon: 'book', label: 'One story', text: 'From her life, just for fun', tone: 'butter' },
] as const;

/** One day, morning to evening, as the site draws it. */
export const DAY = [
  { id: 'call', time: '9:00 AM', title: 'Ion calls', text: 'At the time you set. No answer? Ion tries again a little later.' },
  { id: 'talk', time: '9:01 AM', title: 'She answers in her own words', text: 'A few everyday questions, at an easy pace.' },
  { id: 'report', time: '9:08 AM', title: 'The report is written', text: 'Plain words, each answer beside her own usual.' },
  { id: 'yes', time: '9:08 AM', title: 'Next steps wait for your yes', text: 'Nothing is booked until someone in the family says yes.' },
  { id: 'evening', time: '6:00 PM', title: 'An evening reminder', text: 'Only if you set one. A short, kind call about her evening pills.' },
] as const;

/** For your parent: what her side of I-on is. */
export const PARENT_POINTS = [
  { icon: 'phone', title: 'Any ordinary phone', text: 'Landline or mobile.' },
  { icon: 'check', title: 'Nothing to set up', text: 'No app, no buttons, nothing to charge.' },
  { icon: 'clock', title: 'Same voice, same time', text: 'Calm, and at an easy pace.' },
  { icon: 'bell', title: 'Kind reminders', text: 'The family adds them. Ion says them on the call.' },
];

export const CARE_FIRST = {
  title: 'Not an emergency service.',
  text: 'I-on calls once a day. It does not watch, listen or send help between calls.',
  strong: 'In an emergency, call 911.',
};
export const CARE_POINTS = [
  { icon: 'chat', tone: 'leaf', title: 'She is asked each time', text: 'Each call starts by asking if she is happy to answer today. If she would rather not, that is fine, and the family is told.' },
  { icon: 'pill', tone: 'acc', title: 'No medical advice', text: 'Ion never names a medicine and never gives a diagnosis. At most, it suggests asking her doctor or pharmacist.' },
  { icon: 'users', tone: 'sky', title: 'You see what she said', text: 'Her own words, and where each answer came from. When two answers disagree, you see both.' },
  { icon: 'book', tone: 'butter', title: 'The family here is invented', text: 'Maggie, her children and every answer on these pages are example data.' },
  { icon: 'clock', tone: 'paper', title: 'Still in development', text: 'I-on is not calling anyone yet. People on the waitlist hear first.' },
] as const;

export const FAQS = [
  { q: 'What if she does not pick up?',
    a: ['Ion tries again a little later, at times you choose. If she still does not answer, the family is told, so someone can give her a ring.', 'A missed call is not an alarm. I-on cannot know why she did not answer.'] },
  { q: 'What if something sounds wrong on a call?',
    a: ['Answers that sound different from her usual are shown first in the report, in plain words, for the family to read.', 'I-on is not an emergency service. It does not send help and does not watch over her between calls. In an emergency, call 911.'] },
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
    a: ['Yes. The idea is one report for the whole family. You can invite brothers, sisters and grandchildren, and everyone sees the same report and the same next steps.'] },
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

/**
 * The sections of the home page, in page order. The header menu follows them as you scroll.
 * Labels come from siteNav in nav.ts where a section is listed there; `label` here is used for the rest.
 */
export const HOME_SECTIONS = [
  { id: 'why', label: 'Why it matters' },
  { id: 'how', label: 'How it works' },
  { id: 'see', label: 'What you see' },
  { id: 'parent', label: 'For your parent' },
  { id: 'care', label: 'Built with care' },
  { id: 'questions', label: 'Questions' },
];
