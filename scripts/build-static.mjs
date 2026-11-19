import { copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const legacy = [
  'cv.html', 'cv-en.html', 'lab.html', 'lab-en.html', 'lab.css',
  'lab.js', 'lab-en.js', 'lab-core.js', 'lab-core-en.js', 'language.js',
  'app.js', 'app-en.js', 'contact-config.js', 'contact.js', 'polish.js',
  'system-scene.js', 'theme-init.js', 'favicon.svg',
];
const supportedImages = /^project-[a-z]+(?:-[a-z]+)?\.(?:jpg|png|webp)$/;
const images = (await readdir(root)).filter(name => supportedImages.test(name));
await Promise.all([...legacy, ...images].map(name => copyFile(new URL(name, root), new URL(name, output))));
console.log('Recursos públicos copiados en ' + fileURLToPath(output));
