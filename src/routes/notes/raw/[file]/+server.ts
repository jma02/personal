import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const GET = async ({ params }: { params: { file: string } }) => {
  const fileName = path.basename(params.file);
  const lowerName = fileName.toLowerCase();

  if (fileName !== params.file || !lowerName.endsWith('.pdf')) {
    throw error(404, 'File not found');
  }

  try {
    const notesDir = path.resolve('notes');
    const filePath = path.join(notesDir, fileName);
    const content = await readFile(filePath);
    return new Response(content, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    });
  } catch (err) {
    throw error(404, 'File not found');
  }
};
