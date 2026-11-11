<script lang="ts">
  // 根据分类配置递归展示多级目录；名称、说明与站点内容均为静态可定制数据。
  import { goto } from '$app/navigation';
  import PortalShell from '#lib/components/PortalShell.svelte';
  import NavigationCardGrid from '#lib/components/NavigationCardGrid.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import { navigationCategories, categoryPath, collectCategorySites } from '#lib/data/categories.ts';
  import type { CategoryPage, CategorySection } from '#lib/types/navigation.ts';

  let { data }: { data: { category: CategoryPage } } = $props();
  const sites = $derived(collectCategorySites(data.category.sections));

  function selectCategory(id: string) {
    const path = categoryPath(id);
    if (path) {
      if (id !== data.category.id) void goto(path);
    } else {
      void goto(id === 'recommended' ? '/' : `/?category=${encodeURIComponent(id)}`);
    }
  }
</script>

<svelte:head>
  <title>{data.category.title} · TSNav</title>
  <meta name="description" content={data.category.description} />
</svelte:head>

{#snippet sectionTree(section: CategorySection, level: number)}
  <section class="directory-section level-{Math.min(level, 4)}" aria-labelledby={`section-${section.id}`}>
    <div class="directory-heading">
      {#if section.icon}<Icon name={section.icon} size={level === 2 ? 26 : level === 3 ? 20 : 18} />{:else}<span class="directory-bullet" aria-hidden="true"></span>{/if}
      <svelte:element this={`h${Math.min(level, 6)}`} id={`section-${section.id}`}>{section.title}</svelte:element>
    </div>
    {#if section.sites?.length}
      <NavigationCardGrid sites={section.sites} class="directory-grid" headingLevel={Math.min(level + 1, 6) as 3 | 4 | 5 | 6} />
    {/if}
    {#if section.children?.length}
      <div class="directory-children">
        {#each section.children as child (child.id)}{@render sectionTree(child, level + 1)}{/each}
      </div>
    {/if}
  </section>
{/snippet}

<PortalShell categories={navigationCategories} selected={data.category.id} onselect={selectCategory} {sites} variant="directory">
  <div class="category-directory">
    <header class="directory-title"><span aria-hidden="true"></span><h1>{data.category.title}</h1></header>
    {#each data.category.sections as section (section.id)}{@render sectionTree(section, 2)}{/each}
  </div>
</PortalShell>
