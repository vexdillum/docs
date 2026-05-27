import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeFrontendReference} from './frontend-reference.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsSiteRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(docsSiteRoot, '..');
const frontendRoot = path.join(workspaceRoot, 'lost-last-frontend');
const backendRoot = path.join(workspaceRoot, 'lost-last');
const contentRoot = path.join(docsSiteRoot, 'content');
const docsOut = path.join(docsSiteRoot, 'generated-docs');
const staticGeneratedOut = path.join(docsSiteRoot, 'static', 'generated');
const backendModulePath = 'gitlab.informatics.ru/2025-2026/ydex/s102d/lost-last';

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyTree(from, to) {
  if (!(await exists(from))) {
    return false;
  }

  await fs.mkdir(path.dirname(to), {recursive: true});
  await fs.cp(from, to, {recursive: true});
  return true;
}

function rewriteBackendDocLinks(raw) {
  return raw
    .replace(/\]\(\.\.\/CONTRIBUTING\.md\)/g, '](/contribution/)')
    .replace(/\]\(\.\.\/README\.md\)/g, '](/guide/backend)')
    .replace(/\[swagger\.html\]\(swagger\.html\)/g, '<a href="/docs/generated/swagger/" target="_blank">swagger.html</a>')
    .replace(/\[openapi\.json\]\(openapi\.json\)/g, '<a href="/docs/generated/swagger/openapi.json" target="_blank">openapi.json</a>')
    .replace(/\]\(backend\.md\)/g, '](overview.md)')
    .replace(/\]\(architecture\.md\)/g, '](/architecture/backend)')
    .replace(/\[compose\.yaml\]\(\.\.\/compose\.yaml\)/g, '`compose.yaml`')
    .replace(/\[\.env\.example\]\(\.\.\/\.env\.example\)/g, '`.env.example`')
    .replace(/\[\.gitlab-ci\.yml\]\(\.\.\/\.gitlab-ci\.yml\)/g, '`.gitlab-ci.yml`')
    .replace(/\[\.golangci\.yml\]\(\.\.\/\.golangci\.yml\)/g, '`.golangci.yml`')
    .replace(/\[patterns\.txt\]\(\.\.\/patterns\.txt\)/g, '`patterns.txt`');
}

async function copyBackendMarkdownDocs() {
  const sourceDir = path.join(backendRoot, 'docs');
  const targetDir = path.join(docsOut, 'backend');
  const entries = await fs.readdir(sourceDir, {withFileTypes: true});
  await fs.mkdir(targetDir, {recursive: true});

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }

    const source = path.join(sourceDir, entry.name);
    const raw = await fs.readFile(source, 'utf8');

    if (entry.name === 'architecture.md') {
      await fs.mkdir(path.join(docsOut, 'architecture'), {recursive: true});
      await fs.writeFile(
        path.join(docsOut, 'architecture', 'backend.md'),
        rewriteBackendDocLinks(raw).replace(/^title:\s*.+$/m, 'title: Архитектура backend')
      );
      continue;
    }

    const targetName = entry.name === 'backend.md' ? 'overview.md' : entry.name;
    const target = path.join(targetDir, targetName);
    await fs.writeFile(target, rewriteBackendDocLinks(raw));
  }
}

