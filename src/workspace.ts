import { parseYAML } from 'confbox';
import { join } from 'path';
import { findWorkspaceDir } from 'pkg-types';

export type WorkspaceType =
  | 'npm'
  | 'pnpm'
  | 'yarn'
  | 'bun'
  | 'lerna'
  | 'nx'
  | 'rush'
  | 'turbo'
  | 'deno';

export interface WorkspaceConfig {
  type: WorkspaceType;
  rootDir: string;
  configPath: string;
  packages: string[];
  config: unknown;
}

/**
 * 查找传入路径可能的工作区，返回绝对路径
 *
 * 按优先级进行判断：
 * 1. 最远的 workspace 文件（pnpm-workspace.yaml, lerna.json, turbo.json, rush.json）
 * 2. 最近的 .git/config 文件
 * 3. 最远的 lockfile
 * 4. 最远的 package.json 文件
 */
export async function resolveWorkspacePath(
  path?: string,
): Promise<WorkspaceConfig> {
  // TODO: wait for https://github.com/unjs/pkg-types/pull/247
  const dir = await findWorkspaceDir(path);
  const obj = parseYAML<{ packages: string[] }>(
    join(dir, 'pnpm-workspace.yaml'),
  );
  return {
    type: 'pnpm',
    rootDir: dir,
    configPath: join(dir, 'pnpm-workspace.yaml'),
    packages: obj.packages,
    config: obj,
  };
}
