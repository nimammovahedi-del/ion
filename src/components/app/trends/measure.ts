// Turns a measure's numbers into plain words. Shared by Today (the week at a glance) and Trends.
// Nothing here diagnoses: it only compares her answers with her own usual.
import type { DayPoint, HerWords, MetricId, MetricSeries, PillAnswer, Status } from '@/data/types';
import { average, pillCounts, pillDays } from '@/lib/loaders';

export type DayState = 'usual' | 'little' | 'changed' | 'none';

/** How far from her usual, in the worse direction, before a day counts as "changed". */
const TOLERANCE: Record<MetricId, number> = {
  sleep: 1.5, feeling: 2, pain: 1, meals: 2, fluids: 2, medicines: 1, falls: 1,
  out: Infinity, // a day at home is normal for her; going out is judged over the week, not the day
};
/** How far before a day counts as "a little different". Only for measures where a small step means something. */
const LITTLE: Partial<Record<MetricId, number>> = { sleep: 1, feeling: 1 };

export function dayState(m: MetricSeries, value: number | null): DayState {
  if (value === null) return 'none';
  const worse = m.higherIsBetter ? m.usual - value : value - m.usual;
  if (worse >= TOLERANCE[m.id]) return 'changed';
  return worse >= (LITTLE[m.id] ?? Infinity) ? 'little' : 'usual';
}

const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n: number) => NUM[n] ?? String(n);
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const half = (v: number) => Math.round(v * 2) / 2;
const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** One day's answer in words, for tables and screen readers. */
export function valueWords(id: MetricId, v: number | null): string {
  if (v === null) return 'No answer';
  switch (id) {
    case 'sleep': return `${fmt(v)} hours`;
    case 'feeling': case 'pain': return `${fmt(v)} out of 10`;
    case 'meals': return v === 1 ? '1 meal' : `${v} meals`;
    case 'fluids': return v === 1 ? '1 cup' : `${v} cups`;
    case 'medicines': return v >= 2 ? 'She said yes to both pill times' : v === 1 ? 'Yes to one, the other in doubt' : 'She said no to both';
    case 'falls': return v === 0 ? 'No fall' : v === 1 ? 'A fall or stumble' : `${v} falls`;
    case 'out': return v === 0 ? 'Stayed in' : v === 1 ? 'Went out' : 'Out twice';
  }
}

/** Short value for a table cell. */
export const short = (v: number | null) => (v === null ? 'No answer' : fmt(v));

function hours(r: number) {
  if (r === 0.5) return 'half an hour';
  if (r === 1) return 'an hour';
  if (r === 1.5) return 'an hour and a half';
  return Number.isInteger(r) ? `${word(r)} hours` : `${word(Math.floor(r))} and a half hours`;
}
function points(r: number) {
  if (r === 0.5) return 'half a point';
  if (r === 1) return 'one point';
  return Number.isInteger(r) ? `${word(r)} points` : `${word(Math.floor(r))} and a half points`;
}

export interface RangeSummary {
  n: number; answered: number; noAnswer: number;
  avg: number | null;
  /** The big value for the tile, e.g. "7.0" or "12 of 14". */
  value: string; unit?: string; label: string;
  /** The difference from her usual in words. */
  diff: string;
  /** True when the range is meaningfully worse than her usual. */
  flag: boolean;
}

