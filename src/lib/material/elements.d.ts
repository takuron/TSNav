import type { HTMLAttributes } from 'svelte/elements';
import type { MdMenu, CloseMenuEvent } from '@material/web/menu/menu.js';
import type { MdMenuItem } from '@material/web/menu/menu-item.js';
import type { MdFilledButton } from '@material/web/button/filled-button.js';

// 类型导入不执行组件注册；事件 currentTarget 保留具体元素类型。
declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    'md-menu': HTMLAttributes<MdMenu> & {
      positioning?: MdMenu['positioning'];
      'anchor-corner'?: MdMenu['anchorCorner'];
      'menu-corner'?: MdMenu['menuCorner'];
      'y-offset'?: number;
      onopening?: (event: Event) => void;
      onclosed?: (event: Event) => void;
    };
    'md-menu-item': HTMLAttributes<MdMenuItem> & { selected?: boolean; 'onclose-menu'?: (event: CloseMenuEvent) => void };

    'md-filled-button': HTMLAttributes<MdFilledButton> & { disabled?: boolean; type?: 'button' | 'submit' | 'reset' };
  }
}
export {};
