type NoteEntry = {
  name: string;
  type: 'txt' | 'pdf';
  href: string;
};

import { pdfNotes } from '../../lib/notes/pdf-manifest';

const textNotes = import.meta.glob('/notes/*.txt', { eager: true, as: 'raw' });

const toFileName = (filePath: string) => {
  const parts = filePath.split('/');
  return parts[parts.length - 1] ?? filePath;
};

export const load = () => {
  const entries: NoteEntry[] = [];

  Object.keys(textNotes).forEach((filePath) => {
    const name = toFileName(filePath);
    entries.push({ name, type: 'txt', href: `/notes/${name}` });
  });

  pdfNotes.forEach((name: string) => {
    entries.push({ name, type: 'pdf', href: `/notes/${name}` });
  });

  entries.sort((a, b) => a.name.localeCompare(b.name));

  return { files: entries };
};