export function summarise(m: MetricSeries, pts: DayPoint[]): RangeSummary {
  const n = pts.length;
  const vals = pts.map((p) => p.value).filter((x): x is number => x !== null);
  const answered = vals.length;
  const noAnswer = n - answered;
  const avg = average(pts);
  const base = { n, answered, noAnswer, avg };
  if (avg === null) return { ...base, value: 'No answers', label: 'Average', diff: 'No answers in these days.', flag: false };
  const d = avg - m.usual;
  switch (m.id) {
    case 'sleep': {
      const r = half(Math.abs(d));
      return { ...base, value: avg.toFixed(1), unit: 'hours', label: 'Average a night', flag: d <= -1,
        diff: r === 0 ? 'About the same as her usual.' : `About ${hours(r)} ${d < 0 ? 'less' : 'more'} than her usual.` };
    }
    case 'feeling': case 'pain': {
      const r = half(Math.abs(d));
      const worse = m.higherIsBetter ? d < 0 : d > 0;
      return { ...base, value: avg.toFixed(1), unit: 'out of 10', label: 'Average', flag: worse && r >= 1,
        diff: r === 0 ? 'About the same as her usual.' : `About ${points(r)} ${d < 0 ? 'lower' : 'higher'} than her usual.` };
    }
    case 'meals': case 'fluids': {
      const unit = m.id === 'meals' ? 'meals a day' : 'cups a day';
      const thing = m.id === 'meals' ? 'meal' : 'cup';
      const r = half(Math.abs(d));
      return { ...base, value: avg.toFixed(1), unit, label: 'Average', flag: d <= -1,
        diff: r === 0 ? 'About the same as her usual.' : r === 0.5 ? `About half a ${thing} a day ${d < 0 ? 'less' : 'more'} than her usual.` : `About ${word(r)} ${thing}${r > 1 ? 's' : ''} a day ${d < 0 ? 'less' : 'more'} than her usual.` };
    }
    case 'medicines': {
      // Counted by pill time on its own date: the mornings and evenings she was asked about in these days.
      const c = pillCounts(pillDays(pts));
      const parts: string[] = [];
      if (c.two) parts.push(`${cap(word(c.two))} evening has two different answers.`);
      if (c.no) parts.push(`${cap(word(c.no))} time${c.no > 1 ? 's' : ''} she said no, or was not sure.`);
      return { ...base, value: `${c.timesYes} of ${c.times}`, unit: 'pill times', label: 'Pill times she said yes to', flag: c.two + c.no >= 2,
        diff: parts.length ? parts.join(' ') : 'She said yes every time Ion asked.' };
    }
    case 'falls': {
      const falls = vals.reduce((a, b) => a + b, 0);
      const days = pts.filter((p) => (p.value ?? 0) > 0).map((p) => p.label);
      return { ...base, value: String(falls), unit: falls === 1 ? 'fall or stumble' : 'falls', label: 'Falls she told Ion about', flag: falls > 0,
        diff: falls === 0 ? 'No falls in these days, the same as her usual.' : `On ${days.join(' and ')}. Her usual is none.` };
    }
    case 'out': {
      const out = vals.filter((v) => v > 0).length;
      const share = answered ? out / answered : 0;
      return { ...base, value: `${out} of ${answered}`, unit: 'days out', label: 'Days she went out', flag: share < 0.3,
        diff: share >= 0.6 ? 'Out on most days, as usual for her.' : share >= 0.3 ? 'Out a little less often than usual.' : 'Out on fewer days than usual.' };
    }
  }
}

/** A word for the direction of the last 7 days against her usual, for the doctor-visit table. */
export function direction(m: MetricSeries, pts: DayPoint[]): string {
  const s = summarise(m, pts);
  if (s.avg === null) return 'No answers';
  if (m.id === 'falls') return s.value === '0' ? 'None' : 'Had a fall';
  if (m.id === 'medicines') {
    const c = pillCounts(pillDays(pts));
    return c.two ? 'Two answers on one evening' : c.no ? 'Not every time' : 'Steady';
  }
  if (m.id === 'out') return s.flag ? 'Less often' : s.diff.includes('a little') ? 'A little less often' : 'Steady';
  const d = s.avg - m.usual;
  const tol = m.id === 'fluids' ? 1 : 0.5;
  if (Math.abs(d) < tol) return 'Steady';
  const little = Math.abs(d) < tol * 2 ? 'A little ' : '';
  return little ? `${little}${d < 0 ? 'lower' : 'higher'}` : d < 0 ? 'Lower' : 'Higher';
}

/** Average or count for the doctor-visit table cells. */
export function tableValue(m: MetricSeries, pts: DayPoint[]): string {
  const s = summarise(m, pts);
  if (s.avg === null) return 'No answers';
  if (m.id === 'medicines') return `Yes for ${s.value} pill times`;
  if (m.id === 'out') return `Out on ${s.value} days`;
  if (m.id === 'falls') return s.value === '0' ? 'None' : s.value === '1' ? '1 fall' : `${s.value} falls`;
  return `${s.value} ${s.unit ?? ''}`.trim();
}

