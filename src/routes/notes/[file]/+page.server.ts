import { error } from '@sveltejs/kit';

const textNotes = import.meta.glob('/notes/*.txt', { eager: true, as: 'raw' });

export const load = ({ params }: { params: { file: string } }) => {
  const fileName = params.file;
  const lowerName = fileName.toLowerCase();
  if (
    fileName.includes('/') ||
    fileName.includes('..') ||
    !lowerName.endsWith('.txt')
  ) {
    throw error(404, 'Note not found');
  }

  const fileKey = `/notes/${fileName}`;
  const content = textNotes[fileKey] as string | undefined;
  if (!content) {
    throw error(404, 'Note not found');
  }

  return { fileName, content };
};
