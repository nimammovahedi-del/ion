// Small browser helpers for the care screens. Everything is kept in this browser only, under keys that start "ion-example-".
// Nothing here talks to a server. User-typed text is only ever set with textContent.

export const PREFIX = 'ion-example-';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* storage full or blocked: the change still shows on screen */ }
}

export function resetAll() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
  } catch { /* nothing to clear */ }
}

/** Say a change out loud to screen readers through the page's polite live region. */
export function announce(text: string) {
  const el = document.getElementById('care-live');
  if (!el) return;
  el.textContent = '';
  window.setTimeout(() => { el.textContent = text; }, 60);
}

/** Copy the first element of a <template> and fill each [data-slot] with plain text. */
export function fromTemplate<T extends HTMLElement = HTMLElement>(id: string, slots: Record<string, string> = {}): T {
  const tpl = document.getElementById(id) as HTMLTemplateElement | null;
  if (!tpl || !tpl.content.firstElementChild) throw new Error(`Missing template ${id}`);
  const node = tpl.content.firstElementChild.cloneNode(true) as T;
  fill(node, slots);
  return node;
}

export function fill(root: ParentNode, slots: Record<string, string>) {
  for (const [k, v] of Object.entries(slots)) root.querySelectorAll<HTMLElement>(`[data-slot="${k}"]`).forEach((el) => { el.textContent = v; });
}

export function uid() {
  return `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** "14:05" to "2:05 PM". */
export function clock(hhmm: string): string {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return hhmm;
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Keep the "Waiting for you" count in the top bar in step with the Tasks page. */
export function syncWaitingBadge(count?: number) {
  const n = count ?? load<number | null>('waiting', null);
  if (n === null) return;
  const b = document.querySelector('.approvals b');
  if (b) b.textContent = String(n);
  const m = document.querySelector<HTMLElement>('[data-waiting-count]');
  if (m) { m.textContent = String(n); if (m.parentElement) m.parentElement.hidden = n === 0; }
}