/** Weekday and date from an ISO date, without depending on the machine's time zone. */
export function dayLabel(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short' }) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' });
}

/** Chart ticks per measure. */
export const TICKS: Record<MetricId, number[]> = {
  sleep: [3, 5, 7, 9], feeling: [0, 5, 10], pain: [0, 5, 10], meals: [0, 1, 2, 3, 4],
  fluids: [0, 3, 6, 9], medicines: [0, 1, 2], falls: [0, 1, 2], out: [0, 1, 2],
};

export const STEPPED: MetricId[] = ['meals', 'medicines'];

export const ABOUT: Record<MetricId, string> = {
  sleep: 'Hours she said she slept, when Ion asked about the night before.',
  feeling: 'The number she gave when Ion asked how she feels today, from 0 to 10.',
  pain: 'The number she gave for her pain, mostly her right knee, from 0 to 10.',
  meals: 'How many meals she said she had the day before.',
  fluids: 'About how many cups of tea, water or other drinks she said she had.',
  medicines: 'Whether she said she took her morning and evening pills. Two pill times a day.',
  falls: 'Ion asks on every call whether she has fallen since the last call.',
  out: 'Whether she said she left the house the day before, and how often.',
};

/** Her usual, short enough for a tile, with the rest as a caption. */
export function usualShort(m: MetricSeries): { value: string; caption?: string } {
  if (m.id === 'medicines') return { value: 'Both', caption: 'pill times, every day' };
  if (m.id === 'out') return { value: 'Most days', caption: 'out of the house' };
  const [main, ...rest] = m.usualLabel.split(', ');
  return { value: main.charAt(0).toUpperCase() + main.slice(1), caption: rest.length ? rest.join(', ') : undefined };
}

// ---- Added for the warm redesign: how each measure is drawn ----

/** The icon on each measure's tile. */
export const ICON: Record<MetricId, string> = {
  sleep: 'moon', feeling: 'heart', pain: 'spark', meals: 'bowl', fluids: 'cup', medicines: 'pill', falls: 'walk', out: 'door',
};

/** The tint of each measure's icon tile. Variety only: the tint never carries meaning. */
export const TONE: Record<MetricId, 'acc' | 'leaf' | 'butter' | 'sky'> = {
  sleep: 'sky', feeling: 'acc', pain: 'butter', meals: 'leaf', fluids: 'sky', medicines: 'leaf', falls: 'butter', out: 'leaf',
};

export const STATUS_WORD: Record<Status, string> = { changed: 'Changed', check: 'Check', little: 'A little different', usual: 'As usual' };
/** The status of a measure in words: its own label ("A little lower") when it has one. */
export const statusWord = (m: { status: Status; statusLabel?: string }) => m.statusLabel ?? STATUS_WORD[m.status];
/** Line and bar colour: sage for as usual, apricot for anything different from her usual. */
export const chartTone = (s: Status): 'leaf' | 'acc' => (s === 'usual' ? 'leaf' : 'acc');

/** Which picture suits a measure: a line, bars per day, or rows of marked days. */
export const CHART: Record<MetricId, 'line' | 'bars' | 'days' | 'calm'> = {
  sleep: 'line', feeling: 'line', pain: 'line', fluids: 'line', meals: 'bars', medicines: 'days', falls: 'calm', out: 'days',
};

/** The most recent answer in a series, or null when there is none. */
export function latest(pts: DayPoint[]): DayPoint | null {
  for (let i = pts.length - 1; i >= 0; i--) if (pts[i].value !== null) return pts[i];
  return null;
}

