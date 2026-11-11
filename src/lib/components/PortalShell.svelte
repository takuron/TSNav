<script lang="ts">
  // 复用主页与分类页的侧栏、移动抽屉、页脚和设置，内容布局由页面选择。
  import type { Snippet } from 'svelte';
  import { m } from '#lib/paraglide/messages.js';
  import Sidebar from '#lib/components/Sidebar.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import Icon from '#lib/components/Icon.svelte';
  import LanguageSwitcher from '#lib/components/LanguageSwitcher.svelte';
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
  let collapsed = $state(false);
  let settings: HTMLDialogElement;
</script>

<a class="skip-link" href="#content">{m.skip_content()}</a>
<div class="portal" class:collapsed>
  <Sidebar {categories} {selected} {onselect} {collapsed} ontoggle={() => { collapsed = !collapsed; }} onsettings={() => settings.showModal()} />
  <div class="main-wrapper">
    <main id="content" class={variant === 'home' ? 'portal-main' : 'directory-main'}>{@render children()}</main>
    <Footer {sites} />
  </div>
</div>
<dialog class="utility-dialog" bind:this={settings} aria-labelledby="settings-title">
  <div class="dialog-heading"><h2 id="settings-title">{m.settings_label()}</h2><button class="icon-button" type="button" aria-label={m.dialog_close()} onclick={() => settings.close()}><Icon name="close" size={20} /></button></div>
  <p>{m.language_label()}</p><LanguageSwitcher />
</dialog>
