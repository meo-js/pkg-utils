import { resolve } from "path";
import {
    readTSConfig as pkg_readTSConfig,
    resolveTSConfig as pkg_resolveTSConfig,
    writeTSConfig as pkg_writeTSConfig,
    type TSConfig as pkg_TsConfig,
} from "pkg-types";
import { cwd } from "process";
import type * as tf from "type-fest";
import { parseResolveOptions, type ResolveOptions } from "./shared.js";

/**
 * `tsconfig.json` 类型
 */
export type TsConfigJson = tf.TsConfigJson;

/**
 * `tsconfig.json` 修改函数
 */
export type TsConfigModifier = (obj: TsConfigJson) => TsConfigJson;

/**
 * 查找并读取离传入路径最近的 `tsconfig.json` 文件
 *
 * @param path 默认为 {@link cwd()}
 * @param opts {@link ResolveOptions}
 * @throws
 */
export async function readTsConfig(path?: string, opts?: ResolveOptions) {
    return (await pkg_readTSConfig(resolve(cwd(), path ?? ""), {
        ...parseResolveOptions(opts),
        cache: false,
        try: false,
    })) as TsConfigJson;
}

/**
 * 查找离传入路径最近的 `tsconfig.json` 文件，返回绝对路径
 *
 * @param path 默认为 {@link cwd()}
 * @param opts {@link ResolveOptions}
 * @throws
 */
export async function resolveTsConfigPath(
    path?: string,
    opts?: ResolveOptions,
) {
    return await pkg_resolveTSConfig(resolve(cwd(), path ?? ""), {
        ...parseResolveOptions(opts),
        cache: false,
        try: false,
    });
}

/**
 * 写入离传入路径最近的 `tsconfig.json` 文件
 *
 * @param path 路径
 * @param obj {@link TsConfigJson} | {@link TsConfigModifier}
 * @param opts {@link ResolveOptions}
 * @throws
 */
export async function writeTsConfig(
    path: string,
    obj: TsConfigJson | TsConfigModifier,
    opts?: ResolveOptions,
): Promise<void>;
/**
 * 写入离 {@link cwd()} 最近的 `tsconfig.json` 文件
 *
 * @param obj {@link TsConfigJson} | {@link TsConfigModifier}
 * @param opts {@link ResolveOptions}
 * @throws
 */
export async function writeTsConfig(
    obj: TsConfigJson | TsConfigModifier,
    opts?: ResolveOptions,
): Promise<void>;
export async function writeTsConfig(
    arg1: string | TsConfigJson | TsConfigModifier,
    arg2?: TsConfigJson | TsConfigModifier | ResolveOptions,
    arg3?: ResolveOptions,
) {
    const [path, obj, opts] =
        typeof arg1 === "string"
            ? [arg1, arg2 as TsConfigJson, arg3]
            : [cwd(), arg1, arg2 as ResolveOptions | undefined];

    const data =
        typeof obj === "function"
            ? obj(await readTsConfig(resolve(cwd(), path), opts))
            : obj;
    await pkg_writeTSConfig(
        await resolveTsConfigPath(path, opts),
        data as pkg_TsConfig,
    );
}
