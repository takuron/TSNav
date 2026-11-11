<script lang="ts">
  // 展示一张静态站点卡片，并通知页面记录访问。
  import { m } from '#lib/paraglide/messages.js';
  import Icon from '#lib/components/Icon.svelte';
  import type { NavigationSite } from '#lib/types/navigation.ts';

  let { site, onvisit }: {
    /** 站点名称、描述、链接及图标等静态内容。 */
    site: NavigationSite;
    /** 可选的访问回调，不拦截链接的原生行为。 */
    onvisit?: (id: string) => void;
  } = $props();
</script>

              <a class="site-card" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={m.site_open_label({ name: site.name })} onclick={() => onvisit?.(site.id)}>
                <div class="card-top"><span class="site-icon {site.tone}"><Icon name={site.icon} size={26} /></span><span class="card-arrow"><Icon name="openInNew" size={18} /></span></div>
                <div class="card-copy"><h2>{site.name}{#if site.badge}<span class="site-badge">{site.badge}</span>{/if}</h2><p title={site.description}>{site.description}</p></div>
              </a>
