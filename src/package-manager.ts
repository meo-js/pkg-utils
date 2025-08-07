import { prune } from "@meojs/std/object";
import type { checked } from "@meojs/std/ts";
import { detect, getUserAgent } from "package-manager-detector";
import { cwd } from "process";
import { parseResolveOptions, type ResolveOptions } from "./shared.js";

/**
 * 包管理器类型
 */
export enum PackageManagerType {
    // sync from package-manager-detector's Agent.
    None = "none",
    Unknown = "unknown",
    Npm = "npm",
    Yarn = "yarn",
    Pnpm = "pnpm",
    Bun = "bun",
    Deno = "deno",
}

/**
 * 检测项目使用的包管理器
 *
 * 按优先级进行判断：
 * 1. 包管理器添加的安装元数据
 * 2. 包管理器的 `lockfile` 文件
 * 3. `package.json` 中的 `packageManager` 字段
 * 4. `package.json` 中的 `devEngines.packageManager` 字段
 *
 * 当前支持的包管理器类型：{@link PackageManagerType}
 *
 * @param path 默认为 {@link cwd()}
 * @param opts {@link ResolveOptions}
 */
export async function detectPackageManager(
    path?: string,
    opts?: ResolveOptions,
): Promise<{ type: PackageManagerType; cmd: string; version?: string }> {
    const { rootPattern } = parseResolveOptions(opts);

    const result = await detect({
        cwd: path ?? cwd(),
        onUnknown: pkg => ({
            name: "unknown" as checked,
            agent: "unknown" as checked,
        }),
        stopDir: (currentDir: string) => rootPattern.test(currentDir),
    });

    if (result) {
        let type = PackageManagerType.Unknown;
        switch (result.agent) {
            case "pnpm@6":
                type = PackageManagerType.Pnpm;
                break;
            case "yarn@berry":
                type = PackageManagerType.Yarn;
                break;

            default:
                type = result.agent as PackageManagerType;
                break;
        }

        const cmd =
            type === PackageManagerType.Unknown
            || type === PackageManagerType.None
                ? "npm"
                : type;

        return prune({
            type,
            cmd,
            version: result.version,
        });
    } else {
        return {
            type: PackageManagerType.None,
            cmd: "npm",
        };
    }
}

/**
 * 检查当前进程使用的包管理器
 *
 * 通过 `process.env.npm_config_user_agent` 进行判断。
 */
export function detectProcessPackageManager(): PackageManagerType {
    const agent = getUserAgent();
    if (agent) {
        return agent as PackageManagerType;
    } else {
        return PackageManagerType.None;
    }
}
