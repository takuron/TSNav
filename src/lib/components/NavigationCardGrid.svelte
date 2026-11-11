<script lang="ts">
  // 根据卡片区域的实际宽度排布统一卡片，主页与分类页共用列数规则。
  import NavigationCard from '#lib/components/NavigationCard.svelte';
  import type { NavigationSite } from '#lib/types/navigation.ts';

  let { sites, headingLevel = 2, onvisit, class: className = '', flow = false }: {
    /** 当前分组展示的只读站点集合。 */
    sites: readonly NavigationSite[];
    /** 卡片标题层级，默认 h2。 */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** 可选的页面内访问记录回调。 */
    onvisit?: (id: string) => void;
    /** 容器的布局类，默认空；用于目录层级缩进。 */
    class?: string;
    /** 卡片达到五张时启用按最小卡片宽度自动流式换列。 */
    flow?: boolean;
  } = $props();
</script>

<div class="navigation-card-region {className}" class:flow-grid={flow}>
  <div class="navigation-card-grid">
    {#each sites as site (site.id)}
      <NavigationCard {site} {headingLevel} {onvisit} />
    {/each}
  </div>
</div>
