// utils/fuzzySearch.ts
import Fuse from 'fuse.js';

export function getFuzzyMatches<T>(
  query: string,
  items: T[],
  getValue: (item: T) => string
): T[] {
  if (!query.trim()) {
    return []; // Or return all items if that's your desired behavior
  }

  const options = {
    shouldSort: true,
    threshold: 0.6, // Adjust this value (0.0 for perfect match, 1.0 for any match)
    keys: [
      {
        name: 'name', // Assuming your restaurant objects have a 'name' property
        weight: 1,
      },
    ],
  };

  const fuse = new Fuse(items, options);
  const results = fuse.search(query);
  return results.map((result) => result.item);
}