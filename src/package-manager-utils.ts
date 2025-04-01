import { prune } from "@meojs/utils";
import { detect, getUserAgent } from "package-manager-detector";
import { cwd } from "process";

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
 * - `package.json` 中的 `packageManager` 字段
 * - `lock` 文件
 *
 * 当前支持的包管理器类型：{@link PackageManagerType}
 *
 * @param path 默认为 {@link cwd()}
 */
export async function detectPackageManager(
    path?: string,
): Promise<{ type: PackageManagerType; version?: string } | null> {
    const result = await detect({
        cwd: path ?? cwd(),
        onUnknown: pkg => ({
            name: "unknown" as never,
            agent: "unknown" as never,
        }),
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
        return prune({
            type,
            version: result.version,
        });
    } else {
        return {
            type: PackageManagerType.None,
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
