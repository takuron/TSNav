// 集中维护单语言界面文案，避免组件散落重复字符串。
export const copy = {
  page_title: () => 'TSNav · 好去处，随手可达', page_description: () => '一个简洁、安静的 Material Design 风格网址导航，收藏开发、设计与阅读的好去处。',
  skip_content: () => '跳转到主要内容', home_label: () => 'TSNav 首页', search_label: () => '输入搜索词、技术关键词、或快捷指令…',
  noscript_hint: () => '启用 JavaScript 后可使用搜索和分类；下方站点链接可直接访问。', sites_title: () => '发现好站', category_label: () => '站点分类',
  site_open_label: ({ name }: { name: string }) => `${name}（在新标签页打开）`, reset_filters: () => '查看全部站点', footer_tagline: () => 'TSNav · 你的日常探索起点', footer_credits: () => '精选常用网站，让好去处随手可达',
  search_engines: () => '搜索引擎', search_submit: () => '搜索（在新标签页打开）', sidebar_toggle: () => '收起或展开侧栏', menu_open: () => '打开导航菜单', menu_close: () => '关闭导航菜单',
  local_profile: () => '本地访客', local_profile_hint: () => '无需登录，即刻探索', feedback_label: () => '反馈死链', back_to_top: () => '返回顶部',
  recent_empty: () => '还没有最近访问的网站', recent_hint: () => '从这里打开的站点会暂存在本次页面访问中。', feedback_hint: () => '当前为前端原型，尚未接入反馈服务。可复制站点信息后自行分享。',
  feedback_copy: () => '复制站点信息', feedback_copied: () => '已复制站点信息', feedback_failed: () => '复制失败，请手动复制链接。', feedback_site: () => '选择站点', dialog_close: () => '关闭',
  engine_baidu: () => '百度', engine_sogou: () => '搜狗', nav_recommended: () => '常用推荐', search_clear: () => '清空搜索', search_placeholder: () => '搜索互联网',
 
  search_engine_choose: ({ name }: { name: string }) => `选择搜索引擎，当前为 ${name}`
};
