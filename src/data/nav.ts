// Pages described as data: one list drives the menus, the titles and (from r2) who may open each page.
export interface NavItem {
  id: string; label: string; href: string; icon: string; access: 'public' | 'family' | 'main-caregiver';
  group?: 'her' | 'do' | 'care' | 'setup'; soon?: boolean;
  hint?: string;                                     // one short line on what the page is for; shown in menus and on shortcut tiles
  tone?: 'acc' | 'leaf' | 'butter' | 'sky';   // tint of the page's icon tile
}

/** Menu groups, in order. The labels answer "what am I here to do?". */
export const appGroups = [
  { id: 'her', label: 'How she is' },
  { id: 'do', label: 'Things to do' },
  { id: 'care', label: 'Her care' },
  { id: 'setup', label: 'Set up' },
] as const;

export const appNav: NavItem[] = [
  { id: 'today', label: 'Today', href: '/app/', icon: 'today', access: 'family', group: 'her', tone: 'acc', hint: 'This morning\'s call and what needs you' },
  { id: 'trends', label: 'Trends', href: '/app/trends/', icon: 'trends', access: 'family', group: 'her', tone: 'acc', hint: 'Sleep, meals, mood and more over time' },
  { id: 'tasks', label: 'Tasks', href: '/app/tasks/', icon: 'tasks', access: 'family', group: 'do', tone: 'butter', hint: 'What she asked for, and who is on it' },
  { id: 'calendar', label: 'Calendar', href: '/app/calendar/', icon: 'calendar', access: 'family', group: 'do', tone: 'butter', hint: 'Appointments, visits and refills' },
  { id: 'reminders', label: 'Reminders', href: '/app/reminders/', icon: 'bell', access: 'family', group: 'do', tone: 'butter', hint: 'Things Ion says to her on a call' },
  { id: 'medicines', label: 'Medicines', href: '/app/medicines/', icon: 'pill', access: 'family', group: 'care', tone: 'leaf', hint: 'Her pills, by your family\'s own names' },
  { id: 'ask', label: 'Ask tomorrow', href: '/app/ask/', icon: 'chat', access: 'family', group: 'care', tone: 'leaf', hint: 'Add a question of your own to the next call' },
  { id: 'services', label: 'Services', href: '/app/services/', icon: 'car', access: 'family', group: 'care', tone: 'leaf', soon: true, hint: 'Rides, groceries and refills' },
  { id: 'family', label: 'Family circle', href: '/app/family/', icon: 'users', access: 'main-caregiver', group: 'setup', tone: 'sky', hint: 'Who sees the report and who can change things' },
  { id: 'settings', label: 'Call settings', href: '/app/settings/', icon: 'settings', access: 'main-caregiver', group: 'setup', tone: 'sky', hint: 'When Ion calls and what it asks about' },
];

export const siteNav: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: 'home', access: 'public' },
  { id: 'why', label: 'Why it matters', href: '/#why', icon: 'heart', access: 'public' },
  { id: 'how', label: 'How it works', href: '/#how', icon: 'phone', access: 'public' },
  { id: 'see', label: 'What you see', href: '/#see', icon: 'trends', access: 'public' },
  { id: 'care', label: 'Built with care', href: '/#care', icon: 'shield', access: 'public' },
  { id: 'questions', label: 'Questions', href: '/#questions', icon: 'question', access: 'public' },
];

export const STANDING_LINE = 'I-on is a daily check-in. It is not an emergency service and does not monitor between calls.';
