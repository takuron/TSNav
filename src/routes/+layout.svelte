<script lang="ts">
  // 根布局统一引入全局主题；所有路由在构建时预渲染为静态 HTML。
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <meta name="generator" content="SvelteKit SSG" />
</svelte:head>

{@render children()}
