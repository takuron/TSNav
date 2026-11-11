<script lang="ts">
  // 统一管理固定推荐入口、可定制分类、桌面侧栏与移动端模态抽屉。
  import { m } from '#lib/paraglide/messages.js';
  import Icon from '#lib/components/Icon.svelte';
  import type { NavigationCategory } from '#lib/types/navigation.ts';

  let { categories, selected, collapsed = false, onselect, ontoggle, onsettings }: {
    /** 页面传入的可定制分类，不包含固定推荐入口。 */
    categories: readonly NavigationCategory[];
    /** 当前分类的稳定 ID。 */
    selected: string;
    /** 桌面侧栏是否折叠，默认展开。 */
    collapsed?: boolean;
    /** 选择分类后通知页面。 */
    onselect: (id: string) => void;
    /** 请求切换桌面折叠状态。 */
    ontoggle: () => void;
    /** 请求打开界面设置。 */
    onsettings: () => void;
  } = $props();
  let drawer: HTMLDialogElement;

  function selectCategory(id: string) {
    onselect(id);
    drawer?.close();
  }
</script>

{#snippet brand()}
  <a href="/" class="brand" aria-label={m.home_label()}>
    <img src="/favicon.svg" width="36" height="36" alt="" />
    <span class="sidebar-text">TSNav</span>
  </a>
{/snippet}
{#snippet navigation()}
  <nav class="destination-list" aria-label={m.category_label()}>
    {#each [{ id: 'recommended', label: m.nav_recommended(), icon: 'star' as const }, ...categories] as item}
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
    <button class="icon-button settings-button" type="button" aria-label={m.settings_label()} title={m.settings_label()} onclick={() => { drawer?.close(); onsettings(); }}><Icon name="settings" size={20} /></button>
  </div>
{/snippet}

  <aside class="sidebar">
    <div><div class="sidebar-heading">{@render brand()}<button class="icon-button collapse-button" type="button" aria-label={m.sidebar_toggle()} aria-expanded={!collapsed} onclick={() => { ontoggle(); }}><Icon name={collapsed ? 'menu' : 'collapse'} size={20} /></button></div>{@render navigation()}</div>
    {@render profile()}
  </aside>
  <header class="mobile-header">
    <button class="icon-button" type="button" aria-label={m.menu_open()} onclick={() => drawer.showModal()}><Icon name="menu" /></button>
  </header>
<dialog class="mobile-drawer" bind:this={drawer} aria-label={m.category_label()}>
  <div class="sidebar-heading">{@render brand()}<button type="button" class="icon-button" aria-label={m.menu_close()} onclick={() => drawer.close()}><Icon name="close" size={20} /></button></div>
  {@render navigation()}<div class="drawer-profile">{@render profile()}</div>
  <form method="dialog"><button class="drawer-backdrop" aria-label={m.menu_close()}></button></form>
</dialog>
