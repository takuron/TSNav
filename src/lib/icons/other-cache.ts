import baiduTieba from './other/baidu-tieba.svg?raw';
import iqiyi from './other/iqiyi.svg?raw';
import neteaseMail from './other/netease-mail.svg?raw';

/** 构建时内联非 Simple Icons 品牌 SVG；来源为 Iconify Arcticons 开源图标集。 */
export const otherIconCache: Record<string, string> = Object.fromEntries(
  Object.entries({ baiduTieba, iqiyi, neteaseMail })
    .map(([id, svg]) => [id, `data:image/svg+xml,${encodeURIComponent(svg)}`])
);
