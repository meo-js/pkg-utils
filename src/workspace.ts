import { findWorkspaceDir } from 'pkg-types';

/**
 * 查找传入路径可能的工作区，返回绝对路径
 *
 * 按优先级进行判断：
 * 1. 最远的 workspace 文件（pnpm-workspace.yaml, lerna.json, turbo.json, rush.json）
 * 2. 最近的 .git/config 文件
 * 3. 最远的 lockfile
 * 4. 最远的 package.json 文件
 */
export async function resolveWorkspacePath(path?: string) {
  return await findWorkspaceDir(path);
}
