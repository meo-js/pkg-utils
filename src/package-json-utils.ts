import {
    readPackageJSON,
    resolvePackageJSON,
    writePackageJSON,
    type PackageJson as pkg_PackageJson,
} from "pkg-types";
import { cwd } from "process";
import type { PackageJson } from "./package-json-type.js";
import { parseFindOptions, type FindOptions } from "./shared.js";

/**
 * `package.json` 修改函数
 */
export type PackageJsonModifier = (obj: PackageJson) => PackageJson;

/**
 * 查找并读取离传入路径最近的 `package.json` 文件
 *
 * @param path 默认为 {@link cwd()}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function readPackageJson(path?: string, opts?: FindOptions) {
    return (await readPackageJSON(path, {
        ...parseFindOptions(opts),
        cache: false,
        try: false,
    })) as PackageJson;
}

/**
 * 查找离传入路径最近的 `package.json` 文件，返回绝对路径
 *
 * @param path 默认为 {@link cwd()}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function resolvePackageJsonPath(
    path?: string,
    opts?: FindOptions,
) {
    return await resolvePackageJSON(path, {
        ...parseFindOptions(opts),
        cache: false,
        try: false,
    });
}

/**
 * 写入离传入路径最近的 `package.json` 文件
 *
 * @param path 路径
 * @param obj {@link PackageJson} | {@link PackageJsonModifier}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function writePackageJson(
    path: string,
    obj: PackageJson | PackageJsonModifier,
    opts?: FindOptions,
): Promise<void>;
/**
 * 写入离 {@link cwd()} 最近的 `package.json` 文件
 *
 * @param obj {@link PackageJson} | {@link PackageJsonModifier}
 * @param opts {@link FindOptions}
 *
 * @throws
 */
export async function writePackageJson(
    obj: PackageJson | PackageJsonModifier,
    opts?: FindOptions,
): Promise<void>;
export async function writePackageJson(
    arg1: string | PackageJson | PackageJsonModifier,
    arg2?: PackageJson | PackageJsonModifier | FindOptions,
    arg3?: FindOptions,
) {
    const [path, obj, opts] =
        typeof arg1 === "string"
            ? [arg1, arg2 as PackageJson, arg3!]
            : [cwd(), arg1, arg2 as FindOptions | undefined];

    const data =
        typeof obj === "function"
            ? obj(await readPackageJson(path, opts))
            : obj;
    await writePackageJSON(
        await resolvePackageJsonPath(path, opts),
        data as pkg_PackageJson,
    );
}
