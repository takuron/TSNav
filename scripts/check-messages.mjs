import { readFile } from 'node:fs/promises';

// 校验当前扁平消息格式，防止缺失翻译被编译器的回退机制隐藏。
const settings = JSON.parse(await readFile(new URL('../project.inlang/settings.json', import.meta.url), 'utf8'));
const catalogs = new Map(await Promise.all(settings.locales.map(async (locale) => [
  locale,
  JSON.parse(await readFile(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'))
])));
const base = catalogs.get(settings.baseLocale);
const keys = Object.keys(base).sort();
const parameters = (message) => [...new Set([...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1]))].sort().join(',');
const errors = [];
for (const [locale, catalog] of catalogs) {
  if (Object.keys(catalog).sort().join('\n') !== keys.join('\n')) {
    errors.push(`${locale}: 消息键与 ${settings.baseLocale} 不一致`);
  }
  for (const key of keys) {
    const value = catalog[key];
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(`${locale}.${key}: 必须是非空字符串`);
    } else if (typeof base[key] === 'string' && parameters(value) !== parameters(base[key])) {
      errors.push(`${locale}.${key}: 插值参数与基础语言不一致`);
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`语言检查通过：${catalogs.size} 种语言，${keys.length} 条消息。`);
}
