import devices from '@iconify-icons/material-symbols/devices-rounded';
import dns from '@iconify-icons/material-symbols/dns-rounded';
import hub from '@iconify-icons/material-symbols/hub-rounded';
import code from '@iconify-icons/material-symbols/code-rounded';
import codeBlocks from '@iconify-icons/material-symbols/code-blocks-rounded';
import viewQuilt from '@iconify-icons/material-symbols/view-quilt-rounded';
import bolt from '@iconify-icons/material-symbols/bolt-rounded';
import cycle from '@iconify-icons/material-symbols/cycle-rounded';
import spa from '@iconify-icons/material-symbols/spa-rounded';
import speed from '@iconify-icons/material-symbols/speed-rounded';
import hexagon from '@iconify-icons/material-symbols/hexagon-rounded';
import anchor from '@iconify-icons/material-symbols/anchor-rounded';
import deployedCode from '@iconify-icons/material-symbols/deployed-code-rounded';
import accountTree from '@iconify-icons/material-symbols/account-tree-rounded';
import sourceNotes from '@iconify-icons/material-symbols/source-notes-rounded';
import bugReport from '@iconify-icons/material-symbols/bug-report-rounded';
import api from '@iconify-icons/material-symbols/api-rounded';
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
export const materialIcons = { devices, dns, hub, code, codeBlocks, viewQuilt, bolt, cycle, spa, speed, hexagon, anchor, deployedCode, accountTree, sourceNotes, bugReport, api, check, search, openInNew, menu, close, home, settings, lightMode, darkMode, language, favorite, folder, link, star, gridView, sparkles, terminal, palette, history, collapse, psychology, note, video, quiz, arrowUp, feedback, explore };

/** Simple Icons 品牌图形，统一单色并继承主题颜色。 */
export const brandIcons = { github, svelte, cloudflare, materialdesign, figma, mdnwebdocs, google, youtube, wikipedia, stackoverflow, vercel, baidu, microsoftbing, sogou, duckduckgo };

/** Simple Icons 官方品牌色；未登记品牌继续继承页面主题色。 */
export const brandColors: Partial<Record<keyof typeof brandIcons, string>> = {
  github: '#181717', svelte: '#FF3E00', cloudflare: '#F38020', materialdesign: '#757575', figma: '#F24E1E', mdnwebdocs: '#000000', google: '#4285F4', youtube: '#FF0000', wikipedia: '#000000', stackoverflow: '#F58025', vercel: '#000000', baidu: '#2932E1', microsoftbing: '#008373', sogou: '#FF6700', duckduckgo: '#DE5833'
};

/** 项目允许使用的图标注册表；禁止接收外部 SVG 内容。 */
export const icons = { ...materialIcons, ...brandIcons };

/** 类型安全的内置图标名称。 */
export type IconName = keyof typeof icons;

/** 图标来源标记；Material 和项目登记的常用 Simple Icons 永远从本地缓存读取。 */
export type IconSource = 'material-local' | 'simple-local' | 'simple-online' | 'image-online';

/** 根据配置 URI 判断图标缓存来源；在线来源只作为后续受控加载的标记。 */
export function iconSource(value: string): IconSource {
  if (value.startsWith('md://')) return 'material-local';
  if (value.startsWith('icon://')) return Object.prototype.hasOwnProperty.call(brandIcons, value.slice(7)) ? 'simple-local' : 'simple-online';
  return value.startsWith('https://') ? 'image-online' : 'image-online';
}
