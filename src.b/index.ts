import {defineConfig, LibraryOptions, mergeConfig, PluginOption} from 'vite'
import {ExternalOption, RollupOptions} from 'rollup'
import {sub} from './sub'
import {main} from './main'

export interface SubOptions extends Omit<LibraryOptions, 'entry'>, RollupOptions {
    /**
     * 作为子项目时，若使用`React`框架，则`react`与`react-dom`必须作为外部依赖
     * @example
     * ```
     * external: [/react/, /react-dom/]
     * ```
     * 但作为主项目时不需要排除`React`
     */
    external?: ExternalOption
    /**
     * 作为子项目时，指定对外暴露的模块
     * @example
     * exports: {
     *     app: path.resolve('app.ts')
     * }
     */
    exports?: LibraryOptions['entry']
    /**
     * 作为主项目时，指定引用远程模块的地址
     * @example
     * imports: {
     *     remoteApp: 'http://someAddress/app.mjs'
     * }
     */
    imports?: Record<string, string>
}

export default function micromation({
    // LibraryOptions
    exports,
    name,
    formats = ['es'],
    fileName = name,
    cssFileName,
    // for main project
    imports,
    // RollupOptions
    ...rollupOptions
}: SubOptions): PluginOption {
    const isSubProject = typeof exports !== 'undefined'
    const isMainProject = !!imports

    return {
        name: 'vite-plugin-micromation',
        config(userConfig) {
            return mergeConfig(userConfig, defineConfig({
                build: {
                    ...isSubProject && {lib: {entry: exports, name, formats, fileName, cssFileName}},
                    rollupOptions
                }
            }))
        },
        ...isSubProject && sub(),
        ...isMainProject && main(imports)
    }
}