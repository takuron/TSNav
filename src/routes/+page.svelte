<script lang="ts">
  // 首页提供站点搜索和分类筛选，状态不离开当前页面。
  import { categories, categoryLabels, sites, type Category } from '#lib/data/sites.ts';

  import { m } from '#lib/paraglide/messages.js';
  import LanguageSwitcher from '#lib/components/LanguageSwitcher.svelte';

  let query = $state('');
  let category = $state<Category | 'all'>('all');
  const filtered = $derived(sites.filter((site) =>
    (category === 'all' || site.category === category) &&
    `${site.name} ${site.description()} ${categoryLabels[site.category]()} ${site.url}`.toLowerCase().includes(query.trim().toLowerCase())
  ));

  function resetFilters() {
    query = '';
    category = 'all';
  }
</script>

<svelte:head>
  <title>{m.page_title()}</title>
  <meta name="description" content={m.page_description()} />
</svelte:head>

<a class="skip-link" href="#content">{m.skip_content()}</a>
<div class="mx-auto max-w-6xl px-5 sm:px-10">
  <header class="flex items-center justify-between py-7">
    <a href="/" class="flex items-center gap-3 no-underline" aria-label={m.home_label()}>
      <span class="brand-mark" aria-hidden="true">T</span>
      <span class="text-xl font-semibold tracking-tight">TSNav<span class="text-primary">.</span></span>
    </a>
    <div class="flex flex-wrap items-center justify-end gap-3"><span class="hidden text-sm text-muted sm:inline">{m.header_tagline()}</span><LanguageSwitcher /></div>
  </header>

  <main id="content" class="pb-12">
    <section class="hero mt-5 rounded-[2rem] p-7 sm:p-12" aria-labelledby="hero-title">
      <p class="mb-4 text-xs font-semibold tracking-[0.2em] text-primary">{m.hero_eyebrow()}</p>
      <h1 id="hero-title" class="m-0 text-4xl leading-tight font-medium tracking-tight sm:text-5xl">{m.hero_title_start()}<br class="sm:hidden" />{m.hero_title_end()}</h1>
      <p class="mt-5 mb-8 max-w-lg text-base leading-7 text-muted">{m.hero_description()}</p>
      <md-outlined-text-field
        class="search-field w-full max-w-xl"
        label={m.search_label()}
        type="search"
        value={query}
        oninput={(event) => { query = event.currentTarget.value; }}
      ></md-outlined-text-field>
      <noscript><p class="mt-4 text-sm">{m.noscript_hint()}</p></noscript>
    </section>

    <section class="mt-10" aria-labelledby="sites-title">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-baseline gap-3">
          <h2 id="sites-title" class="m-0 text-xl font-medium">{m.sites_title()}</h2>
          <span class="text-sm text-muted" role="status">{m.sites_count({ count: filtered.length })}</span>
        </div>
        <nav class="flex flex-wrap gap-2" aria-label={m.category_label()}>
          {#each ['all', ...categories] as item}
            <button type="button" class="category-chip" aria-pressed={category === item} onclick={() => { category = item as Category | 'all'; }}>{item === 'all' ? m.category_all() : categoryLabels[item as Category]()}</button>
          {/each}
        </nav>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each filtered as site (site.id)}
          <a class="site-card group flex flex-col rounded-3xl p-6 no-underline transition-colors" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={m.site_open_label({ name: site.name })}>
            <div class="mb-6 flex items-start justify-between">
              <span class="site-monogram flex size-12 items-center justify-center rounded-2xl text-base font-semibold" aria-hidden="true">{site.monogram}</span>
              <span class="text-sm text-muted" aria-hidden="true">↗</span>
            </div>
            <h3 class="m-0 text-lg font-medium">{site.name}</h3>
            <p class="mt-2 mb-6 text-sm leading-6 text-muted">{site.description()}</p>
            <span class="mt-auto text-xs text-primary">{categoryLabels[site.category]()}</span>
          </a>
        {/each}
      </div>
      {#if filtered.length === 0}
        <div class="py-16 text-center">
          <h3 class="text-xl font-medium">{m.empty_title()}</h3>
          <p class="mb-6 text-muted">{m.empty_description()}</p>
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (Material Web 在 Shadow DOM 中提供原生按钮与键盘行为，避免给宿主重复设置交互角色) -->
          <md-filled-button onclick={resetFilters}>{m.reset_filters()}</md-filled-button>
        </div>
      {/if}
    </section>
  </main>
  <footer class="flex flex-wrap justify-between gap-3 border-0 border-t border-solid border-outline py-7 text-xs text-muted">
    <span>{m.footer_tagline()}</span>
    <span>{m.footer_credits()}</span>
  </footer>
</div>
