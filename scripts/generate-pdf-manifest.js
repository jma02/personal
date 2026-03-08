import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceNotesDir = path.resolve('notes');
const notesDir = path.resolve('static', 'notes');
const manifestPath = path.resolve('src', 'lib', 'notes', 'pdf-manifest.ts');

const pdfTitles = {
  'algebra_i.pdf': 'Algebra I',
  'analysis_i.pdf': 'Analysis I',
  'finite_geometry.pdf': 'Finite Geometry',
  'finite-element-method.pdf': 'Finite Element Method',
  'functional_analysis.pdf': 'Functional Analysis',
  'linear_algebra.pdf': 'Linear Algebra',
  'measure-complex.pdf': 'Measure and Complex Analysis',
  'probability_i.pdf': 'Probability I',
  'stochastic-processes.pdf': 'Stochastic Processes',
};

const toDisplayTitle = (fileName) => {
  const explicitTitle = pdfTitles[fileName.toLowerCase()];
  if (explicitTitle) {
    return explicitTitle;
  }

  return fileName
    .replace(/\.pdf$/i, '')
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const toTypeScriptLiteral = (entries) => {
  const body = entries
    .map(
      (entry) =>
        `  { fileName: ${JSON.stringify(entry.fileName)}, title: ${JSON.stringify(entry.title)} },`
    )
    .join('\n');

  return `export type PdfNote = {\n  fileName: string;\n  title: string;\n};\n\nexport const pdfNotes: PdfNote[] = [\n${body}\n];\n`;
};

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

  const pdfEntries = pdfFiles.map((fileName) => ({
    fileName,
    title: toDisplayTitle(fileName),
  }));

  const contents = toTypeScriptLiteral(pdfEntries);
  await writeFile(manifestPath, contents, 'utf-8');
};

main().catch((error) => {
  console.error('Failed to generate PDF manifest', error);
  process.exit(1);
});
