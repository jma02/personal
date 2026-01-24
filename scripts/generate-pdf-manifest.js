import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const notesDir = path.resolve('static', 'notes');
const manifestPath = path.resolve('src', 'lib', 'notes', 'pdf-manifest.ts');

const main = async () => {
  let files = [];
  try {
    files = await readdir(notesDir);
  } catch (error) {
    files = [];
  }

  const pdfFiles = files
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .sort((a, b) => a.localeCompare(b));

  const contents = `export const pdfNotes = ${JSON.stringify(pdfFiles, null, 2)};\n`;
  await writeFile(manifestPath, contents, 'utf-8');
};

main().catch((error) => {
  console.error('Failed to generate PDF manifest', error);
  process.exit(1);
});
