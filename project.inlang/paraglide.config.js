// 编译命令和 Vite 共用配置，避免检查与生产构建使用不同的语言策略。
export default {
  outdir: './src/lib/paraglide',
  emitTsDeclarations: true,
  strategy: ['cookie', 'baseLocale'],
  cookieName: 'tsnav_locale'
};
