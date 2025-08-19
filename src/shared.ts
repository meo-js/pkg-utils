import type { detectPackageManager } from './package-manager.js';
import type { resolveWorkspacePath } from './workspace.js';

/**
 * 查找选项
 */
export interface ResolveOptions {
  /**
   * 传入一个正则表达式，匹配的路径段将成为查找的根目录，不会再向上查找
   *
   * @default /^node_modules$/
   */
  rootPattern?: RegExp;

  /**
   * 是否从根目录向子目录查找
   *
   * 注意：
   * - {@link detectPackageManager} 会忽略该选项
   * - {@link resolveWorkspacePath} 会忽略该选项
   *
   * @default false
   */
  startFromRoot?: boolean;
}

/**
 * @internal
 */
export function parseResolveOptions(opts?: ResolveOptions) {
  return {
    rootPattern: opts?.rootPattern ?? /^node_modules$/u,
    startFromRoot: opts?.startFromRoot ?? false,
  };
}
