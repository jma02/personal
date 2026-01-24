import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const load = async ({ params }: { params: { file: string } }) => {
  const fileName = path.basename(params.file);
  const lowerName = fileName.toLowerCase();
  if (fileName !== params.file || !lowerName.endsWith('.txt')) {
    throw error(404, 'Note not found');
  }

  try {
    const notesDir = path.resolve('notes');
    const filePath = path.join(notesDir, fileName);
    const content = await readFile(filePath, 'utf-8');
    return { fileName, content };
  } catch (err) {
    throw error(404, 'Note not found');
  }
};
