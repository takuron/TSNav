<script lang="ts">
  // 还原主页原型；分类与站点为可替换的静态内容，交互状态仅保留在页面内。
  import { m } from '#lib/paraglide/messages.js';
  import Icon from '#lib/components/Icon.svelte';
  import LanguageSwitcher from '#lib/components/LanguageSwitcher.svelte';
  import type { IconName } from '#lib/icons/index.ts';

  const destinations: { id: string; label: string; icon: IconName }[] = [
    { id: 'recommended', label: '常用推荐', icon: 'star' },
    { id: 'discover', label: '发现库与分类', icon: 'gridView' },
    { id: 'ai', label: '人工智能与前沿', icon: 'sparkles' },
    { id: 'dev', label: '开发与云原生', icon: 'terminal' },
    { id: 'design', label: '设计与视觉灵感', icon: 'palette' },
    { id: 'recent', label: '历史与最近访问', icon: 'history' }
  ];
  const shortcuts: { id: string; name: string; description: string; url: string; category: string; icon: IconName; tone: string; badge?: string }[] = [
    { id: 'github', name: 'GitHub', description: '全球最大的开源代码托管与协作平台', url: 'https://github.com', category: 'dev', icon: 'github', tone: 'neutral' },
    { id: 'claude', name: 'Claude / ChatGPT', description: '前沿对话大模型协同与推理引擎', url: 'https://claude.ai', category: 'ai', icon: 'psychology', tone: 'blue' },
    { id: 'figma', name: 'Figma Design', description: '下一代云端 UI/UX 协作与原型设计器', url: 'https://figma.com', category: 'design', icon: 'figma', tone: 'accent' },
    { id: 'vercel', name: 'Vercel', description: '极速前端全栈托管与边缘计算网络', url: 'https://vercel.com', category: 'dev', icon: 'vercel', tone: 'neutral' },
    { id: 'notion', name: 'Notion', description: '结构化文档、团队知识库与多维表格', url: 'https://www.notion.so', category: 'dev', icon: 'note', tone: 'neutral' },
    { id: 'bilibili', name: '哔哩哔哩 / YouTube', description: '优质技术视频教程与全球创意内容', url: 'https://www.bilibili.com', category: 'discover', icon: 'video', tone: 'blue' },
    { id: 'stackoverflow', name: 'Stack Overflow', description: '全球最大的专业软件开发疑难解答社区', url: 'https://stackoverflow.com', category: 'dev', icon: 'quiz', tone: 'primary' },
    { id: 'dribbble', name: 'Dribbble & Behance', description: '全球顶尖数字产品 UI 与插画艺术灵感', url: 'https://dribbble.com', category: 'design', icon: 'palette', tone: 'primary' }
  ];
  const engines = [
    { id: 'google', name: () => 'Google', mark: 'G', url: 'https://www.google.com/search?q=' },
    { id: 'baidu', name: m.engine_baidu, mark: '度', url: 'https://www.baidu.com/s?wd=' },
    { id: 'bing', name: () => 'Bing', icon: 'explore' as const, url: 'https://www.bing.com/search?q=' },
    { id: 'sogou', name: m.engine_sogou, mark: '搜', url: 'https://www.sogou.com/web?query=' },
    { id: 'duckduckgo', name: () => 'DuckDuckGo', icon: 'search' as const, url: 'https://duckduckgo.com/?q=' }
  ];
  let selected = $state('recommended');
  let collapsed = $state(false);
  let drawer: HTMLDialogElement;
  let settings: HTMLDialogElement;
  let feedback: HTMLDialogElement;
  let query = $state('');
  let engine = $state(engines[0]);
  let visited = $state<string[]>([]);
  let reportSite = $state(shortcuts[0].id);
  let copyStatus = $state('');
  const visibleSites = $derived(selected === 'recent'
    ? visited.map((id) => shortcuts.find((site) => site.id === id)!).filter(Boolean)
    : shortcuts.filter((site) => ['recommended', 'discover'].includes(selected) || site.category === selected));

  function selectCategory(id: string) {
    selected = id;
    drawer?.close();
  }
  function search() {
    if (query.trim()) window.open(engine.url + encodeURIComponent(query.trim()), '_blank', 'noopener,noreferrer');
  }
  function visit(id: string) {
    visited = [id, ...visited.filter((item) => item !== id)];
  }
  async function copyReport() {
    const site = shortcuts.find((item) => item.id === reportSite)!;
    try {
      await navigator.clipboard.writeText(`${site.name}\n${site.url}`);
      copyStatus = m.feedback_copied();
    } catch {
      copyStatus = m.feedback_failed();
    }
  }
  function backToTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
