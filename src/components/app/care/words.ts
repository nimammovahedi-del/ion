// How Ion phrases things. Used at build time and in the browser, so the words match.

/** The lead-in Ion uses before a reminder someone in the family set. */
export function ionLead(setBy: string): string {
  if (setBy.startsWith('I-on')) return 'A little note from your calendar.';
  return `${setBy} asked me to pass this on.`;
}

/** Joins ["a", "b", "c"] as "a, b and c". */
export function listWords(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** What Ion asks about, in the words it uses on the call, by topic id. */
export const TOPIC_PHRASES: Record<string, string> = {
  sleep: 'how you slept',
  meals: 'what you have been eating and drinking',
  pain: 'any aches or pains',
  medicines: 'your pills',
  falls: 'whether you have had any falls',
  out: 'whether you have been out and about',
  food: 'whether you have enough food in the house',
  mood: 'how you are feeling in yourself',
};

export function openingTopics(ids: string[]): string {
  const phrases = ids.filter((id) => TOPIC_PHRASES[id]).map((id) => TOPIC_PHRASES[id]);
  return `I'd like to hear ${listWords(phrases)}.`;
}
