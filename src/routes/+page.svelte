<script lang="ts">
  // 首页提供站点搜索和分类筛选，状态不离开当前页面。
  import { categories, sites, type Category } from '#lib/data/sites.ts';

  let query = $state('');
  let category = $state<Category | '全部'>('全部');
  const filtered = $derived(sites.filter((site) =>
    (category === '全部' || site.category === category) &&
    `${site.name} ${site.description} ${site.category} ${site.url}`.toLowerCase().includes(query.trim().toLowerCase())
  ));

  function resetFilters() {
    query = '';
    category = '全部';
  }
</script>

<svelte:head>
  <title>TSNav · 好去处，随手可达</title>
  <meta name="description" content="一个简洁、安静的 Material Design 风格网址导航，收藏开发、设计与阅读的好去处。" />
</svelte:head>

<a class="skip-link" href="#content">跳转到主要内容</a>
<div class="mx-auto max-w-6xl px-5 sm:px-10">
  <header class="flex items-center justify-between py-7">
    <a href="/" class="flex items-center gap-3 no-underline" aria-label="TSNav 首页">
      <span class="brand-mark" aria-hidden="true">T</span>
      <span class="text-xl font-semibold tracking-tight">TSNav<span class="text-primary">.</span></span>
    </a>
    <span class="text-sm text-muted">你的日常探索起点</span>
  </header>

  <main id="content" class="pb-12">
    <section class="hero mt-5 rounded-[2rem] p-7 sm:p-12" aria-labelledby="hero-title">
      <p class="mb-4 text-xs font-semibold tracking-[0.2em] text-primary">A LITTLE SPACE FOR DISCOVERY</p>
      <h1 id="hero-title" class="m-0 text-4xl leading-tight font-medium tracking-tight sm:text-5xl">好去处，<br class="sm:hidden" />随手可达。</h1>
      <p class="mt-5 mb-8 max-w-lg text-base leading-7 text-muted">把值得停留的网站放在一起。少一点寻找，多一点发现。</p>
      <md-outlined-text-field
        class="search-field w-full max-w-xl"
        label="搜索站点、分类或关键词"
        type="search"
        value={query}
        oninput={(event) => { query = event.currentTarget.value; }}
      ></md-outlined-text-field>
      <noscript><p class="mt-4 text-sm">启用 JavaScript 后可使用搜索和分类；下方站点链接可直接访问。</p></noscript>
    </section>

    <section class="mt-10" aria-labelledby="sites-title">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-baseline gap-3">
          <h2 id="sites-title" class="m-0 text-xl font-medium">发现好站</h2>
          <span class="text-sm text-muted" role="status">{filtered.length} 个站点</span>
        </div>
        <nav class="flex flex-wrap gap-2" aria-label="站点分类">
          {#each ['全部', ...categories] as item}
            <button type="button" class="category-chip" aria-pressed={category === item} onclick={() => { category = item as Category | '全部'; }}>{item}</button>
          {/each}
        </nav>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each filtered as site (site.id)}
          <a class="site-card group flex flex-col rounded-3xl p-6 no-underline transition-colors" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`${site.name}（在新标签页打开）`}>
            <div class="mb-6 flex items-start justify-between">
              <span class="site-monogram flex size-12 items-center justify-center rounded-2xl text-base font-semibold" aria-hidden="true">{site.monogram}</span>
              <span class="text-sm text-muted" aria-hidden="true">↗</span>
            </div>
            <h3 class="m-0 text-lg font-medium">{site.name}</h3>
            <p class="mt-2 mb-6 text-sm leading-6 text-muted">{site.description}</p>
            <span class="mt-auto text-xs text-primary">{site.category}</span>
          </a>
        {/each}
      </div>
      {#if filtered.length === 0}
        <div class="py-16 text-center">
          <h3 class="text-xl font-medium">还没有找到这个好去处</h3>
          <p class="mb-6 text-muted">试试其他关键词，或重新查看所有站点。</p>
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (Material Web 在 Shadow DOM 中提供原生按钮与键盘行为，避免给宿主重复设置交互角色) -->
          <md-filled-button onclick={resetFilters}>查看全部站点</md-filled-button>
        </div>
      {/if}
    </section>
  </main>
  <footer class="flex flex-wrap justify-between gap-3 border-0 border-t border-solid border-outline py-7 text-xs text-muted">
    <span>TSNav · 为日常留一点秩序</span>
    <span>Built with Svelte & Material Web</span>
  </footer>
</div>
