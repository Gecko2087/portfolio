import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
for (const name of readdirSync(root).filter(name => name.endsWith('.html'))) {
  const html = readFileSync(path.join(root, name), 'utf8');
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]));
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    assert(!/^javascript:/i.test(ref), `Enlace inseguro en ${name}`);
    if (ref.startsWith('#')) assert(ids.has(ref.slice(1)), `Ancla ausente: ${name} ${ref}`);
    else if (!/^(https?:|mailto:|data:)/.test(ref)) assert(existsSync(path.join(root, ref.split(/[?#]/)[0])), `Recurso ausente: ${ref}`);
  }
}
for (const [name, lang] of [['index.html','es'],['en.html','en'],['cv.html','es'],['cv-en.html','en']]) {
  assert(readFileSync(name,'utf8').includes(`html lang="${lang}"`), `Idioma incorrecto: ${name}`);
}
console.log('Recursos, anclas e idiomas del portfolio comprobados.');
