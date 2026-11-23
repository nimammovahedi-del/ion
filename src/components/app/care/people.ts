// One colour per person, the same on every page, so a face is easy to find again.
// The order matches the little row of faces in the top bar (butter, sage, sky). Colour is only a help: the initials and names carry the meaning.
export type PersonTone = 'butter' | 'leaf' | 'sky' | 'acc' | 'paper';
const ORDER: PersonTone[] = ['butter', 'leaf', 'sky'];

export const toneAt = (index: number): PersonTone => ORDER[index % ORDER.length];

export interface Face { initials: string; tone: PersonTone }

/** Faces keyed by short name ("Sara"), for showing who has a task or who asked a question. */
export function facesOf(people: { short: string; initials: string }[]): Record<string, Face> {
  return Object.fromEntries(people.map((p, i) => [p.short, { initials: p.initials, tone: toneAt(i) }]));
}
