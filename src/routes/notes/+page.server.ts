type NoteEntry = {
  name: string;
  title: string;
  type: 'txt' | 'pdf';
  href: string;
};

import { pdfNotes, type PdfNote } from '../../lib/notes/pdf-manifest';

const textNotes = import.meta.glob('/notes/*.txt', { eager: true, as: 'raw' });

const toFileName = (filePath: string) => {
  const parts = filePath.split('/');
  return parts[parts.length - 1] ?? filePath;
};

const toTextNoteTitle = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, '')
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const load = () => {
  const entries: NoteEntry[] = [];

  Object.keys(textNotes).forEach((filePath) => {
    const name = toFileName(filePath);
    entries.push({
      name,
      title: toTextNoteTitle(name),
      type: 'txt',
      href: `/notes/${name}`,
    });
  });

  pdfNotes.forEach((note: PdfNote) => {
    entries.push({
      name: note.fileName,
      title: note.title,
      type: 'pdf',
      href: `/notes/${note.fileName}`,
    });
  });

  entries.sort((a, b) => a.title.localeCompare(b.title));

  return { files: entries };
};
