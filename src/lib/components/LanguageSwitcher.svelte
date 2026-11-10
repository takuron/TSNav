<script lang="ts">
  // 提供最小语言入口；默认整页重载，保证服务端、文档属性和组件语言同步。
  import { m } from '#lib/paraglide/messages.js';
  import { getLocale, setLocale } from '#lib/paraglide/runtime.js';
</script>

<nav class="flex gap-2" aria-label={m.language_label()}>
  <button type="button" class="category-chip" lang="zh-CN" aria-pressed={getLocale() === 'zh-CN'} onclick={() => setLocale('zh-CN')}>简体中文</button>
  <button type="button" class="category-chip" lang="en" aria-pressed={getLocale() === 'en'} onclick={() => setLocale('en')}>English</button>
</nav>
