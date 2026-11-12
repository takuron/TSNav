<script lang="ts">
  // 统一展示主页和分类目录的站点卡片，保持原生外链行为和正确标题层级。
  import { copy } from '#lib/copy.ts';
  import Icon from '#lib/components/Icon.svelte';
  import type { NavigationSite } from '#lib/types/navigation.ts';

  let { site, onvisit, headingLevel = 2 }: {
    /** 站点名称、描述、链接及图标等静态内容。 */
    site: NavigationSite;
    /** 可选的访问回调，不拦截链接的原生行为。 */
    onvisit?: (id: string) => void;
    /** 按目录深度指定语义标题层级，默认 h2。 */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
  } = $props();
</script>

<a class="site-card" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={copy.site_open_label({ name: site.name })} onclick={() => onvisit?.(site.id)}>
  <div class="card-top">
    <span class="site-icon"><Icon name={site.icon} size={26} brandColor /></span>
    <span class="card-arrow"><Icon name="openInNew" size={18} /></span>
  </div>
  <div class="card-copy">
    <svelte:element this={`h${headingLevel}`} class="card-title">{site.name}{#if site.badge}<span class="site-badge">{site.badge}</span>{/if}</svelte:element>
    <p title={site.description}>{site.description}</p>
  </div>
</a>
