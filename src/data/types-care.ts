// Extra shapes for the care screens (Tasks, Calendar, Medicines, Reminders, Ask tomorrow, Services, Family circle, Call settings).
import type { CalendarItem, Medicine, Person, Task } from './types';

/** A task with the words the Tasks page needs: where it came from in a sentence, and what "doing it" means. */
export interface CareTask extends Task {
  origin: string;        // "She asked on today's call."
  source?: string;       // short and quiet, shown on the card: "From today's call"
  doing: string;         // finishes "Daniel will ...": "drive her"
  approveLabel: string;  // the yes button
  ionAfter?: string;     // what Ion does once someone says yes
  doneNote?: string;     // shown when it is done
}

export interface AgendaDay {
  iso: string; label: string; short: string; weekday: string; dayNum: string;
  isToday: boolean; call: { time: string; note?: string };
  items: AgendaItem[];
}
/** `short` is the title for the two-week strip. `isTask` marks something that is really a task. `noteLink` is a note that leads to another page. */
export interface AgendaItem extends CalendarItem { mention?: string; sort: number; short: string; isTask?: boolean; noteLink?: { text: string; href: string; task?: string }; }

export type DoseAnswer = 'yes' | 'no' | 'two' | 'not-yet' | 'no-call';
export interface DoseDay { date: string; label: string; weekday: string; answer: DoseAnswer; }
export interface MedicineGroup {
  when: 'morning' | 'evening'; title: string; asked: string;
  items: (Medicine & { refillOn?: string })[];
  days: DoseDay[];   // oldest first, 14 days
  todayLine: string; // one plain sentence about today
}

export interface AskedQuestion { id: string; text: string; by: string; date: string; summary: string; quote?: string; declined?: boolean; note?: string; }   // note: a fact her words do not carry


/** A page that can show a copy of the same thing, and a small link from one copy to another. */
export type Place = 'tasks' | 'calendar' | 'reminders' | 'medicines' | 'ask' | 'services';
export interface AlsoLink { place: Place; label: string; href: string; }

export interface PlannedService { id: string; title: string; icon: string; plan: string; today: string; }
export interface PreparedRequest { title: string; quote: string; lines: [string, string, string][]; }   // each line: label, value, icon

export type Hearing = 'daily' | 'changes';
/** One thing a person in the circle may do, with a small icon. `allowed` is false for things only the main caregiver does. */
export interface Ability { id: string; icon: string; label: string; mainOnly: boolean; allowed: boolean; }
export interface CircleMember extends Person { hearing: Hearing; sees: string[]; does: string[]; joined: string; abilities: Ability[]; }
