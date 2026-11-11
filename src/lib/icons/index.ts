import search from '@iconify-icons/material-symbols/search-rounded';
import openInNew from '@iconify-icons/material-symbols/open-in-new-rounded';
import menu from '@iconify-icons/material-symbols/menu-rounded';
import close from '@iconify-icons/material-symbols/close-rounded';
import home from '@iconify-icons/material-symbols/home-rounded';
import settings from '@iconify-icons/material-symbols/settings-rounded';
import lightMode from '@iconify-icons/material-symbols/light-mode-rounded';
import darkMode from '@iconify-icons/material-symbols/dark-mode-rounded';
import language from '@iconify-icons/material-symbols/language-rounded';
import favorite from '@iconify-icons/material-symbols/favorite-rounded';
import folder from '@iconify-icons/material-symbols/folder-rounded';
import link from '@iconify-icons/material-symbols/link-rounded';
import github from '@iconify-icons/simple-icons/github';
import svelte from '@iconify-icons/simple-icons/svelte';
import cloudflare from '@iconify-icons/simple-icons/cloudflare';
import materialdesign from '@iconify-icons/simple-icons/materialdesign';
import figma from '@iconify-icons/simple-icons/figma';
import mdnwebdocs from '@iconify-icons/simple-icons/mdnwebdocs';
import google from '@iconify-icons/simple-icons/google';
import youtube from '@iconify-icons/simple-icons/youtube';
import wikipedia from '@iconify-icons/simple-icons/wikipedia';
import stackoverflow from '@iconify-icons/simple-icons/stackoverflow';

/** Google Material Symbols Rounded：仅静态导入项目需要的官方图形。 */
export const materialIcons = { search, openInNew, menu, close, home, settings, lightMode, darkMode, language, favorite, folder, link };

/** Simple Icons 品牌图形，统一单色并继承主题颜色。 */
export const brandIcons = { github, svelte, cloudflare, materialdesign, figma, mdnwebdocs, google, youtube, wikipedia, stackoverflow };

/** 项目允许使用的图标注册表；禁止接收外部 SVG 内容。 */
export const icons = { ...materialIcons, ...brandIcons };

/** 类型安全的内置图标名称。 */
export type IconName = keyof typeof icons;
