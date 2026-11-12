import defaultMaster from '../../../static/api/master.json';
import type { MasterConfig } from '#lib/types/config.ts';

/** 构建时预载默认 master.json，并提供运行时用户配置的路径约定。 */
export class NavigationConfig {
  readonly defaultMaster: MasterConfig = defaultMaster as MasterConfig;

  /** 返回默认配置中指定分类文件的静态 API 路径。 */
  categoryPath(slug: string): string {
    return `/api/${encodeURIComponent(slug)}.json`;
  }

  /** 返回指定用户配置目录中的 master.json 路径。 */
  userMasterPath(uuid: string): string {
    return `/api/user/${encodeURIComponent(uuid)}/master.json`;
  }

  /** 返回指定用户分类文件的路径。 */
  userCategoryPath(uuid: string, slug: string): string {
    return `/api/user/${encodeURIComponent(uuid)}/${encodeURIComponent(slug)}.json`;
  }
}

export const navigationConfig = new NavigationConfig();
