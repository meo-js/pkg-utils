/** @ctix-generation-style default-alias-named-destructive */

/**
 * 查找选项
 */
export interface FindOptions {
    /**
     * 传入一个正则表达式，匹配的路径段将成为查找的根目录，不会再向上查找
     *
     * @default /^node_modules$/
     */
    rootPattern?: RegExp;

    /**
     * 从根目录向子目录查找
     *
     * @default false
     */
    startFromRoot?: boolean;
}

/** @ctix-exclude-next */
export function parseFindOptions(opts?: FindOptions) {
    return {
        rootPattern: opts?.rootPattern ?? /^node_modules$/u,
        startFromRoot: opts?.startFromRoot ?? false,
    };
}
