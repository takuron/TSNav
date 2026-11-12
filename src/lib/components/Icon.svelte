<script lang="ts">
  // 将受信任的本地图标数据渲染为 SSR 可见的内联 SVG，不调用在线 API。
  import { brandColors, icons, localBrandAssets, simpleIconCache, simpleIconCdnUrl, type IconName } from '#lib/icons/index.ts';
  let { name, size = 24, label, class: className = '', brandColor = false }: {
    /** 注册表中的图标名称。 */
    name: IconName;
    /** 图标宽高，默认 24px。 */
    size?: number;
    /** 独立语义图标的本地化名称；省略时视为装饰。 */
    label?: string;
    /** 宿主布局与颜色工具类。 */
    class?: string;
    /** 是否在卡片站点图标中使用 Simple Icons 品牌色；默认跟随主题。 */
    brandColor?: boolean;
  } = $props();
  const icon = $derived(icons[name]);
  const localAsset = $derived(localBrandAssets[name as string] ?? simpleIconCache[name as string]);
  const onlineAsset = $derived(!icon && !localAsset ? simpleIconCdnUrl(name as string) : undefined);
  const iconColor = $derived(brandColor ? brandColors[name as keyof typeof brandColors] : undefined);
</script>

{#if localAsset}<img src={localAsset} width={size} height={size} class={className} alt={label ?? ''} aria-hidden={label ? undefined : 'true'} />{:else if icon}<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${icon.width ?? 24} ${icon.height ?? 24}`} fill="currentColor" class={className} style={`display: inline-block; flex-shrink: 0; vertical-align: middle;${iconColor ? ` color: ${iconColor};` : ''}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'} focusable="false">
  <!-- 仅渲染构建依赖中静态注册的 SVG，不能传入用户输入。 -->
  {@html icon.body}
</svg>{:else if onlineAsset}<img src={onlineAsset} width={size} height={size} class={className} alt={label ?? ''} aria-hidden={label ? undefined : 'true'} />{/if}
