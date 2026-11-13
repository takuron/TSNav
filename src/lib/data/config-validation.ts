import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const VERSION = 1;
const MAX_CHILDREN_DEPTH = 3;
const HTTPS_URL = /^https:\/\//;
const CATEGORY_ICON = /^md:\/\/[A-Za-z0-9_-]+$/;
const SITE_ICON = /^(md|simple|icon):\/\/[A-Za-z0-9_-]+$|^https:\/\//;
const OTHER_ICON_IDS = new Set(['baiduTieba', 'iqiyi', 'neteaseMail']);

interface ValidationIssue {
  path: string;
  message: string;
}

function issue(issues: ValidationIssue[], path: string, message: string): void {
  issues.push({ path, message });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateLink(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (!isRecord(value)) {
    issue(issues, path, '链接必须是对象');
    return;
  }
  for (const field of ['name', 'description', 'url', 'icon']) {
    if (typeof value[field] !== 'string' || value[field].length === 0) issue(issues, `${path}.${field}`, '必须是非空字符串');
  }
  if (typeof value.url === 'string' && !HTTPS_URL.test(value.url)) issue(issues, `${path}.url`, '必须使用 https://');
  if (typeof value.icon === 'string') {
    if (!SITE_ICON.test(value.icon)) issue(issues, `${path}.icon`, '必须是 md://、simple://、icon:// 或 https://');
    else if (value.icon.startsWith('icon://') && !OTHER_ICON_IDS.has(value.icon.slice(7))) issue(issues, `${path}.icon`, 'icon:// 只能使用已注册的本地图标 ID');
  }
}

function validateGroup(value: unknown, path: string, depth: number, issues: ValidationIssue[]): void {
  if (!isRecord(value)) {
    issue(issues, path, '分组必须是对象');
    return;
  }
  if (typeof value.id !== 'string' || value.id.length === 0) issue(issues, `${path}.id`, '必须是非空字符串');
  if (typeof value.title !== 'string' || value.title.length === 0) issue(issues, `${path}.title`, '必须是非空字符串');
  if (value.icon !== undefined && (typeof value.icon !== 'string' || !CATEGORY_ICON.test(value.icon))) issue(issues, `${path}.icon`, '必须是 md:// 图标');
  if (!Array.isArray(value.links)) issue(issues, `${path}.links`, '必须是数组');
  else value.links.forEach((link, index) => validateLink(link, `${path}.links[${index}]`, issues));
  if (!Array.isArray(value.children)) {
    issue(issues, `${path}.children`, '必须是数组');
  } else if (depth >= MAX_CHILDREN_DEPTH && value.children.length > 0) {
    issue(issues, `${path}.children`, '超过允许的三层子分组');
  } else {
    value.children.forEach((child, index) => validateGroup(child, `${path}.children[${index}]`, depth + 1, issues));
  }
}

function validateCommon(value: unknown, filePath: string, issues: ValidationIssue[]): void {
  if (!isRecord(value)) {
    issue(issues, filePath, 'JSON 根节点必须是对象');
    return;
  }
  if (value.version !== VERSION) issue(issues, `${filePath}.version`, '必须为整数 1');
  if (value.scope !== 'default' && value.scope !== 'user') issue(issues, `${filePath}.scope`, '只能是 default 或 user');
}

function validateMaster(value: unknown, filePath: string, issues: ValidationIssue[]): void {
  validateCommon(value, filePath, issues);
  if (!isRecord(value)) return;
  if (!isRecord(value.profile) || typeof value.profile.username !== 'string' || typeof value.profile.email !== 'string') issue(issues, `${filePath}.profile`, '必须包含 username 和 email');
  if (!isRecord(value.site) || typeof value.site.name !== 'string' || typeof value.site.description !== 'string' || !isRecord(value.site.footer)) issue(issues, `${filePath}.site`, '必须包含 name、description 和 footer');
  if (!isRecord(value.homepage) || !Array.isArray(value.homepage.commonLinks)) issue(issues, `${filePath}.homepage`, '必须包含 commonLinks 数组');
  else value.homepage.commonLinks.forEach((link, index) => validateLink(link, `${filePath}.homepage.commonLinks[${index}]`, issues));
  if (!Array.isArray(value.categories)) issue(issues, `${filePath}.categories`, '必须是数组');
  else {
    const slugs = new Set<string>();
    value.categories.forEach((category, index) => {
      const path = `${filePath}.categories[${index}]`;
      if (!isRecord(category)) return issue(issues, path, '分类必须是对象');
      if (typeof category.slug !== 'string' || category.slug.length === 0) issue(issues, `${path}.slug`, '必须是非空字符串');
      else if (slugs.has(category.slug)) issue(issues, `${path}.slug`, '不能重复');
      else slugs.add(category.slug);
      if (typeof category.title !== 'string' || category.title.length === 0) issue(issues, `${path}.title`, '必须是非空字符串');
      if (category.label !== undefined && typeof category.label !== 'string') issue(issues, `${path}.label`, '必须是字符串');
      if (typeof category.icon !== 'string' || !CATEGORY_ICON.test(category.icon)) issue(issues, `${path}.icon`, '必须是 md:// 图标');
    });
  }
}

function validateCategory(value: unknown, filePath: string, issues: ValidationIssue[]): void {
  validateCommon(value, filePath, issues);
  if (!isRecord(value)) return;
  if (typeof value.slug !== 'string' || value.slug.length === 0) issue(issues, `${filePath}.slug`, '必须是非空字符串');
  if (!isRecord(value.category)) {
    issue(issues, `${filePath}.category`, '必须是对象');
    return;
  }
  const category = value.category;
  if (typeof category.title !== 'string' || category.title.length === 0) issue(issues, `${filePath}.category.title`, '必须是非空字符串');
  if (category.label !== undefined && typeof category.label !== 'string') issue(issues, `${filePath}.category.label`, '必须是字符串');
  if (typeof category.icon !== 'string' || !CATEGORY_ICON.test(category.icon)) issue(issues, `${filePath}.category.icon`, '必须是 md:// 图标');
  if (!Array.isArray(category.links)) issue(issues, `${filePath}.category.links`, '必须是数组');
  else category.links.forEach((link, index) => validateLink(link, `${filePath}.category.links[${index}]`, issues));
  if (!Array.isArray(category.children)) issue(issues, `${filePath}.category.children`, '必须是数组');
  else category.children.forEach((child, index) => validateGroup(child, `${filePath}.category.children[${index}]`, 1, issues));
}

function jsonFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? jsonFiles(path) : entry.name.endsWith('.json') ? [path] : [];
  });
}

