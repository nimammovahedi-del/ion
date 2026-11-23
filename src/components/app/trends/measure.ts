// Turns a measure's numbers into plain words. Shared by Today (the week at a glance) and Trends.
// Nothing here diagnoses: it only compares her answers with her own usual.
import type { DayPoint, MetricId, MetricSeries } from '@/data/types';
import { average } from '@/lib/loaders';

export type DayState = 'usual' | 'changed' | 'none';

/** How far from her usual, in the worse direction, before a day counts as "changed". */
const TOLERANCE: Record<MetricId, number> = {
  sleep: 1.5, feeling: 2, pain: 1, meals: 1, fluids: 2, medicines: 1, falls: 1,
  out: Infinity, // a day at home is normal for her; going out is judged over the week, not the day
};

export function dayState(m: MetricSeries, value: number | null): DayState {
  if (value === null) return 'none';
  const worse = m.higherIsBetter ? m.usual - value : value - m.usual;
  return worse >= TOLERANCE[m.id] ? 'changed' : 'usual';
}

const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n: number) => NUM[n] ?? String(n);
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
    case 'medicines': return v >= 2 ? 'Both pill times' : v === 1 ? 'One of two' : 'Neither';
    case 'falls': return v === 0 ? 'No fall' : v === 1 ? '1 fall' : `${v} falls`;
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
      const both = vals.filter((v) => v >= 2).length;
      const missed = answered - both;
      return { ...base, value: `${both} of ${answered}`, unit: 'days with both', label: 'Days with both pill times', flag: missed >= 2,
        diff: missed === 0 ? 'She said she took both pill times on every day she answered.' : `On ${word(missed)} day${missed > 1 ? 's' : ''} she said she took only one, or was not sure.` };
    }
    case 'falls': {
      const falls = vals.reduce((a, b) => a + b, 0);
      const days = pts.filter((p) => (p.value ?? 0) > 0).map((p) => p.label);
      return { ...base, value: String(falls), unit: falls === 1 ? 'fall' : 'falls', label: falls === 1 ? 'Fall she told us about' : 'Falls she told us about', flag: falls > 0,
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
  if (m.id === 'medicines') return s.flag ? 'Some missed' : 'Steady';
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
  if (m.id === 'medicines') return `Both on ${s.value} days`;
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

export const STATUS_WORD = { changed: 'Changed', check: 'Check', usual: 'As usual' } as const;

/** Which picture suits a measure: a line, bars per day, or rows of marked days. */
export const CHART: Record<MetricId, 'line' | 'bars' | 'days'> = {
  sleep: 'line', feeling: 'line', pain: 'line', fluids: 'line', meals: 'bars', medicines: 'days', falls: 'days', out: 'days',
};

/** The most recent answer in a series, or null when there is none. */
export function latest(pts: DayPoint[]): DayPoint | null {
  for (let i = pts.length - 1; i >= 0; i--) if (pts[i].value !== null) return pts[i];
  return null;
}

/** A changed day's answer, short enough to sit inside a small pill. */
export function cellShort(id: MetricId, v: number): string {
  if (id === 'medicines') return `${v} of 2`;
  if (id === 'falls') return v === 1 ? 'Fall' : `${v} falls`;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/** "Sat, Sun and Mon" */
export const listWords = (xs: string[]) => (xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** A yes-or-no measure as rows of marked days, for DayStrip. Medicines get one row per pill time. */
export function dayRows(m: MetricSeries, pts: DayPoint[]): { rows: { label?: string; cells: ('yes' | 'no' | 'flag' | 'none')[]; words: string[] }[]; keys: { cell: 'yes' | 'no' | 'flag' | 'none'; label: string }[] } {
  const none = { cell: 'none' as const, label: 'No answer' };
  if (m.id === 'medicines') {
    // r1 rule, the same as getPillTimesTaken: a day with one of two pill times was the evening pills.
    const row = (label: string, need: number) => ({
      label,
      cells: pts.map((p) => (p.value === null ? 'none' as const : p.value >= need ? 'yes' as const : 'flag' as const)),
      words: pts.map((p) => (p.value === null ? 'no answer' : p.value >= need ? 'she said she took them' : 'not taken, or she was not sure')),
    });
    return { rows: [row('Morning', 1), row('Evening', 2)], keys: [{ cell: 'yes', label: 'She said she took them' }, { cell: 'flag', label: 'Not taken, or not sure' }, none] };
  }
  if (m.id === 'falls') {
    return {
      rows: [{ cells: pts.map((p) => (p.value === null ? 'none' : p.value > 0 ? 'flag' : 'no')), words: pts.map((p) => (p.value === null ? 'no answer' : p.value > 0 ? 'a fall' : 'no fall')) }],
      keys: [{ cell: 'no', label: 'No fall' }, { cell: 'flag', label: 'A fall she told Ion about' }, none],
    };
  }
  return {
    rows: [{ cells: pts.map((p) => (p.value === null ? 'none' : p.value > 0 ? 'yes' : 'no')), words: pts.map((p) => (p.value === null ? 'no answer' : p.value > 1 ? 'out twice' : p.value > 0 ? 'went out' : 'stayed in')) }],
    keys: [{ cell: 'yes', label: 'Went out' }, { cell: 'no', label: 'Stayed in' }, none],
  };
}