function escapeTableCell(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function escapeMarkdown(value) {
  return String(value || '').replace(/\r?\n/g, ' ').trim();
}

function exported(name) {
  return /^[A-Z]/.test(name);
}

function normalizeDoc(lines) {
  return lines
    .map((line) => line.replace(/^\s*\/\/\s?/, '').replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ');
}

function countBraces(line) {
  const withoutStrings = line
    .replace(/`[^`]*`/g, '')
    .replace(/"([^"\\]|\\.)*"/g, '')
    .replace(/\/\/.*$/, '');
  return (withoutStrings.match(/\{/g) || []).length - (withoutStrings.match(/\}/g) || []).length;
}

async function collectGoPackages(root) {
  const skipDirs = new Set(['.git', '.cache', 'bin', 'coverage', 'docs', 'kctf', 'vendor']);
  const packages = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, {withFileTypes: true});
    const goFiles = entries
      .filter((entry) => entry.isFile())
      .filter((entry) => entry.name.endsWith('.go'))
      .filter((entry) => !entry.name.endsWith('_test.go'))
      .filter((entry) => !entry.name.endsWith('.pb.go'))
      .filter((entry) => !entry.name.endsWith('_gen.go'))
      .filter((entry) => entry.name !== 'router_gen.go')
      .map((entry) => path.join(dir, entry.name));

    if (goFiles.length > 0 && !dir.includes(`${path.sep}biz${path.sep}model${path.sep}`)) {
      const pkg = await parseGoPackage(root, dir, goFiles);
      if (pkg) {
        packages.push(pkg);
      }
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || skipDirs.has(entry.name)) {
        continue;
      }
      await walk(path.join(dir, entry.name));
    }
  }

  await walk(root);
  return packages.sort((a, b) => a.importPath.localeCompare(b.importPath));
}

async function parseGoPackage(root, dir, files) {
  const parsedFiles = [];

  for (const file of files) {
    const parsed = await parseGoFile(root, file);
    if (parsed) {
      parsedFiles.push(parsed);
    }
  }

  if (parsedFiles.length === 0) {
    return null;
  }

  const relativeDir = path.relative(root, dir);
  const importPath = relativeDir === ''
    ? backendModulePath
    : `${backendModulePath}/${relativeDir.split(path.sep).join('/')}`;
  const declarations = parsedFiles
    .flatMap((file) => file.declarations)
    .sort((a, b) => `${a.kind}:${a.name}`.localeCompare(`${b.kind}:${b.name}`));

  return {
    importPath,
    packageName: parsedFiles[0].packageName,
    relativeDir: relativeDir || '.',
    doc: parsedFiles.find((file) => file.packageDoc)?.packageDoc || '',
    declarations
  };
}

async function parseGoFile(root, file) {
  const raw = await fs.readFile(file, 'utf8');
  if (/^\/\/ Code generated\b/m.test(raw.slice(0, 500))) {
    return null;
  }

  const packageMatch = raw.match(/(?:^|\n)package\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
  if (!packageMatch) {
    return null;
  }

  return {
    file: path.relative(root, file),
    packageName: packageMatch[1],
    packageDoc: extractPackageDoc(raw, packageMatch.index ?? 0, packageMatch[1]),
    declarations: extractDeclarations(raw, path.relative(root, file))
  };
}

function extractPackageDoc(raw, packageIndex) {
  const beforePackage = raw.slice(0, packageIndex);
  const blockMatch = beforePackage.match(/\/\*\*?([\s\S]*?)\*\/\s*$/);
  if (blockMatch) {
    return blockMatch[1]
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean)
      .join(' ');
  }

  const lines = beforePackage.split(/\r?\n/).reverse();
  const commentLines = [];
  for (const line of lines) {
    const match = line.match(/^\s*\/\/\s?(.*)$/);
    if (!match) {
      if (line.trim() === '') {
        continue;
      }
      break;
    }
    commentLines.unshift(match[1]);
  }

  return normalizeDoc(commentLines);
}

function extractDeclarations(raw, file) {
  const lines = raw.split(/\r?\n/);
  const declarations = [];
  let depth = 0;
  let pendingDoc = [];
  let inBlockDoc = false;
  let blockDoc = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (depth === 0 && inBlockDoc) {
      blockDoc.push(line);
      if (trimmed.includes('*/')) {
        pendingDoc = blockDoc;
        blockDoc = [];
        inBlockDoc = false;
      }
      continue;
    }

    if (depth === 0 && trimmed.startsWith('/*')) {
      inBlockDoc = true;
      blockDoc = [line];
      if (trimmed.includes('*/')) {
        pendingDoc = blockDoc;
        blockDoc = [];
        inBlockDoc = false;
      }
      continue;
    }

    if (depth === 0 && trimmed.startsWith('//')) {
      pendingDoc.push(line);
      continue;
    }

    if (depth === 0 && trimmed === '') {
      pendingDoc = [];
      continue;
    }

    if (depth === 0) {
      const doc = normalizeDoc(pendingDoc);
      const blockKind = trimmed.match(/^(const|var)\s*\($/);
      if (blockKind) {
        const block = readDeclarationBlock(lines, i + 1, blockKind[1], file);
        declarations.push(...block.declarations);
        i = block.endIndex;
        pendingDoc = [];
        continue;
      }

      const declaration = parseDeclarationLine(trimmed, doc, file);
      if (declaration) {
        declarations.push(declaration);
        pendingDoc = [];
      } else if (!trimmed.startsWith('package ') && !trimmed.startsWith('import ')) {
        pendingDoc = [];
      }
    }

    depth = Math.max(0, depth + countBraces(line));
  }

  return declarations;
}

function readDeclarationBlock(lines, startIndex, kind, file) {
  const declarations = [];
  let pendingDoc = [];

  for (let i = startIndex; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed === ')') {
      return {declarations, endIndex: i};
    }
    if (trimmed === '') {
      pendingDoc = [];
      continue;
    }
    if (trimmed.startsWith('//')) {
      pendingDoc.push(lines[i]);
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\b/);
    if (match && exported(match[1])) {
      declarations.push({
        kind,
        name: match[1],
        signature: `${kind} ${match[1]}`,
        doc: normalizeDoc(pendingDoc),
        file
      });
    }
    pendingDoc = [];
  }

  return {declarations, endIndex: lines.length - 1};
}

function parseDeclarationLine(line, doc, file) {
  const typeMatch = line.match(/^type\s+([A-Za-z_][A-Za-z0-9_]*)\b(.*)$/);
  if (typeMatch && exported(typeMatch[1])) {
    return {
      kind: 'type',
      name: typeMatch[1],
      signature: `type ${typeMatch[1]}${typeMatch[2] || ''}`,
      doc,
      file
    };
  }

  const methodMatch = line.match(/^func\s*\(([^)]*)\)\s*([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)$/);
  if (methodMatch && exported(methodMatch[2])) {
    const receiver = methodMatch[1].trim().split(/\s+/).pop()?.replace(/^\*/, '') || '';
    return {
      kind: 'method',
      name: `${receiver}.${methodMatch[2]}`,
      signature: line.replace(/\s*\{?\s*$/, ''),
      doc,
      file
    };
  }

  const funcMatch = line.match(/^func\s+([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)$/);
  if (funcMatch && exported(funcMatch[1])) {
    return {
      kind: 'function',
      name: funcMatch[1],
      signature: line.replace(/\s*\{?\s*$/, ''),
      doc,
      file
    };
  }

  const valueMatch = line.match(/^(const|var)\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
  if (valueMatch && exported(valueMatch[2])) {
    return {
      kind: valueMatch[1],
      name: valueMatch[2],
      signature: `${valueMatch[1]} ${valueMatch[2]}`,
      doc,
      file
    };
  }

  return null;
}

function renderDeclarationGroup(title, declarations) {
  if (declarations.length === 0) {
    return '';
  }

  let body = `\n### ${title}\n\n| Имя | Сигнатура | Описание | Файл |\n| --- | --- | --- | --- |\n`;
  for (const declaration of declarations) {
    body += `| \`${escapeTableCell(declaration.name)}\` | \`${escapeTableCell(declaration.signature)}\` | ${escapeTableCell(declaration.doc) || '-'} | \`${escapeTableCell(declaration.file)}\` |\n`;
  }
  return body;
}

async function writeBackendReference() {
  const target = path.join(docsOut, 'backend', 'reference.md');
  await fs.mkdir(path.dirname(target), {recursive: true});
  const packages = await collectGoPackages(backendRoot);

  let body = `---\ntitle: Backend автодокументация\n---\n\n# Backend автодокументация\n\n`;
  body += 'Этот раздел генерируется напрямую из `.go` файлов backend-проекта и не использует `go list`, `go doc` или установленный Go toolchain.\n\n';
  body += `Найдено пакетов: **${packages.length}**.\n\n`;
  body += '## Пакеты\n\n| Пакет | Экспортируемый API |\n| --- | --- |\n';

  for (const pkg of packages) {
    body += `| \`${escapeTableCell(pkg.relativeDir)}\` | ${pkg.declarations.length} |\n`;
  }

  for (const pkg of packages) {
    body += `\n## \`${escapeMarkdown(pkg.relativeDir)}\`\n\n`;
    if (pkg.doc) {
      body += `${escapeMarkdown(pkg.doc)}\n\n`;
    }

    const byKind = (kind) => pkg.declarations.filter((declaration) => declaration.kind === kind);
    body += renderDeclarationGroup('Типы', byKind('type'));
    body += renderDeclarationGroup('Функции', byKind('function'));
    body += renderDeclarationGroup('Методы', byKind('method'));
    body += renderDeclarationGroup('Константы', byKind('const'));
    body += renderDeclarationGroup('Переменные', byKind('var'));

    if (pkg.declarations.length === 0) {
      body += 'Экспортируемый API не найден.\n';
    }
  }

  await fs.writeFile(target, body);
}

async function main() {
  await fs.rm(docsOut, {recursive: true, force: true});
  await fs.rm(staticGeneratedOut, {recursive: true, force: true});
  await fs.mkdir(docsOut, {recursive: true});
  await fs.mkdir(staticGeneratedOut, {recursive: true});

  await copyTree(contentRoot, docsOut);
  await copyBackendMarkdownDocs();

  await copyTree(
    path.join(backendRoot, 'docs', 'images'),
    path.join(docsOut, 'backend', 'docs', 'images')
  );
  await copyTree(
    path.join(frontendRoot, 'documentation'),
    path.join(staticGeneratedOut, 'frontend-compodoc')
  );
  await copyTree(
    path.join(backendRoot, 'docs', 'swagger.html'),
    path.join(staticGeneratedOut, 'swagger', 'swagger.html')
  );
  await copyTree(
    path.join(backendRoot, 'docs', 'swagger.html'),
    path.join(staticGeneratedOut, 'swagger', 'index.html')
  );
  await copyTree(
    path.join(backendRoot, 'docs', 'openapi.json'),
    path.join(staticGeneratedOut, 'swagger', 'openapi.json')
  );
  await copyTree(
    path.join(frontendRoot, 'public', 'favicon.ico'),
    path.join(docsSiteRoot, 'static', 'img', 'favicon.ico')
  );

  await writeFrontendReference({frontendRoot, docsOut});
  await writeBackendReference();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
