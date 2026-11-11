<script lang="ts">
  // 展示通用页脚，管理本地反馈原型与返回顶部行为。
  import { copy } from '#lib/copy.ts';
  import Icon from '#lib/components/Icon.svelte';
  import type { NavigationSite } from '#lib/types/navigation.ts';

  let { sites }: {
    /** 可供反馈选择的站点；为空时禁用反馈入口。 */
    sites: readonly NavigationSite[];
  } = $props();
  let feedback: HTMLDialogElement;
  let reportSite = $state('');
  let copyStatus = $state('');
  async function copyReport() {
    const site = sites.find((item) => item.id === reportSite)!;
    try {
      await navigator.clipboard.writeText(`${site.name}\n${site.url}`);
      copyStatus = copy.feedback_copied();
    } catch {
      copyStatus = copy.feedback_failed();
    }
  }
  function backToTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
</script>

    <footer class="portal-footer">
      <div><p class="footer-title">{copy.footer_tagline()}</p><p>{copy.footer_credits()}</p></div>
      <div class="footer-actions"><button class="feedback-button" type="button" disabled={sites.length === 0} onclick={() => { reportSite = sites[0]?.id ?? ''; copyStatus = ''; feedback.showModal(); }}><Icon name="feedback" size={16} />{copy.feedback_label()}</button><button class="icon-button" type="button" aria-label={copy.back_to_top()} title={copy.back_to_top()} onclick={backToTop}><Icon name="arrowUp" size={20} /></button></div>
    </footer>
<dialog class="utility-dialog" bind:this={feedback} aria-labelledby="feedback-title">
  <div class="dialog-heading"><h2 id="feedback-title">{copy.feedback_label()}</h2><button class="icon-button" type="button" aria-label={copy.dialog_close()} onclick={() => feedback.close()}><Icon name="close" size={20} /></button></div>
  <p>{copy.feedback_hint()}</p><label class="report-label" for="report-site">{copy.feedback_site()}</label>
  <select id="report-site" bind:value={reportSite} onchange={() => { copyStatus = ''; }}>{#each sites as site}<option value={site.id}>{site.name}</option>{/each}</select>
  <p class="report-url">{sites.find((site) => site.id === reportSite)?.url}</p>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (Material 内部原生按钮提供键盘行为) -->
  <md-filled-button onclick={copyReport}>{copy.feedback_copy()}</md-filled-button><p role="status">{copyStatus}</p>
</dialog>
