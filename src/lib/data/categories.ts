import type { CategoryPage, CategorySection, NavigationCategory, NavigationSite } from '#lib/types/navigation.ts';

/** 当前静态分类原型；以后用用户配置替换此数据源，显示名称不参与 URL 判定。 */
export const categoryPages: readonly CategoryPage[] = [
  {
    id: 'dev', slug: 'development', label: '开发与云原生', icon: 'terminal',
    title: '开发技术与基础架构', description: '从现代前端框架到云原生基础设施，汇集开发工作中常用的技术与工具。',
    sections: [
      { id: 'frontend', title: '前端与客户端架构', icon: 'devices', children: [
        { id: 'web-frameworks', title: '现代前端生态与框架', sites: [
          { id: 'react', name: 'React', description: '用于构建现代 Web 响应式交互界面的渐进式组件化库。', url: 'https://react.dev', category: 'dev', icon: 'codeBlocks', tone: 'blue' },
          { id: 'vue', name: 'Vue.js', description: '易学易用、性能卓越且全能灵活的渐进式 JavaScript 框架。', url: 'https://vuejs.org', category: 'dev', icon: 'viewQuilt', tone: 'blue' },
          { id: 'nextjs', name: 'Next.js', description: 'Vercel 推出的全栈 React 框架，提供极速 SSR 与服务端组件支持。', url: 'https://nextjs.org', category: 'dev', icon: 'bolt', tone: 'blue' },
          { id: 'svelte', name: 'Svelte', description: '零运行时开销的前端编译器，提供简洁优雅的无虚拟 DOM 架构。', url: 'https://svelte.dev', category: 'dev', icon: 'cycle', tone: 'blue' }
        ] }
      ] },
      { id: 'backend', title: '后端与云原生架构', icon: 'dns', children: [
        { id: 'microservices', title: '微服务与分布式运行时', icon: 'hub', children: [
          { id: 'runtimes', title: '核心语言运行时与微框架', icon: 'code', sites: [
            { id: 'golang', name: 'Golang', description: '具备高并发天生优势的静态类型编译语言，云原生基础工程基石。', url: 'https://go.dev', category: 'dev', icon: 'terminal', tone: 'blue' },
            { id: 'spring', name: 'Spring Boot', description: '企业级 Java 微服务主流开发标准，全自动化配置与生产级支撑。', url: 'https://spring.io/projects/spring-boot', category: 'dev', icon: 'spa', tone: 'blue' },
            { id: 'fastapi', name: 'FastAPI', description: '基于 Python 现代类型提示的高性能 Web 框架，开箱即用 Swagger 文档。', url: 'https://fastapi.tiangolo.com', category: 'dev', icon: 'speed', tone: 'blue' },
            { id: 'nodejs', name: 'Node.js', description: '基于 V8 引擎的高并发异步事件驱动 JavaScript 运行时。', url: 'https://nodejs.org', category: 'dev', icon: 'hexagon', tone: 'blue' }
          ] },
          { id: 'containers', title: '容器化与集群编排调度', sites: [
            { id: 'kubernetes', name: 'Kubernetes', description: '生产级自动化容器编排管理系统，支持大规模集群部署与自愈伸缩。', url: 'https://kubernetes.io', category: 'dev', icon: 'anchor', tone: 'blue' },
            { id: 'docker', name: 'Docker', description: '行业事实标准的应用程序容器化打包与轻量级环境隔离方案。', url: 'https://www.docker.com', category: 'dev', icon: 'deployedCode', tone: 'blue' },
            { id: 'terraform', name: 'Terraform', description: '声明式基础设施即代码（IaC）平台，安全可靠地编排多云资源。', url: 'https://developer.hashicorp.com/terraform', category: 'dev', icon: 'accountTree', tone: 'blue' },
            { id: 'istio', name: 'Istio', description: '开源服务网格层，提供分布式微服务流量调度、双向 TLS 与全景监控。', url: 'https://istio.io', category: 'dev', icon: 'hub', tone: 'blue' }
          ] }
        ] }
      ] },
      { id: 'devops', title: 'DevOps 与研发效能', sites: [
        { id: 'github-actions', name: 'GitHub Actions', description: '开箱即用的代码仓库持续集成与自动化流水线分发平台。', url: 'https://github.com/features/actions', category: 'dev', icon: 'terminal', tone: 'blue' },
        { id: 'gitlab', name: 'GitLab', description: '覆盖项目规划、代码管理与安全治理的全生命周期 DevSecOps 平台。', url: 'https://gitlab.com', category: 'dev', icon: 'sourceNotes', tone: 'blue' },
        { id: 'sentry', name: 'Sentry', description: '面向全栈应用的代码级实时异常捕获与性能追踪观测平台。', url: 'https://sentry.io', category: 'dev', icon: 'bugReport', tone: 'blue' },
        { id: 'postman', name: 'Postman', description: '行业通用的 API 协作平台，简化接口设计、Mock 模拟与自动化测试。', url: 'https://www.postman.com', category: 'dev', icon: 'api', tone: 'blue' }
      ] }
    ]
  }
];

/** 按 URL 中已解码的 slug 精确查找，支持中文；不按显示名猜测或回退到其他分类；pages 可传入后续用户配置。 */
export function findCategoryBySlug(slug: string, pages: readonly CategoryPage[] = categoryPages): CategoryPage | undefined {
  return pages.find((category) => category.slug === slug);
}

/** 按稳定分类 ID 生成路由，编码可定制 slug；未配置独立页时返回 undefined；pages 默认使用静态原型配置。 */
export function categoryPath(id: string, pages: readonly CategoryPage[] = categoryPages): string | undefined {
  const category = pages.find((item) => item.id === id);
  return category ? `/category/${encodeURIComponent(category.slug)}` : undefined;
}

/** 侧栏静态配置；目录页入口从分类页面配置生成，名称和路由可独立修改。 */
export const navigationCategories: readonly NavigationCategory[] = [
  { id: 'discover', label: '发现库与分类', icon: 'gridView' },
  { id: 'ai', label: '人工智能与前沿', icon: 'sparkles' },
  ...categoryPages.map(({ id, label, icon }) => ({ id, label, icon, href: categoryPath(id) })),
  { id: 'design', label: '设计与视觉灵感', icon: 'palette' },
  { id: 'recent', label: '历史与最近访问', icon: 'history' }
];

/** 按展示顺序收集各级分组站点，用于页脚反馈等通用功能。 */
export function collectCategorySites(sections: readonly CategorySection[]): NavigationSite[] {
  return sections.flatMap((section) => [...(section.sites ?? []), ...collectCategorySites(section.children ?? [])]);
}
