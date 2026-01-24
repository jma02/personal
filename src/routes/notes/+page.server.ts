import { error } from '@sveltejs/kit';
import type { Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const load = async () => {
  try {
    const notesDir = path.resolve('notes');
    const entries = await readdir(notesDir, { withFileTypes: true });
    const files = entries
      .filter((entry: Dirent) => entry.isFile())
      .map((entry: Dirent) => entry.name)
      .filter((name: string) => {
        const lowerName = name.toLowerCase();
        return lowerName.endsWith('.txt') || lowerName.endsWith('.pdf');
      })
      .sort((a: string, b: string) => a.localeCompare(b));

    return { files };
  } catch (err) {
    throw error(500, 'Unable to load notes');
  }
};