/** A changed day's answer, short enough to sit inside a small pill. */
export function cellShort(id: MetricId, v: number): string {
  if (id === 'medicines') return v >= 2 ? 'Yes' : 'In doubt';
  if (id === 'falls') return v === 1 ? 'Fall' : `${v} falls`;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/** "Sat, Sun and Mon" */
export const listWords = (xs: string[]) => (xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

export type StripCell = 'yes' | 'no' | 'flag' | 'two' | 'later' | 'none';
const PILL_CELL: Record<PillAnswer, StripCell> = { yes: 'yes', no: 'flag', two: 'two', 'no-call': 'none', later: 'later' };
export const PILL_WORDS: Record<PillAnswer, string> = { yes: 'She said yes', no: 'She said no, or was not sure', two: 'Two different answers', 'no-call': 'No answer', later: 'Later today' };

/** A yes-or-no measure as rows of marked days, for DayStrip. Medicines get one row per pill time, each on its own date. */
export function dayRows(m: MetricSeries, pts: DayPoint[]): { rows: { label?: string; cells: StripCell[]; words: string[] }[]; keys: { cell: StripCell; label: string }[] } {
  const none = { cell: 'none' as const, label: 'No answer' };
  if (m.id === 'medicines') {
    const days = pillDays(pts);
    const row = (label: string, when: 'morning' | 'evening') => ({ label, cells: days.map((d) => PILL_CELL[d[when]]), words: days.map((d) => PILL_WORDS[d[when]].toLowerCase()) });
    const rows = [row('Morning', 'morning'), row('Evening', 'evening')];
    const has = (c: StripCell) => rows.some((r) => r.cells.includes(c));
    const keys: { cell: StripCell; label: string }[] = [{ cell: 'yes', label: 'She said she took them' }];
    if (has('two')) keys.push({ cell: 'two', label: 'Two different answers' });
    if (has('flag')) keys.push({ cell: 'flag', label: 'She said no, or was not sure' });
    if (has('later')) keys.push({ cell: 'later', label: 'Later today: Ion asks tomorrow' });
    if (has('none')) keys.push(none);
    return { rows, keys };
  }
  if (m.id === 'falls') {
    return {
      rows: [{ cells: pts.map((p) => (p.value === null ? 'none' : p.value > 0 ? 'flag' : 'yes')), words: pts.map((p) => (p.value === null ? 'no answer' : p.value > 0 ? 'a fall or stumble' : 'no fall')) }],
      keys: [{ cell: 'yes', label: 'No fall' }, { cell: 'flag', label: 'A fall or stumble she told Ion about' }, none],
    };
  }
  const cells = pts.map((p): StripCell => (p.value === null ? 'none' : p.value > 0 ? 'yes' : 'no'));
  return {
    rows: [{ cells, words: pts.map((p) => (p.value === null ? 'no answer' : p.value > 1 ? 'out twice' : p.value > 0 ? 'went out' : 'stayed in')) }],
    keys: [{ cell: 'yes', label: 'Went out' }, { cell: 'no', label: 'Stayed in' }, ...(cells.includes('none') ? [none] : [])],
  };
}

/**
 * One sentence about what happened inside the days shown, so the words under a chart always fit its window.
 * Pain: the days it rose above her usual. Falls: how many, and when. Other measures add nothing.
 */
export function windowNote(m: MetricSeries, pts: DayPoint[]): string {
  const n = pts.length;
  if (m.id === 'falls') {
    const days = pts.filter((p) => (p.value ?? 0) > 0);
    if (!days.length) return `No falls in the last ${n} days.`;
    const when = listWords(days.map((p) => dayLabel(p.date, { weekday: 'long', month: 'short', day: 'numeric' })));
    return `${days.length === 1 ? 'One fall or stumble' : `${cap(word(days.length))} falls or stumbles`} in the last ${n} days, on ${when}. None since.`;
  }
  if (m.id === 'pain') {
    const up = pts.filter((p) => dayState(m, p.value) === 'changed');
    if (!up.length || up.length > 4) return '';
    const top = Math.max(...up.map((p) => p.value as number));
    return `It rose to ${top} on ${listWords(up.map((p) => p.label))}, then settled.`;
  }
  return '';
}

/** The sentence under a measure's chart for one window: how she is now, plus what the window itself shows. */
export function story(m: MetricSeries, pts: DayPoint[]): string {
  const w = windowNote(m, pts);
  if (m.id === 'falls') return w;
  return w ? `${m.note} ${w}` : m.note;
}

/** Her words that were said inside the days shown, newest first. */
export const wordsIn = (words: HerWords[], pts: DayPoint[]) => words.filter((w) => pts.length > 0 && w.date >= pts[0].date && w.date <= pts[pts.length - 1].date);
