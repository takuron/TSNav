<script lang="ts">
  // 还原主页原型；分类与站点为可替换的静态内容，交互状态仅保留在页面内。
  import { copy } from '#lib/copy.ts';
  import Icon from '#lib/components/Icon.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import PortalShell from '#lib/components/PortalShell.svelte';
  import { navigationCategories, categoryPath } from '#lib/data/categories.ts';
  import NavigationCardGrid from '#lib/components/NavigationCardGrid.svelte';
  import SearchBar from '#lib/components/SearchBar.svelte';
  import type { NavigationSite } from '#lib/types/navigation.ts';

  const destinations = navigationCategories;
  const shortcuts: NavigationSite[] = [
    { id: 'github', name: 'GitHub', description: '全球最大的开源代码托管与协作平台', url: 'https://github.com', category: 'dev', icon: 'github', tone: 'default' },
    { id: 'claude', name: 'Claude / ChatGPT', description: '前沿对话大模型协同与推理引擎', url: 'https://claude.ai', category: 'ai', icon: 'psychology', tone: 'theme' },
    { id: 'figma', name: 'Figma Design', description: '下一代云端 UI/UX 协作与原型设计器', url: 'https://figma.com', category: 'design', icon: 'figma', tone: 'theme' },
    { id: 'vercel', name: 'Vercel', description: '极速前端全栈托管与边缘计算网络', url: 'https://vercel.com', category: 'dev', icon: 'vercel', tone: 'default' },
    { id: 'notion', name: 'Notion', description: '结构化文档、团队知识库与多维表格', url: 'https://www.notion.so', category: 'dev', icon: 'note', tone: 'default' },
    { id: 'bilibili', name: '哔哩哔哩 / YouTube', description: '优质技术视频教程与全球创意内容', url: 'https://www.bilibili.com', category: 'discover', icon: 'video', tone: 'theme' },
    { id: 'stackoverflow', name: 'Stack Overflow', description: '全球最大的专业软件开发疑难解答社区', url: 'https://stackoverflow.com', category: 'dev', icon: 'quiz', tone: 'theme' },
    { id: 'dribbble', name: 'Dribbble & Behance', description: '全球顶尖数字产品 UI 与插画艺术灵感', url: 'https://dribbble.com', category: 'design', icon: 'palette', tone: 'theme' }
  ];
  // 从分类页返回本地筛选时，使用稳定 ID 初始化，不以显示名判定。
  function initialCategory() {
    const id = typeof window !== 'undefined' ? page.url.searchParams.get('category') : null;
    return destinations.some((category) => category.id === id && !category.href) ? id! : 'recommended';
  }
  let selected = $state(initialCategory());
  let visited = $state<string[]>([]);
  const selectedLabel = $derived(selected === 'recommended' ? copy.nav_recommended() : destinations.find((item) => item.id === selected)?.label);
  const visibleSites = $derived(selected === 'recent'
    ? visited.map((id) => shortcuts.find((site) => site.id === id)!).filter(Boolean)
    : shortcuts.filter((site) => ['recommended', 'discover'].includes(selected) || site.category === selected));

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
          {#if !['recommended', 'discover'].includes(selected)}<h2 class="category-heading">{selectedLabel}</h2>{/if}
          <NavigationCardGrid sites={visibleSites} onvisit={visit} class="home-grid" />
          {#if visibleSites.length === 0}<div class="empty-state"><Icon name="history" size={36} /><h2>{copy.recent_empty()}</h2><p>{copy.recent_hint()}</p><!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (Material 内部原生按钮提供键盘行为) --><md-filled-button onclick={() => selectCategory('recommended')}>{copy.reset_filters()}</md-filled-button></div>{/if}
        </section>
      </div>
</PortalShell>
