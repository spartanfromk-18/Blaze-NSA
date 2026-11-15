import { access, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, join, normalize } from 'node:path';

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const ignored = ['Docx/', 'test/', 'scripts/', 'submission/', 'docs/', 'TASKS-HARDEN.md', 'TASKS-VERCEL.md', 'PROGRESS.md', 'DECISIONS.md', '.github/', '*.log', '*.md', 'LICENSE'];
const isIgnored = file => ignored.some(pattern => pattern.endsWith('/') ? file.startsWith(pattern) : pattern.startsWith('*.') ? file.endsWith(pattern.slice(1)) : pattern.endsWith('*') ? file.startsWith(pattern.slice(0, -1)) : file === pattern);
const allowed = file => ['index.html', 'styles.css', '404.html', 'robots.txt', 'sitemap.xml', 'favicon.svg', 'favicon-32.png', 'og.png', 'vercel.json'].includes(file) || file.startsWith('src/') || file.startsWith('data/') || file.startsWith('.well-known/');
const configOnly = ['.gitignore', '.vercelignore'];
for (const file of tracked) if (!allowed(file) && !configOnly.includes(file) && !isIgnored(file)) throw new Error(`unaccounted publish file: ${file}`);

const files = ['index.html', '404.html', 'styles.css', ...tracked.filter(file => file.startsWith('src/'))];
for (const file of files) {
  const content = await readFile(file, 'utf8');
  const rootReferences = [...content.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)].map(match => [match[1], '.']);
  const importReferences = [...content.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map(match => [match[1], dirname(file)]);
  const styleReferences = [...content.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => [match[1], dirname(file)]);
  const references = [...rootReferences, ...importReferences, ...styleReferences].filter(([value]) => value.startsWith('.') && !value.startsWith('..'));
  for (const [reference, base] of references) {
    const resolved = normalize(join(base, reference));
    await access(resolved);
  }
}
console.log(`Vercel publish set: ${tracked.filter(file => allowed(file)).length} allow-listed tracked files; references resolve.`);
