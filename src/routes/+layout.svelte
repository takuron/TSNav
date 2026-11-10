<script lang="ts">
  // 根布局统一引入全局主题，页面内容继续使用服务端渲染。
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}
