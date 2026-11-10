import type { HTMLAttributes } from 'svelte/elements';
import type { MdFilledButton } from '@material/web/button/filled-button.js';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

// 类型导入不执行组件注册；事件 currentTarget 保留具体元素类型。
declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    'md-filled-button': HTMLAttributes<MdFilledButton> & { disabled?: boolean; type?: 'button' | 'submit' | 'reset' };
    'md-outlined-text-field': HTMLAttributes<MdOutlinedTextField> & { label?: string; value?: string; type?: string; disabled?: boolean };
  }
}
export {};
