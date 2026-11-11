<script lang="ts">
  // 统一管理固定推荐入口、可定制分类、桌面侧栏与移动端模态抽屉。
  import { tick } from 'svelte';
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
  let closing = $state(false);

  async function closeDrawer(afterClose?: () => void) {
    if (!drawer?.open) {
      afterClose?.();
      return;
    }
    if (closing) return;
    // 从当前可见位置退场，展开途中关闭也不会跳回完全展开的位置。
    const panel = drawer.querySelector<HTMLElement>('.drawer-panel')!;
    drawer.style.setProperty('--drawer-exit-transform', getComputedStyle(panel).transform);
    drawer.style.setProperty('--drawer-exit-opacity', getComputedStyle(drawer, '::backdrop').opacity);
    closing = true;
    await tick();
    const animations = drawer.getAnimations({ subtree: true }).filter((animation) =>
      animation instanceof CSSAnimation && ['drawer-panel-exit', 'drawer-scrim-exit'].includes(animation.animationName)
    );
    await Promise.allSettled(animations.map((animation) => animation.finished));
    if (!drawer.isConnected) return;
    drawer.close();
    closing = false;
    afterClose?.();
  }


  function selectCategory(id: string) {
    void closeDrawer(() => onselect(id));
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
    <button class="icon-button settings-button" type="button" aria-label={m.settings_label()} title={m.settings_label()} onclick={() => { void closeDrawer(onsettings); }}><Icon name="settings" size={20} /></button>
  </div>
{/snippet}

  <aside class="sidebar">
    <div><div class="sidebar-heading">{@render brand()}<button class="icon-button collapse-button" type="button" aria-label={m.sidebar_toggle()} aria-expanded={!collapsed} onclick={() => { ontoggle(); }}><Icon name={collapsed ? 'menu' : 'collapse'} size={20} /></button></div>{@render navigation()}</div>
    {@render profile()}
  </aside>
  <header class="mobile-header">
    <button class="icon-button" type="button" aria-label={m.menu_open()} onclick={() => drawer.showModal()}><Icon name="menu" /></button>
  </header>
<dialog class="mobile-drawer" class:closing bind:this={drawer} aria-label={m.category_label()} oncancel={(event) => { event.preventDefault(); void closeDrawer(); }}>
  <div class="drawer-panel">
    <div class="sidebar-heading">{@render brand()}<button type="button" class="icon-button" aria-label={m.menu_close()} onclick={() => { void closeDrawer(); }}><Icon name="close" size={20} /></button></div>
    {@render navigation()}<div class="drawer-profile">{@render profile()}</div>
  </div>
  <button type="button" class="drawer-backdrop" aria-label={m.menu_close()} onclick={() => { void closeDrawer(); }}></button>
</dialog>
