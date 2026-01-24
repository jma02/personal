import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceNotesDir = path.resolve('notes');
const notesDir = path.resolve('static', 'notes');
const manifestPath = path.resolve('src', 'lib', 'notes', 'pdf-manifest.ts');

const main = async () => {
  await mkdir(notesDir, { recursive: true });

  let sourceFiles = [];
  try {
    sourceFiles = await readdir(sourceNotesDir);
  } catch (error) {
    sourceFiles = [];
  }

  await Promise.all(
    sourceFiles.map((file) =>
      copyFile(path.join(sourceNotesDir, file), path.join(notesDir, file))
    )
  );

  const pdfFiles = sourceFiles
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .sort((a, b) => a.localeCompare(b));

  const contents = `export const pdfNotes = ${JSON.stringify(pdfFiles, null, 2)};\n`;
  await writeFile(manifestPath, contents, 'utf-8');
};

main().catch((error) => {
  console.error('Failed to generate PDF manifest', error);
  process.exit(1);
});
