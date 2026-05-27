import fs from 'node:fs/promises';
import path from 'node:path';

function escapeTableCell(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function escapeMarkdown(value) {
  return String(value || '').replace(/\r?\n/g, ' ').trim();
}

function countBraces(line) {
  const withoutStrings = line
    .replace(/`[^`]*`/g, '')
    .replace(/"([^"\\]|\\.)*"/g, '')
    .replace(/'([^'\\]|\\.)*'/g, '')
    .replace(/\/\/.*$/, '');
  return (withoutStrings.match(/\{/g) || []).length - (withoutStrings.match(/\}/g) || []).length;
}

async function walkTsFiles(root) {
  const files = [];
  const skipDirs = new Set(['node_modules', 'dist', 'coverage', 'documentation', 'test-stubs']);

  async function walk(dir) {
    const entries = await fs.readdir(dir, {withFileTypes: true});
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) {
          await walk(fullPath);
        }
        continue;
      }
      if (
        entry.isFile() &&
        entry.name.endsWith('.ts') &&
        !entry.name.endsWith('.spec.ts') &&
        !entry.name.endsWith('.d.ts') &&
        !entry.name.startsWith('test-')
      ) {
        files.push(fullPath);
      }
    }
  }

  await walk(root);
  return files.sort();
}

function extractBalanced(raw, openIndex, openChar = '{', closeChar = '}') {
  let depth = 0;
  let quote = '';
  let escaped = false;

  for (let i = openIndex; i < raw.length; i += 1) {
    const char = raw[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === openChar) {
      depth += 1;
    }
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return raw.slice(openIndex, i + 1);
      }
    }
  }

  return '';
}

function valueFromDecorator(block, key) {
  const match = block.match(new RegExp(`${key}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`));
  return match?.[1] || '';
}

function arrayFromDecorator(block, key) {
  const match = block.match(new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) {
    return [];
  }
  return match[1]
    .split(',')
    .map((item) => item.trim().replace(/^['"`]|['"`]$/g, ''))
    .filter(Boolean);
}

function parseClassMethods(raw, className) {
  const classMatch = raw.match(new RegExp(`export\\s+class\\s+${className}\\b`));
  if (!classMatch) {
    return [];
  }

  const openIndex = raw.indexOf('{', classMatch.index);
  if (openIndex === -1) {
    return [];
  }

  const body = extractBalanced(raw, openIndex);
  const methods = [];
  let depth = 0;
  const lines = body.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (depth === 1) {
      const match = trimmed.match(/^(?:public\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?/);
      if (match && match[1] !== 'constructor' && !match[1].startsWith('ng')) {
        methods.push({
          name: match[1],
          signature: `${match[1]}(${match[2]})${match[3] ? `: ${match[3].trim()}` : ''}`
        });
      }
    }
    depth = Math.max(0, depth + countBraces(line));
  }

  return methods;
}

function parseComponents(raw, file) {
  const components = [];
  let cursor = 0;

  while (true) {
    const componentIndex = raw.indexOf('@Component', cursor);
    if (componentIndex === -1) {
      break;
    }
    const objectStart = raw.indexOf('{', componentIndex);
    const decorator = objectStart === -1 ? '' : extractBalanced(raw, objectStart);
    const afterDecorator = raw.slice(componentIndex + decorator.length);
    const classMatch = afterDecorator.match(/export\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);

    if (decorator && classMatch) {
      const className = classMatch[1];
      components.push({
        name: className,
        selector: valueFromDecorator(decorator, 'selector'),
        templateUrl: valueFromDecorator(decorator, 'templateUrl'),
        styleUrls: [
          valueFromDecorator(decorator, 'styleUrl'),
          ...arrayFromDecorator(decorator, 'styleUrls')
        ].filter(Boolean),
        imports: arrayFromDecorator(decorator, 'imports'),
        standalone: /standalone\s*:\s*true/.test(decorator),
        file
      });
    }

    cursor = componentIndex + 10;
  }

  return components;
}

function parseInjectables(raw, file) {
  const injectables = [];
  let cursor = 0;

  while (true) {
    const injectableIndex = raw.indexOf('@Injectable', cursor);
    if (injectableIndex === -1) {
      break;
    }
    const afterDecorator = raw.slice(injectableIndex);
    const classMatch = afterDecorator.match(/export\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
    if (classMatch) {
      const name = classMatch[1];
      injectables.push({
        name,
        file,
        methods: parseClassMethods(raw, name)
      });
    }
    cursor = injectableIndex + 10;
  }

  return injectables;
}

function parseInterfaces(raw, file) {
  const interfaces = [];
  const interfaceRegex = /export\s+interface\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s+extends\s+([^{]+))?\s*\{/g;
  let match;

  while ((match = interfaceRegex.exec(raw)) !== null) {
    const openIndex = raw.indexOf('{', match.index);
    const body = extractBalanced(raw, openIndex);
    const fields = body
      .slice(1, -1)
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//'))
      .map((line) => line.replace(/;$/, ''))
      .filter(Boolean);
    interfaces.push({
      name: match[1],
      extends: match[2]?.trim() || '',
      file,
      fields
    });
  }

  return interfaces;
}

function parseTypeAliases(raw, file) {
  const aliases = [];
  const typeRegex = /export\s+type\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^;]+);/g;
  let match;

  while ((match = typeRegex.exec(raw)) !== null) {
    aliases.push({
      name: match[1],
      value: match[2].trim(),
      file
    });
  }

  return aliases;
}

function parseRoutes(raw) {
  const routes = [];
  const routeRegex = /\{\s*path:\s*['"`]([^'"`]*)['"`]\s*,\s*component:\s*([A-Za-z_][A-Za-z0-9_]*)/g;
  let match;

  while ((match = routeRegex.exec(raw)) !== null) {
    const before = raw.slice(Math.max(0, match.index - 220), match.index);
    const guardMatch = before.match(/canActivate:\s*\[([^\]]+)\]\s*$/);
    routes.push({
      path: match[1] || '/',
      component: match[2],
      guard: guardMatch?.[1]?.replace(/\s+/g, ' ').trim() || ''
    });
  }

  return routes;
}

async function collectFrontendReference(frontendRoot) {
  const srcRoot = path.join(frontendRoot, 'src');
  const files = await walkTsFiles(srcRoot);
  const reference = {
    components: [],
    injectables: [],
    interfaces: [],
    typeAliases: [],
    routes: []
  };

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const file = path.relative(frontendRoot, filePath);
    reference.components.push(...parseComponents(raw, file));
    reference.injectables.push(...parseInjectables(raw, file));
    reference.interfaces.push(...parseInterfaces(raw, file));
    reference.typeAliases.push(...parseTypeAliases(raw, file));
    if (file.endsWith('src/app/app.routes.ts')) {
      reference.routes = parseRoutes(raw);
    }
  }

  for (const key of Object.keys(reference)) {
    reference[key].sort((a, b) => (a.name || a.path).localeCompare(b.name || b.path));
  }

  return reference;
}

function pageHeader(title) {
  return `---\ntitle: ${title}\n---\n\n# ${title}\n\n`;
}

function renderComponents(reference) {
  let body = pageHeader('Фронтенд-компоненты');
  body += `Всего компонентов: **${reference.components.length}**.\n\n`;
  body += '| Компонент | Selector | Template | Styles | Imports | Файл |\n| --- | --- | --- | --- | --- | --- |\n';
  for (const component of reference.components) {
    body += `| \`${escapeTableCell(component.name)}\` | ${component.selector ? `\`${escapeTableCell(component.selector)}\`` : '-'} | ${component.templateUrl ? `\`${escapeTableCell(component.templateUrl)}\`` : '-'} | ${component.styleUrls.length ? component.styleUrls.map((style) => `\`${escapeTableCell(style)}\``).join('<br />') : '-'} | ${component.imports.length ? component.imports.map((item) => `\`${escapeTableCell(item)}\``).join('<br />') : '-'} | \`${escapeTableCell(component.file)}\` |\n`;
  }
  return body;
}

function renderServices(reference) {
  let body = pageHeader('Фронтенд-сервисы');
  body += `Всего injectable-сервисов: **${reference.injectables.length}**.\n\n`;
  for (const service of reference.injectables) {
    body += `## \`${escapeMarkdown(service.name)}\`\n\n`;
    body += `Файл: \`${escapeMarkdown(service.file)}\`\n\n`;
    if (service.methods.length === 0) {
      body += 'Публичные методы не найдены.\n\n';
      continue;
    }
    body += '| Метод | Сигнатура |\n| --- | --- |\n';
    for (const method of service.methods) {
      body += `| \`${escapeTableCell(method.name)}\` | \`${escapeTableCell(method.signature)}\` |\n`;
    }
    body += '\n';
  }
  return body;
}

function renderInterfaces(reference) {
  let body = pageHeader('Фронтенд-интерфейсы');
  body += `Всего интерфейсов: **${reference.interfaces.length}**. Type aliases: **${reference.typeAliases.length}**.\n\n`;
  for (const item of reference.interfaces) {
    body += `## \`${escapeMarkdown(item.name)}\`\n\n`;
    body += `Файл: \`${escapeMarkdown(item.file)}\`\n\n`;
    if (item.extends) {
      body += `Extends: \`${escapeMarkdown(item.extends)}\`\n\n`;
    }
    if (item.fields.length === 0) {
      body += 'Поля не найдены.\n\n';
      continue;
    }
    body += '| Поле |\n| --- |\n';
    for (const field of item.fields) {
      body += `| \`${escapeTableCell(field)}\` |\n`;
    }
    body += '\n';
  }

  if (reference.typeAliases.length > 0) {
    body += '## Type aliases\n\n| Имя | Значение | Файл |\n| --- | --- | --- |\n';
    for (const alias of reference.typeAliases) {
      body += `| \`${escapeTableCell(alias.name)}\` | \`${escapeTableCell(alias.value)}\` | \`${escapeTableCell(alias.file)}\` |\n`;
    }
  }
  return body;
}

function renderRoutes(reference) {
  let body = pageHeader('Фронтенд-маршруты');
  body += `Всего route entries: **${reference.routes.length}**.\n\n`;
  body += '| Путь | Компонент | Guard |\n| --- | --- | --- |\n';
  for (const route of reference.routes) {
    body += `| \`${escapeTableCell(route.path)}\` | \`${escapeTableCell(route.component)}\` | ${route.guard ? `\`${escapeTableCell(route.guard)}\`` : '-'} |\n`;
  }
  return body;
}

function renderOverview(reference) {
  let body = pageHeader('Фронтенд-автодокументация');
  body += 'Этот раздел генерируется в формате Docusaurus из исходников Angular/TypeScript. Compodoc HTML больше не встраивается iframe-страницей, поэтому документация выглядит как часть общего портала.\n\n';
  body += '| Раздел | Количество |\n| --- | --- |\n';
  body += `| Компоненты | ${reference.components.length} |\n`;
  body += `| Injectable-сервисы | ${reference.injectables.length} |\n`;
  body += `| Интерфейсы | ${reference.interfaces.length} |\n`;
  body += `| Type aliases | ${reference.typeAliases.length} |\n`;
  body += `| Маршруты | ${reference.routes.length} |\n\n`;
  body += '## Разделы\n\n';
  body += '- [Компоненты](./frontend/components)\n';
  body += '- [Сервисы](./frontend/services)\n';
  body += '- [Интерфейсы](./frontend/interfaces)\n';
  body += '- [Маршруты](./frontend/routes)\n\n';
  body += 'Оригинальный Compodoc HTML всё ещё копируется в статические артефакты как fallback в `generated/frontend-compodoc/`, но основной раздел теперь рендерится в стиле Docusaurus.\n';
  return body;
}

export async function writeFrontendReference({frontendRoot, docsOut}) {
  const reference = await collectFrontendReference(frontendRoot);
  const targetDir = path.join(docsOut, 'architecture', 'frontend');
  await fs.mkdir(targetDir, {recursive: true});

  await fs.writeFile(path.join(docsOut, 'architecture', 'frontend.md'), renderOverview(reference));
  await fs.writeFile(path.join(targetDir, 'components.md'), renderComponents(reference));
  await fs.writeFile(path.join(targetDir, 'services.md'), renderServices(reference));
  await fs.writeFile(path.join(targetDir, 'interfaces.md'), renderInterfaces(reference));
  await fs.writeFile(path.join(targetDir, 'routes.md'), renderRoutes(reference));
}