</script>

<svelte:head>
  <title>{m.page_title()}</title>
  <meta name="description" content={m.page_description()} />
</svelte:head>

{#snippet brand()}
  <a href="/" class="brand" aria-label={m.home_label()}>
    <img src="/favicon.svg" width="36" height="36" alt="" />
    <span class="sidebar-text">TSNav</span>
  </a>
{/snippet}
{#snippet navigation()}
  <nav class="destination-list" aria-label={m.category_label()}>
    {#each destinations as item}
      <button type="button" class="destination" aria-pressed={selected === item.id} title={item.label} onclick={() => selectCategory(item.id)}>
        <Icon name={item.icon} size={20} /><span class="sidebar-text">{item.label}</span>
      </button>
    {/each}
  </nav>
{/snippet}
{#snippet profile()}
  <div class="profile">
    <span class="avatar" aria-hidden="true">T</span>
    <div class="profile-info sidebar-text"><strong>{m.local_profile()}</strong><span>{m.local_profile_hint()}</span></div>
    <button class="icon-button settings-button" type="button" aria-label={m.settings_label()} title={m.settings_label()} onclick={() => { drawer?.close(); settings.showModal(); }}><Icon name="settings" size={20} /></button>
  </div>
{/snippet}

<a class="skip-link" href="#content">{m.skip_content()}</a>
<div class="portal" class:collapsed>
  <aside class="sidebar">
    <div><div class="sidebar-heading">{@render brand()}<button class="icon-button collapse-button" type="button" aria-label={m.sidebar_toggle()} aria-expanded={!collapsed} onclick={() => { collapsed = !collapsed; }}><Icon name={collapsed ? 'menu' : 'collapse'} size={20} /></button></div>{@render navigation()}</div>
    {@render profile()}
  </aside>
  <header class="mobile-header">
    <button class="icon-button" type="button" aria-label={m.menu_open()} onclick={() => drawer.showModal()}><Icon name="menu" /></button>
    {@render brand()}
    <button class="icon-button" type="button" aria-label={m.settings_label()} onclick={() => settings.showModal()}><Icon name="settings" size={20} /></button>
  </header>
  <div class="main-wrapper">
    <main id="content" class="portal-main">
      <h1 class="sr-only">{m.sites_title()}</h1>
      <div class="dashboard">
        <section class="search-panel" aria-label={m.search_engines()}>
          <div class="engine-tabs" role="group" aria-label={m.search_engines()}>
            {#each engines as item}
              <button type="button" class="engine-tab" aria-pressed={engine.id === item.id} onclick={() => { engine = item; }}>
                <span class="engine-mark" aria-hidden="true">{#if item.icon}<Icon name={item.icon} size={16} />{:else}{item.mark}{/if}</span>{item.name()}
              </button>
            {/each}
          </div>
          <div class="search-row">
            <!-- svelte-ignore a11y_no_static_element_interactions (键盘事件来自 Shadow DOM 内的原生搜索框，不给宿主重复设置角色) -->
            <md-outlined-text-field class="search-field" label={m.search_label()} type="search" value={query} oninput={(event) => { query = event.currentTarget.value; }} onkeydown={(event) => { if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); search(); } }}>
              <span slot="leading-icon"><Icon name="search" size={24} /></span>
            </md-outlined-text-field>
            <button type="button" class="icon-button search-submit" aria-label={m.search_submit()} onclick={search}><Icon name="openInNew" size={20} /></button>
          </div>
          <noscript><p class="noscript-hint">{m.noscript_hint()}</p></noscript>
        </section>
        <section aria-label={destinations.find((item) => item.id === selected)?.label}>
          {#if !['recommended', 'discover'].includes(selected)}<h2 class="category-heading">{destinations.find((item) => item.id === selected)?.label}</h2>{/if}
          <div class="shortcut-grid">
            {#each visibleSites as site (site.id)}
              <a class="site-card" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={m.site_open_label({ name: site.name })} onclick={() => visit(site.id)}>
                <div class="card-top"><span class="site-icon {site.tone}"><Icon name={site.icon} size={26} /></span><span class="card-arrow"><Icon name="openInNew" size={18} /></span></div>
                <div class="card-copy"><h2>{site.name}{#if site.badge}<span class="site-badge">{site.badge}</span>{/if}</h2><p title={site.description}>{site.description}</p></div>
              </a>
            {/each}
          </div>
          {#if visibleSites.length === 0}<div class="empty-state"><Icon name="history" size={36} /><h2>{m.recent_empty()}</h2><p>{m.recent_hint()}</p><!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (Material 内部原生按钮提供键盘行为) --><md-filled-button onclick={() => selectCategory('recommended')}>{m.reset_filters()}</md-filled-button></div>{/if}
        </section>
      </div>
    </main>
    <footer class="portal-footer">
      <div><p class="footer-title">{m.footer_tagline()}</p><p>{m.footer_credits()}</p></div>
      <div class="footer-actions"><button class="feedback-button" type="button" onclick={() => { copyStatus = ''; feedback.showModal(); }}><Icon name="feedback" size={16} />{m.feedback_label()}</button><button class="icon-button" type="button" aria-label={m.back_to_top()} title={m.back_to_top()} onclick={backToTop}><Icon name="arrowUp" size={20} /></button></div>
    </footer>
  </div>
</div>

<dialog class="mobile-drawer" bind:this={drawer} aria-label={m.category_label()}>
  <div class="sidebar-heading">{@render brand()}<button type="button" class="icon-button" aria-label={m.menu_close()} onclick={() => drawer.close()}><Icon name="close" size={20} /></button></div>
  {@render navigation()}<div class="drawer-profile">{@render profile()}</div>
  <form method="dialog"><button class="drawer-backdrop" aria-label={m.menu_close()}></button></form>
</dialog>
<dialog class="utility-dialog" bind:this={settings} aria-labelledby="settings-title">
  <div class="dialog-heading"><h2 id="settings-title">{m.settings_label()}</h2><button class="icon-button" type="button" aria-label={m.dialog_close()} onclick={() => settings.close()}><Icon name="close" size={20} /></button></div>
  <p>{m.language_label()}</p><LanguageSwitcher />
</dialog>
<dialog class="utility-dialog" bind:this={feedback} aria-labelledby="feedback-title">
  <div class="dialog-heading"><h2 id="feedback-title">{m.feedback_label()}</h2><button class="icon-button" type="button" aria-label={m.dialog_close()} onclick={() => feedback.close()}><Icon name="close" size={20} /></button></div>
  <p>{m.feedback_hint()}</p><label class="report-label" for="report-site">{m.feedback_site()}</label>
  <select id="report-site" bind:value={reportSite} onchange={() => { copyStatus = ''; }}>{#each shortcuts as site}<option value={site.id}>{site.name}</option>{/each}</select>
  <p class="report-url">{shortcuts.find((site) => site.id === reportSite)?.url}</p>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (Material 内部原生按钮提供键盘行为) -->
  <md-filled-button onclick={copyReport}>{m.feedback_copy()}</md-filled-button><p role="status">{copyStatus}</p>
</dialog>
