import check from '@iconify-icons/material-symbols/check-rounded';
import baidu from '@iconify-icons/simple-icons/baidu';
import microsoftbing from '@iconify-icons/simple-icons/microsoftbing';
import sogou from '@iconify-icons/simple-icons/sogou';
import duckduckgo from '@iconify-icons/simple-icons/duckduckgo';
import star from '@iconify-icons/material-symbols/star-rounded';
import gridView from '@iconify-icons/material-symbols/grid-view-rounded';
import sparkles from '@iconify-icons/material-symbols/auto-awesome-rounded';
import terminal from '@iconify-icons/material-symbols/terminal-rounded';
import palette from '@iconify-icons/material-symbols/palette-rounded';
import history from '@iconify-icons/material-symbols/schedule-rounded';
import collapse from '@iconify-icons/material-symbols/dock-to-right-rounded';
import psychology from '@iconify-icons/material-symbols/psychology-rounded';
import note from '@iconify-icons/material-symbols/sticky-note-2-rounded';
import video from '@iconify-icons/material-symbols/smart-display-rounded';
import quiz from '@iconify-icons/material-symbols/quiz-rounded';
import arrowUp from '@iconify-icons/material-symbols/arrow-upward-rounded';
import feedback from '@iconify-icons/material-symbols/feedback-rounded';
import explore from '@iconify-icons/material-symbols/explore-rounded';
import vercel from '@iconify-icons/simple-icons/vercel';
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
export const materialIcons = { check, search, openInNew, menu, close, home, settings, lightMode, darkMode, language, favorite, folder, link, star, gridView, sparkles, terminal, palette, history, collapse, psychology, note, video, quiz, arrowUp, feedback, explore };

/** Simple Icons 品牌图形，统一单色并继承主题颜色。 */
export const brandIcons = { github, svelte, cloudflare, materialdesign, figma, mdnwebdocs, google, youtube, wikipedia, stackoverflow, vercel, baidu, microsoftbing, sogou, duckduckgo };

/** 项目允许使用的图标注册表；禁止接收外部 SVG 内容。 */
export const icons = { ...materialIcons, ...brandIcons };

/** 类型安全的内置图标名称。 */
export type IconName = keyof typeof icons;
