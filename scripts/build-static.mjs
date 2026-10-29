import { execFileSync } from 'node:child_process';
import { mkdir, copyFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = path.join(root, 'dist');
// Solo recursos públicos versionados en la raíz; nunca carpetas privadas o configuración.
const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0').filter(name => name && !name.includes('/') && /\.(html|css|js|svg|png|jpg|webp|ico)$/.test(name));
if (!files.includes('index.html')) throw new Error('No se encontró la portada versionada.');
await mkdir(dest, { recursive: true });
for (const item of await readdir(dest, { withFileTypes: true })) {
  if (!item.isFile()) throw new Error('La salida contiene una carpeta inesperada; revisar antes de publicar.');
  if (!files.includes(item.name)) await unlink(path.join(dest, item.name));
}
for (const file of files) await copyFile(path.join(root, file), path.join(dest, file));
console.log(`Preparados ${files.length} recursos públicos; sin secretos ni archivos de desarrollo.`);
