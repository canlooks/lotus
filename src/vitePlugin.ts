import path from 'path'
import fs from 'fs'
import {build, defineConfig, mergeConfig, PluginOption} from 'vite'
import {InputOption} from 'rollup'

type vitePluginMicroOptions = {
    entry?: InputOption
}

export default function vitePluginMicro(options?: vitePluginMicroOptions): PluginOption {
    return {
        name: 'vite-plugin-micro',
        config(userConfig) {
            return mergeConfig(userConfig, defineConfig({
                base: userConfig.base || '',
                build: {
                    rollupOptions: {
                        input: options?.entry,
                        output: {
                            entryFileNames: '[name].js'
                        }
                    }
                }
            }))
        },
        configurePreviewServer({
            config: {
                root,
                build: {outDir},
                configFile,
                resolve: {extensions}
            },
            middlewares
        }) {
            const absoluteOutDir = path.isAbsolute(outDir) ? outDir : path.join(root, outDir)

            middlewares.use((req, res, next) => {
                if (req.url) {
                    const pathname = req.url.replace(/^\/+/, '')
                    const filePath = path.join(absoluteOutDir, pathname)
                    const extname = path.extname(filePath)

                    const fn = (ext = '') => {
                        const _path = filePath + ext
                        if (fs.existsSync(_path)) {
                            const file = fs.readFileSync(_path)
                            const _ext = ext || path.extname(_path)
                            if (_ext === '.js' || _ext === '.mjs') {
                                res.setHeader('Content-Type', 'application/javascript')
                            }
                            res.end(file)
                            return true
                        }
                    }

                    if (extname) {
                        fn()
                        return
                    }
                    for (let i = 0; i < extensions.length; i++) {
                        if (fn(extensions[i])) {
                            return
                        }
                    }
                }
                next()
            })

            build({
                configFile,
                build: {
                    watch: {}
                }
            }).then()
        }
    }
}