import {PluginOption} from 'vite'
import {WebSocket} from 'ws'
import {changeProtocol} from './sub'
import path from 'path'

export function main(imports: Record<string, string>): Partial<PluginOption> {
    const microPrefix = '\0micro:'
    return {
        resolveId(id) {
            const moduleName = id.match(/^([^/]+)\/.*/)?.[1]
            if (moduleName && imports[moduleName]) {
                return microPrefix + id
            }
        },
        load(filePath) {
            if (filePath.startsWith(microPrefix)) {
                return ''
            }

        //     if (id.startsWith(microPrefix)) {
        //         const pathname = id.replace(microPrefix, '')
        //         const address = imports[moduleName]
        //         if (address) {
        //             try {
        //                 const res = await fetch(address)
        //                 if (res.ok) {
        //                     return await res.text()
        //                 }
        //                 console.error(Error(`[@canlooks/lotus] Remote module "${moduleName}: ${address}" fetch failed.`))
        //                 return 'export default () => null'
        //             } catch (e) {
        //                 console.error(e)
        //                 return 'export default () => null'
        //             }
        //         }
        //     }
        },
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                console.log(req.url)
                next()
            })

            /**
             * 每个源分别创建`fileName`与`moduleName`的对应关系
             */

            const origin_filePath_moduleName = new Map<string, Map<string, string>>()
            for (const moduleName in imports) {
                const address = imports[moduleName]
                try {
                    const {origin} = new URL(address)
                    const filePath_moduleName = origin_filePath_moduleName.get(origin) || new Map<string, string>()
                    const filePath = path.relative(origin, address)
                    filePath_moduleName.set(filePath, moduleName)
                    origin_filePath_moduleName.set(origin, filePath_moduleName)
                } catch (e) {
                    console.error(e)
                }
            }

            /**
             * 监听各个源的文件变化消息
             */

            for (const [origin, fileName_moduleName] of origin_filePath_moduleName) {
                new WebSocket(origin).on('message', data => {
                    const message = data.toString()
                    if (message.startsWith(changeProtocol)) {
                        const filePath = message.replace(changeProtocol, '')
                        const moduleName = fileName_moduleName.get(filePath)
                        const reloadModule = moduleName && server.moduleGraph.idToModuleMap.get(microPrefix + moduleName)
                        reloadModule && server.reloadModule(reloadModule)
                    }
                })
            }
        }
    }
}