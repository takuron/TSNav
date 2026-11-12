<script lang="ts">
  // 还原主页原型；分类与站点为可替换的静态内容，交互状态仅保留在页面内。
  import { copy } from '#lib/copy.ts';
  import Icon from '#lib/components/Icon.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import PortalShell from '#lib/components/PortalShell.svelte';
  import { navigationCategories, categoryPath, defaultNavigation } from '#lib/data/navigation-config.ts';
  import NavigationCardGrid from '#lib/components/NavigationCardGrid.svelte';
  import SearchBar from '#lib/components/SearchBar.svelte';
  import type { NavigationSite } from '#lib/types/navigation.ts';

  const destinations = navigationCategories;
  const shortcuts: readonly NavigationSite[] = defaultNavigation.shortcuts;
  // 从分类页返回本地筛选时，使用稳定 ID 初始化，不以显示名判定。
  function initialCategory() {
    const id = typeof window !== 'undefined' ? page.url.searchParams.get('category') : null;
    return destinations.some((category) => category.id === id) ? id! : 'recommended';
  }
  let selected = $state(initialCategory());
  let visited = $state<string[]>([]);
  const selectedLabel = $derived(destinations.find((item) => item.id === selected)?.label);
  const visibleSites = $derived(selected === 'recommended' ? shortcuts : shortcuts.filter((site) => site.category === selected));

  function selectCategory(id: string) {
    const path = categoryPath(id);
    if (path) void goto(path);
    else selected = id;
  }
  function visit(id: string) {
    visited = [id, ...visited.filter((item) => item !== id)];
  }
</script>

<svelte:head>
  <title>{copy.page_title()}</title>
  <meta name="description" content={copy.page_description()} />
</svelte:head>

<PortalShell categories={destinations} {selected} onselect={selectCategory} sites={shortcuts}>
      <h1 class="sr-only">{copy.sites_title()}</h1>
      <div class="dashboard">
        <SearchBar />
        <section aria-label={selectedLabel}>
          {#if selected !== 'recommended'}<h2 class="category-heading">{selectedLabel}</h2>{/if}
          <NavigationCardGrid sites={visibleSites} onvisit={visit} class="home-grid" />
          {#if visibleSites.length === 0}<div class="empty-state"><Icon name="explore" size={36} /><h2>{copy.sites_title()}</h2><p>{copy.page_description()}</p></div>{/if}
        </section>
      </div>
</PortalShell>
