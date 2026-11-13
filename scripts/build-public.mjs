import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Only publish the public site. Never copy the repository, Worker, or credentials.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(process.argv[2] || join(root, 'dist'));
if (output === root || root.startsWith(output + '/')) {
  throw new Error('Output must not be the repository or an ancestor directory.');
}
try {
  await access(output);
  throw new Error('Use a new output directory to avoid publishing stale files.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await mkdir(output, { recursive: true });
const pages = ['index', 'services', 'work', 'about', 'contact', 'privacy'];
for (const name of ['assets', 'partials', 'admin', 'robots.txt', 'sitemap.xml']) {
  await cp(join(root, name), join(output, name), { recursive: true });
}
for (const page of pages) {
  let html = await readFile(join(root, `${page}.html`), 'utf8');
  // Render navigation for crawlers and visitors without JavaScript. The existing
  // include loader still refreshes these partials and attaches menu behaviour.
  for (const part of ['header', 'footer']) {
    const source = `partials/${part}.html`;
    const content = await readFile(join(root, source), 'utf8');
    const marker = `<div data-include="${source}"></div>`;
    if (!html.includes(marker)) throw new Error(`Missing ${source} in ${page}`);
    html = html.replace(marker, `<div data-include="${source}">${content}</div>`);
  }
  await writeFile(join(output, `${page}.html`), html);
}
console.log(`Public site prepared at ${output}`);
