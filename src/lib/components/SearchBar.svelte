<script lang="ts">
  // 按 M3 Search 样式提供引擎切换、回车搜索与条件清空，不使用浮动文本标签。
  import { onMount } from 'svelte';
  import type { MdMenu, CloseMenuEvent } from '@material/web/menu/menu.js';
  import { copy } from '#lib/copy.ts';
  import Icon from '#lib/components/Icon.svelte';
  import type { IconName } from '#lib/icons/index.ts';

  const engines: { id: string; name: () => string; icon: IconName; url: string }[] = [
    { id: 'google', name: () => 'Google', icon: 'google', url: 'https://www.google.com/search?q=' },
    { id: 'baidu', name: copy.engine_baidu, icon: 'baidu', url: 'https://www.baidu.com/s?wd=' },
    { id: 'bing', name: () => 'Bing', icon: 'microsoftbing', url: 'https://www.bing.com/search?q=' },
    { id: 'sogou', name: copy.engine_sogou, icon: 'sogou', url: 'https://www.sogou.com/web?query=' },
    { id: 'duckduckgo', name: () => 'DuckDuckGo', icon: 'duckduckgo', url: 'https://duckduckgo.com/?q=' }
  ];

  let query = $state('');
  let engineId = $state(engines[0].id);
  const engine = $derived(engines.find((item) => item.id === engineId) ?? engines[0]);
  let input: HTMLInputElement;
  const id = $props.id();
  let trigger: HTMLButtonElement;
  let menu: MdMenu;
  let menuOpen = $state(false);

  function openMenu(last = false) {
    menu.anchorElement = trigger;
    // 浮层居中对齐按钮，避免 320px 视口中最小菜单宽度阻止自动收缩。
    menu.xOffset = (trigger.getBoundingClientRect().width - 224) / 2;
    menu.defaultFocus = last ? 'last-item' : 'first-item';
    menu.quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    menu.show();
  }
  function toggleMenu() {
    if (menuOpen) menu.close();
    else openMenu();
  }

  function selectEngine(event: CloseMenuEvent, id: string) {
    // 菜单键盘选择由 close-menu 通知，不能只监听不会必然发生的 click。
    const reason = event.detail.reason;
    if (reason.kind === 'click-selection' || (reason.kind === 'keydown' && ['Enter', 'Space'].includes(reason.key))) {
      engineId = id;
    }
  }

  onMount(() => {
    // 宽屏隐藏移动入口后关闭顶层菜单，避免留下失去锚点的浮层。
    const observer = new ResizeObserver(() => {
      if (trigger.getBoundingClientRect().width === 0 && menu.open) menu.close();
    });
    observer.observe(trigger);
    return () => observer.disconnect();
  });


  function search(event: SubmitEvent) {
    event.preventDefault();
    if (query.trim()) window.open(engine.url + encodeURIComponent(query.trim()), '_blank', 'noopener,noreferrer');
  }
  function clear() {
    query = '';
    input.focus();
  }
</script>

<section class="search-panel" aria-label={copy.search_engines()}>
  <div class="engine-tabs" role="group" aria-label={copy.search_engines()}>
    {#each engines as item}
      <button type="button" class="engine-tab" aria-pressed={engine.id === item.id} onclick={() => { engineId = item.id; }}>
        <span class="engine-mark" aria-hidden="true"><Icon name={item.icon} size={16} /></span>{item.name()}
      </button>
    {/each}
  </div>
  <div class="engine-picker">
    <button class="engine-tab engine-trigger" type="button" bind:this={trigger} aria-pressed="true" aria-label={copy.search_engine_choose({ name: engine.name() })} aria-haspopup="menu" aria-expanded={menuOpen} aria-controls={`${id}-engines`} onclick={toggleMenu} onkeydown={(event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu(event.key === 'ArrowUp');
      }
    }}>
      <span class="engine-mark" aria-hidden="true"><Icon name={engine.icon} size={16} /></span>{engine.name()}
    </button>
    <md-menu class="engine-menu" id={`${id}-engines`} bind:this={menu} positioning="popover" anchor-corner="end-start" menu-corner="start-start" y-offset={8} aria-label={copy.search_engines()} onopening={() => { menuOpen = true; }} onclosed={() => { menuOpen = false; }}>
      {#each engines as item}
        <md-menu-item selected={engineId === item.id} aria-current={engineId === item.id ? 'true' : undefined} onclose-menu={(event) => selectEngine(event, item.id)}>
          <span slot="start" class="engine-menu-icon"><Icon name={item.icon} size={16} /></span>
          <span slot="headline">{item.name()}</span>
          {#if engineId === item.id}<span slot="end" class="engine-menu-check"><Icon name="check" size={18} /></span>{/if}
        </md-menu-item>
      {/each}
    </md-menu>
  </div>
  <form class="search-row" role="search" aria-label={copy.search_label()} onsubmit={search}>
    <span class="search-leading"><Icon name="search" size={24} /></span>
    <input class="search-input" bind:this={input} bind:value={query} type="search" aria-label={copy.search_label()} placeholder={copy.search_placeholder()} enterkeyhint="search" autocomplete="off" onkeydown={(event) => { if (event.key === 'Enter' && event.isComposing) event.preventDefault(); }} />
    {#if query.length > 0}
      <button type="button" class="icon-button search-clear" aria-label={copy.search_clear()} title={copy.search_clear()} onclick={clear}><Icon name="close" size={24} /></button>
    {/if}
  </form>
  <noscript><p class="noscript-hint">{copy.noscript_hint()}</p></noscript>
</section>