/** 在 Vite 构建开始前校验默认和用户导航 JSON。 */
export function validateNavigationJson(apiDirectory: string): void {
  const files = jsonFiles(apiDirectory);
  const failures: Array<{ file: string; issues: ValidationIssue[]; user: boolean }> = [];
  for (const file of files) {
    const issues: ValidationIssue[] = [];
    const relativePath = relative(apiDirectory, file).replaceAll('\\', '/');
    const user = relativePath.startsWith('user/');
    let value: unknown;
    try {
      value = JSON.parse(readFileSync(file, 'utf8')) as unknown;
    } catch (error) {
      issue(issues, relativePath, `无法解析 JSON：${error instanceof Error ? error.message : String(error)}`);
      failures.push({ file: relativePath, issues, user });
      continue;
    }
    if (relativePath.endsWith('/master.json') || relativePath === 'master.json') validateMaster(value, relativePath, issues);
    else validateCategory(value, relativePath, issues);
    if (issues.length > 0) failures.push({ file: relativePath, issues, user });
  }
  const format = (failure: (typeof failures)[number]) => failure.issues.map(({ path, message }) => `  - ${path}: ${message}`).join('\n');
  const errors = failures.filter(({ user }) => !user);
  const warnings = failures.filter(({ user }) => user);
  for (const warning of warnings) console.warn(`[navigation-config] warning: ${warning.file}\n${format(warning)}`);
  if (errors.length > 0) throw new Error(`[navigation-config] 默认 JSON 校验失败：\n${errors.map(format).join('\n')}`);
}
