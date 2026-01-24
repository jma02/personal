type NoteEntry = {
  name: string;
  type: 'txt' | 'pdf';
  href: string;
};

const textNotes = import.meta.glob('/notes/*.txt', { eager: true, as: 'raw' });
const pdfNotes = import.meta.glob('/notes/*.pdf', { eager: true, as: 'url' });

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

  Object.entries(pdfNotes).forEach(([filePath, url]) => {
    const name = toFileName(filePath);
    entries.push({ name, type: 'pdf', href: url as string });
  });

  entries.sort((a, b) => a.name.localeCompare(b.name));

  return { files: entries };
};
