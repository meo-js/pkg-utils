import {
    readTSConfig as pkg_readTSConfig,
    resolveTSConfig as pkg_resolveTSConfig,
    writeTSConfig as pkg_writeTSConfig,
    type TSConfig as pkg_TsConfig,
} from "pkg-types";
import { cwd } from "process";
import { parseFindOptions, type FindOptions } from "./shared.js";
import type { TsConfigJson } from "./tsconfig-type.js";

/**
 * `tsconfig.json` 修改函数
 */
export type TsConfigModifier = (obj: TsConfigJson) => TsConfigJson;

/**
 * 查找并读取离传入路径最近的 `tsconfig.json` 文件
 *
 * @param path 默认为 {@link cwd()}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function readTsConfig(path?: string, opts?: FindOptions) {
    return (await pkg_readTSConfig(path, {
        ...parseFindOptions(opts),
        cache: false,
        try: false,
    })) as TsConfigJson;
}

/**
 * 查找离传入路径最近的 `tsconfig.json` 文件，返回绝对路径
 *
 * @param path 默认为 {@link cwd()}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function resolveTsConfigPath(path?: string, opts?: FindOptions) {
    return await pkg_resolveTSConfig(path, {
        ...parseFindOptions(opts),
        cache: false,
        try: false,
    });
}

/**
 * 写入离传入路径最近的 `tsconfig.json` 文件
 *
 * @param path 路径
 * @param obj {@link TsConfigJson} | {@link TsConfigModifier}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function writeTsConfig(
    path: string,
    obj: TsConfigJson | TsConfigModifier,
    opts?: FindOptions,
): Promise<void>;
/**
 * 写入离 {@link cwd()} 最近的 `tsconfig.json` 文件
 *
 * @param obj {@link TsConfigJson} | {@link TsConfigModifier}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function writeTsConfig(
    obj: TsConfigJson | TsConfigModifier,
    opts?: FindOptions,
): Promise<void>;
export async function writeTsConfig(
    arg1: string | TsConfigJson | TsConfigModifier,
    arg2?: TsConfigJson | TsConfigModifier | FindOptions,
    arg3?: FindOptions,
) {
    const [path, obj, opts] =
        typeof arg1 === "string"
            ? [arg1, arg2 as TsConfigJson, arg3!]
            : [cwd(), arg1, arg2 as FindOptions | undefined];

    const data =
        typeof obj === "function" ? obj(await readTsConfig(path, opts)) : obj;
    await pkg_writeTSConfig(
        await resolveTsConfigPath(path, opts),
        data as pkg_TsConfig,
    );
}
