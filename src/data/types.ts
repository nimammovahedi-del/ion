// Shapes of everything the app shows. r1 fills them from example data; r2 will fill them from the database.

export type Status = 'changed' | 'check' | 'usual';
export type StepStatus = 'done' | 'working' | 'waiting' | 'needs-you';
export type MetricId = 'sleep' | 'feeling' | 'pain' | 'meals' | 'fluids' | 'medicines' | 'falls' | 'out';

export interface Person { id: string; name: string; short: string; initials: string; relation: string; role: 'parent' | 'main-caregiver' | 'family'; }

export interface Source { label: string; kind: 'call' | 'family-note' | 'earlier-calls'; }

export interface HealthCardData {
  id: MetricId | 'medicines';
  title: string;
  icon: string;
  value: string;
  unit?: string;
  caption: string;        // what the value is, and her usual
  status: Status;
  statusLabel: string;    // "Changed" | "Check" | "As usual"
  sources: Source[];
  evidence: string;       // one or two sentences, with her own words where we have them
  disagreement?: string;  // shown openly when two sources disagree
}

export interface TaskAction { label: string; kind: 'primary' | 'secondary'; }
export interface Task {
  id: string; title: string; detail: string; icon: string; from: string;   // where it came from
  due?: string; status: 'needs-you' | 'in-progress' | 'done'; actions: TaskAction[]; assignee?: string;
}

export interface AgentStep {
  n: number; title: string; result: string; time: string; status: StepStatus;
  substeps?: { label: string; done: boolean; code?: string }[]; progress?: number;
}

export interface CalendarItem { id: string; date: string; day: string; time?: string; title: string; kind: 'appointment' | 'visit' | 'refill' | 'call'; note?: string; }

export interface Medicine {
  id: string; label: string;        // family's own label, e.g. "Blood pressure pill". Never a drug name from I-on.
  when: 'morning' | 'evening'; count: number; takenToday: boolean | null; note?: string; refillDaysLeft?: number;
}

export interface Reminder { id: string; kind: 'medicine' | 'appointment' | 'other'; text: string; when: string; spokenBy: 'call' | 'evening-reminder'; setBy: string; active: boolean; }

export interface Story { id: string; date: string; title: string; text: string; quote?: string; }

export interface DayPoint { date: string; label: string; value: number | null; }
export interface MetricSeries {
  id: MetricId; title: string; unit: string; icon: string; usual: number; usualLabel: string;
  higherIsBetter: boolean; min: number; max: number; points: DayPoint[];   // oldest first, 90 days
  note: string;   // one plain sentence on the last two weeks
  status: Status;
}

export interface WeekNote { week: string; changed: string[]; steady: string[]; }

export interface AskTomorrow { id: string; text: string; by: string; status: 'queued' | 'asked'; answer?: string; }

export interface CallSettings { time: string; days: string[]; voice: string; topics: { id: string; label: string; on: boolean; fixed?: boolean }[]; retry: string; }
