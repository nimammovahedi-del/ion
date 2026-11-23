// Pages described as data: one list drives the menus, the titles and (from r2) who may open each page.
export interface NavItem { id: string; label: string; href: string; icon: string; access: 'public' | 'family' | 'main-caregiver'; group?: 'main' | 'care' | 'setup'; soon?: boolean; }

export const appNav: NavItem[] = [
  { id: 'today', label: 'Today', href: '/app/', icon: 'today', access: 'family', group: 'main' },
  { id: 'trends', label: 'Trends', href: '/app/trends/', icon: 'trends', access: 'family', group: 'main' },
  { id: 'tasks', label: 'Tasks', href: '/app/tasks/', icon: 'tasks', access: 'family', group: 'main' },
  { id: 'calendar', label: 'Calendar', href: '/app/calendar/', icon: 'calendar', access: 'family', group: 'main' },
  { id: 'medicines', label: 'Medicines', href: '/app/medicines/', icon: 'pill', access: 'family', group: 'care' },
  { id: 'reminders', label: 'Reminders', href: '/app/reminders/', icon: 'bell', access: 'family', group: 'care' },
  { id: 'ask', label: 'Ask tomorrow', href: '/app/ask/', icon: 'chat', access: 'family', group: 'care' },
  { id: 'stories', label: 'Stories', href: '/app/stories/', icon: 'book', access: 'family', group: 'care' },
  { id: 'services', label: 'Services', href: '/app/services/', icon: 'car', access: 'family', group: 'care', soon: true },
  { id: 'family', label: 'Family circle', href: '/app/family/', icon: 'users', access: 'main-caregiver', group: 'setup' },
  { id: 'settings', label: 'Call settings', href: '/app/settings/', icon: 'settings', access: 'main-caregiver', group: 'setup' },
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
