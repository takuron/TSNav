<script lang="ts">
  // 复用主页与分类页的侧栏、移动抽屉、页脚和设置，内容布局由页面选择。
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import { copy } from '#lib/copy.ts';
  import Sidebar from '#lib/components/Sidebar.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import type { NavigationCategory, NavigationSite } from '#lib/types/navigation.ts';

  let { categories, selected, onselect, sites, variant = 'home', children }: {
    /** 当前侧栏分类配置。 */
    categories: readonly NavigationCategory[];
    /** 当前页面或筛选的稳定分类 ID。 */
    selected: string;
    /** 分类入口由页面决定路由或本地筛选行为。 */
    onselect: (id: string) => void;
    /** 页脚可反馈的站点。 */
    sites: readonly NavigationSite[];
    /** home 保持居中，directory 使用顶部对齐的目录布局。 */
    variant?: 'home' | 'directory';
    /** 页面主内容。 */
    children: Snippet;
  } = $props();
  const sidebarPreferenceKey = 'tsnav.sidebar.collapsed';
  let collapsed = $state(true);

  onMount(() => {
    const saved = localStorage.getItem(sidebarPreferenceKey);
    if (saved === 'false') collapsed = false;
    if (saved === 'true') collapsed = true;
  });

  function toggleSidebar() {
    collapsed = !collapsed;
    localStorage.setItem(sidebarPreferenceKey, String(collapsed));
  }
</script>

<a class="skip-link" href="#content">{copy.skip_content()}</a>
<div class="portal" class:collapsed>
  <Sidebar {categories} {selected} {onselect} {collapsed} ontoggle={toggleSidebar} />
  <div class="main-wrapper">
    <main id="content" class={variant === 'home' ? 'portal-main' : 'directory-main'}>{@render children()}</main>
    <Footer {sites} />
  </div>
</div>
