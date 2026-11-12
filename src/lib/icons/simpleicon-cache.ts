import bilibili from './simpleicon/bilibili.svg?raw';
import deepseek from './simpleicon/deepseek.svg?raw';
import github from './simpleicon/github.svg?raw';
import neteasecloudmusic from './simpleicon/neteasecloudmusic.svg?raw';
import qq from './simpleicon/qq.svg?raw';
import zhihu from './simpleicon/zhihu.svg?raw';
import weibo from './simpleicon/sinaweibo.svg?raw';

/** 构建时内联的常见 Simple Icons；不依赖 npm 图标注册表。 */
export const simpleIconCache: Record<string, string> = Object.fromEntries(
  Object.entries({ bilibili, deepseek, github, neteasecloudmusic, qq, zhihu, sinaweibo: weibo })
    .map(([id, svg]) => [id, `data:image/svg+xml,${encodeURIComponent(svg)}`])
);
